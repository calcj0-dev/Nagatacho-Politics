'use strict';

// ヘッドレス・ゲームシミュレーター
// 使用方法: node sim/sim.js [levelA] [levelB] [games] [--verbose]
// 例: node sim/sim.js 3 5 1000

const fs   = require('fs');
const path = require('path');

const DATA_DIR        = path.join(__dirname, '../assets/data');
const POLITICIAN_CARDS = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'politician_cards.json'), 'utf8'));
const OPTION_CARDS     = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'option_cards.json'),     'utf8'));

const PARTIES = ['自民党', '国民民主党', 'チームみらい', '維新の会', '参政党', '中道改革連合'];

// ---- ユーティリティ ----
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ---- ゲームクラス ----
class SimGame {
  // Lv5 AI のスコアリング定数（tune.js でグリッドサーチして最適化する）
  static DEFAULT_PARAMS = {
    attackBase:         120, // 攻撃系能力の基本スコア
    nearWinBonus:       100, // 相手が勝利に近いときの攻撃ボーナス
    criticalSealBonus:  150, // 相手が危険域(60%)かつ封印能力のボーナス
    behindBonus:         60, // 自分が10%以上劣勢のときの攻撃ボーナス
    surgeBonus:          80, // 相手が前ターン10%以上上昇したときの攻撃ボーナス
    usedAttackPenalty:   30, // 相手が攻撃済みのときの防御優先度引き下げ
    selfNearWinBonus:    50, // 自分が勝利に近いときの非攻撃ボーナス
    lateBonus:          100, // 終盤（17ターン〜）の全スコアボーナス
    midBehindBonus:      40, // 中盤かつ劣勢のときのスコアボーナス
  };

  constructor(levelA, levelB, verbose = false, params = {}) {
    this.levelA   = levelA;
    this.levelB   = levelB;
    this.verbose  = verbose;
    this.params   = { ...SimGame.DEFAULT_PARAMS, ...params };
    this.idCtr    = 0;
    this.turn     = 1;
    this.A        = null; // "player" 相当
    this.B        = null; // "cpu" 相当
    this.pendingEffects  = [];
    this.approvalHistory = []; // [{ A, B }] ターン開始時スナップショット
  }

  log(msg) { if (this.verbose) console.log(msg); }

  // ---- 状態生成 ----
  newState(party) {
    return {
      party,
      approval: 30,
      funds: 0,
      hand: [], field: [], deck: [], discard: [],
      placedThisTurn: false,
      usedAbilities: {},
      usedOptionThisTurn: false,
      skipNextDraw: false,
      sealAllNextTurn: false,
      blockOptionNextTurn: false,
      shields: [],
      currentTurnCostReduction: 0,
      zeroCostCardId: null,
      nextTurnBonuses: { fundBonus: 0, costReduction: 0, defenseBonus: 0, attackReduction: 0 },
    };
  }

  mkCard(def) {
    return { ...def, instanceId: ++this.idCtr, disabled: false, sealedAbility2: false };
  }

  buildDeck(party) {
    const politicians = POLITICIAN_CARDS.filter(c => c.party === party).map(c => this.mkCard(c));
    const options = [];
    for (const def of OPTION_CARDS) {
      for (let i = 0; i < (def.count ?? 2); i++) options.push(this.mkCard(def));
    }
    return shuffle([...politicians, ...options]);
  }

  init() {
    const [partyA, partyB] = shuffle(PARTIES);

    const deckA = this.buildDeck(partyA);
    const pA = deckA.findIndex(c => c.type === 'politician');
    if (pA > 2) [deckA[0], deckA[pA]] = [deckA[pA], deckA[0]];
    this.A = this.newState(partyA);
    this.A.deck = deckA;
    this.A.hand = this.A.deck.splice(0, 3);

    const deckB = this.buildDeck(partyB);
    const pB = deckB.findIndex(c => c.type === 'politician');
    if (pB > 2) [deckB[0], deckB[pB]] = [deckB[pB], deckB[0]];
    this.B = this.newState(partyB);
    this.B.deck = deckB;
    this.B.hand = this.B.deck.splice(0, 3);

    this.turn = 1;
    this.pendingEffects = [];
    this.approvalHistory = [{ A: 30, B: 30 }];

    this.log(`[Init] A=${partyA}(Lv${this.levelA}) vs B=${partyB}(Lv${this.levelB})`);
  }

  // ---- 共通ゲーム処理 ----
  sides(side) {
    return side === 'A'
      ? { self: this.A, opponent: this.B }
      : { self: this.B, opponent: this.A };
  }

  applyDefenses(target, amount) {
    if (amount >= 0) return amount;
    for (const key of ['block_approval_down_drill', 'block_approval_down', 'block_attack', 'immune']) {
      const i = target.shields.indexOf(key);
      if (i >= 0) { target.shields.splice(i, 1); return 0; }
    }
    if (target.nextTurnBonuses.defenseBonus > 0) {
      const r = Math.floor(Math.abs(amount) * target.nextTurnBonuses.defenseBonus / 100);
      target.nextTurnBonuses.defenseBonus = 0;
      return amount + r;
    }
    if (target.nextTurnBonuses.attackReduction > 0) {
      const r = target.nextTurnBonuses.attackReduction;
      target.nextTurnBonuses.attackReduction = 0;
      return amount + r;
    }
    return amount;
  }

  changeApproval(target, amount) {
    if (amount < 0) {
      amount = this.applyDefenses(target, amount);
    } else if (amount > 0) {
      const mi = target.shields.indexOf('block_approval_up_masukomi');
      if (mi >= 0) { target.shields.splice(mi, 1); return; }
      const bi = target.shields.indexOf('block_approval_up');
      if (bi >= 0) { target.shields.splice(bi, 1); return; }
    }
    target.approval = clamp(target.approval + amount, 0, 100);
  }

  changeFunds(target, amount) {
    target.funds = Math.max(0, target.funds + amount);
  }

  processPending() {
    this.pendingEffects = this.pendingEffects.filter(e => {
      if (e.returnTurn === this.turn) {
        this.changeFunds(e.side === 'A' ? this.A : this.B, e.amount);
        return false;
      }
      return true;
    });
  }

  checkWin() {
    const pa = this.A.approval, pb = this.B.approval;
    if (pa >= 100 && pb >= 100) return 'draw';
    if (pa <= 0  && pb <= 0)   return 'draw';
    if (pa >= 100) return 'A';
    if (pb >= 100) return 'B';
    if (pa <= 0)   return 'B';
    if (pb <= 0)   return 'A';
    return null;
  }

  gamePhase() {
    const t = this.turn;
    if (t <= 8)  return 'early';
    if (t <= 16) return 'mid';
    return 'late';
  }

  // 相手の前ターン比較での支持率急上昇を取得（CPUの防御判断に使用）
  approvalSurge(opponentSide) {
    const h = this.approvalHistory;
    if (h.length < 2) return 0;
    return h[h.length - 1][opponentSide] - h[h.length - 2][opponentSide];
  }

  // ---- 能力効果 ----
  execAbility(effectId, side) {
    const { self, opponent } = this.sides(side);
    const G = this;

    // 封印ターゲット: シミュレーターでは両サイドともに脅威度ベース
    const sealTarget = (field) => G.mostThreatening(field) || field[0];

    const FX = {
      // 自民党
      ishiba_1:    () => { G.changeApproval(self, -3); G.changeFunds(self, 5); },
      ishiba_2:    () => { if (opponent.field.length > 0) sealTarget(opponent.field).sealedNextTurn = true; },
      takaichi_1:  () => { G.changeApproval(self, 8); },
      takaichi_2:  () => { G.changeApproval(self, 12); G.changeApproval(opponent, -4); },
      koizumi_1:   () => { G.changeApproval(self, Math.random() < 0.5 ? 15 : -10); },
      koizumi_2:   () => {
        if (opponent.hand.length > 0) {
          const d = opponent.hand.splice(Math.floor(Math.random() * opponent.hand.length), 1)[0];
          opponent.discard.push(d);
        }
      },
      kono_1:      () => { self.shields.push('block_approval_down'); },
      kono_2:      () => {
        G.changeApproval(self, 6);
        if (self.deck.length > 0) self.hand.push(self.deck.shift());
      },
      suga_1:      () => { G.changeFunds(self, 3); },
      suga_2:      () => { G.changeApproval(self, 8 + (self.field.length === 1 ? 4 : 0)); },

      // 国民民主党
      tamaki_1:    () => {
        if (self.field.length > 0) G.changeApproval(opponent, -(self.field.length * 4));
      },
      tamaki_2:    () => { G.changeFunds(self, 5); },
      mori_1:      () => {
        G.changeApproval(self, 5);
        self.currentTurnCostReduction = (self.currentTurnCostReduction || 0) + 1;
      },
      mori_2:      () => { G.changeApproval(self, 7 + (self.field.length <= 2 ? 8 : 0)); },
      shinba_1:    () => { G.changeApproval(self, 5); },
      shinba_2:    () => { if (opponent.field.length > 0) sealTarget(opponent.field).sealedNextTurn = true; },
      furukawa_1:  () => { G.changeApproval(opponent, -5); },
      furukawa_2:  () => { G.changeApproval(self, Math.random() < 0.5 ? 10 : -3); },
      ito_1:       () => { if (self.hand.length > 0) G.changeApproval(self, self.hand.length * 2); },
      ito_2:       () => {
        for (let i = 0; i < 2; i++) if (self.deck.length > 0) self.hand.push(self.deck.shift());
      },

      // チームみらい
      anno_1:      () => {
        G.pendingEffects.push({ side, returnTurn: G.turn + 5, amount: 5 });
      },
      anno_2:      () => { G.changeApproval(self, 6 + (self.field.length >= 3 ? 10 : 0)); },
      takayama_1:  () => { G.changeApproval(self, 4); opponent.blockOptionNextTurn = true; },
      takayama_2:  () => {
        if (self.field.length > 0) G.changeApproval(self, self.field.length * 4);
      },
      muto_1:      () => { G.changeApproval(self, 6); },
      muto_2:      () => { G.changeApproval(opponent, -10); G.changeApproval(self, 5); },
      suda_1:      () => { G.changeApproval(self, 5); },
      suda_2:      () => {
        if (self.hand.length > 0) G.changeApproval(opponent, -(self.hand.length * 2));
      },
      mineshima_1: () => {
        self.currentTurnCostReduction = (self.currentTurnCostReduction || 0) + 1;
      },
      mineshima_2: () => { G.changeApproval(self, 15); G.changeApproval(opponent, -10); },

      // 維新の会
      saito_a_1:   () => { G.changeApproval(self, 5); },
      saito_a_2:   () => { G.changeApproval(self, 15); self.skipNextDraw = true; },
      fujita_1:    () => { G.changeApproval(self, 6); },
      fujita_2:    () => { if (self.deck.length > 0) self.hand.push(self.deck.shift()); },
      nakatsuka_1: () => { G.changeApproval(self, 10); },
      nakatsuka_2: () => { G.changeFunds(self, 6); },
      baba_1:      () => { G.changeApproval(self, 8); },
      baba_2:      () => { G.changeApproval(self, Math.random() < 0.5 ? 15 : 5); },
      maehara_1:   () => { G.changeFunds(self, Math.floor(Math.random() * 6)); }, // slot: 0-5
      maehara_2:   () => { G.changeApproval(self, 9); },

      // 参政党
      kamiya_1:    () => { G.changeApproval(self, Math.floor(Math.random() * 11)); },
      kamiya_2:    () => { G.changeApproval(self, 10); G.changeApproval(opponent, -4); },
      ando_1:      () => { G.changeApproval(self, 5); },
      ando_2:      () => { G.changeApproval(self, 10); },
      toyota_1:    () => { G.changeApproval(self, 10); },
      toyota_2:    () => {
        const fem = self.field.filter(c => c.gender === '女').length;
        G.changeApproval(self, 7 + (fem >= 2 ? 13 : 0));
      },
      yoshikawa_1: () => { G.changeApproval(self, 6); },
      yoshikawa_2: () => { G.changeApproval(self, 6); opponent.blockOptionNextTurn = true; },
      mogami_1:    () => { G.changeApproval(self, 4); },
      mogami_2:    () => { self.currentTurnCostReduction = 99; },

      // 中道改革連合
      noda_1:      () => { G.changeApproval(self, 6); },
      noda_2:      () => { G.changeApproval(self, -5); G.changeFunds(self, 4); },
      izumi_1:     () => { G.changeApproval(self, 5); },
      izumi_2:     () => { G.changeApproval(opponent, -25); },
      ogawa_1:     () => { if (opponent.field.length > 0) sealTarget(opponent.field).sealedNextTurn = true; },
      ogawa_2:     () => { G.changeApproval(self, 9); },
      isa_1:       () => { G.changeApproval(self, 5); },
      isa_2:       () => { G.changeApproval(self, self.hand.length * 3); },
      saito_t_1:   () => { if (self.deck.length > 0) self.hand.push(self.deck.shift()); },
      saito_t_2:   () => { G.changeApproval(self, 15); G.changeApproval(opponent, -10); },
    };

    const fn = FX[effectId];
    if (!fn) { this.log(`  [WARN] 未定義の能力効果: ${effectId}`); return; }
    fn();
  }

  execOption(effectId, side) {
    const { self, opponent } = this.sides(side);
    const G = this;

    const FX = {
      trump_tariff: () => {
        G.changeFunds(self,     -Math.floor(self.funds     * 0.5));
        G.changeFunds(opponent, -Math.floor(opponent.funds * 0.5));
      },
      kioku_ni_gozaimasen: () => { /* zeroCostCardId は phaseOption で設定済み */ },
      kenkin_party:   () => { G.changeFunds(self, 5); },
      gaitou_enzetsu: () => {
        G.changeApproval(self, 4);
        if (self.field.length >= 2) G.changeApproval(self, 8);
      },
      drill_hakai:    () => { self.shields.push('block_approval_down_drill'); },
      tounai_kaikaku: () => {
        if (self.field.length === 0) return;
        const polIdx = self.hand.findIndex(c => c.type === 'politician');
        if (polIdx < 0) return;
        const rmIdx = Math.floor(Math.random() * self.field.length);
        const removed = self.field.splice(rmIdx, 1)[0];
        self.discard.push(removed);
        const added = self.hand.splice(polIdx, 1)[0];
        added.fieldSlot = removed.fieldSlot ?? rmIdx;
        self.field.push(added);
      },
      toushu_touron:      () => { G.changeApproval(self, Math.floor(Math.random() * 10) + 1); },
      yukiguni_yukikaki:  () => { G.changeApproval(opponent, -5); },
      kono_hage:          () => {
        const hasFem = opponent.field.some(c => c.gender === '女');
        G.changeApproval(opponent, hasFem ? -12 : -5);
      },
      netenai_jiman:      () => { G.changeApproval(self, 4); },
      masukomi_taisaku:   () => { opponent.shields.push('block_approval_up_masukomi'); },
      ouen_enzetsu:       () => {
        const pi = self.deck.findIndex(c => c.type === 'politician');
        if (pi >= 0) self.hand.push(self.deck.splice(pi, 1)[0]);
      },
      kinkyuu_yoron:      () => { /* 情報カード: 効果なし */ },
      giinkaikan_furin:   () => { G.changeApproval(opponent, -8); G.changeApproval(self, -3); },
      yaji_gassen:        () => {
        if (opponent.field.length > 0) opponent.sealAllNextTurn = true;
      },
      gyuuho_senjutsu:    () => { opponent.skipNextDraw = true; },
      kokkai_inemuri:     () => {
        for (let i = 0; i < 2; i++) if (self.deck.length > 0) self.hand.push(self.deck.shift());
      },
      zouzei_megane: () => {
        const amt = Math.min(3, opponent.funds);
        G.changeFunds(opponent, -amt);
        G.changeFunds(self, amt);
      },
    };

    const fn = FX[effectId];
    if (!fn) { this.log(`  [WARN] 未定義のオプション効果: ${effectId}`); return; }
    fn();
  }

  // ---- AI ヘルパー ----
  mostThreatening(field) {
    if (field.length === 0) return null;
    let maxT = -1, target = null;
    for (const card of field) {
      let threat = 0;
      for (let i = 0; i < (card.abilities || []).length; i++) {
        if (i === 1 && card.sealedAbility2) continue;
        const ab = card.abilities[i];
        const tags = ab.tags || [];
        if (tags.includes('attack') || tags.includes('seal')) {
          threat += (ab.aiThreat || 0) * 20 + ab.cost * 10;
        } else {
          threat += ab.cost * 3;
        }
      }
      if (threat > maxT) { maxT = threat; target = card; }
    }
    return target;
  }

  scoreOption(card, self, opponent) {
    const diff    = self.approval - opponent.approval;
    const phase   = this.gamePhase();
    const tags    = card.tags || [];
    const blocked = self.shields.some(s => s === 'block_approval_up_masukomi' || s === 'block_approval_up');
    const pShield = opponent.shields.some(s => s === 'block_approval_down' || s === 'block_approval_down_drill');

    let score = card.aiBaseScore || 30;

    if (tags.includes('attack')) {
      if (pShield)              score -= 25;
      if (diff < 0)             score += 20;
      if (opponent.approval >= 55) score += 30;
    }
    if (tags.includes('seal_all')) {
      if (opponent.field.length === 0) return 0;
      score += opponent.field.length * 20;
    }
    if (tags.includes('self_boost')) {
      if (blocked)              return 0;
      if (self.approval >= 60)  score += 20;
    }
    if (tags.includes('fund_gain')) {
      if (self.funds <= 1)      score += 30;
      else if (self.funds >= 6) score -= 20;
    }
    if (tags.includes('draw')) {
      if (phase === 'early')    score += 15;
      if (phase === 'late')     score -= 15;
    }
    if (tags.includes('shield')) {
      if (diff >= 0)            score -= 15;
      if (diff < -10)           score += 20;
    }
    if (tags.includes('draw_block') && phase === 'late') score += 25;
    if (tags.includes('block_boost') && diff > 0)        score += 20;

    // カード固有補正
    const eff = card.effect;
    if (eff === 'kenkin_party') {
      score = self.funds <= 1 ? 90 : self.funds <= 3 ? 55 : 25;
    } else if (eff === 'zouzei_megane') {
      if (opponent.funds >= 3) score += 20; else if (opponent.funds === 0) score -= 30;
    } else if (eff === 'trump_tariff') {
      score = opponent.funds > self.funds + 2 ? score + 30 : opponent.funds > self.funds ? score : score - 20;
    } else if (eff === 'kioku_ni_gozaimasen') {
      const maxC = self.field.reduce((mx, fc) =>
        Math.max(mx, (fc.abilities || []).reduce((s, a) => s + (a.cost || 0), 0)), 0);
      score = maxC >= 5 ? 100 : maxC >= 3 ? 65 : 25;
    } else if (eff === 'tounai_kaikaku') {
      const bestH = self.hand.filter(hc => hc.type === 'politician')
        .reduce((mx, hc) => Math.max(mx, (hc.abilities || []).reduce((s, a) => s + (a.cost || 0), 0)), 0);
      const worstF = self.field.length > 0
        ? self.field.reduce((mn, fc) => Math.min(mn, (fc.abilities || []).reduce((s, a) => s + (a.cost || 0), 0)), Infinity)
        : Infinity;
      score = bestH > worstF + 3 ? 65 : 15;
    } else if (eff === 'gaitou_enzetsu') {
      score = self.field.length >= 2 ? score + 45 : score - 20;
    } else if (eff === 'kono_hage') {
      if (opponent.field.some(fc => fc.gender === '女')) score += 50;
    }

    return Math.max(0, score);
  }

  bestOptionIdx(hand, self, opponent, level) {
    if (level === 5) {
      let bestI = -1, bestS = -1;
      hand.forEach((c, i) => {
        if (c.type !== 'option') return;
        const s = this.scoreOption(c, self, opponent);
        if (s > bestS) { bestS = s; bestI = i; }
      });
      return bestI;
    }
    return hand.findIndex(c => c.type === 'option');
  }

  // ---- ターン実行 ----
  runTurn(side, level) {
    const { self, opponent } = this.sides(side);

    // --- ターン開始 ---
    self.placedThisTurn    = false;
    self.usedAbilities     = {};
    self.usedOptionThisTurn = self.blockOptionNextTurn ?? false;
    self.blockOptionNextTurn = false;

    self.shields = self.shields.filter(s => s !== 'block_approval_down' && s !== 'block_approval_down_drill');
    self.zeroCostCardId = null;
    self.field.forEach(c => { c.disabled = false; c.sealedAbility2 = false; });

    if (self.sealAllNextTurn) {
      self.field.forEach(c => { c.disabled = true; });
      self.sealAllNextTurn = false;
    }
    self.field.forEach(c => { if (c.sealedNextTurn) { c.disabled = true; c.sealedNextTurn = false; } });

    this.processPending();

    self.currentTurnCostReduction = self.nextTurnBonuses.costReduction;
    self.nextTurnBonuses.costReduction = 0;

    self.funds += 1 + self.nextTurnBonuses.fundBonus;
    self.nextTurnBonuses.fundBonus = 0;

    if (self.skipNextDraw) {
      self.skipNextDraw = false;
    } else if (self.deck.length > 0) {
      self.hand.push(self.deck.shift());
    }

    this.log(`[T${this.turn}][${side}Lv${level}] ${self.party} ${self.approval}% / ${self.funds}億 hand=${self.hand.length} field=${self.field.length}`);

    // --- フェーズ順決定 ---
    const optIdx  = this.bestOptionIdx(self.hand, self, opponent, level);
    const optCard = optIdx >= 0 ? self.hand[optIdx] : null;

    let phases = ['place', 'abilities', 'option'];
    if (level >= 4 && optCard) {
      const prio = optCard.aiTiming ?? 'last';
      if (prio === 'first')          phases = ['option', 'place', 'abilities'];
      else if (prio === 'before_ability') phases = ['place', 'option', 'abilities'];
    }

    for (const ph of phases) {
      if (ph === 'place')     this.phasePlace(side, level);
      else if (ph === 'abilities') this.phaseAbilities(side, level);
      else if (ph === 'option')    this.phaseOption(side, level);
    }

    this.phaseDiscard(side, level);
  }

  phasePlace(side, level) {
    const { self, opponent } = this.sides(side);
    if (level === 1 && Math.random() < 0.65) return;
    if (level === 2 && Math.random() < 0.35) return;

    if (self.placedThisTurn || self.field.length >= 3) return;

    let idx;
    if (level === 5) {
      const pfSize = opponent.field.length;
      let bestI = -1, bestS = -Infinity;
      self.hand.forEach((c, i) => {
        if (c.type !== 'politician') return;
        const total = (c.abilities || []).reduce((s, a) => s + (a.cost || 0), 0);
        const hasAtk = (c.abilities || []).some(a => (a.tags || []).some(t => t === 'attack' || t === 'seal'));
        let sc = total + (pfSize >= 2 && hasAtk ? 60 : 0);
        if (sc > bestS) { bestS = sc; bestI = i; }
      });
      idx = bestI;
    } else if (level === 4) {
      let bestI = -1, bestC = -1;
      self.hand.forEach((c, i) => {
        if (c.type !== 'politician') return;
        const t = (c.abilities || []).reduce((s, a) => s + (a.cost || 0), 0);
        if (t > bestC) { bestC = t; bestI = i; }
      });
      idx = bestI;
    } else {
      idx = self.hand.findIndex(c => c.type === 'politician');
    }

    if (idx >= 0) {
      const card = self.hand.splice(idx, 1)[0];
      const used = self.field.map(fc => fc.fieldSlot);
      card.fieldSlot = [0, 1, 2].find(s => !used.includes(s)) ?? self.field.length;
      self.field.push(card);
      self.placedThisTurn = true;
      this.log(`  [Place] ${card.name}`);
    }
  }

  phaseAbilities(side, level) {
    const { self, opponent } = this.sides(side);
    const cr = self.currentTurnCostReduction || 0;
    const actions = [];

    for (const card of self.field) {
      if (self.usedAbilities[card.instanceId] || card.disabled) continue;

      const costs = card.abilities.map(a => Math.max(0, a.cost - cr));

      const isUseful = (eff) => {
        if (eff === 'kono_1') return opponent.field.length > 0;
        return (eff !== 'ishiba_2' && eff !== 'shinba_2' && eff !== 'ogawa_1') || opponent.field.length > 0;
      };

      const a0 = self.funds >= costs[0] && isUseful(card.abilities[0].effect);
      const a1 = !card.sealedAbility2 && self.funds >= costs[1] && isUseful(card.abilities[1].effect);

      if (level === 1 && Math.random() < 0.6) continue;
      if (level === 2 && Math.random() < 0.3) continue;

      let chosen = -1, actionScore = 0;

      if (level <= 2) {
        const opts = [];
        if (a0) opts.push(0);
        if (a1) opts.push(1);
        if (opts.length > 0) chosen = opts[Math.floor(Math.random() * opts.length)];

      } else if (level === 3) {
        const s3 = (i) => {
          const tags = card.abilities[i].tags || [];
          let sc = costs[i] * 10;
          if ((tags.includes('attack') || tags.includes('seal')) && opponent.field.length > 0) {
            sc += 30;
            if (opponent.approval > self.approval) sc += 20;
          }
          return sc;
        };
        if (a0 && a1) chosen = s3(1) >= s3(0) ? 1 : 0;
        else if (a1)  chosen = 1;
        else if (a0)  chosen = 0;

      } else if (level === 4) {
        const s4 = (i) => {
          const tags = card.abilities[i].tags || [];
          return (tags.includes('attack') || tags.includes('seal')) ? 100 + costs[i] : costs[i];
        };
        if (a0 && a1) chosen = s4(1) >= s4(0) ? 1 : 0;
        else if (a1)  chosen = 1;
        else if (a0)  chosen = 0;

      } else {
        // Lv5
        const diff  = self.approval - opponent.approval;
        const phase = this.gamePhase();
        const opNearWin  = opponent.approval >= 55;
        const selfNearWin = self.approval >= 55;
        const opCritical = opponent.approval >= 60;
        const opSurge    = this.approvalSurge(side === 'A' ? 'B' : 'A');
        const opUsedAttack = opponent.field.some(fc => {
          const ui = opponent.usedAbilities[fc.instanceId];
          if (!ui) return false;
          return (fc.abilities[ui - 1]?.tags || []).some(t => t === 'attack' || t === 'seal');
        });

        const s5 = (i) => {
          const tags  = card.abilities[i].tags || [];
          const isAtk = tags.includes('attack') || tags.includes('seal');
          const isSl  = tags.includes('seal');
          let sc = costs[i] * 3;
          const P = this.params;
          if (isAtk) {
            sc += P.attackBase;
            if (opNearWin)            sc += P.nearWinBonus;
            if (opCritical && isSl)   sc += P.criticalSealBonus;
            if (diff < -10)           sc += P.behindBonus;
            if (opSurge >= 10)        sc += P.surgeBonus;
            if (opUsedAttack)         sc -= P.usedAttackPenalty;
          } else {
            if (selfNearWin)          sc += P.selfNearWinBonus;
            if (diff < -15)           sc -= 20;
            if (opSurge >= 10)        sc -= 40;
          }
          if (phase === 'late')                   sc += P.lateBonus;
          if (phase === 'mid' && diff < -10)      sc += P.midBehindBonus;
          return sc;
        };

        if (a0 && a1) chosen = s5(1) >= s5(0) ? 1 : 0;
        else if (a1)  chosen = 1;
        else if (a0)  chosen = 0;
        if (chosen >= 0) actionScore = s5(chosen);
      }

      if (chosen >= 0) actions.push({ card, abilityIdx: chosen, cost: costs[chosen], score: actionScore });
    }

    level === 5
      ? actions.sort((a, b) => b.score - a.score)
      : actions.sort((a, b) => a.cost - b.cost);

    for (const act of actions) {
      if (self.usedAbilities[act.card.instanceId]) continue;
      const curCr = self.currentTurnCostReduction || 0;
      let ai = act.abilityIdx;
      let ec = Math.max(0, act.card.abilities[ai].cost - curCr);

      if (ai === 1 && act.card.sealedAbility2) {
        const alt = Math.max(0, act.card.abilities[0].cost - curCr);
        if (self.funds >= alt) { ai = 0; ec = alt; } else continue;
      } else if (self.funds < ec) {
        const altI = 1 - ai;
        if (altI === 1 && act.card.sealedAbility2) continue;
        const altC = Math.max(0, act.card.abilities[altI].cost - curCr);
        if (self.funds >= altC) { ai = altI; ec = altC; } else continue;
      }

      // zeroCostCardId（記憶にございません）
      if (self.zeroCostCardId === act.card.instanceId) ec = 0;

      self.funds -= ec;
      self.usedAbilities[act.card.instanceId] = ai + 1;
      const ab = act.card.abilities[ai];
      this.log(`  [Ability] ${act.card.name}「${ab.name}」cost=${ec}`);
      this.execAbility(ab.effect, side);
    }
  }

  phaseOption(side, level) {
    const { self, opponent } = this.sides(side);

    if (level === 1 && Math.random() < 0.8) return;
    if (level === 2 && Math.random() < 0.5) return;
    if (self.usedOptionThisTurn) return;

    // Lv3: 序盤優勢時に温存
    if (level === 3) {
      const diff = self.approval - opponent.approval;
      if (this.gamePhase() === 'early' && diff > 20 && Math.random() < 0.4) return;
    }

    // Lv5: 圧勝時は温存
    if (level === 5) {
      const diff = self.approval - opponent.approval;
      const remaining = 25 - this.turn;
      const surge = this.approvalSurge(side === 'A' ? 'B' : 'A');
      if (surge < 10 && diff > 30 && remaining > 10) return;
    }

    const optIdx = this.bestOptionIdx(self.hand, self, opponent, level);
    if (optIdx < 0) return;

    const card = self.hand.splice(optIdx, 1)[0];
    self.discard.push(card);
    self.usedOptionThisTurn = true;

    if (card.effect === 'kioku_ni_gozaimasen' && self.field.length > 0) {
      const target = self.field.reduce((best, cur) => {
        const bc = (best.abilities || []).reduce((s, a) => s + (a.cost || 0), 0);
        const cc = (cur.abilities  || []).reduce((s, a) => s + (a.cost || 0), 0);
        return cc > bc ? cur : best;
      }, self.field[0]);
      self.zeroCostCardId = target.instanceId;
    }

    this.log(`  [Option] ${card.name}`);
    this.execOption(card.effect, side);
  }

  phaseDiscard(side, level) {
    const { self, opponent } = this.sides(side);

    while (self.hand.length > 7) {
      let di;
      if (level === 5) {
        let wi = -1, wc = Infinity;
        self.hand.forEach((c, i) => {
          if (c.type !== 'politician') return;
          const t = (c.abilities || []).reduce((s, a) => s + (a.cost || 0), 0);
          if (t < wc) { wc = t; wi = i; }
        });
        if (wi >= 0) {
          di = wi;
        } else {
          di = self.hand.findIndex(c => c.type === 'option');
          if (di < 0) di = self.hand.length - 1;
        }
      } else if (level >= 3) {
        let wi = -1, wv = Infinity;
        self.hand.forEach((c, i) => {
          const v = c.type === 'option'
            ? this.scoreOption(c, self, opponent) + 30
            : (c.abilities || []).reduce((s, a) => s + (a.cost || 0), 0) * 8;
          if (v < wv) { wv = v; wi = i; }
        });
        di = wi >= 0 ? wi : self.hand.length - 1;
      } else {
        const oi = self.hand.findIndex(c => c.type === 'option');
        di = oi >= 0 ? oi : self.hand.length - 1;
      }

      self.discard.push(self.hand.splice(di, 1)[0]);
    }
  }

  // ---- ゲーム実行 ----
  run() {
    this.init();

    for (let t = 1; t <= 25; t++) {
      this.turn = t;

      // A のターン（プレイヤー側）
      this.approvalHistory.push({ A: this.A.approval, B: this.B.approval });
      this.runTurn('A', this.levelA);
      const w1 = this.checkWin();
      if (w1) return { winner: w1, turns: t };

      // B のターン（CPU側）
      this.runTurn('B', this.levelB);
      const w2 = this.checkWin();
      if (w2) return { winner: w2, turns: t };
    }

    // 25ターン終了: 支持率比較
    if (this.A.approval > this.B.approval) return { winner: 'A', turns: 25 };
    if (this.B.approval > this.A.approval) return { winner: 'B', turns: 25 };
    return { winner: 'draw', turns: 25 };
  }
}

// ---- メイン ----
function main() {
  const args    = process.argv.slice(2).filter(a => !a.startsWith('-'));
  const flags   = process.argv.slice(2).filter(a => a.startsWith('-'));
  const levelA  = Math.max(1, Math.min(5, parseInt(args[0] ?? '3', 10) || 3));
  const levelB  = Math.max(1, Math.min(5, parseInt(args[1] ?? '5', 10) || 5));
  const games   = Math.max(1, parseInt(args[2] ?? '1000', 10) || 1000);
  const verbose = flags.includes('--verbose') || flags.includes('-v');

  if (verbose && games > 10) {
    console.warn('[WARN] --verbose は games が多いと大量出力になります');
  }

  console.log(`\nシミュレーション: Lv${levelA}(A) vs Lv${levelB}(B)  ${games}ゲーム\n`);

  let wA = 0, wB = 0, draws = 0, totalT = 0;

  for (let i = 0; i < games; i++) {
    const g = new SimGame(levelA, levelB, verbose);
    const r = g.run();
    totalT += r.turns;
    if (r.winner === 'A')    wA++;
    else if (r.winner === 'B') wB++;
    else                       draws++;
  }

  const pA = (wA   / games * 100).toFixed(1);
  const pB = (wB   / games * 100).toFixed(1);
  const pD = (draws / games * 100).toFixed(1);
  const avg = (totalT / games).toFixed(1);

  console.log(`---- 結果 (${games}ゲーム) ----`);
  console.log(`Lv${levelA}(A) 勝利: ${wA.toString().padStart(5)}  (${pA}%)`);
  console.log(`Lv${levelB}(B) 勝利: ${wB.toString().padStart(5)}  (${pB}%)`);
  console.log(`引き分け:       ${draws.toString().padStart(5)}  (${pD}%)`);
  console.log(`平均ターン数:   ${avg}`);
}

if (require.main === module) main();

module.exports = { SimGame };
