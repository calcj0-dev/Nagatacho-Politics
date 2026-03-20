// ============================================================
// バージョン
// ============================================================
const APP_VERSION = "0.1.22";

// ============================================================
// カードデータ定義
// ============================================================

let POLITICIAN_CARDS = []; // assets/data/politician_cards.json から読み込み
let OPTION_CARDS = [];    // assets/data/option_cards.json から読み込み
const cardImageCache = new Map(); // card.id → Canvas dataURL



// 政党リスト
const PARTIES = ["自民党", "国民民主党", "チームみらい", "維新の会", "参政党", "中道改革連合"];

// ============================================================
// ユーティリティ
// ============================================================

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ============================================================
// ゲーム状態
// ============================================================

function createPlayerState() {
  return {
    party: null,
    approval: 30,
    funds: 0,
    hand: [],
    field: [],
    deck: [],
    discard: [],
    placedThisTurn: false,
    usedAbilities: {},       // { cardInstanceId: true }
    usedOptionThisTurn: false,
    skipNextDraw: false,
    sealAllNextTurn: false,  // ヤジ合戦：次の自分ターン開始後に全カード封印
    shields: [],             // 無効化系効果
    currentTurnCostReduction: 0, // このターンのみ有効なコスト軽減（ターン開始時にnextTurnBonusesから転写）
    zeroCostCardId: null,        // このターンのみコスト0にする政治家カードのinstanceId
    nextTurnBonuses: {
      fundBonus: 0,
      costReduction: 0,      // 次ターン開始時にcurrentTurnCostReductionへ転写してリセット
      defenseBonus: 0,
      attackMultiplier: 1,
      attackReduction: 0,
      immuneTurns: 0
    }
  };
}

const gameState = {
  phase: "party_select", // party_select | card_select | playing | finished
  turn: 0,
  currentPlayer: "player", // player | cpu
  player: createPlayerState(),
  cpu: createPlayerState(),
  instanceIdCounter: 0,
  pendingEffects: [],      // 遅延効果（5ターン後投資返却など）
  cpuLevel: 3,             // 1〜5
  _pendingParty: null,     // レベル選択前に一時保持する政党名
};

// カードインスタンスを生成（同じカード定義から複数インスタンスを作る）
function createCardInstance(cardDef) {
  gameState.instanceIdCounter++;
  return {
    ...cardDef,
    instanceId: gameState.instanceIdCounter,
    disabled: false,       // 能力使用不可フラグ
    sealedAbility2: false  // 能力2封印フラグ
  };
}

// ============================================================
// デッキ構築
// ============================================================

function buildDeck(party) {
  const politicians = POLITICIAN_CARDS.filter(c => c.party === party).map(createCardInstance);
  const options = [];
  for (const optDef of OPTION_CARDS) {
    const count = optDef.count ?? 2;
    for (let i = 0; i < count; i++) {
      options.push(createCardInstance(optDef));
    }
  }
  return { politicians, options };
}

// ============================================================
// ゲーム初期化
// ============================================================

function initGame(playerParty) {
  // プレイヤー側: 全カードをシャッフルし、手札先頭に政治家カードを1枚保証
  const playerCards = buildDeck(playerParty);
  const playerAll = shuffleArray([...playerCards.politicians, ...playerCards.options]);
  const pPolIdx = playerAll.findIndex(c => c.type === "politician");
  if (pPolIdx > 2) [playerAll[0], playerAll[pPolIdx]] = [playerAll[pPolIdx], playerAll[0]];

  gameState.player = createPlayerState();
  gameState.player.party = playerParty;
  gameState.player.field = [];
  gameState.player.deck = playerAll;
  gameState.player.hand = gameState.player.deck.splice(0, 3);

  // CPU側: プレイヤーと異なる政党からランダム選択
  const cpuParties = PARTIES.filter(p => p !== playerParty);
  const cpuParty = cpuParties[Math.floor(Math.random() * cpuParties.length)];
  const cpuCards = buildDeck(cpuParty);
  const cpuAll = shuffleArray([...cpuCards.politicians, ...cpuCards.options]);
  const cPolIdx = cpuAll.findIndex(c => c.type === "politician");
  if (cPolIdx > 2) [cpuAll[0], cpuAll[cPolIdx]] = [cpuAll[cPolIdx], cpuAll[0]];

  gameState.cpu = createPlayerState();
  gameState.cpu.party = cpuParty;
  gameState.cpu.field = [];
  gameState.cpu.deck = cpuAll;
  gameState.cpu.hand = gameState.cpu.deck.splice(0, 3);

  gameState.turn = 1;
  gameState.currentPlayer = "player";
  gameState.phase = "playing";
  gameState.approvalHistory = [];

  console.log("[initGame] ゲーム開始");
  console.log(`  プレイヤー: ${playerParty}`);
  console.log(`  CPU: ${cpuParty}`);
  logState();

  startPlayerTurn();
}

// ============================================================
// 効果処理
// ============================================================

// 支持率変更（クランプ付き）- 変動メッセージを返す
function changeApproval(player, amount) {
  const before = player.approval;
  let shieldMsg = null;
  if (amount < 0) {
    const result = applyDefenses(player, amount);
    amount = result.amount;
    shieldMsg = result.shieldMsg ?? null;
    if (result.showBanner && shieldMsg) {
      const isPlayer = player === gameState.player;
      setTimeout(() => showActionBanner(["🛡 ドリル破壊！", shieldMsg], isPlayer, () => {}), 200);
    }
  } else if (amount > 0) {
    const masukomiIdx = player.shields.indexOf("block_approval_up_masukomi");
    if (masukomiIdx >= 0) {
      player.shields.splice(masukomiIdx, 1);
      amount = 0;
      shieldMsg = "📵 マスコミ対策発動！支持率上昇を無効化！";
      const isPlayer = player === gameState.player;
      setTimeout(() => showActionBanner(["📵 マスコミ対策！", shieldMsg], isPlayer, () => {}), 200);
    } else {
      const blockIdx = player.shields.indexOf("block_approval_up");
      if (blockIdx >= 0) {
        player.shields.splice(blockIdx, 1);
        console.log("  シールド発動: 支持率上昇を無効化");
        amount = 0;
        shieldMsg = "📵 シールド発動！支持率上昇を無効化！";
      }
    }
  }
  player.approval = clamp(player.approval + amount, 0, 100);
  const after = player.approval;
  if (after !== before) player._approvalFlash = { dir: after > before ? "up" : "down", delta: after - before };
  const who = player === gameState.player ? "あなた" : "相手";
  if (shieldMsg) return shieldMsg;
  if (after > before) return `${who}の支持率が上がった！`;
  if (after < before) return `${who}の支持率が下がった…`;
  return null;
}

// 資金変更
function changeFunds(player, amount) {
  const before = player.funds;
  player.funds = Math.max(0, player.funds + amount);
  const delta = player.funds - before;
  if (delta !== 0) player._fundsFlash = { dir: delta > 0 ? "up" : "down", delta };
}

// 自分/相手を取得
function getSelfAndOpponent(executor) {
  if (executor === "player") return { self: gameState.player, opponent: gameState.cpu };
  return { self: gameState.cpu, opponent: gameState.player };
}

// 能力効果マップ
const ABILITY_EFFECTS = {
  // --- 自民党 ---
  ishiba_1(self, _opponent) {
    const msgs = [];
    const m1 = changeApproval(self, -3);
    if (m1) msgs.push(m1);
    changeFunds(self, 5);
    msgs.push("政治資金+5億円を獲得！");
    return msgs;
  },
  ishiba_2(self, opponent) {
    const msgs = [];
    if (opponent.field.length > 0) {
      // CPU：最も能力コスト合計が高いカードを封印対象に選ぶ
      const target = opponent.field.reduce((best, cur) => {
        const bestCost = (best.abilities || []).reduce((s, a) => s + (a.cost || 0), 0);
        const curCost  = (cur.abilities  || []).reduce((s, a) => s + (a.cost || 0), 0);
        return curCost > bestCost ? cur : best;
      }, opponent.field[0]);
      target.sealedNextTurn = true;
      msgs.push(`${target.name}の能力を次ターン封印！`);
    } else {
      msgs.push("相手の場にカードがなく空振り…");
    }
    return msgs;
  },
  takaichi_1(self, _opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 8);
    if (m1) msgs.push(m1);
    return msgs;
  },
  takaichi_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 12);
    if (m1) msgs.push(m1);
    const m2 = changeApproval(opponent, -4);
    if (m2) msgs.push(m2);
    return msgs;
  },
  koizumi_1(self, _opponent) {
    // CPU用: スロット演出なしでランダム判定
    const msgs = [];
    const amount = Math.random() < 0.5 ? 15 : -10;
    const m1 = changeApproval(self, amount);
    if (m1) msgs.push(m1);
    return msgs;
  },
  koizumi_2(_self, opponent) {
    const msgs = [];
    if (opponent.hand.length > 0) {
      const idx = Math.floor(Math.random() * opponent.hand.length);
      const discarded = opponent.hand.splice(idx, 1)[0];
      opponent.discard.push(discarded);
      msgs.push("相手の手札から1枚を捨て札にした！");
    } else {
      msgs.push("相手の手札がなく空振り…");
    }
    return msgs;
  },
  kono_1(self, _opponent) {
    const msgs = [];
    self.shields.push("block_approval_down");
    msgs.push("次の相手ターンに受ける支持率低下を無効化！");
    return msgs;
  },
  kono_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 6);
    if (m1) msgs.push(m1);
    if (self.deck.length > 0) {
      const drawn = self.deck.shift();
      self.hand.push(drawn);
      msgs.push(`${drawn.name}を手札に加えた！`);
    } else {
      msgs.push("山札がなくドロー不可…");
    }
    return msgs;
  },
  suga_1(self, _opponent) {
    const msgs = [];
    changeFunds(self, 3);
    msgs.push("政治資金+3億円を獲得！");
    return msgs;
  },
  suga_2(self, _opponent) {
    const msgs = [];
    let bonus = 0;
    if (self.field.length === 1) bonus = 4;
    const m1 = changeApproval(self, 8 + bonus);
    if (m1) msgs.push(m1);
    if (bonus > 0) msgs.push("場が1枚で追加+4%！");
    return msgs;
  },

  // --- 国民民主党 ---
  tamaki_1(self, opponent) {
    const msgs = [];
    if (self.field.length === 0) {
      msgs.push("場にカードがなく効果なし…");
      return msgs;
    }
    const down = self.field.length * 4;
    const m1 = changeApproval(opponent, -down);
    if (m1) msgs.push(m1);
    msgs.push(`自分の場${self.field.length}枚×4%=${down}%DOWN！`);
    return msgs;
  },
  tamaki_2(self, _opponent) {
    const msgs = [];
    changeFunds(self, 5);
    msgs.push("政治資金+5億円を獲得！");
    return msgs;
  },
  mori_1(self, _opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 5);
    if (m1) msgs.push(m1);
    self.currentTurnCostReduction = (self.currentTurnCostReduction || 0) + 1;
    msgs.push("このターンの能力コスト全て-1億！");
    return msgs;
  },
  mori_2(self, _opponent) {
    const msgs = [];
    let bonus = 0;
    if (self.field.length <= 2) bonus = 8;
    const m1 = changeApproval(self, 7 + bonus);
    if (m1) msgs.push(m1);
    if (bonus > 0) msgs.push("場が2枚以下で追加+8%！");
    return msgs;
  },
  shinba_1(self, _opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 5);
    if (m1) msgs.push(m1);
    return msgs;
  },
  shinba_2(self, opponent) {
    const msgs = [];
    if (opponent.field.length === 0) {
      msgs.push("相手の場にカードがなく空振り…");
      return msgs;
    }
    // CPU：最もコスト合計が高いカードを封印対象に選ぶ
    const target = opponent.field.reduce((best, cur) => {
      const bestCost = (best.abilities || []).reduce((s, a) => s + (a.cost || 0), 0);
      const curCost  = (cur.abilities  || []).reduce((s, a) => s + (a.cost || 0), 0);
      return curCost > bestCost ? cur : best;
    }, opponent.field[0]);
    target.sealedNextTurn = true;
    msgs.push(`${target.name}の能力を次ターン封印！`);
    return msgs;
  },
  furukawa_1(_self, opponent) {
    const msgs = [];
    const m1 = changeApproval(opponent, -5);
    if (m1) msgs.push(m1);
    return msgs;
  },
  furukawa_2(self, _opponent) {
    // CPU用: スロット演出なしでランダム判定
    const msgs = [];
    const amount = Math.random() < 0.5 ? 10 : -3;
    const m1 = changeApproval(self, amount);
    if (m1) msgs.push(m1);
    return msgs;
  },
  ito_1(self, _opponent) {
    const msgs = [];
    if (self.hand.length === 0) {
      msgs.push("手札がなく効果なし…");
      return msgs;
    }
    const up = self.hand.length * 2;
    const m1 = changeApproval(self, up);
    if (m1) msgs.push(m1);
    msgs.push(`手札${self.hand.length}枚×2%=${up}%UP！`);
    return msgs;
  },
  ito_2(self, _opponent) {
    const msgs = [];
    const drawCount = Math.min(2, self.deck.length);
    if (drawCount === 0) {
      msgs.push("山札がなくドロー不可…");
      return msgs;
    }
    for (let i = 0; i < drawCount; i++) {
      const drawn = self.deck.shift();
      self.hand.push(drawn);
      msgs.push(`${drawn.name}を手札に加えた！`);
    }
    return msgs;
  },

  // --- チームみらい ---
  anno_1(self, _opponent) {
    const msgs = [];
    const returnTurn = gameState.turn + 5;
    const isPlayer = self === gameState.player;
    gameState.pendingEffects.push({ type: "anno_invest", player: isPlayer ? "player" : "cpu", returnTurn, amount: 5 });
    msgs.push(`投資完了！5ターン後（第${returnTurn}ターン）に+5億で返却！`);
    return msgs;
  },
  anno_2(self, _opponent) {
    const msgs = [];
    let bonus = 0;
    if (self.field.length >= 3) bonus = 10;
    const m1 = changeApproval(self, 6 + bonus);
    if (m1) msgs.push(m1);
    if (bonus > 0) msgs.push("場のカードが3枚で追加+10%！");
    return msgs;
  },
  takayama_1(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 4);
    if (m1) msgs.push(m1);
    opponent.blockOptionNextTurn = true;
    msgs.push("次の相手ターンはオプションカード使用不可！");
    return msgs;
  },
  takayama_2(self, opponent) {
    const msgs = [];
    if (self.field.length === 0) {
      msgs.push("場にカードがなく効果なし…");
      return msgs;
    }
    const up = self.field.length * 4;
    const m1 = changeApproval(self, up);
    if (m1) msgs.push(m1);
    msgs.push(`自分の場${self.field.length}枚×4%=${up}%UP！`);
    return msgs;
  },
  muto_1(self, _opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 6);
    if (m1) msgs.push(m1);
    return msgs;
  },
  muto_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(opponent, -10);
    if (m1) msgs.push(m1);
    const m2 = changeApproval(self, 5);
    if (m2) msgs.push(m2);
    return msgs;
  },
  suda_1(self, _opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 5);
    if (m1) msgs.push(m1);
    return msgs;
  },
  suda_2(self, opponent) {
    const msgs = [];
    if (self.hand.length === 0) {
      msgs.push("手札がなく効果なし…");
      return msgs;
    }
    const down = self.hand.length * 2;
    const m1 = changeApproval(opponent, -down);
    if (m1) msgs.push(m1);
    msgs.push(`自分の手札${self.hand.length}枚×2%=${down}%DOWN！`);
    return msgs;
  },
  mineshima_1(self, opponent) {
    const msgs = [];
    // currentTurnCostReductionに直接加算（nextTurnBonusesではなく今すぐ有効にする）
    self.currentTurnCostReduction = (self.currentTurnCostReduction || 0) + 1;
    msgs.push("このターン、全カードの能力コスト-1億！");
    return msgs;
  },
  mineshima_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 15);
    if (m1) msgs.push(m1);
    const m2 = changeApproval(opponent, -10);
    if (m2) msgs.push(m2);
    return msgs;
  },
  // 維新の会
  saito_a_1(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 5);
    if (m) msgs.push(m);
    return msgs;
  },
  saito_a_2(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 15);
    if (m) msgs.push(m);
    self.skipNextDraw = true;
    msgs.push("次のターンのドローをスキップ");
    return msgs;
  },
  fujita_1(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 6);
    if (m) msgs.push(m);
    return msgs;
  },
  fujita_2(self, _opponent) {
    const msgs = [];
    if (self.deck.length > 0) {
      const drawn = self.deck.shift();
      self.hand.push(drawn);
      msgs.push(`${drawn.name}を手札に加えた！`);
    }
    return msgs;
  },
  nakatsuka_1(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 10);
    if (m) msgs.push(m);
    return msgs;
  },
  nakatsuka_2(self, _opponent) {
    const msgs = [];
    self.funds += 6;
    msgs.push("政治資金+6億");
    return msgs;
  },
  baba_1(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 8);
    if (m) msgs.push(m);
    return msgs;
  },
  baba_2(self, _opponent) {
    const msgs = [];
    const gain = Math.random() < 0.5 ? 15 : 5;
    const m = changeApproval(self, gain);
    if (m) msgs.push(m);
    return msgs;
  },
  maehara_1(self, _opponent) {
    const msgs = [];
    const gain = Math.floor(Math.random() * 6); // 0〜5
    self.funds += gain;
    msgs.push(`政治資金+${gain}億`);
    return msgs;
  },
  maehara_2(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 9);
    if (m) msgs.push(m);
    return msgs;
  },
  // 参政党
  kamiya_1(self, _opponent) {
    const msgs = [];
    const gain = Math.floor(Math.random() * 11); // 0〜10
    const m = changeApproval(self, gain);
    if (m) msgs.push(m);
    return msgs;
  },
  kamiya_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 10);
    if (m1) msgs.push(m1);
    const m2 = changeApproval(opponent, -4);
    if (m2) msgs.push(m2);
    return msgs;
  },
  ando_1(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 5);
    if (m) msgs.push(m);
    return msgs;
  },
  ando_2(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 10);
    if (m) msgs.push(m);
    return msgs;
  },
  toyota_1(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 10);
    if (m) msgs.push(m);
    return msgs;
  },
  toyota_2(self, _opponent) {
    const msgs = [];
    const femaleCount = self.field.filter(c => c.gender === "女").length;
    const bonus = femaleCount >= 2 ? 13 : 0;
    const m = changeApproval(self, 7 + bonus);
    if (m) msgs.push(m);
    return msgs;
  },
  yoshikawa_1(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 6);
    if (m) msgs.push(m);
    return msgs;
  },
  yoshikawa_2(self, opponent) {
    const msgs = [];
    const m = changeApproval(self, 6);
    if (m) msgs.push(m);
    opponent.blockOptionNextTurn = true;
    msgs.push("次の相手ターンはオプションカード使用不可！");
    return msgs;
  },
  mogami_1(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 4);
    if (m) msgs.push(m);
    return msgs;
  },
  mogami_2(self, _opponent) {
    const msgs = [];
    self.currentTurnCostReduction = 99; // 全能力コスト0
    msgs.push("このターン、全カードの能力コスト消費なし！");
    return msgs;
  },
  // 中道改革連合
  noda_1(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 6);
    if (m) msgs.push(m);
    return msgs;
  },
  noda_2(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, -5);
    if (m) msgs.push(m);
    self.funds += 4;
    msgs.push("政治資金+4億");
    return msgs;
  },
  izumi_1(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 5);
    if (m) msgs.push(m);
    return msgs;
  },
  izumi_2(_self, opponent) {
    const msgs = [];
    const m = changeApproval(opponent, -25);
    if (m) msgs.push(m);
    return msgs;
  },
  ogawa_1(_self, opponent) {
    const msgs = [];
    if (opponent.field.length > 0) {
      const target = opponent.field.reduce((best, cur) => {
        const bestCost = (best.abilities || []).reduce((s, a) => s + (a.cost || 0), 0);
        const curCost  = (cur.abilities  || []).reduce((s, a) => s + (a.cost || 0), 0);
        return curCost > bestCost ? cur : best;
      }, opponent.field[0]);
      target.sealedNextTurn = true;
      msgs.push(`${target.name}の能力を次ターン封印！`);
    } else {
      msgs.push("相手の場にカードがなく空振り…");
    }
    return msgs;
  },
  ogawa_2(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 9);
    if (m) msgs.push(m);
    return msgs;
  },
  isa_1(self, _opponent) {
    const msgs = [];
    const m = changeApproval(self, 5);
    if (m) msgs.push(m);
    return msgs;
  },
  isa_2(self, _opponent) {
    const msgs = [];
    const gain = self.hand.length * 3;
    const m = changeApproval(self, gain);
    if (m) msgs.push(m);
    return msgs;
  },
  saito_t_1(self, _opponent) {
    const msgs = [];
    if (self.deck.length > 0) {
      const drawn = self.deck.shift();
      self.hand.push(drawn);
      msgs.push(`${drawn.name}を手札に加えた！`);
    }
    return msgs;
  },
  saito_t_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 15);
    if (m1) msgs.push(m1);
    const m2 = changeApproval(opponent, -10);
    if (m2) msgs.push(m2);
    return msgs;
  }
};

// オプション効果マップ
const OPTION_EFFECTS = {
  trump_tariff(self, opponent) {
    const msgs = [];
    const selfLoss = Math.floor(self.funds * 0.5);
    const oppLoss = Math.floor(opponent.funds * 0.5);
    changeFunds(self, -selfLoss);
    changeFunds(opponent, -oppLoss);
    msgs.push(`両者の政治資金が没収された！（自分-${selfLoss}億、相手-${oppLoss}億）`);
    return msgs;
  },
  kioku_ni_gozaimasen(_self, _opponent) {
    // zeroCostCardId の設定は useOptionCard の特殊処理で行う
    return [];
  },
  kenkin_party(self, opponent) {
    const msgs = [];
    changeFunds(self, 5);
    msgs.push("政治資金+5億円を獲得！");
    return msgs;
  },
  gaitou_enzetsu(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 4);
    if (m1) msgs.push(m1);
    if (self.field.length >= 2) {
      const m2 = changeApproval(self, 8);
      if (m2) msgs.push(m2);
    }
    return msgs;
  },
  drill_hakai(self, _opponent) {
    const msgs = [];
    self.shields.push("block_approval_down_drill");
    msgs.push("次の支持率低下を一度だけ無効化！");
    return msgs;
  },
  tounai_kaikaku(self, opponent) {
    const msgs = [];
    // 場にカードがなければ空振り
    if (self.field.length === 0) {
      msgs.push("場にカードがなく空振り…");
      return msgs;
    }
    // 手札に政治家カードがなければ使用不可（空振り）
    const politicianInHand = self.hand.find(c => c.type === "politician");
    if (!politicianInHand) {
      msgs.push("手札に政治家カードがなく空振り…");
      return msgs;
    }
    // ランダムに場から1枚捨て、手札から政治家を場に出す
    const removeIdx = Math.floor(Math.random() * self.field.length);
    const removed = self.field.splice(removeIdx, 1)[0];
    self.discard.push(removed);
    const addIdx = self.hand.findIndex(c => c.type === "politician");
    const added = self.hand.splice(addIdx, 1)[0];
    added.fieldSlot = removed.fieldSlot ?? removeIdx;
    self.field.push(added);
    msgs.push(`${removed.name}を捨て、${added.name}を場に出した！`);
    return msgs;
  },
  toushu_touron(self, _opponent) {
    const msgs = [];
    const bonus = Math.floor(Math.random() * 10) + 1;
    const m1 = changeApproval(self, bonus);
    if (m1) msgs.push(m1);
    return msgs;
  },
  yukiguni_yukikaki(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(opponent, -5);
    if (m1) msgs.push(m1);
    return msgs;
  },
  kono_hage(self, opponent) {
    const msgs = [];
    let extra = 0;
    const hasFemale = opponent.field.some(c => c.gender === "女");
    if (hasFemale) extra = -7;
    const m1 = changeApproval(opponent, -5 + extra);
    if (m1) msgs.push(m1);
    if (hasFemale) msgs.push("相手の場に女性政治家がいたため追加効果！");
    return msgs;
  },
  netenai_jiman(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 4);
    if (m1) msgs.push(m1);
    return msgs;
  },
  masukomi_taisaku(_self, opponent) {
    const msgs = [];
    opponent.shields.push("block_approval_up_masukomi");
    msgs.push("次の相手ターンの支持率上昇を1回無効化！");
    return msgs;
  },
  ouen_enzetsu(self, opponent) {
    const msgs = [];
    const politicianIdx = self.deck.findIndex(c => c.type === "politician");
    if (politicianIdx >= 0) {
      const drawn = self.deck.splice(politicianIdx, 1)[0];
      self.hand.push(drawn);
      msgs.push("政治家カードを山札から1枚手札に加えた！");
    } else {
      msgs.push("山札に政治家カードがなく空振り…");
    }
    return msgs;
  },
  kinkyuu_yoron(self, opponent) {
    return []; // 効果はshowSurveyOverlay（kinkyuu）で表示
  },
  giinkaikan_furin(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(opponent, -8);
    if (m1) msgs.push(m1);
    const m2 = changeApproval(self, -3);
    if (m2) msgs.push(m2);
    return msgs;
  },
  yaji_gassen(_self, opponent) {
    const msgs = [];
    const count = opponent.field.length;
    if (count > 0) {
      opponent.sealAllNextTurn = true;
      msgs.push(`相手の政治家${count}人の能力を次のターン封じた！`);
    } else {
      msgs.push("相手の場に政治家カードがない…");
    }
    return msgs;
  },
  gyuuho_senjutsu(_self, opponent) {
    const msgs = [];
    opponent.skipNextDraw = true;
    msgs.push("相手の次のターンのドローを封じた！");
    return msgs;
  },
  kokkai_inemuri(self, _opponent) {
    const msgs = [];
    let drawn = 0;
    for (let i = 0; i < 2; i++) {
      if (self.deck.length === 0) break;
      self.hand.push(self.deck.shift());
      drawn++;
    }
    msgs.push(drawn > 0 ? `山札から${drawn}枚ドローした！` : "山札が空でドローできない…");
    return msgs;
  },
  zouzei_megane(self, opponent) {
    const msgs = [];
    const amount = Math.min(3, opponent.funds);
    changeFunds(opponent, -amount);
    changeFunds(self, amount);
    msgs.push(`相手から${amount}億徴収した！`);
    return msgs;
  }
};

// 攻撃系の支持率低下にシールド/防御ボーナスを適用
// 戻り値: { amount: number, shieldMsg?: string }
function applyDefenses(target, amount) {
  if (amount >= 0) return { amount };

  // シールドチェック（block_approval_down）
  const drillIdx = target.shields.indexOf("block_approval_down_drill");
  if (drillIdx >= 0) {
    target.shields.splice(drillIdx, 1);
    console.log("  シールド発動: ドリル破壊");
    return { amount: 0, shieldMsg: "🛡 ドリル破壊発動！支持率低下を無効化！", showBanner: true };
  }

  const shieldIdx = target.shields.indexOf("block_approval_down");
  if (shieldIdx >= 0) {
    target.shields.splice(shieldIdx, 1);
    console.log("  シールド発動: 支持率低下を無効化");
    return { amount: 0, shieldMsg: "🛡 Xブロック祭り発動！支持率低下を無効化！" };
  }

  // block_attack シールド
  const blockIdx = target.shields.indexOf("block_attack");
  if (blockIdx >= 0) {
    target.shields.splice(blockIdx, 1);
    console.log("  シールド発動: 攻撃を無効化");
    return { amount: 0, shieldMsg: "🛡 シールド発動！攻撃を無効化！" };
  }

  // immune シールド
  const immuneIdx = target.shields.indexOf("immune");
  if (immuneIdx >= 0) {
    target.shields.splice(immuneIdx, 1);
    console.log("  シールド発動: 免疫で無効化");
    return { amount: 0, shieldMsg: "🛡 シールド発動！無効化！" };
  }

  // 防御ボーナス（1回使用後リセット）
  if (target.nextTurnBonuses.defenseBonus > 0) {
    const reduction = Math.floor(Math.abs(amount) * target.nextTurnBonuses.defenseBonus / 100);
    target.nextTurnBonuses.defenseBonus = 0;
    console.log(`  防御ボーナス: ${reduction}%軽減`);
    return { amount: amount + reduction };
  }

  // 攻撃軽減
  if (target.nextTurnBonuses.attackReduction > 0) {
    const red = target.nextTurnBonuses.attackReduction;
    target.nextTurnBonuses.attackReduction = 0;
    return { amount: amount + red };
  }

  return { amount };
}

// 効果を実行して結果メッセージを返す
function executeEffect(effectId, executor) {
  const { self, opponent } = getSelfAndOpponent(executor);
  const effectFn = ABILITY_EFFECTS[effectId] || OPTION_EFFECTS[effectId];
  if (!effectFn) {
    console.log(`効果未定義: ${effectId}`);
    return ["（効果未定義）"];
  }
  return effectFn(self, opponent);
}

// ============================================================
// ターンループ
// ============================================================

// 遅延効果の処理（anno_1の投資返却など）
function processPendingEffects() {
  gameState.pendingEffects = gameState.pendingEffects.filter(e => {
    if (e.returnTurn === gameState.turn) {
      const target = e.player === "player" ? gameState.player : gameState.cpu;
      changeFunds(target, e.amount);
      console.log(`  [投資返却] ${e.player} +${e.amount}億 (ターン${gameState.turn})`);
      return false;
    }
    return true;
  });
}

function startPlayerTurn() {
  const p = gameState.player;
  gameState.currentPlayer = "player";

  // リセット
  p.placedThisTurn = false;
  p.usedAbilities = {};
  p.usedOptionThisTurn = p.blockOptionNextTurn ?? false;
  p.optionBlockReason = p.blockOptionNextTurn ? "takayama" : null;
  p.blockOptionNextTurn = false;

  // 1ターン限定シールドを失効（前の自分ターンに積んだ未使用分を消去）
  p.shields = p.shields.filter(s => s !== "block_approval_down" && s !== "block_approval_down_drill");

  // disabled解除・sealedAbility2解除（前ターンで封印されたカードを復帰）
  p.field.forEach(c => { c.disabled = false; c.sealedAbility2 = false; });

  // ヤジ合戦：このターン全カード封印
  if (p.sealAllNextTurn) {
    p.field.forEach(c => { c.disabled = true; });
    p.sealAllNextTurn = false;
  }

  // ishiba_2等: 個別カード封印フラグ適用
  p.field.forEach(c => { if (c.sealedNextTurn) { c.disabled = true; c.sealedNextTurn = false; } });

  // 遅延効果の処理
  processPendingEffects();

  // 次ターンボーナスの支持率ボーナスを適用
  if (p.nextTurnBonuses.approvalBonus) {
    changeApproval(p, p.nextTurnBonuses.approvalBonus);
    p.nextTurnBonuses.approvalBonus = 0;
  }

  // 次ターンボーナスのコスト軽減を転写してリセット（これで永久蓄積を防ぐ）
  p.currentTurnCostReduction = p.nextTurnBonuses.costReduction;
  p.nextTurnBonuses.costReduction = 0;
  p.zeroCostCardId = null;

  // ① 資金フェーズ
  const bonus = p.nextTurnBonuses.fundBonus;
  const income = 1 + bonus;
  p.funds += income;
  p._fundsFlash = { dir: "up", delta: income };
  p.nextTurnBonuses.fundBonus = 0;
  console.log(`[ターン${gameState.turn}] プレイヤーのターン開始 - 資金+${income}億 (合計${p.funds}億)`);

  // ② ドローフェーズ（山札からカードを抜くが、手札への追加はバナー後に行う）
  let drawnCard = null;
  if (p.skipNextDraw) {
    console.log("  ドロースキップ");
    p.skipNextDraw = false;
  } else if (p.deck.length > 0) {
    drawnCard = p.deck.shift();
    console.log(`  ドロー: ${drawnCard.name}`);
  } else {
    console.log("  山札なし - ドロー不可");
  }

  // ③ メインフェーズ: UI操作待ち
  gameState.approvalHistory.push({
    turn: gameState.turn,
    player: gameState.player.approval,
    cpu: gameState.cpu.approval,
  });

  // ゲーム画面に先に切り替える（フラッシュアニメーションはバナー後に発火させたいので一時退避）
  const savedFundsFlash    = gameState.player._fundsFlash;
  const savedApprovalFlash = gameState.player._approvalFlash;
  delete gameState.player._fundsFlash;
  delete gameState.player._approvalFlash;
  renderGame(); // ← ここでゲーム画面へ遷移（手札はまだ増えていない）
  if (savedFundsFlash)    gameState.player._fundsFlash    = savedFundsFlash;
  if (savedApprovalFlash) gameState.player._approvalFlash = savedApprovalFlash;

  showTurnBanner(true, () => {
    if (drawnCard) p.hand.push(drawnCard); // バナー後に手札へ追加
    focusedHandIndex = Math.floor(p.hand.length / 2); // 中央カードをフォーカス
    renderGame(); // ← バナー後にフラッシュ発火（手札反映済み）
    if (drawnCard) {
      animateDrawCard(true, () => setMainPhaseUI(true));
    } else {
      setMainPhaseUI(true);
    }
  });
}

// 山札→手札ドローアニメーション
function animateDrawCard(isPlayer, onDone) {
  const deckId = isPlayer ? "player-deck" : "cpu-deck";
  const handId = isPlayer ? "player-hand" : "cpu-hand";
  const srcEl = document.querySelector(`#${deckId} .deck-card-back`);
  const handEl = document.getElementById(handId);
  const handCards = handEl ? handEl.querySelectorAll(isPlayer ? ".card" : ".card-back") : [];
  const destEl = handCards[handCards.length - 1];

  if (!srcEl || !destEl) { onDone(); return; }

  const srcRect = srcEl.getBoundingClientRect();
  const destRect = destEl.getBoundingClientRect();

  const clone = srcEl.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.left = srcRect.left + "px";
  clone.style.top = srcRect.top + "px";
  clone.style.width = srcRect.width + "px";
  clone.style.height = srcRect.height + "px";
  clone.style.margin = "0";
  clone.style.zIndex = "450";
  clone.style.pointerEvents = "none";
  clone.style.transition = "none";
  document.body.appendChild(clone);
  clone.getBoundingClientRect();

  requestAnimationFrame(() => {
    clone.style.transition = [
      "left 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      "top 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      "width 0.28s ease",
      "height 0.28s ease"
    ].join(", ");
    clone.style.left = destRect.left + "px";
    clone.style.top = destRect.top + "px";
    clone.style.width = destRect.width + "px";
    clone.style.height = destRect.height + "px";
  });

  setTimeout(() => {
    clone.style.transition = "opacity 0.12s ease";
    clone.style.opacity = "0";
    setTimeout(() => {
      clone.remove();
      // ドロー完了時: 最後の手札カードをフリップ演出で登場させる
      if (isPlayer) {
        const lastCard = [...document.querySelectorAll("#player-hand .card")].at(-1);
        if (lastCard) {
          lastCard.classList.remove("card-draw-appear");
          void lastCard.offsetWidth;
          lastCard.classList.add("card-draw-appear");
          lastCard.addEventListener("animationend",
            () => lastCard.classList.remove("card-draw-appear"), { once: true });
        }
      }
      onDone();
    }, 120);
  }, 330);
}

// ターン交代バナー（画面中央にスライドインして自動消え）
function showTurnBanner(isPlayer, onDone) {
  // 全画面フラッシュ
  const flash = document.createElement("div");
  Object.assign(flash.style, {
    position: "fixed", inset: "0", pointerEvents: "none", zIndex: "355",
    background: isPlayer ? "rgba(74,171,240,0.18)" : "rgba(240,160,32,0.18)",
    opacity: "1", transition: "opacity 0.5s ease",
  });
  document.body.appendChild(flash);
  requestAnimationFrame(() => requestAnimationFrame(() => { flash.style.opacity = "0"; }));
  setTimeout(() => flash.remove(), 550);

  const el = document.createElement("div");
  el.id = "turn-transition-banner";
  el.className = isPlayer ? "ttb-player" : "ttb-cpu";
  el.textContent = isPlayer ? "あなたのターン" : "CPUのターン";
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.classList.add("ttb-show");
    setTimeout(() => {
      el.classList.remove("ttb-show");
      el.classList.add("ttb-hide");
      setTimeout(() => { el.remove(); onDone(); }, 220);
    }, 850);
  });
}

// オプションカードの最適使用タイミングを返す（Lv4-5用）
// "first"         → 政治家配置前（draw系：引いた政治家をその場で配置可能）
// "before_ability"→ 配置後・能力前（資金系：増やした資金で能力コストを払える）
// "last"          → 能力後（デフォルト）
function cpuGetOptionPriority(card) {
  if (!card) return "last";
  const drawFirst   = ["ouen_enzetsu", "kokkai_inemuri"];
  const fundBefore  = ["kenkin_party", "zouzei_megane"];
  if (drawFirst.includes(card.effect))  return "first";
  if (fundBefore.includes(card.effect)) return "before_ability";
  return "last";
}

// キューから次のフェーズ関数を取り出して実行
function cpuRunNextPhase() {
  const next = gameState.cpuPhaseQueue && gameState.cpuPhaseQueue.shift();
  if (next) next();
}

function startCpuTurn() {
  const c = gameState.cpu;
  gameState.currentPlayer = "cpu";

  c.placedThisTurn = false;
  c.usedAbilities = {};
  c.usedOptionThisTurn = c.blockOptionNextTurn ?? false;
  c.blockOptionNextTurn = false;

  // 1ターン限定シールドを失効
  c.shields = c.shields.filter(s => s !== "block_approval_down" && s !== "block_approval_down_drill");
  c.zeroCostCardId = null;
  c.field.forEach(card => { card.disabled = false; card.sealedAbility2 = false; });

  // ヤジ合戦：このターン全カード封印
  if (c.sealAllNextTurn) {
    c.field.forEach(card => { card.disabled = true; });
    c.sealAllNextTurn = false;
  }

  // ishiba_2等: 個別カード封印フラグ適用
  c.field.forEach(card => { if (card.sealedNextTurn) { card.disabled = true; card.sealedNextTurn = false; } });

  processPendingEffects();

  if (c.nextTurnBonuses.approvalBonus) {
    changeApproval(c, c.nextTurnBonuses.approvalBonus);
    c.nextTurnBonuses.approvalBonus = 0;
  }

  c.currentTurnCostReduction = c.nextTurnBonuses.costReduction;
  c.nextTurnBonuses.costReduction = 0;

  // ① 資金フェーズ
  const bonus = c.nextTurnBonuses.fundBonus;
  c.funds += 1 + bonus;
  c.nextTurnBonuses.fundBonus = 0;
  console.log(`[ターン${gameState.turn}] CPUのターン開始 - 資金+${1 + bonus}億 (合計${c.funds}億)`);

  // ② ドローフェーズ
  let cpuDrew = false;
  if (c.skipNextDraw) {
    c.skipNextDraw = false;
  } else if (c.deck.length > 0) {
    const drawn = c.deck.shift();
    c.hand.push(drawn);
    console.log(`  CPUドロー: ${drawn.name}`);
    cpuDrew = true;
  }

  showTurnBanner(false, () => {
    renderGame();

    const startThinking = () => {
      const thinkingBanner = document.createElement("div");
      thinkingBanner.id = "cpu-thinking";
      thinkingBanner.textContent = "CPU 思考中...";
      document.body.appendChild(thinkingBanner);
      setTimeout(() => {
        thinkingBanner.remove();
        // フェーズ実行順序を決定（Lv4-5はオプションカード種別で最適化）
        const lv = gameState.cpuLevel;
        const optionCard = gameState.cpu.hand.find(card => card.type === "option");
        let phases = [cpuPhasePlace, cpuPhaseAbilities, cpuPhaseOption, cpuCheckWinAndEnd];
        if (lv >= 4 && optionCard) {
          const priority = cpuGetOptionPriority(optionCard);
          if (priority === "first") {
            phases = [cpuPhaseOption, cpuPhasePlace, cpuPhaseAbilities, cpuCheckWinAndEnd];
          } else if (priority === "before_ability") {
            phases = [cpuPhasePlace, cpuPhaseOption, cpuPhaseAbilities, cpuCheckWinAndEnd];
          }
        }
        gameState.cpuPhaseQueue = phases.slice(1);
        phases[0]();
      }, 900);
    };

    if (cpuDrew) {
      animateDrawCard(false, startThinking);
    } else {
      startThinking();
    }
  });
}

// CPUアクションバナーを表示して onDone を呼ぶ（ノンブロッキング）
// isPlayer=true → 青系(プレイヤー) / false → 橙系(CPU)
function showActionBanner(lines, isPlayer, onDone) {
  // 支持率・政治資金・その他の3グループに分類（空グループはスキップ）
  const approvalLines = lines.filter(l =>  l.includes("支持率"));
  const fundsLines    = lines.filter(l => !l.includes("支持率") && (l.includes("億円") || l.includes("政治資金")));
  const otherLines    = lines.filter(l => !l.includes("支持率") && !l.includes("億円") && !l.includes("政治資金"));
  const groups = [otherLines, approvalLines, fundsLines].filter(g => g.length > 0);

  if (groups.length === 0) { onDone(); return; }

  let banner = document.getElementById("action-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "action-banner";
    document.body.appendChild(banner);
  }

  function showGroup(index) {
    if (index >= groups.length) {
      banner.style.display = "none";
      banner.style.pointerEvents = "none";
      onDone();
      return;
    }

    // コンテンツ差し替え（フェード前に非表示で更新）
    banner.style.transition = "none";
    banner.style.opacity = "0";
    banner.className = isPlayer ? "banner-player" : "banner-cpu";
    banner.innerHTML = groups[index].map(l => `<div>${l}</div>`).join("")
      + `<div class="banner-skip-hint">クリックでスキップ</div>`;
    banner.style.display = "block";
    banner.style.pointerEvents = "auto";
    banner.style.cursor = "pointer";

    // 全画面クリック受け口（バナー外側でもスキップ可）
    const clickCatcher = document.createElement("div");
    Object.assign(clickCatcher.style, {
      position: "fixed", inset: "0", zIndex: "249", cursor: "pointer",
    });
    document.body.appendChild(clickCatcher);

    let done = false;
    let timer;

    function next() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      clickCatcher.remove();
      banner.removeEventListener("click", next);
      banner.style.transition = "opacity 0.25s ease";
      banner.style.opacity = "0";
      setTimeout(() => showGroup(index + 1), 280);
    }

    clickCatcher.addEventListener("click", next);
    banner.addEventListener("click", next);

    // フェードイン
    requestAnimationFrame(() => requestAnimationFrame(() => {
      banner.style.transition = "opacity 0.25s ease";
      banner.style.opacity = "1";
    }));

    timer = setTimeout(next, 2000);
  }

  showGroup(0);
}

// フェーズ1: 政治家カードを場に出す
function cpuPhasePlace() {
  const c = gameState.cpu;
  const lv = gameState.cpuLevel;

  // Lv1: 50%でスキップ / Lv2: 25%でスキップ
  if (lv === 1 && Math.random() < 0.5) { cpuRunNextPhase(); return; }
  if (lv === 2 && Math.random() < 0.25) { cpuRunNextPhase(); return; }

  if (!c.placedThisTurn && c.field.length < 3) {
    // Lv4-5: 能力コスト合計が最大の政治家を選ぶ / Lv1-3: 先頭
    let idx;
    if (lv >= 4) {
      let bestIdx = -1, bestCost = -1;
      c.hand.forEach((card, i) => {
        if (card.type !== "politician") return;
        const total = (card.abilities || []).reduce((s, a) => s + (a.cost || 0), 0);
        if (total > bestCost) { bestCost = total; bestIdx = i; }
      });
      idx = bestIdx;
    } else {
      idx = c.hand.findIndex(card => card.type === "politician");
    }
    if (idx >= 0) {
      // アニメーション用に配置前の位置を取得
      const cardBackEl = document.querySelector("#cpu-hand .card-back");
      const destEl = document.querySelector("#cpu-field .field-empty-slot");

      const card = c.hand.splice(idx, 1)[0];
      const usedCpuSlots = c.field.map(fc => fc.fieldSlot);
      card.fieldSlot = [0, 1, 2].find(s => !usedCpuSlots.includes(s)) ?? c.field.length;
      c.field.push(card);
      c.placedThisTurn = true;
      console.log(`  CPU: ${card.name}を場に出した`);

      const afterPlace = () => {
        renderGame();
        // 着地アニメーション
        const cpuFieldCards = document.querySelectorAll("#cpu-field .card");
        const newCard = cpuFieldCards[cpuFieldCards.length - 1];
        if (newCard) newCard.classList.add("card-landing");
        showActionBanner([`${card.name} を場に出した！`], false, () => cpuRunNextPhase());
      };

      if (cardBackEl && destEl) {
        // card-back の位置に表面カード要素を一時生成してアニメーション
        const backRect = cardBackEl.getBoundingClientRect();
        const faceEl = createCardElement(card);
        Object.assign(faceEl.style, {
          position: "fixed", pointerEvents: "none", zIndex: "499",
          left: backRect.left + "px", top: backRect.top + "px",
          width: backRect.width + "px", height: backRect.height + "px",
          margin: "0",
        });
        document.body.appendChild(faceEl);
        animateCardFly(faceEl, destEl, false, () => { faceEl.remove(); afterPlace(); });
        faceEl.style.opacity = "0"; // cloneが作られた後に元を非表示
      } else {
        afterPlace();
      }
      return;
    }
  }
  cpuRunNextPhase();
}

// フェーズ2: 能力の発動（1つずつ順番に）
function cpuPhaseAbilities() {
  const c = gameState.cpu;
  const lv = gameState.cpuLevel;
  const cr = c.currentTurnCostReduction || 0;
  const abilityActions = [];

  for (const card of c.field) {
    if (c.usedAbilities[card.instanceId] || card.disabled) continue;
    const costs = card.abilities.map(a => Math.max(0, a.cost - cr));
    const isUseful = (effect) => (effect !== "ishiba_2" && effect !== "shinba_2" && effect !== "ogawa_1") || gameState.player.field.length > 0;
    const afford0 = c.funds >= costs[0] && isUseful(card.abilities[0].effect);
    const afford1 = !card.sealedAbility2 && c.funds >= costs[1] && isUseful(card.abilities[1].effect);

    // Lv1: 50%でスキップ
    if (lv === 1 && Math.random() < 0.5) continue;
    // Lv2: 25%でスキップ
    if (lv === 2 && Math.random() < 0.25) continue;

    let chosen = -1;
    if (lv <= 2) {
      // Lv1-2: ランダム選択
      const options = [];
      if (afford0) options.push(0);
      if (afford1) options.push(1);
      if (options.length > 0) chosen = options[Math.floor(Math.random() * options.length)];
    } else if (lv === 3) {
      // Lv3: コストが高い方（従来通り）
      if (afford0 && afford1) chosen = costs[1] >= costs[0] ? 1 : 0;
      else if (afford1) chosen = 1;
      else if (afford0) chosen = 0;
    } else {
      // Lv4-5: 支持率変動効果が大きい方を優先
      const getScore = (abilityIdx) => {
        const effect = card.abilities[abilityIdx].effect;
        // 妨害系・支持率大変動を高スコアに
        const highValueEffects = ["ishiba_2", "shinba_2", "ogawa_1", "izumi_2", "takaichi_2",
          "muto_2", "saito_t_2", "mineshima_2", "mogami_2", "baba_2"];
        if (highValueEffects.includes(effect)) return 100 + costs[abilityIdx];
        return costs[abilityIdx];
      };
      if (afford0 && afford1) {
        chosen = getScore(1) >= getScore(0) ? 1 : 0;
      } else if (afford1) chosen = 1;
      else if (afford0) chosen = 0;

      // Lv5: 支持率差が大きくリードしている場合、資金温存（安い方を選ぶ）
      if (lv === 5 && chosen >= 0) {
        const approvalDiff = c.approval - gameState.player.approval;
        const remainingTurns = 25 - gameState.turn;
        if (approvalDiff > 20 && remainingTurns > 5) {
          if (afford0 && afford1) chosen = costs[0] <= costs[1] ? 0 : 1;
        }
      }
    }

    if (chosen >= 0) {
      abilityActions.push({ card, abilityIdx: chosen, cost: costs[chosen] });
    }
  }
  abilityActions.sort((a, b) => a.cost - b.cost);
  cpuExecuteNextAbility(abilityActions, 0);
}

function cpuExecuteNextAbility(abilityActions, idx) {
  const c = gameState.cpu;
  // 未処理を探す
  while (idx < abilityActions.length) {
    const action = abilityActions[idx];
    if (c.usedAbilities[action.card.instanceId]) { idx++; continue; }
    const cr = c.currentTurnCostReduction || 0;
    let abilityIdx = action.abilityIdx;
    let effectiveCost = Math.max(0, action.card.abilities[abilityIdx].cost - cr);
    // 能力2が封印されている場合は能力1にフォールバック
    if (abilityIdx === 1 && action.card.sealedAbility2) {
      const altCost = Math.max(0, action.card.abilities[0].cost - cr);
      if (c.funds >= altCost) {
        abilityIdx = 0;
        effectiveCost = altCost;
      } else {
        idx++; continue;
      }
    } else if (c.funds < effectiveCost) {
      const altIdx = 1 - abilityIdx;
      // 代替能力が封印されていないか確認
      if (altIdx === 1 && action.card.sealedAbility2) {
        idx++; continue;
      }
      const altCost = Math.max(0, action.card.abilities[altIdx].cost - cr);
      if (c.funds >= altCost) {
        abilityIdx = altIdx;
        effectiveCost = altCost;
      } else {
        idx++; continue;
      }
    }
    c.funds -= effectiveCost;
    c.usedAbilities[action.card.instanceId] = abilityIdx + 1;
    const ability = action.card.abilities[abilityIdx];
    const effectMsgs = executeEffect(ability.effect, "cpu");
    console.log(`  CPU: ${action.card.name}「${ability.name}」（コスト${effectiveCost}億）`);
    const cpuFieldIndex = c.field.findIndex(fc => fc.instanceId === action.card.instanceId);
    playAbilityAnimation(cpuFieldIndex, abilityIdx, "cpu", () => {
      renderGame(); // カードアニメーション後に支持率・資金フラッシュを発火
      setTimeout(() => {
        showActionBanner(
          [`${action.card.name}「${ability.name}」を発動！`, ...effectMsgs],
          false,
          () => cpuExecuteNextAbility(abilityActions, idx + 1)
        );
      }, 700);
    });
    return;
  }
  cpuRunNextPhase();
}

// フェーズ3: オプションカード使用
function cpuPhaseOption() {
  const c = gameState.cpu;
  const lv = gameState.cpuLevel;

  // Lv1: 70%でスキップ / Lv2: 40%でスキップ
  if (lv === 1 && Math.random() < 0.7) { cpuRunNextPhase(); return; }
  if (lv === 2 && Math.random() < 0.4) { cpuRunNextPhase(); return; }

  if (!c.usedOptionThisTurn) {
    // Lv5: 支持率が大幅リードなら温存（オプションを使わない）
    if (lv === 5) {
      const approvalDiff = c.approval - gameState.player.approval;
      const remainingTurns = 25 - gameState.turn;
      if (approvalDiff > 25 && remainingTurns > 8) { cpuRunNextPhase(); return; }
    }

    const optionIdx = c.hand.findIndex(card => card.type === "option");
    if (optionIdx >= 0) {
      const card = c.hand.splice(optionIdx, 1)[0];
      c.discard.push(card);
      c.usedOptionThisTurn = true;

      // kioku_ni_gozaimasen: CPUは場のカード中コスト最大のものを自動選択
      if (card.effect === "kioku_ni_gozaimasen") {
        const cpuField = c.field.filter(Boolean);
        if (cpuField.length > 0) {
          const target = cpuField.reduce((best, cur) => (cur.cost || 0) > (best.cost || 0) ? cur : best, cpuField[0]);
          gameState.zeroCostCardId = target.instanceId;
        }
      }

      const effectMsgs = executeEffect(card.effect, "cpu");
      console.log(`  CPU: ${card.name}を使用`);
      playOptionCardAnimation(card, null, true, () => {
        animateCardToDiscard(card, false, () => {
          renderGame(); // カード・捨て札アニメーション後に支持率・資金フラッシュを発火
          setTimeout(() => {
            showActionBanner(
              [`${card.name} を使用！`, ...effectMsgs],
              false,
              () => {
                cpuRunNextPhase();
              }
            );
          }, 700);
        });
      });
      return;
    }
  }
  cpuRunNextPhase();
}

// 勝敗判定 → ターン終了
function cpuCheckWinAndEnd() {
  const result = checkWinCondition();
  if (result) {
    gameState.phase = "finished";
    renderGame();
    showFinishOverlay(result);
    return;
  }
  cpuEndPhase();
}

function cpuEndPhase() {
  const c = gameState.cpu;
  // 手札上限チェック（7枚超過分を自動で捨てる - オプション優先）
  while (c.hand.length > 7) {
    const optionIdx = c.hand.findIndex(card => card.type === "option");
    const discardIdx = optionIdx >= 0 ? optionIdx : c.hand.length - 1;
    const discarded = c.hand.splice(discardIdx, 1)[0];
    c.discard.push(discarded);
    console.log(`  CPU手札超過: ${discarded.name}を捨てた`);
  }

  // 防御ボーナスリセット
  c.nextTurnBonuses.defenseBonus = 0;

  endTurn();
}

function endPlayerTurn() {
  const p = gameState.player;
  setMainPhaseUI(false);

  // 防御ボーナスリセット
  p.nextTurnBonuses.defenseBonus = 0;

  // ④ エンドフェーズ: 手札上限チェック
  if (p.hand.length > 7) {
    showDiscardUI(p.hand.length - 7, () => {
      endTurn();
    });
  } else {
    endTurn();
  }
}

function endTurn() {
  // 勝敗判定
  const result = checkWinCondition();
  if (result) {
    gameState.phase = "finished";
    console.log(`[ゲーム終了] ${result}`);
    renderGame();
    showFinishOverlay(result);
    return;
  }

  if (gameState.currentPlayer === "player") {
    // プレイヤーのターン終了 → CPUのターン
    renderGame();
    startCpuTurn();
  } else {
    // CPUのターン終了 → ピップアニメーション → 情勢調査チェック → 次ターン
    animateSurveyPip(() => {
      if (gameState.turn % 5 === 0) {
        console.log(`[情勢調査] ターン${gameState.turn}: プレイヤー${gameState.player.approval}% / CPU${gameState.cpu.approval}%`);
        showSurveyOverlay(() => advanceToNextTurn());
      } else {
        advanceToNextTurn();
      }
    });
  }
}

function animateSurveyPip(onDone) {
  const pips = Array.from(document.querySelectorAll(".survey-pip"));
  const pipIdx = (gameState.turn - 1) % 5;   // 0-4: 今のターンに対応するピップ
  const pip = pips[pipIdx];
  if (!pip) { onDone(); return; }

  // 警告クラスを外してフィルアニメーション開始
  pip.classList.remove("pip-urgent");
  pip.classList.add("pip-filling");

  setTimeout(() => {
    pip.classList.remove("pip-filling");
    pip.classList.add("pip-filled");

    if (gameState.turn % 5 === 0) {
      // 情勢調査ターン: 全ピップをフラッシュしてからリセット
      pips.forEach(p => p.classList.add("pip-survey-flash"));
      setTimeout(() => {
        pips.forEach(p => p.classList.remove("pip-filled", "pip-survey-flash"));
        onDone();
      }, 700);
    } else {
      onDone();
    }
  }, 450);
}

function advanceToNextTurn() {
  // 25ターン到達チェック
  if (gameState.turn >= 25) {
    gameState.phase = "finished";
    const result25 = gameState.player.approval > gameState.cpu.approval ? "プレイヤーの勝利"
      : gameState.player.approval < gameState.cpu.approval ? "CPUの勝利"
      : "引き分け";
    console.log(`[25ターン終了] ${result25} (${gameState.player.approval}% vs ${gameState.cpu.approval}%)`);
    showFinishOverlay(result25);
    return;
  }

  gameState.turn++;
  logState();
  startPlayerTurn();
}

function checkWinCondition() {
  const pa = gameState.player.approval;
  const ca = gameState.cpu.approval;

  if (pa >= 100 && ca >= 100) return "引き分け（両者100%到達）";
  if (pa <= 0 && ca <= 0) return "引き分け（両者0%到達）";
  if (pa >= 100) return "プレイヤーの勝利（支持率100%達成）";
  if (ca >= 100) return "CPUの勝利（支持率100%達成）";
  if (pa <= 0) return "CPUの勝利（プレイヤーの支持率0%）";
  if (ca <= 0) return "プレイヤーの勝利（CPUの支持率0%）";
  return null;
}

// ============================================================
// メインフェーズのアクション
// ============================================================

// 手札→場カードフライアニメーション
// isPlayer=true → 青グロー / false → 橙グロー
function animateCardFly(srcEl, destEl, isPlayer, onDone) {
  const srcRect  = srcEl.getBoundingClientRect();
  const destRect = destEl.getBoundingClientRect();

  const clone = srcEl.cloneNode(true);
  Object.assign(clone.style, {
    position: "fixed", margin: "0", zIndex: "500",
    pointerEvents: "none", transition: "none",
    transformOrigin: "center center",
    left: srcRect.left + "px", top: srcRect.top + "px",
    width: srcRect.width + "px", height: srcRect.height + "px",
  });
  document.body.appendChild(clone);

  const glowRgb  = isPlayer ? "74,171,240" : "240,160,32";
  const glowRgba = (a) => `rgba(${glowRgb},${a.toFixed(2)})`;

  const startX = srcRect.left  + srcRect.width  / 2;
  const startY = srcRect.top   + srcRect.height / 2;
  const endX   = destRect.left + destRect.width  / 2;
  const endY   = destRect.top  + destRect.height / 2;
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  const startW = srcRect.width,  startH = srcRect.height;
  const endW   = destRect.width, endH   = destRect.height;
  const peakScale = 2.4;
  const peakW  = endW * peakScale, peakH = endH * peakScale;

  const P1 = 350, P2 = 380, P3 = 280;
  const TOTAL = P1 + P2 + P3;
  const t0 = performance.now();

  function easeOut(t) { return 1 - (1-t)*(1-t)*(1-t); }
  function easeIn(t)  { return t*t*t; }

  function spawnRing(x, y, r, g, b) {
    const ring = document.createElement("div");
    Object.assign(ring.style, {
      position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: "498",
      width: "60px", height: "60px",
      left: (x - 30) + "px", top: (y - 30) + "px",
      border: `3px solid rgba(${r},${g},${b},0.85)`,
      animation: "card-ring-expand 0.55s ease-out forwards",
    });
    document.body.appendChild(ring);
    ring.addEventListener("animationend", () => ring.remove(), { once: true });
  }

  let ringsFired = false;

  function frame(now) {
    const elapsed = now - t0;

    if (elapsed < P1) {
      // フェーズ1: ズームアップ → 画面中央へ
      const t = easeOut(elapsed / P1);
      const x = startX + (cx - startX) * t;
      const y = startY + (cy - startY) * t;
      const w = startW + (peakW - startW) * t;
      const h = startH + (peakH - startH) * t;
      const glow   = Math.round(t * 50);
      const bright = 1 + t * 1.0;
      clone.style.left      = (x - w/2) + "px";
      clone.style.top       = (y - h/2) + "px";
      clone.style.width     = w + "px";
      clone.style.height    = h + "px";
      clone.style.boxShadow = `0 0 ${glow}px ${Math.round(glow/2)}px ${glowRgba(t * 0.85)}`;
      clone.style.filter    = `brightness(${bright.toFixed(2)})`;
      requestAnimationFrame(frame);

    } else if (elapsed < P1 + P2) {
      // フェーズ2: 発光パルス（中央で3回）
      const t = (elapsed - P1) / P2;
      const pulse  = Math.sin(t * Math.PI * 3);
      const glow   = 50 + pulse * 28;
      const bright = 2.0 + pulse * 0.5;
      clone.style.left      = (cx - peakW/2) + "px";
      clone.style.top       = (cy - peakH/2) + "px";
      clone.style.width     = peakW + "px";
      clone.style.height    = peakH + "px";
      clone.style.boxShadow = `0 0 ${glow}px ${Math.round(glow/2)}px ${glowRgba(0.92)}`;
      clone.style.filter    = `brightness(${bright.toFixed(2)})`;
      // パルス頂点ごとにリングを発生
      if (!ringsFired && t > 0.1) {
        const [r,g,b] = isPlayer ? [74,171,240] : [240,160,32];
        spawnRing(cx, cy, r, g, b);
        setTimeout(() => spawnRing(cx, cy, r, g, b), 130);
        setTimeout(() => spawnRing(cx, cy, r, g, b), 260);
        ringsFired = true;
      }
      requestAnimationFrame(frame);

    } else if (elapsed < TOTAL) {
      // フェーズ3: 場スロットへ高速スラム
      const t = easeIn((elapsed - P1 - P2) / P3);
      const x = cx + (endX - cx) * t;
      const y = cy + (endY - cy) * t;
      const w = peakW + (endW - peakW) * t;
      const h = peakH + (endH - peakH) * t;
      const glow   = Math.round((1-t) * 50);
      const bright = 2.0 - t * 1.0;
      clone.style.left      = (x - w/2) + "px";
      clone.style.top       = (y - h/2) + "px";
      clone.style.width     = w + "px";
      clone.style.height    = h + "px";
      clone.style.boxShadow = `0 0 ${glow}px ${Math.round(glow/2)}px ${glowRgba((1-t) * 0.85)}`;
      clone.style.filter    = `brightness(${bright.toFixed(2)})`;
      requestAnimationFrame(frame);

    } else {
      // 着地バースト（2重リング）
      for (let i = 0; i < 2; i++) {
        const burst = document.createElement("div");
        burst.className = `card-land-burst ${isPlayer ? "burst-player" : "burst-cpu"}`;
        Object.assign(burst.style, {
          position: "fixed",
          left: (endX - 70) + "px", top: (endY - 70) + "px",
          width: "140px", height: "140px",
          pointerEvents: "none", zIndex: "499",
          animationDelay: `${i * 80}ms`,
        });
        document.body.appendChild(burst);
        burst.addEventListener("animationend", () => burst.remove(), { once: true });
      }
      clone.remove();
      onDone();
    }
  }

  requestAnimationFrame(frame);
}

// 手札から政治家カードを場に出す
function playCardToField(handIndex, targetSlot) {
  const p = gameState.player;
  const card = p.hand[handIndex];

  if (!card || card.type !== "politician") return false;
  if (p.placedThisTurn) return false;
  if (p.field.length >= 3) return false;

  p.hand.splice(handIndex, 1);
  // 指定スロットが空いていればそこへ、そうでなければ最初の空きスロットへ
  const usedSlots = p.field.map(c => c.fieldSlot);
  const freeSlots = [0, 1, 2].filter(s => !usedSlots.includes(s));
  card.fieldSlot = (targetSlot != null && freeSlots.includes(targetSlot))
    ? targetSlot
    : freeSlots[0];
  p.field.push(card);
  p.placedThisTurn = true;
  console.log(`${card.name}を場に出した`);
  renderGame();

  // 着地アニメーション
  const fieldCards = document.querySelectorAll("#player-field .card");
  const newCard = fieldCards[fieldCards.length - 1];
  if (newCard) newCard.classList.add("card-landing");

  return true;
}

// 能力発動: 確認ダイアログ → 実行 → 結果表示
function useAbility(fieldIndex, abilityIndex) {
  const p = gameState.player;
  const card = p.field[fieldIndex];

  if (!card) return;
  if (card.disabled) return;
  if (abilityIndex === 1 && card.sealedAbility2) return;
  if (p.usedAbilities[card.instanceId]) return;

  const ability = card.abilities[abilityIndex];
  const effectiveCost = p.zeroCostCardId === card.instanceId
    ? 0
    : Math.max(0, ability.cost - (p.currentTurnCostReduction || 0));
  if (p.funds < effectiveCost) return;

  // 確認ダイアログ表示
  showConfirmDialog(card.name, ability.name, ability.effectText || "", ability.description || "", effectiveCost, () => {
    p.funds -= effectiveCost;
    p.usedAbilities[card.instanceId] = abilityIndex + 1; // 1 or 2 (常にtruthyで0を避ける)
    console.log(`[能力発動] ${card.name}: ${ability.name}（コスト${effectiveCost}億）`);

    // ishiba_2 / shinba_2: プレイヤーが相手の場から封印対象を選択
    if (ability.effect === "ishiba_2" || ability.effect === "shinba_2" || ability.effect === "ogawa_1") {
      const opp = gameState.cpu;
      if (opp.field.length === 0) {
        playAbilityAnimation(fieldIndex, abilityIndex, "player", () => {
          renderGame();
          setTimeout(() => showActionBanner([`「${ability.name}」発動！`, "相手の場にカードがなく空振り…"], true, () => {
            const result = checkWinCondition();
            if (result) { gameState.phase = "finished"; showFinishOverlay(result); }
          }), 700);
        });
        return;
      }
      showFieldCardPicker(opp.field, "封印する相手カードを選択", (selected) => {
        if (!selected) return;
        selected.sealedNextTurn = true;
        const msgs = [`${selected.name}の能力を次ターン封印！`];
        playAbilityAnimation(fieldIndex, abilityIndex, "player", () => {
          renderGame();
          setTimeout(() => showActionBanner([`「${ability.name}」発動！`, ...msgs], true, () => {
            const result = checkWinCondition();
            if (result) { gameState.phase = "finished"; showFinishOverlay(result); }
          }), 700);
        });
      });
      return;
    }

    // スロット演出が必要な能力の共通ハンドラ
    const slotEffects = {
      koizumi_1: [
        { label: "+15%", value: 15, color: "#22cc77" },
        { label: "-10%", value: -10, color: "#ee4444" },
      ],
      furukawa_2: [
        { label: "+10%", value: 10, color: "#22cc77" },
        { label: "-3%",  value: -3,  color: "#ee4444" },
      ],
    };
    if (slotEffects[ability.effect]) {
      playAbilityAnimation(fieldIndex, abilityIndex, "player", () => {
        showSlotAnimation(
          slotEffects[ability.effect],
          (winner) => {
            const { self } = getSelfAndOpponent("player");
            const msgs = [];
            const m = changeApproval(self, winner.value);
            if (m) msgs.push(m);
            renderGame();
            setTimeout(() => showActionBanner([`「${ability.name}」発動！`, ...msgs], true, () => {
              const result = checkWinCondition();
              if (result) { gameState.phase = "finished"; showFinishOverlay(result); }
            }), 700);
          }
        );
      });
      return;
    }

    const msgs = executeEffect(ability.effect, "player");
    playAbilityAnimation(fieldIndex, abilityIndex, "player", () => {
      renderGame(); // カードアニメーション後に支持率・資金フラッシュを発火
      setTimeout(() => {
        showActionBanner([`「${ability.name}」発動！`, ...msgs], true, () => {
          const result = checkWinCondition();
          if (result) {
            gameState.phase = "finished";
            showFinishOverlay(result);
            return;
          }
        });
      }, 700);
    });
  });
}

// 能力発動アニメーション: 画面の約40%サイズに拡大→3秒光って静止→フェードアウト
// クリックでスキップ可。side: "player" | "cpu"
function playAbilityAnimation(fieldIndex, abilityIndex, side, callback) {
  const containerId = side === "cpu" ? "cpu-field" : "player-field";
  const container = document.getElementById(containerId);
  if (!container) { callback(); return; }

  const ps = side === "cpu" ? gameState.cpu : gameState.player;
  const card = ps.field[fieldIndex];
  if (!card) { callback(); return; }

  // 元カードを一瞬発光（スロット順でDOM検索）
  const targetSlot = card.fieldSlot ?? fieldIndex;
  const cardEl = container.children[targetSlot];
  if (cardEl && cardEl.classList.contains("card")) {
    cardEl.classList.add("card-ability-glow");
    cardEl.addEventListener("animationend", () => cardEl.classList.remove("card-ability-glow"), { once: true });
  }

  // 暗幕（クリックでスキップ）
  const backdrop = document.createElement("div");
  Object.assign(backdrop.style, {
    position: "fixed", inset: "0",
    background: "rgba(0,0,0,0)", zIndex: "999",
    cursor: "pointer", transition: "background 0.3s",
  });
  document.body.appendChild(backdrop);

  // showCardZoom と同形式のカード表示
  const zoomWrap = document.createElement("div");
  Object.assign(zoomWrap.style, {
    position: "fixed", zIndex: "1000", pointerEvents: "none",
    opacity: "0", transition: "opacity 0.28s ease-out",
    left: "50%", top: "50%",
    transform: "translate(-50%, -50%) scale(0.85)",
  });

  const imageDiv = document.createElement("div");
  imageDiv.className = "card-zoom-image";
  const _zoomSrc1 = cardImageCache.get(card.id) ?? card.image;
  if (_zoomSrc1) imageDiv.style.backgroundImage = `url(${_zoomSrc1})`;

  // 発動能力をY座標で黄色くハイライト（Canvasが能力テキストを表示済み）
  const abilities = card.abilities;
  const rowCount = abilities.length;
  const rowH = (40 / rowCount); // % per row within bottom 40%
  const highlightTop = 60 + abilityIndex * rowH;
  const highlight = document.createElement("div");
  Object.assign(highlight.style, {
    position: "absolute",
    top: `${highlightTop}%`,
    left: "0",
    right: "0",
    height: `${rowH}%`,
    background: "rgba(255,220,50,0.35)",
    boxShadow: "0 0 18px 6px rgba(255,220,50,0.7)",
    borderRadius: "4px",
    pointerEvents: "none",
  });
  imageDiv.appendChild(highlight);
  zoomWrap.appendChild(imageDiv);
  document.body.appendChild(zoomWrap);

  const timers = [];
  let finished = false;

  function finish() {
    if (finished) return;
    finished = true;
    timers.forEach(t => clearTimeout(t));
    zoomWrap.style.opacity = "0";
    backdrop.style.transition = "background 0.15s";
    backdrop.style.background = "rgba(0,0,0,0)";
    setTimeout(() => { zoomWrap.remove(); backdrop.remove(); callback(); }, 200);
  }

  backdrop.addEventListener("click", finish);

  // Step 1: フェードイン＋スケールアップ
  requestAnimationFrame(() => requestAnimationFrame(() => {
    backdrop.style.background = "rgba(0,0,0,0.65)";
    zoomWrap.style.opacity = "1";
    zoomWrap.style.transform = "translate(-50%, -50%) scale(1)";
    zoomWrap.style.transition = "opacity 0.28s ease-out, transform 0.32s cubic-bezier(0.34,1.56,0.64,1)";
  }));

  // Step 2: フェードアウト (2400ms後)
  timers.push(setTimeout(() => {
    if (finished) return;
    zoomWrap.style.transition = "opacity 0.25s ease-in";
    zoomWrap.style.opacity = "0";
    backdrop.style.transition = "background 0.25s";
    backdrop.style.background = "rgba(0,0,0,0)";
  }, 2400));

  // Step 3: 完了 (2650ms)
  timers.push(setTimeout(() => {
    if (finished) return;
    zoomWrap.remove(); backdrop.remove(); callback(); finished = true;
  }, 2650));
}

// オプションカードアニメーション: 拡大→3秒光って静止→フェードアウト
// クリックでスキップ可
function playOptionCardAnimation(card, fromRect, isCpu, callback) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const cardW = 100, cardH = 140;
  const rect = fromRect ?? {
    left: vw / 2 - cardW / 2,
    top: isCpu ? 60 : vh - cardH - 60,
    width: cardW,
    height: cardH,
  };

  const targetWidth = Math.min(vw * 0.42, 420);
  const scale = targetWidth / rect.width;
  const tx = vw / 2 - (rect.left + rect.width / 2);
  const ty = vh / 2 - (rect.top + rect.height / 2);

  // 暗幕（クリックでスキップ）
  const backdrop = document.createElement("div");
  Object.assign(backdrop.style, {
    position: "fixed", inset: "0",
    background: "rgba(0,0,0,0)", zIndex: "999",
    cursor: "pointer", transition: "background 0.3s",
  });
  document.body.appendChild(backdrop);

  // カード要素を新規作成
  let clone;
  let cloneInitLeft, cloneInitTop, animTransform;
  if (card.type === "option") {
    // showCardZoom と同じ card-zoom-image 構造・固定サイズ（スケールなし、平行移動のみ）
    const zoomW = 250, zoomH = 350;
    clone = document.createElement("div");
    clone.className = "card-zoom-image";
    clone.style.backgroundImage = `url(${cardImageCache.get(card.id) ?? card.image})`;
    // 初期位置：元カードの中心に合わせる
    cloneInitLeft = rect.left + rect.width / 2 - zoomW / 2;
    cloneInitTop  = rect.top  + rect.height / 2 - zoomH / 2;
    // 画面中央への移動量
    const dtx = vw / 2 - (cloneInitLeft + zoomW / 2);
    const dty = vh / 2 - (cloneInitTop  + zoomH / 2);
    animTransform = `translate(${dtx}px, ${dty}px)`;
    Object.assign(clone.style, {
      position: "fixed",
      left: cloneInitLeft + "px", top: cloneInitTop + "px",
      width: zoomW + "px", height: zoomH + "px",
      margin: "0", zIndex: "1000", pointerEvents: "none",
      transformOrigin: "center center", transition: "none",
    });
  } else {
    clone = createCardElement(card);
    animTransform = `translate(${tx}px,${ty}px) scale(${scale})`;
    Object.assign(clone.style, {
      position: "fixed",
      left: rect.left + "px", top: rect.top + "px",
      width: rect.width + "px", height: rect.height + "px",
      margin: "0", zIndex: "1000", pointerEvents: "none",
      transformOrigin: "center center", transition: "none",
    });
  }

  document.body.appendChild(clone);

  const timers = [];
  let finished = false;

  function finish() {
    if (finished) return;
    finished = true;
    timers.forEach(t => clearTimeout(t));
    clone.style.transition = "opacity 0.15s ease-in";
    clone.style.opacity = "0";
    backdrop.style.transition = "background 0.15s";
    backdrop.style.background = "rgba(0,0,0,0)";
    setTimeout(() => { clone.remove(); backdrop.remove(); callback(); }, 150);
  }

  backdrop.addEventListener("click", finish);

  // Step 1: 画面中央へ拡大 (0 → 320ms)
  requestAnimationFrame(() => requestAnimationFrame(() => {
    backdrop.style.background = "rgba(0,0,0,0.55)";
    clone.style.transition = "transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.32s";
    clone.style.transform = animTransform;
    clone.style.boxShadow = "0 0 60px 16px rgba(255,220,50,0.35)";
  }));

  // Step 2: カードグロー（拡大完了後、3秒静止）
  timers.push(setTimeout(() => {
    if (finished) return;
    clone.style.boxShadow = "0 0 80px 24px rgba(255,220,50,0.6)";
  }, 350));

  // Step 3: フェードアウト (350 + 2000 = 2350ms)
  timers.push(setTimeout(() => {
    if (finished) return;
    clone.style.transition = "opacity 0.25s ease-in, box-shadow 0.25s";
    clone.style.opacity = "0";
    clone.style.boxShadow = "none";
    backdrop.style.transition = "background 0.25s";
    backdrop.style.background = "rgba(0,0,0,0)";
  }, 2350));

  // Step 4: 完了 (2600ms)
  timers.push(setTimeout(() => {
    if (finished) return;
    clone.remove(); backdrop.remove(); callback(); finished = true;
  }, 2600));
}

// オプションカード使用: 確認ダイアログ → 実行 → 結果表示
function useOptionCard(handIndex) {
  const p = gameState.player;
  const card = p.hand[handIndex];

  if (!card || card.type !== "option") return;
  if (p.usedOptionThisTurn) return;

  // 確認ダイアログ後はカード要素がDOMから消えるため、先に位置を取得
  const handContainer = document.getElementById("player-hand");
  const handCardEls = handContainer ? handContainer.querySelectorAll(".card") : [];
  const cardRect = handCardEls[handIndex]?.getBoundingClientRect() ?? null;

  const effectText = card.effectDescription || "";
  const desc = card.description || "";
  showConfirmDialog(card.name, card.name, effectText, desc, 0, () => {
    p.hand.splice(handIndex, 1);
    p.discard.push(card);
    p.usedOptionThisTurn = true;
    console.log(`[オプション使用] ${card.name}`);

    if (card.effect === "kioku_ni_gozaimasen") {
      showFieldCardPicker(p.field, (selected) => {
        if (selected) {
          p.zeroCostCardId = selected.instanceId;
          console.log(`[記憶にございません] ${selected.name}のコストを今ターン0に`);
        }
        const msgs = selected ? [`${selected.name}の能力コストが今ターン0になった！`] : [];
        playOptionCardAnimation(card, cardRect, false, () => {
          animateCardToDiscard(card, true, () => {
            renderGame();
            setTimeout(() => {
              const bannerMsgs = [`「${card.name}」使用！`, ...msgs];
              showActionBanner(bannerMsgs, true, () => {
                const result = checkWinCondition();
                if (result) { gameState.phase = "finished"; showFinishOverlay(result); }
              });
            }, 700);
          });
        });
      });
      return;
    }

    if (card.effect === "toushu_touron") {
      const outcomes = Array.from({ length: 10 }, (_, i) => ({
        label: `+${i + 1}%`,
        value: i + 1,
        color: `hsl(${130 - i * 8}, 70%, 50%)`,
      }));
      playOptionCardAnimation(card, cardRect, false, () => {
        animateCardToDiscard(card, true, () => {
          renderGame();
          showSlotAnimation(outcomes, (winner) => {
            const { self } = getSelfAndOpponent("player");
            const msgs = [];
            const m = changeApproval(self, winner.value);
            if (m) msgs.push(m);
            renderGame();
            setTimeout(() => showActionBanner([`「${card.name}」使用！`, ...msgs], true, () => {
              const result = checkWinCondition();
              if (result) { gameState.phase = "finished"; showFinishOverlay(result); }
            }), 700);
          }, { title: "党首討論！" });
        });
      });
      return;
    }

    if (card.effect === "tounai_kaikaku") {
      const politicianInHand = p.hand.find(c => c.type === "politician");
      if (p.field.length === 0 || !politicianInHand) {
        const msgs = [p.field.length === 0 ? "場にカードがなく空振り…" : "手札に政治家カードがなく空振り…"];
        playOptionCardAnimation(card, cardRect, false, () => {
          animateCardToDiscard(card, true, () => {
            renderGame();
            setTimeout(() => showActionBanner([`「${card.name}」使用！`, ...msgs], true, () => {
              const result = checkWinCondition();
              if (result) { gameState.phase = "finished"; showFinishOverlay(result); }
            }), 700);
          });
        });
        return;
      }
      showFieldCardPicker(p.field, "交代させる政治家カードを選択", (selected) => {
        if (!selected) return;
        const removeIdx = p.field.findIndex(c => c === selected);
        const removed = p.field.splice(removeIdx, 1)[0];
        p.discard.push(removed);
        const addIdx = p.hand.findIndex(c => c.type === "politician");
        const added = p.hand.splice(addIdx, 1)[0];
        added.fieldSlot = removed.fieldSlot ?? removeIdx;
        p.field.push(added);
        const msgs = [`${removed.name}を捨て、${added.name}を場に出した！`];
        playOptionCardAnimation(card, cardRect, false, () => {
          animateCardToDiscard(card, true, () => {
            renderGame();
            setTimeout(() => showActionBanner([`「${card.name}」使用！`, ...msgs], true, () => {
              const result = checkWinCondition();
              if (result) { gameState.phase = "finished"; showFinishOverlay(result); }
            }), 700);
          });
        });
      });
      return;
    }

    const msgs = executeEffect(card.effect, "player");
    playOptionCardAnimation(card, cardRect, false, () => {
      animateCardToDiscard(card, true, () => {
        renderGame(); // カード・捨て札アニメーション後に支持率・資金フラッシュを発火
        setTimeout(() => {
          const bannerMsgs = msgs.length > 0 ? [`「${card.name}」使用！`, ...msgs] : [`「${card.name}」使用！`];
          showActionBanner(bannerMsgs, true, () => {
            if (card.effect === "kinkyuu_yoron") {
              showSurveyOverlay(() => {
                const result = checkWinCondition();
                if (result) { gameState.phase = "finished"; showFinishOverlay(result); }
              }, { kinkyuu: true });
              return;
            }
            const result = checkWinCondition();
            if (result) {
              gameState.phase = "finished";
              showFinishOverlay(result);
              return;
            }
          });
        }, 700);
      });
    });
  });
}

// 場の政治家カードを選択させるUI
function showFieldCardPicker(fieldCards, titleTextOrCallback, callback) {
  // 後方互換: 引数2つの場合はtitleText省略
  let titleText, cb;
  if (typeof titleTextOrCallback === "function") {
    titleText = "コストを0にする政治家カードを選択";
    cb = titleTextOrCallback;
  } else {
    titleText = titleTextOrCallback;
    cb = callback;
  }
  // 以下の callback を cb に置き換え
  return _showFieldCardPickerImpl(fieldCards, titleText, cb);
}

function _showFieldCardPickerImpl(fieldCards, titleText, callback) {
  const wrap = document.createElement("div");
  Object.assign(wrap.style, {
    position: "fixed", inset: "0", background: "rgba(0,0,0,0.72)",
    zIndex: "3000", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "16px",
  });

  const title = document.createElement("div");
  Object.assign(title.style, { color: "#fff", fontSize: "1rem", fontWeight: "bold", marginBottom: "4px" });
  title.textContent = titleText;
  wrap.appendChild(title);

  if (fieldCards.length === 0) {
    document.body.appendChild(wrap);
    const msg = document.createElement("div");
    msg.style.color = "#aaa";
    msg.textContent = "場に政治家カードがありません";
    wrap.appendChild(msg);
    setTimeout(() => { wrap.remove(); callback(null); }, 1200);
    return;
  }

  const list = document.createElement("div");
  Object.assign(list.style, { display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" });

  fieldCards.forEach((fc) => {
    const btn = document.createElement("div");
    Object.assign(btn.style, {
      background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.4)",
      borderRadius: "8px", padding: "10px 16px", color: "#fff",
      cursor: "pointer", textAlign: "center", minWidth: "80px",
    });
    if (fc.image) {
      const img = document.createElement("div");
      Object.assign(img.style, {
        width: "60px", height: "80px", backgroundImage: `url(${fc.image})`,
        backgroundSize: "cover", backgroundPosition: "center",
        borderRadius: "4px", marginBottom: "6px",
      });
      btn.appendChild(img);
    }
    const name = document.createElement("div");
    name.style.fontSize = "0.75rem";
    name.textContent = fc.name;
    btn.appendChild(name);

    btn.addEventListener("click", () => { wrap.remove(); callback(fc); });
    btn.addEventListener("pointerover", () => { btn.style.borderColor = "rgba(255,220,50,0.9)"; });
    btn.addEventListener("pointerout", () => { btn.style.borderColor = "rgba(255,255,255,0.4)"; });
    list.appendChild(btn);
  });

  wrap.appendChild(list);
  document.body.appendChild(wrap);
}

// 汎用スロット演出
// outcomes: [{ label: string, color?: string, value?: any }, ...]  ← 何個でも可
// options:  { title?: string }  ← 省略可
// onDone(winner) で選ばれた要素を返す
function showSlotAnimation(outcomes, onDone, options = {}) {
  if (!outcomes || outcomes.length === 0) return;

  const titleText = options.title ?? "運命の賭け！";
  const defaultColors = ["#22cc77","#ee4444","#4488ff","#ffaa22","#cc44cc","#22cccc"];
  // color 未指定の場合はデフォルトパレットを順に割り当て
  const items = outcomes.map((o, i) => ({
    ...o,
    color: o.color ?? defaultColors[i % defaultColors.length],
  }));

  const n = items.length;
  const winnerIdx = Math.floor(Math.random() * n);

  // スピンシーケンス: 高速で全アイテムを巡回し、減速して winner に着地（合計約3秒）
  const totalFrames = Math.max(15, n * 3);
  const seq = [];
  for (let i = 0; i < totalFrames; i++) seq.push(i % n);
  // 末尾を winner に合わせる
  while (seq[seq.length - 1] !== winnerIdx) seq.push((seq[seq.length - 1] + 1) % n);

  // 各フレームの表示時間: 指数的に増加（高速→低速）
  const delays = seq.map((_, i) => {
    const t = i / (seq.length - 1);
    return Math.round(40 + t * t * 200);
  });

  // オーバーレイ
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed", inset: "0",
    background: "rgba(0,0,0,0.85)",
    zIndex: "4000",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "20px",
  });

  const titleEl = document.createElement("div");
  titleEl.textContent = titleText;
  Object.assign(titleEl.style, {
    color: "#fff", fontSize: "1.1rem", fontWeight: "bold",
    letterSpacing: "0.12em", opacity: "0.85",
  });
  overlay.appendChild(titleEl);

  // スロット枠
  const slotWrap = document.createElement("div");
  Object.assign(slotWrap.style, {
    background: "#111", border: "4px solid #555",
    borderRadius: "14px", padding: "18px 52px",
    minWidth: "180px", textAlign: "center",
    boxShadow: "inset 0 0 20px rgba(0,0,0,0.6)",
  });
  const slotVal = document.createElement("div");
  Object.assign(slotVal.style, {
    fontSize: "3.2rem", fontWeight: "bold",
    fontFamily: "monospace", transition: "color 0.06s",
  });
  slotWrap.appendChild(slotVal);
  overlay.appendChild(slotWrap);

  document.body.appendChild(overlay);

  // アニメーション実行
  let step = 0;
  let currentTimer = null;
  let finished = false;

  function finish() {
    if (finished) return;
    finished = true;
    if (currentTimer) clearTimeout(currentTimer);
    const winner = items[winnerIdx];
    slotVal.textContent = winner.label;
    slotVal.style.color = winner.color;
    slotWrap.style.border = `4px solid ${winner.color}`;
    slotWrap.style.boxShadow = `0 0 40px ${winner.color}88, inset 0 0 20px rgba(0,0,0,0.6)`;
    currentTimer = setTimeout(() => {
      overlay.remove();
      onDone(winner);
    }, 800);
  }

  // タップでスキップ
  overlay.addEventListener("click", finish, { once: true });

  function tick() {
    const cur = items[seq[step]];
    slotVal.textContent = cur.label;
    slotVal.style.color = cur.color;
    step++;
    if (step < seq.length) {
      currentTimer = setTimeout(tick, delays[step - 1]);
    } else {
      finish();
    }
  }
  tick();
}

// ============================================================
// オーバーレイUI
// ============================================================

function showOverlay(html) {
  const overlay = document.getElementById("overlay");
  const content = document.getElementById("overlay-content");
  content.innerHTML = html;
  overlay.classList.remove("hidden");
}

function hideOverlay() {
  document.getElementById("overlay").classList.add("hidden");
}

// 確認ダイアログ
function showConfirmDialog(_cardName, abilityName, effectText, description, cost, onConfirm) {
  const costHtml = cost > 0 ? `コスト: ${fundsToHtml(cost)}` : "コスト: 無料";
  const effectHtml = effectText ? `<p class="overlay-effect">${effectText}</p>` : "";
  const descHtml = description ? `<p class="overlay-desc">${description.replace(/\n/g, '<br>')}</p>` : "";
  showOverlay(`
    <h2>「${abilityName}」を使用しますか？</h2>
    ${effectHtml}
    ${descHtml}
    <p class="overlay-cost">${costHtml}</p>
    <div class="overlay-buttons">
      <button id="confirm-yes" class="overlay-btn btn-confirm">使用する</button>
      <button id="confirm-no" class="overlay-btn btn-cancel">やめる</button>
    </div>
  `);
  document.getElementById("confirm-yes").addEventListener("click", () => {
    hideOverlay();
    onConfirm();
  });
  document.getElementById("confirm-no").addEventListener("click", () => {
    hideOverlay();
  });
}

// 効果結果表示
function showResultOverlay(title, messages, onClose) {
  const msgHtml = messages.map(m => `<p class="result-msg">${m}</p>`).join("");
  showOverlay(`
    <h2>${title}</h2>
    ${msgHtml}
    <div class="overlay-buttons">
      <button id="result-ok" class="overlay-btn btn-confirm">OK</button>
    </div>
  `);
  document.getElementById("result-ok").addEventListener("click", () => {
    hideOverlay();
    onClose();
  });
}

// 情勢調査オーバーレイ（opts.kinkyuu=true で緊急世論調査モード）
function showSurveyOverlay(onClose, opts) {
  opts = opts || {};
  playSE("assets/audio/se/survey_drum.mp3");
  const pa = gameState.player.approval;
  const ca = gameState.cpu.approval;

  let surveyTitle, surveySubtitle, prevEntry;
  if (opts.kinkyuu) {
    surveyTitle = "緊急世論調査";
    surveySubtitle = `ターン ${gameState.turn} 現在`;
    const hist = gameState.approvalHistory;
    prevEntry = hist.length > 0 ? hist[hist.length - 1] : null;
  } else {
    const surveyNum = gameState.turn / 5;
    surveyTitle = `第 ${surveyNum} 回&nbsp;情勢調査`;
    surveySubtitle = `ターン ${gameState.turn} 終了時点`;
    // 前回調査との差（5ターン前の履歴を参照）
    const hist = gameState.approvalHistory;
    prevEntry = surveyNum > 1 ? hist.find(h => h.turn === gameState.turn - 4) : null;
  }

  const paDelta = prevEntry != null ? pa - prevEntry.player : null;
  const caDelta = prevEntry != null ? ca - prevEntry.cpu    : null;

  const deltaHtml = (d) => {
    if (d === null) return "";
    if (d > 0) return `<div class="surv-delta surv-delta-up">▲ +${d}%</div>`;
    if (d < 0) return `<div class="surv-delta surv-delta-down">▼ ${d}%</div>`;
    return `<div class="surv-delta surv-delta-same">→ 変化なし</div>`;
  };

  const diff = pa - ca;
  const summaryHtml = diff > 0
    ? `<div class="surv-summary surv-lead">あなたが <strong>${diff}%</strong> リード</div>`
    : diff < 0
    ? `<div class="surv-summary surv-behind">CPU が <strong>${Math.abs(diff)}%</strong> リード</div>`
    : `<div class="surv-summary surv-even">同率</div>`;

  const playerParty = gameState.player.party || "あなた";

  showOverlay(`
    <div class="surv-header">
      <div class="surv-num">${surveyTitle}</div>
      <div class="surv-subtitle">${surveySubtitle}</div>
    </div>
    <div class="surv-block ${diff > 0 ? "surv-block-leading" : ""}">
      <div class="surv-block-label">${playerParty}</div>
      <div class="surv-block-row">
        <div class="surv-bar-wrap"><div class="surv-bar surv-bar-player" id="surv-bar-p"></div></div>
        <div class="surv-pct surv-pct-player" id="surv-pct-p">0%</div>
      </div>
      ${deltaHtml(paDelta)}
    </div>
    <div class="surv-block ${diff < 0 ? "surv-block-leading" : ""}">
      <div class="surv-block-label">CPU</div>
      <div class="surv-block-row">
        <div class="surv-bar-wrap"><div class="surv-bar surv-bar-cpu" id="surv-bar-c"></div></div>
        <div class="surv-pct surv-pct-cpu" id="surv-pct-c">0%</div>
      </div>
      ${deltaHtml(caDelta)}
    </div>
    ${summaryHtml}
    <div class="overlay-buttons">
      <button id="survey-ok" class="overlay-btn btn-confirm">続ける</button>
    </div>
  `);

  const content = document.getElementById("overlay-content");
  content.classList.remove("survey-overlay-enter");
  void content.offsetWidth;
  content.classList.add("survey-overlay-enter");

  // バーとカウントアップを順番に発火
  function animateStat(pctId, barId, target, delay) {
    setTimeout(() => {
      const barEl = document.getElementById(barId);
      const pctEl = document.getElementById(pctId);
      if (!barEl || !pctEl) return;
      barEl.style.transition = "width 0.9s cubic-bezier(0.22,1,0.36,1)";
      barEl.style.width = target + "%";
      const t0 = performance.now();
      (function frame(now) {
        const t = Math.min((now - t0) / 900, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        pctEl.textContent = Math.round(ease * target) + "%";
        if (t < 1) requestAnimationFrame(frame);
      })(t0);
    }, delay);
  }

  animateStat("surv-pct-p", "surv-bar-p", pa, 320);
  animateStat("surv-pct-c", "surv-bar-c", ca, 1050);

  document.getElementById("survey-ok").addEventListener("click", () => {
    hideOverlay();
    if (onClose) onClose();
  });
}

// 終了画面オーバーレイ
function showFinishOverlay(result) {
  if (result.startsWith("プレイヤーの勝利")) {
    playSE("assets/audio/se/victory.mp3");
  } else if (result.startsWith("CPUの勝利")) {
    playSE("assets/audio/se/defeat.mp3");
  }
  const pa = gameState.player.approval;
  const ca = gameState.cpu.approval;
  let title, subtitle;

  const titleMap = {
    "プレイヤーの勝利（支持率100%達成）": "総理大臣就任！",
    "プレイヤーの勝利（CPUの支持率0%）": "相手の政党が解散！",
    "プレイヤーの勝利":                   `支持率であなたの勝利！`,
    "CPUの勝利（支持率100%達成）":        "相手が総理大臣に就任…",
    "CPUの勝利（プレイヤーの支持率0%）":  "政党解散…",
    "CPUの勝利":                          `支持率でCPUの勝利…`,
  };
  title    = titleMap[result] ?? "引き分け";
  subtitle = result.startsWith("引き分け") ? "両者互角の戦いでした"
           : result.includes("（")         ? result
           : "25ターン終了";

  // 最終支持率を履歴に反映（最後のエントリを最新値で上書き or 追記）
  const hist = gameState.approvalHistory;
  if (hist.length > 0) {
    hist[hist.length - 1] = { turn: gameState.turn, player: pa, cpu: ca };
  } else {
    hist.push({ turn: gameState.turn, player: pa, cpu: ca });
  }

  // 全画面フラッシュ（勝利:金、敗北:赤、引き分け:灰）
  const isWin  = result.startsWith("プレイヤーの勝利");
  const isDraw = result.startsWith("引き分け");
  const flashColor = isWin ? "rgba(255,215,0,0.28)" : isDraw ? "rgba(180,180,180,0.22)" : "rgba(233,69,96,0.28)";
  const flash = document.createElement("div");
  flash.style.cssText = `position:fixed;inset:0;background:${flashColor};z-index:999;pointer-events:none;animation:finish-flash 0.75s ease-out forwards;`;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 800);

  showOverlay(`
    <h2>${title}</h2>
    <p>${subtitle}</p>
    <p>あなた: ${pa}% / CPU: ${ca}%</p>
    <div class="overlay-buttons">
      <button id="finish-graph" class="overlay-btn btn-secondary">📈 支持率の推移を見る</button>
      <button id="finish-retry" class="overlay-btn btn-confirm">もう一度遊ぶ</button>
    </div>
  `);
  // オーバーレイコンテンツ登場アニメーション
  const content = document.getElementById("overlay-content");
  content.classList.remove("finish-overlay-enter");
  void content.offsetWidth;
  content.classList.add("finish-overlay-enter");

  document.getElementById("finish-graph").addEventListener("click", showApprovalHistoryOverlay);
  document.getElementById("finish-retry").addEventListener("click", () => {
    hideOverlay();
    gameState.phase = "party_select";
    gameState.player = createPlayerState();
    gameState.cpu = createPlayerState();
    renderGame();
  });
}

function buildApprovalSVG() {
  const hist = gameState.approvalHistory;
  if (hist.length === 0) return "<p style='color:#666;text-align:center'>データなし</p>";

  const W = 460, H = 210;
  const pl = 38, pr = 14, pt = 16, pb = 28;
  const cw = W - pl - pr;
  const ch = H - pt - pb;

  const minT = hist[0].turn;
  const maxT = hist[hist.length - 1].turn;
  const tRange = Math.max(maxT - minT, 1);

  function px(t) { return pl + (t - minT) / tRange * cw; }
  function py(a) { return pt + (1 - a / 100) * ch; }

  let svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">`;
  svg += `<rect width="${W}" height="${H}" fill="#080818" rx="6"/>`;

  // グリッドライン
  [0, 25, 50, 75, 100].forEach(a => {
    const y = py(a);
    const dash = a === 50 ? "4,3" : "";
    svg += `<line x1="${pl}" y1="${y}" x2="${pl + cw}" y2="${y}" stroke="rgba(255,255,255,${a === 50 ? 0.35 : 0.15})" stroke-width="1"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
    svg += `<text x="${pl - 4}" y="${y + 4}" text-anchor="end" font-size="9" fill="#bbb">${a}%</text>`;
  });

  // X軸ラベル（最大7本）
  const step = Math.max(1, Math.ceil(hist.length / 7));
  hist.forEach((d, i) => {
    if (i % step === 0 || i === hist.length - 1) {
      svg += `<text x="${px(d.turn)}" y="${H - 6}" text-anchor="middle" font-size="9" fill="#bbb">${d.turn}T</text>`;
    }
  });

  // 折れ線
  function makeLine(key, color) {
    if (hist.length === 1) {
      const d = hist[0];
      return `<circle cx="${px(d.turn)}" cy="${py(d[key])}" r="4" fill="${color}"/>`;
    }
    const pts = hist.map(d => `${px(d.turn).toFixed(1)},${py(d[key]).toFixed(1)}`).join(" ");
    return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/>`;
  }

  svg += makeLine("cpu", "#f0a020");
  svg += makeLine("player", "#4aabf0");

  // ドット
  hist.forEach(d => {
    svg += `<circle cx="${px(d.turn).toFixed(1)}" cy="${py(d.cpu).toFixed(1)}" r="2.8" fill="#f0a020"/>`;
    svg += `<circle cx="${px(d.turn).toFixed(1)}" cy="${py(d.player).toFixed(1)}" r="2.8" fill="#4aabf0"/>`;
  });

  // 凡例
  const lx = W - 112, ly = 8;
  svg += `<rect x="${lx}" y="${ly}" width="106" height="32" fill="rgba(0,0,0,0.4)" rx="4"/>`;
  svg += `<line x1="${lx + 6}" y1="${ly + 9}" x2="${lx + 20}" y2="${ly + 9}" stroke="#4aabf0" stroke-width="2"/>`;
  svg += `<circle cx="${lx + 13}" cy="${ly + 9}" r="2.5" fill="#4aabf0"/>`;
  svg += `<text x="${lx + 24}" y="${ly + 13}" font-size="10" fill="#4aabf0">あなた</text>`;
  svg += `<line x1="${lx + 6}" y1="${ly + 23}" x2="${lx + 20}" y2="${ly + 23}" stroke="#f0a020" stroke-width="2"/>`;
  svg += `<circle cx="${lx + 13}" cy="${ly + 23}" r="2.5" fill="#f0a020"/>`;
  svg += `<text x="${lx + 24}" y="${ly + 27}" font-size="10" fill="#f0a020">CPU</text>`;

  svg += `</svg>`;
  return svg;
}

function showApprovalHistoryOverlay() {
  const existing = document.getElementById("approval-graph-overlay");
  if (existing) { existing.remove(); return; }

  const overlay = document.createElement("div");
  overlay.id = "approval-graph-overlay";
  overlay.className = "approval-graph-overlay";

  const box = document.createElement("div");
  box.className = "approval-graph-box";

  box.innerHTML = `
    <h3 class="approval-graph-title">支持率の推移</h3>
    <div class="approval-graph-svg">${buildApprovalSVG()}</div>
    <div class="approval-graph-footer">
      <span class="approval-graph-hint">あなた <span style="color:#4aabf0">━</span> &nbsp; CPU <span style="color:#f0a020">━</span></span>
      <button class="card-zoom-close" id="approval-graph-close">閉じる</button>
    </div>
  `;

  overlay.appendChild(box);
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  document.getElementById("approval-graph-close").addEventListener("click", () => overlay.remove());
}

// カード拡大表示
function showCardZoom(card, context, index) {
  const existing = document.querySelector(".card-zoom-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "card-zoom-overlay";

  const container = document.createElement("div");
  container.className = "card-zoom-container";

  // カード画像
  const imageDiv = document.createElement("div");
  imageDiv.className = "card-zoom-image";
  const _zoomSrc2 = cardImageCache.get(card.id) ?? card.image;
  const img = new Image();
  img.src = _zoomSrc2;
  img.onload = () => {
    imageDiv.style.backgroundImage = `url(${_zoomSrc2})`;
  };
  img.onerror = () => {
    imageDiv.classList.add("no-image");
    imageDiv.textContent = card.name;
  };

  // 政治家カード: Canvas白枠下40%をY座標検出でタップ判定（HTML要素は不要）
  let infoPanel = null;
  if (card.type === "politician" && card.abilities) {
    const isFieldPlayer = context === "field";
    const isCpuView = context === "view";
    const p = gameState.player;
    const costReduction = isFieldPlayer ? (p.currentTurnCostReduction || 0) : 0;
    const abilities = card.abilities;

    // 相手カード閲覧時: 能力詳細パネルを用意
    if (isCpuView) {
      infoPanel = document.createElement("div");
      infoPanel.className = "card-zoom-info";
      infoPanel.innerHTML = `<div class="card-zoom-hint">能力エリアをタップで詳細表示</div>`;
    }

    // imageDiv クリックで能力判定（Canvas白枠の下40%が能力エリア）
    if (isFieldPlayer || isCpuView) {
      imageDiv.style.cursor = "pointer";
      imageDiv.addEventListener("click", (e) => {
        const rect = imageDiv.getBoundingClientRect();
        const relY = (e.clientY - rect.top) / rect.height;

        // 上60%はイラストエリア → 何もしない
        if (relY < 0.60) return;

        if (isFieldPlayer && card.disabled) return;

        const usedVal = isFieldPlayer ? (p.usedAbilities[card.instanceId] || 0) : 0;
        const usedIdx = usedVal ? usedVal - 1 : -1;

        if (isFieldPlayer && usedIdx >= 0) return; // 使用済み

        // 能力インデックス計算
        const panelRelY = (relY - 0.60) / 0.40;
        let abilityIdx = Math.floor(panelRelY * abilities.length);
        abilityIdx = Math.max(0, Math.min(abilityIdx, abilities.length - 1));
        const ability = abilities[abilityIdx];

        if (isFieldPlayer) {
          const isSealed = abilityIdx === 1 && card.sealedAbility2;
          if (isSealed) return;

          const effectiveCost = (p.zeroCostCardId === card.instanceId)
            ? 0
            : Math.max(0, ability.cost - costReduction);
          if (p.funds < effectiveCost) return;

          overlay.remove();
          useAbility(index, abilityIdx);
        } else if (isCpuView && infoPanel) {
          infoPanel.innerHTML = [
            `<div class="card-zoom-name">${ability.name}</div>`,
            ability.effectText   ? `<div class="card-zoom-effect">${ability.effectText}</div>`   : "",
            ability.description  ? `<div class="card-zoom-desc">${ability.description}</div>`    : "",
          ].join("");
        }
      });
    }
  }

  // オプションカード: CanvasがdescriptionとeffectDescriptionを表示するため不要

  container.appendChild(imageDiv);
  if (infoPanel) container.appendChild(infoPanel);

  // アクションボタン（画像の下に配置）
  const actions = document.createElement("div");
  actions.className = "card-zoom-actions";

  if (context === "hand-politician") {
    // 手札の政治家カード → 場に出すボタン
    const p = gameState.player;
    const btn = document.createElement("button");
    btn.className = "zoom-action-btn";
    btn.textContent = "場に出す";
    if (p.placedThisTurn || p.field.length >= 3) {
      btn.disabled = true;
    }
    btn.addEventListener("click", () => {
      playSE("assets/audio/se/card_play.mp3");
      const srcEl = document.querySelectorAll("#player-hand .card")[index];
      const destEl = document.querySelector("#player-field .field-empty-slot");
      overlay.remove();
      if (srcEl && destEl) {
        animateCardFly(srcEl, destEl, true, () => playCardToField(index));
      } else {
        playCardToField(index);
      }
    });
    actions.appendChild(btn);
  } else if (context === "hand-option") {
    // 手札のオプションカード → 使用ボタン
    const p = gameState.player;
    if (p.optionBlockReason === "takayama") {
      const msg = document.createElement("div");
      msg.textContent = "S・タカヤマの能力により使用不可";
      Object.assign(msg.style, {
        fontSize: "0.78rem", color: "#c00", fontWeight: "bold",
        textAlign: "center", padding: "6px 0",
      });
      actions.appendChild(msg);
    }
    const btn = document.createElement("button");
    btn.className = "zoom-action-btn";
    btn.textContent = "使用する";
    if (p.usedOptionThisTurn) {
      btn.disabled = true;
    }
    btn.addEventListener("click", () => {
      overlay.remove();
      useOptionCard(index);
    });
    actions.appendChild(btn);
  }

  if (actions.children.length > 0) {
    container.appendChild(actions);
  }

  // 閉じるボタン
  const closeBtn = document.createElement("button");
  closeBtn.className = "card-zoom-close";
  closeBtn.textContent = "閉じる";
  closeBtn.addEventListener("click", () => overlay.remove());
  container.appendChild(closeBtn);

  overlay.appendChild(container);

  // 背景クリックで閉じる
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}

// 手札超過時の捨て札選択UI
function showDiscardUI(count, onComplete) {
  let remaining = count;

  function renderDiscardOverlay() {
    const cards = gameState.player.hand;
    const cardsHtml = cards.map((card, idx) => {
      const typeClass = card.type === "politician" ? "card-politician" : "card-option";
      return `<div class="discard-card ${typeClass}" data-idx="${idx}">
        <div class="card-name">${card.name}</div>
      </div>`;
    }).join("");

    showOverlay(`
      <h2>手札が8枚以上あります</h2>
      <p>7枚になるまで捨てるカードを選んでください（あと${remaining}枚）</p>
      <div class="discard-list">${cardsHtml}</div>
    `);

    document.querySelectorAll(".discard-card").forEach(el => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.dataset.idx);
        const discarded = gameState.player.hand.splice(idx, 1)[0];
        gameState.player.discard.push(discarded);
        console.log(`  手札超過: ${discarded.name}を捨てた`);
        remaining--;

        if (remaining <= 0) {
          hideOverlay();
          renderGame();
          onComplete();
        } else {
          renderDiscardOverlay();
        }
      });
    });
  }

  renderDiscardOverlay();
}

// ============================================================
// UI描画
// ============================================================

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(el => el.classList.add("hidden"));
  document.getElementById(screenId).classList.remove("hidden");
}

// 政治資金をコイン画像で表現するヘルパー
// 10億ごとに大きなコイン(内側に"10")、1億ごとに通常コイン
const COIN_IMG = '<img class="coin-icon" src="assets/icons/coin.webp" alt="億">';
function fundsToHtml(amount) {
  if (amount <= 0) return '<span class="funds-zero">—</span>';
  const groups = Math.floor(amount / 10);
  const singles = amount % 10;
  let html = '';
  for (let i = 0; i < groups; i++) {
    html += `<span class="funds-big">${COIN_IMG}<span class="funds-num">10</span></span>`;
  }
  for (let i = 0; i < singles; i++) {
    html += COIN_IMG;
  }
  return html;
}

// オプションカード用ドロップゾーンを表示（ドラッグ開始時に呼ぶ）
function showOptionDropZone(handIdx) {
  hideOptionDropZone();
  const zone = document.createElement("div");
  zone.id = "option-drop-zone";
  zone.textContent = "ここにドロップして使用";
  document.body.appendChild(zone);
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.remove();
    useOptionCard(handIdx);
  });
}

function hideOptionDropZone() {
  const zone = document.getElementById("option-drop-zone");
  if (zone) zone.remove();
}

// オプションカード使用後: 中央→捨て札スロットへ飛ぶ
function animateCardToDiscard(card, isPlayer, onDone) {
  const discardEl = document.getElementById(isPlayer ? "player-discard" : "cpu-discard");
  if (!discardEl) { onDone(); return; }
  const destRect = discardEl.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight;
  const W = 72, H = 101;
  const clone = createCardElement(card);
  Object.assign(clone.style, {
    position: "fixed",
    left: (vw / 2 - W / 2) + "px",
    top:  (vh / 2 - H / 2) + "px",
    width: W + "px", height: H + "px",
    margin: "0", zIndex: "500",
    pointerEvents: "none", transition: "none", opacity: "0.88",
  });
  document.body.appendChild(clone);
  clone.getBoundingClientRect(); // force reflow
  requestAnimationFrame(() => {
    clone.style.transition = "left 0.34s cubic-bezier(0.4,0,0.9,1), top 0.34s cubic-bezier(0.4,0,0.9,1), width 0.28s, height 0.28s, opacity 0.28s ease-in";
    clone.style.left    = destRect.left + "px";
    clone.style.top     = destRect.top  + "px";
    clone.style.width   = destRect.width  + "px";
    clone.style.height  = destRect.height + "px";
    clone.style.opacity = "0";
  });
  setTimeout(() => { clone.remove(); onDone(); }, 380);
}

// 共通: 大型フローティング数値 + プレイヤーエリアフラッシュ
const seCache = new Map();
// メニューSEのみ起動時にプリロード
const _menuSE = new Audio("assets/audio/se/menu_start.mp3");
_menuSE.preload = "auto";
seCache.set("assets/audio/se/menu_start.mp3", _menuSE);

function playSE(src, volume = 0.6) {
  const cached = seCache.get(src);
  const se = cached ?? new Audio(src);
  se.volume = volume;
  se.currentTime = 0;
  se.play().catch(() => {});
}

function showStatBigDelta(text, textClass, flashClass, anchorEl) {
  // プレイヤーエリアフラッシュ
  const playerArea = document.querySelector(".player-area-self");
  if (playerArea) {
    const areaRect = playerArea.getBoundingClientRect();
    const flash = document.createElement("div");
    flash.className = `player-area-flash ${flashClass}`;
    Object.assign(flash.style, {
      position: "fixed",
      left: areaRect.left + "px", top: areaRect.top + "px",
      width: areaRect.width + "px", height: areaRect.height + "px",
      pointerEvents: "none", zIndex: "349",
    });
    document.body.appendChild(flash);
    flash.addEventListener("animationend", () => flash.remove(), { once: true });
  }

  // アンカー要素の中央を起点にする
  let cx, cy;
  if (anchorEl) {
    const r = anchorEl.getBoundingClientRect();
    cx = r.left + r.width / 2;
    cy = r.top;
  } else {
    const infoEl = document.querySelector(".player-area-self .player-info");
    const infoRect = infoEl ? infoEl.getBoundingClientRect() : null;
    cx = infoRect ? infoRect.left + infoRect.width / 2 : window.innerWidth / 2;
    cy = infoRect ? infoRect.top - 8 : window.innerHeight * 0.58;
  }

  const el = document.createElement("div");
  el.className = `stat-big-delta ${textClass}`;
  el.textContent = text;
  el.style.left = cx + "px";
  el.style.top  = cy + "px";
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove(), { once: true });
}

// 政治資金: UP=バウンス上昇(金色) / DOWN=重力落下(赤)
function showFundsDelta(delta, x, y, dir) {
  const text      = (delta > 0 ? "+" : "") + delta + "億";
  const textClass  = dir === "up" ? "stat-big-delta-funds-up" : "stat-big-delta-funds-down";
  const flashClass = dir === "up" ? "player-area-flash-funds-up" : "player-area-flash-down";
  showStatBigDelta(text, textClass, flashClass, document.getElementById("player-funds"));
}

// 支持率: UP/DOWN ともに上昇フロート(緑/赤)
function showApprovalDelta(delta, x, y, dir) {
  const text       = (delta > 0 ? "+" : "") + delta + "%";
  const textClass  = `stat-big-delta-${dir}`;
  const flashClass = `player-area-flash-${dir}`;
  showStatBigDelta(text, textClass, flashClass, document.getElementById("player-approval"));
}

// CPU側: エリアフラッシュ + 下方向フローティングデルタ
function showCpuStatDelta(text, dir, isFunds) {
  const cpuArea = document.querySelector(".cpu-area");
  if (cpuArea) {
    const areaRect = cpuArea.getBoundingClientRect();
    const flash = document.createElement("div");
    const flashClass = dir === "up"
      ? (isFunds ? "player-area-flash-funds-up" : "player-area-flash-up")
      : "player-area-flash-down";
    flash.className = `player-area-flash ${flashClass}`;
    Object.assign(flash.style, {
      position: "fixed",
      left: areaRect.left + "px", top: areaRect.top + "px",
      width: areaRect.width + "px", height: areaRect.height + "px",
      pointerEvents: "none", zIndex: "349",
    });
    document.body.appendChild(flash);
    flash.addEventListener("animationend", () => flash.remove(), { once: true });
  }

  // CPU info の下端を起点に下方向へ浮かせる
  const infoEl = document.querySelector(".cpu-area .player-info");
  const infoRect = infoEl ? infoEl.getBoundingClientRect() : null;
  const cx = infoRect ? infoRect.left + infoRect.width / 2 : window.innerWidth / 2;
  const cy = infoRect ? infoRect.bottom + 4 : window.innerHeight * 0.2;

  const colorClass = dir === "up"
    ? (isFunds ? "stat-big-delta-funds-up" : "stat-big-delta-up")
    : (isFunds ? "stat-big-delta-funds-down" : "stat-big-delta-down");

  const el = document.createElement("div");
  el.className = `stat-big-delta cpu-stat-delta ${colorClass}`;
  el.textContent = text;
  el.style.left = cx + "px";
  el.style.top  = cy + "px";
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove(), { once: true });
}

function renderGame() {
  if (gameState.phase === "party_select") {
    showScreen("party-select-screen");
    return;
  }
  showScreen("game-screen");

  // ターン情報
  const isPlayerTurn = gameState.currentPlayer === "player";
  document.getElementById("turn-num").textContent = `${gameState.turn} / 25`;

  // 情勢調査ピップ: (turn-1) % 5 個が「完了済み」として塗られる
  const pipsFilled = (gameState.turn - 1) % 5;
  document.querySelectorAll(".survey-pip").forEach((pip, i) => {
    pip.classList.remove("pip-filled", "pip-urgent", "pip-filling", "pip-survey-flash");
    if (i < pipsFilled) {
      pip.classList.add("pip-filled");
    } else if (i === pipsFilled && pipsFilled === 4) {
      // ターン5,10,15,20,25の開始時: 最後のピップが空で警告表示
      pip.classList.add("pip-urgent");
    }
  });

  const ownerEl = document.getElementById("turn-owner");
  ownerEl.textContent = isPlayerTurn ? "あなたのターン" : "CPUのターン…";
  ownerEl.className = isPlayerTurn ? "owner-player" : "owner-cpu";

  // CPU情報
  document.getElementById("cpu-party").textContent = gameState.cpu.party || "???";
  document.getElementById("cpu-funds").innerHTML = fundsToHtml(gameState.cpu.funds);
  document.getElementById("cpu-approval").textContent = "???";
  if (gameState.cpu._fundsFlash) {
    const { dir, delta } = gameState.cpu._fundsFlash;
    delete gameState.cpu._fundsFlash;
    playSE(dir === "up" ? "assets/audio/se/funds_up.mp3" : "assets/audio/se/funds_down.mp3");
    const cpuFundsDelay = gameState.cpu._approvalFlash ? 300 : 0;
    setTimeout(() => requestAnimationFrame(() => {
      showCpuStatDelta((delta > 0 ? "+" : "") + delta + "億", dir, true);
    }), cpuFundsDelay);
  }
  if (gameState.cpu._approvalFlash) {
    const { dir, delta } = gameState.cpu._approvalFlash;
    delete gameState.cpu._approvalFlash;
    playSE(dir === "up" ? "assets/audio/se/rating_rise.mp3" : "assets/audio/se/rating_down.mp3", 0.20);
    requestAnimationFrame(() => {
      showCpuStatDelta((delta > 0 ? "+" : "") + delta + "%", dir, false);
    });
  }
  renderFieldCards("cpu-field", gameState.cpu.field, false);
  renderDeckSlot("cpu-deck", gameState.cpu.deck.length);
  renderDiscardSlot("cpu-discard", gameState.cpu.discard);

  // プレイヤー情報
  document.getElementById("player-party").textContent = gameState.player.party || "???";
  document.getElementById("player-funds").innerHTML = fundsToHtml(gameState.player.funds);
  if (gameState.player._fundsFlash) {
    const { dir, delta } = gameState.player._fundsFlash;
    delete gameState.player._fundsFlash;
    playSE(dir === "up" ? "assets/audio/se/funds_up.mp3" : "assets/audio/se/funds_down.mp3");
    const fundsDelay = gameState.player._approvalFlash ? 300 : 0;
    setTimeout(() => requestAnimationFrame(() => {
      const fundsEl = document.getElementById("player-funds");
      const rect = fundsEl.getBoundingClientRect();
      showFundsDelta(delta, rect.right + 6, rect.top + rect.height / 2, dir);
    }), fundsDelay);
  }
  const pa = gameState.player.approval;
  document.getElementById("player-approval").textContent = `${pa}%`;
  const barEl = document.getElementById("player-approval-bar");
  barEl.style.width = `${pa}%`;
  barEl.style.background = pa >= 70 ? "linear-gradient(90deg,#1a7a3e,#2ecc71)"
                          : pa >= 30 ? "linear-gradient(90deg,#1a5276,#3498db)"
                          :            "linear-gradient(90deg,#7a1a1a,#e94560)";
  if (gameState.player._approvalFlash) {
    const { dir, delta } = gameState.player._approvalFlash;
    delete gameState.player._approvalFlash;
    playSE(dir === "up" ? "assets/audio/se/rating_rise.mp3" : "assets/audio/se/rating_down.mp3", 0.20);
    requestAnimationFrame(() => {
      // バーフラッシュ
      barEl.classList.remove("approval-flash-up", "approval-flash-down");
      void barEl.offsetWidth;
      barEl.classList.add(dir === "up" ? "approval-flash-up" : "approval-flash-down");
      // 数値テキストパルス
      const numEl = document.getElementById("player-approval");
      numEl.classList.remove("approval-num-up", "approval-num-down");
      void numEl.offsetWidth;
      numEl.classList.add(dir === "up" ? "approval-num-up" : "approval-num-down");
      // フローティングデルタ
      const numRect = numEl.getBoundingClientRect();
      showApprovalDelta(delta, numRect.right + 6, numRect.top + numRect.height / 2, dir);
    });
  }
  renderFieldCards("player-field", gameState.player.field, true);
  renderDeckSlot("player-deck", gameState.player.deck.length);
  renderDiscardSlot("player-discard", gameState.player.discard);

  // CPU手札（裏向き）
  renderCpuHand();

  // 手札
  renderHand();

}

function renderDeckSlot(slotId, deckCount) {
  const slot = document.getElementById(slotId);
  if (!slot) return;
  slot.innerHTML = "";
  const back = document.createElement("div");
  back.className = "deck-card-back";
  if (deckCount === 0) back.style.visibility = "hidden";
  slot.appendChild(back);
}

function renderDiscardSlot(slotId, pile) {
  const isPlayer = slotId === "player-discard";
  const slot = document.getElementById(slotId);
  if (!slot) return;
  slot.innerHTML = "";
  slot.style.cursor = "default";
  slot.onclick = null;

  if (pile.length === 0) {
    const empty = document.createElement("div");
    empty.className = "discard-slot-empty";
    empty.textContent = "－";
    slot.appendChild(empty);
    return;
  }

  const stack = document.createElement("div");
  stack.className = "discard-stack";

  // 影レイヤー（最大3枚分、後ろへずらして重なり感を出す）
  const layers = Math.min(pile.length - 1, 3);
  for (let i = layers; i >= 1; i--) {
    const shadow = document.createElement("div");
    shadow.className = "discard-stack-shadow";
    shadow.style.transform = `translate(${i * 2}px, ${-i * 2}px)`;
    stack.appendChild(shadow);
  }

  // 一番上のカード（最後に捨てたカード）
  const topCard = pile[pile.length - 1];
  const topEl = document.createElement("div");
  topEl.className = "discard-stack-top";
  const img = document.createElement("img");
  img.className = "discard-fan-img";
  img.src = topCard.image;
  img.alt = topCard.name;
  img.onerror = () => {
    img.style.display = "none";
    topEl.style.background = topCard.type === "politician"
      ? "linear-gradient(160deg, #2a0a18 0%, #4a1a28 100%)"
      : "linear-gradient(160deg, #0a1a2e 0%, #0f2a4a 100%)";
  };
  topEl.appendChild(img);
  stack.appendChild(topEl);

  // 枚数バッジ
  const countEl = document.createElement("div");
  countEl.className = "discard-stack-count";
  countEl.textContent = `${pile.length}枚`;
  stack.appendChild(countEl);

  slot.appendChild(stack);
  slot.style.cursor = "pointer";
  slot.onclick = () => showDiscardOverlay(pile, isPlayer);
}

function showDiscardOverlay(pile, isPlayer) {
  if (pile.length === 0) return;

  const overlay = document.createElement("div");
  overlay.className = "discard-overlay";

  const box = document.createElement("div");
  box.className = "discard-overlay-box";

  const title = document.createElement("h3");
  title.className = "discard-overlay-title";
  title.textContent = `${isPlayer ? "あなた" : "CPU"}の捨て札（${pile.length}枚）`;
  box.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "discard-overlay-grid";

  // 最後に捨てたカードを先頭に表示
  [...pile].reverse().forEach(card => {
    const item = document.createElement("div");
    item.className = "discard-overlay-card";

    const img = document.createElement("img");
    img.src = cardImageCache.get(card.id) ?? card.image;
    img.alt = card.name;
    img.onerror = () => {
      img.style.display = "none";
      item.style.background = card.type === "politician"
        ? "linear-gradient(160deg, #2a0a18 0%, #4a1a28 100%)"
        : "linear-gradient(160deg, #0a1a2e 0%, #0f2a4a 100%)";
      const nameEl = document.createElement("div");
      nameEl.className = "discard-overlay-card-name";
      nameEl.textContent = card.name;
      item.appendChild(nameEl);
    };
    item.appendChild(img);

    item.addEventListener("click", e => {
      e.stopPropagation();
      showCardZoom(card, "view");
    });
    grid.appendChild(item);
  });
  box.appendChild(grid);

  const closeBtn = document.createElement("button");
  closeBtn.className = "card-zoom-close";
  closeBtn.textContent = "閉じる";
  closeBtn.addEventListener("click", () => overlay.remove());
  box.appendChild(closeBtn);

  overlay.appendChild(box);
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}


function renderFieldCards(containerId, cards, isPlayer) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let slotIdx = 0; slotIdx < 3; slotIdx++) {
    const card = cards.find(c => c.fieldSlot === slotIdx)
               ?? (cards[slotIdx] && cards[slotIdx].fieldSlot == null ? cards[slotIdx] : null);
    if (card) {
      const fieldIdx = cards.indexOf(card);
      const el = createCardElement(card);
      el.addEventListener("click", () => {
        clearHandSelection();
        if (isPlayer && gameState.currentPlayer === "player") {
          showCardZoom(card, "field", fieldIdx);
        } else {
          showCardZoom(card, "view");
        }
      });
      container.appendChild(el);
    } else {
      const empty = document.createElement("div");
      empty.className = "field-empty-slot";
      empty.dataset.slotIndex = slotIdx;
      container.appendChild(empty);
    }
  }
}

function renderCpuHand() {
  const container = document.getElementById("cpu-hand");
  if (!container) return;
  container.innerHTML = "";
  gameState.cpu.hand.forEach(() => {
    const el = document.createElement("div");
    el.className = "card-back";
    container.appendChild(el);
  });
}

let selectedHandIndex = null; // タップ選択中の手札インデックス
let focusedHandIndex  = 0;    // 拡大表示中の手札インデックス

// タッチD&D（モバイル向け）: 政治家→空スロット / オプション→ドロップゾーン
function addTouchDrag(el, idx, canPlace, canUseOption) {
  let ts = null; // タッチ状態

  el.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    ts = {
      startX: t.clientX, startY: t.clientY,
      rect: el.getBoundingClientRect(),
      moved: false, clone: null,
      isScrolling: null, // null=未判定 true=横スクロール false=ドラッグ
    };
  }, { passive: true });

  el.addEventListener("touchmove", (e) => {
    if (!ts) return;
    const t = e.touches[0];
    const dx = t.clientX - ts.startX;
    const dy = t.clientY - ts.startY;

    // 初回移動で方向を判定（横優勢→スクロール、縦優勢→ドラッグ）
    if (ts.isScrolling === null && Math.hypot(dx, dy) > 6) {
      ts.isScrolling = Math.abs(dx) > Math.abs(dy);
    }
    if (ts.isScrolling) return; // 横スクロールはブラウザに委譲
    e.preventDefault(); // ドラッグ中のスクロール抑制

    // 8px 以上動いたらドラッグ開始
    if (!ts.moved && Math.hypot(dx, dy) > 8) {
      ts.moved = true;
      el.style.opacity = "0.3";
      const clone = el.cloneNode(true);
      Object.assign(clone.style, {
        position: "fixed",
        left: ts.rect.left + "px", top: ts.rect.top + "px",
        width: ts.rect.width + "px", height: ts.rect.height + "px",
        opacity: "0.9", zIndex: "999",
        pointerEvents: "none", margin: "0", transition: "none",
        transform: "scale(1.06)",
        boxShadow: "0 8px 24px rgba(74,171,240,0.5)",
      });
      document.body.appendChild(clone);
      ts.clone = clone;
      if (canUseOption) showOptionDropZone(idx);
    }
    if (!ts.moved) return;

    // クローンを指に追従
    ts.clone.style.left = (ts.rect.left + dx) + "px";
    ts.clone.style.top  = (ts.rect.top  + dy) + "px";

    // 指の下の要素をハイライト
    ts.clone.style.visibility = "hidden";
    const under = document.elementFromPoint(t.clientX, t.clientY);
    ts.clone.style.visibility = "";
    document.querySelectorAll(".field-empty-slot.drag-over, #option-drop-zone.drag-over")
      .forEach(s => s.classList.remove("drag-over"));
    if (under) {
      if (canPlace)     under.closest?.(".field-empty-slot")?.classList.add("drag-over");
      if (canUseOption) under.closest?.("#option-drop-zone")?.classList.add("drag-over");
    }
  }, { passive: false });

  el.addEventListener("touchend", (e) => {
    if (!ts) return;
    const state = ts;
    ts = null;

    // 横スクロール中に指を離した → 何もしない（クリックも発火させない）
    if (state.isScrolling) { e.preventDefault(); return; }
    // タップ（動いていない）→ click イベントに委譲
    if (!state.moved) return;

    const t = e.changedTouches[0];
    if (state.clone) state.clone.style.visibility = "hidden";
    const under = document.elementFromPoint(t.clientX, t.clientY);
    if (state.clone) state.clone.remove();
    el.style.opacity = "";

    const slot = under?.closest?.(".field-empty-slot");
    const zone = under?.closest?.("#option-drop-zone");

    document.querySelectorAll(".field-empty-slot.drag-over").forEach(s => s.classList.remove("drag-over"));
    hideOptionDropZone();

    if (slot && canPlace && !gameState.player.placedThisTurn) {
      const slotIndex = parseInt(slot.dataset.slotIndex, 10);
      const srcEl = document.querySelectorAll("#player-hand .card")[idx];
      srcEl
        ? animateCardFly(srcEl, slot, true, () => playCardToField(idx, slotIndex))
        : playCardToField(idx, slotIndex);
    } else if (zone && canUseOption) {
      useOptionCard(idx);
    }
  });
}

// 手札タップ選択をクリア
function clearHandSelection() {
  selectedHandIndex = null;
  document.querySelectorAll("#player-hand .card.card-selected")
    .forEach(el => el.classList.remove("card-selected"));
  document.querySelectorAll("#player-field .field-empty-slot.slot-target")
    .forEach(slot => {
      slot.classList.remove("slot-target");
      if (slot._slotTapHandler) {
        slot.removeEventListener("click", slot._slotTapHandler);
        delete slot._slotTapHandler;
      }
    });
  hideOptionDropZone();
}

// 手札カードをタップ選択し、場の空スロットをターゲット化
function selectHandCard(idx, el, canPlace) {
  clearHandSelection();
  selectedHandIndex = idx;
  el.classList.add("card-selected");
  if (canPlace) {
    document.querySelectorAll("#player-field .field-empty-slot").forEach(slot => {
      slot.classList.add("slot-target");
      const handler = (e) => {
        e.stopPropagation();
        const handIdx = selectedHandIndex;
        const slotIndex = parseInt(slot.dataset.slotIndex, 10);
        clearHandSelection();
        const srcEl = document.querySelectorAll("#player-hand .card")[handIdx];
        if (srcEl) {
          animateCardFly(srcEl, slot, true, () => playCardToField(handIdx, slotIndex));
        } else {
          playCardToField(handIdx, slotIndex);
        }
      };
      slot._slotTapHandler = handler;
      slot.addEventListener("click", handler);
    });
  }
}


function renderHand() {
  const container = document.getElementById("player-hand");
  container.innerHTML = "";
  container.classList.toggle("hand-locked", gameState.currentPlayer !== "player");

  // focusedHandIndex を手札枚数内にクランプ
  const hn = gameState.player.hand.length;
  if (hn > 0) focusedHandIndex = Math.max(0, Math.min(focusedHandIndex, hn - 1));
  gameState.player.hand.forEach((card, idx) => {
    const el = createCardElement(card);
    const canPlace = card.type === "politician"
      && gameState.currentPlayer === "player"
      && !gameState.player.placedThisTurn
      && gameState.player.field.length < 3;
    const canUseOption = card.type === "option"
      && gameState.currentPlayer === "player"
      && !gameState.player.usedOptionThisTurn;

    if (selectedHandIndex === idx) el.classList.add("card-selected");

    // 上スワイプ → showCardZoom（touch events で確実に検知）
    let swipeStartY = null;
    let didSwipe = false;
    el.addEventListener("touchstart", (e) => {
      swipeStartY = e.touches[0].clientY;
      didSwipe = false;
    }, { passive: true });
    el.addEventListener("touchmove", (e) => {
      if (swipeStartY === null) return;
      if (swipeStartY - e.touches[0].clientY > 10) e.preventDefault();
    }, { passive: false });
    el.addEventListener("touchend", (e) => {
      if (swipeStartY === null) return;
      const dy = swipeStartY - e.changedTouches[0].clientY;
      swipeStartY = null;
      if (dy > 30) {
        didSwipe = true;
        showCardZoom(card, card.type === "option" ? "hand-option" : "hand-politician", idx);
      }
    });
    el.addEventListener("touchcancel", () => { swipeStartY = null; });

    // タップ → フォーカス移動 or アクション
    el.addEventListener("click", (e) => {
      if (didSwipe) { didSwipe = false; return; } // スワイプ後のclickは無視
      e.stopPropagation();
      if (gameState.currentPlayer !== "player") {
        showCardZoom(card, card.type === "option" ? "hand-option" : "view", idx);
        return;
      }
      // 別のカードをタップ → フォーカス移動のみ
      if (focusedHandIndex !== idx) {
        focusedHandIndex = idx;
        renderHand();
        return;
      }
      // フォーカス済み → アクション
      if (canUseOption) {
        clearHandSelection();
        useOptionCard(idx);
      } else if (canPlace) {
        if (selectedHandIndex === idx) {
          clearHandSelection();
        } else {
          selectHandCard(idx, el, canPlace);
        }
      }
      // 使えない場合は何もしない
    });
    container.appendChild(el);
  });

  applyHandFan(container);
}


// 手札ファン（扇形）レイアウト
function applyHandFan(container) {
  const cards = [...container.querySelectorAll(".card")];
  const n = cards.length;
  if (n === 0) return;

  // カード幅と利用可能幅を取得し、枚数が多いほど重なりを増やす
  const cardW = cards[0].offsetWidth || 52;
  const availW = (container.offsetWidth || window.innerWidth) - 16;
  // n枚が availW に収まるよう間隔を計算（最低4pxは見える）
  const spacing = n > 1 ? Math.max(4, Math.min(cardW, (availW - cardW) / (n - 1))) : cardW;
  const overlap = cardW - spacing;

  const isPlayerTurn = gameState.currentPlayer === "player";
  const focusIdx = isPlayerTurn ? Math.min(focusedHandIndex, n - 1) : -1;

  cards.forEach((card, i) => {
    const isFocused = i === focusIdx;
    if (n < 2) {
      card.style.transform    = isFocused ? "scale(1.22) translateY(-6px)" : "";
      card.style.marginLeft   = "";
      card.style.zIndex       = isFocused ? "20" : "";
      card.style.transformOrigin = "bottom center";
      return;
    }
    const t = (i / (n - 1)) - 0.5;
    const angle   = t * Math.min(16, n * 2.5);
    const yOffset = Math.abs(t) * 12 - (isFocused ? 8 : 0); // フォーカスカードは上に浮かせる
    const scale   = isFocused ? " scale(1.22)" : "";
    card.style.transform       = `rotate(${angle}deg) translateY(${yOffset}px)${scale}`;
    card.style.transformOrigin = "bottom center";
    card.style.marginLeft      = i === 0 ? "0" : `-${overlap}px`;
    card.style.zIndex          = isFocused ? "20" : String(Math.round((1 - Math.abs(t)) * 10));
  });
}

// ============================================================
// Canvas カードレンダリング
// ============================================================

const CARD_CANVAS_W = 400;
const CARD_CANVAS_H = 560;

// 金色コインを Canvas に描画
function drawCoinCanvas(ctx, cx, cy, r) {
  const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.05, cx, cy, r);
  grad.addColorStop(0,    "#fff8c0");
  grad.addColorStop(0.45, "#ffd700");
  grad.addColorStop(0.85, "#c8960c");
  grad.addColorStop(1,    "#8b6914");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.stroke();
  // 内側リム
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();
  // ¥ テキスト
  ctx.font = `900 ${Math.round(r * 1.1)}px 'Noto Sans JP', 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif`;
  ctx.fillStyle = "#7a5500";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("¥", cx, cy + 0.5);
}

// 折り返しテキスト描画（返値: 描画終了Y座標）
function fillWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = "";
  let currentY = y;
  for (const ch of [...text]) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line.length > 0) {
      ctx.fillText(line, x, currentY);
      line = ch;
      currentY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

// カード1枚をCanvasで合成してdataURLを返す
async function renderCardCanvas(card) {
  const W = CARD_CANVAS_W, H = CARD_CANVAS_H;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const isPolitician = card.type === "politician";

  // レイアウト定数
  const GAP       = 18;  // 白パネルの両サイド・下の隙間
  const BORDER_R  = 18;  // カード角丸（グレー枠と合わせる）
  const PANEL_H   = Math.round(H * 0.35);  // 196px（全体の35%）
  const PANEL_Y   = H - PANEL_H;           // 364px
  const NAME_H    = 60;  // 46 × 1.3
  const NAME_Y    = 0;   // グレー枠に隙間なし（最上部）
  const PAD_X     = 18;
  const COIN_R    = 10;
  const COIN_STEP = COIN_R * 2 + 4;

  // ── 0. キャンバス全体をグレーで塗りつぶし（枠外隙間をグレーに） ──
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0,   "#e4e4e4");
  bgGrad.addColorStop(0.5, "#b4b4b4");
  bgGrad.addColorStop(1,   "#888888");
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, BORDER_R);
  ctx.fill();

  // ── 1. イラスト（名前バー下から開始、center-crop） ──
  const imgDestY  = NAME_H;
  const imgDestH  = H - imgDestY;
  await new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const srcW = img.naturalWidth, srcH = img.naturalHeight;
      const destAspect = W / imgDestH;
      const srcAspect  = srcW / srcH;
      let sx, sy, sw, sh;
      if (srcAspect > destAspect) {
        sh = srcH; sw = srcH * destAspect; sx = (srcW - sw) / 2; sy = 0;
      } else {
        sw = srcW; sh = srcW / destAspect; sx = 0; sy = 0;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, imgDestY, W, imgDestH);
      resolve();
    };
    img.onerror = () => {
      const fbGrad = ctx.createLinearGradient(0, imgDestY, W, H);
      fbGrad.addColorStop(0, isPolitician ? "#2a0a18" : "#0a1a2e");
      fbGrad.addColorStop(1, isPolitician ? "#4a1a28" : "#0f2a4a");
      ctx.fillStyle = fbGrad;
      ctx.fillRect(0, imgDestY, W, imgDestH);
      resolve();
    };
    img.src = card.image;
  });

  // ── 2. 名前バー（政党カラー・黒文字） ──
  const PARTY_COLORS = {
    "自民党":       "#d42020",
    "国民民主党":   "#f5c400",
    "チームみらい": "#1c9e45",
    "維新の会":     "#7ec820",
    "参政党":       "#e07020",
    "中道改革連合": "#1060c0",
  };
  const nameColor = isPolitician
    ? (PARTY_COLORS[card.party] ?? "#aaaaaa")
    : "#c0c0c0";

  // 上部・両サイドはグレー枠まで隙間なし
  const nameBarX = 0;
  const nameBarW = W;
  const nameGrad = ctx.createLinearGradient(0, 0, nameBarW, 0);
  nameGrad.addColorStop(0, nameColor);
  nameGrad.addColorStop(1, "#ffffff");
  ctx.fillStyle = nameGrad;
  ctx.beginPath();
  ctx.roundRect(nameBarX, NAME_Y, nameBarW, NAME_H, [BORDER_R, BORDER_R, 0, 0]);
  ctx.fill();

  ctx.font = `900 31px 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif`;  // 24 × 1.3
  ctx.fillStyle = "#111111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(card.name, W / 2, NAME_Y + NAME_H / 2);

  // ── 3. 半透明白パネル（両サイド・下に隙間） ──
  const panelX = GAP;
  const panelW = W - GAP * 2;
  const panelDrawH = PANEL_H - GAP;  // 下GAP分を引く
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.beginPath();
  ctx.roundRect(panelX, PANEL_Y, panelW, panelDrawH, [10, 10, 10, 10]);
  ctx.fill();

  // ── 4. 能力 / 効果テキスト ──
  if (isPolitician && card.abilities) {
    const rows  = card.abilities.length;
    const rowH  = panelDrawH / rows;

    card.abilities.forEach((ability, i) => {
      const rowY = PANEL_Y + i * rowH;

      if (i > 0) {
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(panelX + PAD_X, rowY);
        ctx.lineTo(panelX + panelW - PAD_X, rowY);
        ctx.stroke();
      }

      const cost   = ability.cost ?? 0;
      const startX = panelX + PAD_X;
      const nameY  = rowY + rowH * 0.32;  // 上寄り
      const effY   = rowY + rowH * 0.65;  // 下寄り

      // コイン（能力名と同じ高さ）
      for (let c = 0; c < cost; c++) {
        drawCoinCanvas(ctx, startX + COIN_R + c * COIN_STEP, nameY, COIN_R);
      }

      const textX = startX + (cost > 0 ? cost * COIN_STEP + 8 : 0);

      // 能力名：黒字
      ctx.font = `900 20px 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif`;
      ctx.fillStyle = "#111111";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(ability.name, textX, nameY);

      // 効果テキスト：赤字
      if (ability.effectText) {
        ctx.font = `900 16px 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif`;
        ctx.fillStyle = "#cc1a1a";
        ctx.textBaseline = "middle";
        fillWrappedText(ctx, ability.effectText, panelX + PAD_X, effY, panelW - PAD_X * 2, 20);
      }
    });
  } else if (!isPolitician) {
    const textX   = panelX + PAD_X;
    const maxW    = panelW - PAD_X * 2;
    let   currentY = PANEL_Y + 16;

    // 説明文：黒字
    if (card.description) {
      ctx.font = `900 17px 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif`;
      ctx.fillStyle = "#111111";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      currentY = fillWrappedText(ctx, card.description, textX, currentY, maxW, 24);
      currentY += 6;
    }

    // 効果テキスト：赤字
    if (card.effectDescription) {
      ctx.font = `900 17px 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif`;
      ctx.fillStyle = "#cc1a1a";
      ctx.textBaseline = "top";
      fillWrappedText(ctx, card.effectDescription, textX, currentY, maxW, 24);
    }
  }

  // ── 5. グレー外枠（ポケポケ風） ──
  const BORDER_INSET = 5;
  const BORDER_W     = 9;
  const borderGrad = ctx.createLinearGradient(0, 0, 0, H);
  borderGrad.addColorStop(0,   "#e4e4e4");
  borderGrad.addColorStop(0.5, "#b4b4b4");
  borderGrad.addColorStop(1,   "#888888");
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = BORDER_W;
  ctx.beginPath();
  ctx.roundRect(BORDER_INSET, BORDER_INSET, W - BORDER_INSET * 2, H - BORDER_INSET * 2, BORDER_R);
  ctx.stroke();

  return canvas.toDataURL("image/webp");
}

// 全カードをキャッシュに登録（起動時）
async function buildAllCardImages() {
  const allCards = [...POLITICIAN_CARDS, ...OPTION_CARDS];
  await Promise.all(allCards.map(async card => {
    try {
      cardImageCache.set(card.id, await renderCardCanvas(card));
    } catch (e) {
      console.warn(`[Canvas] ${card.id} 生成失敗:`, e);
    }
  }));
  console.log(`[Canvas] ${cardImageCache.size}枚 生成完了`);
}

function createCardElement(card) {
  const el = document.createElement("div");
  el.className = `card card-${card.type}`;
  el.dataset.instanceId = card.instanceId;

  const imgArea = document.createElement("div");
  imgArea.className = "card-img-area";

  const img = document.createElement("img");
  img.className = "card-photo";
  img.alt = card.name;

  const cached = cardImageCache.get(card.id);
  if (cached) {
    el.classList.add("canvas-rendered", "has-image");
    img.src = cached;
  } else {
    // フォールバック: 生画像のみ（パネルなし）
    img.src = card.image;
    img.onload  = () => el.classList.add("has-image");
    img.onerror = () => el.classList.add("no-image");
  }

  imgArea.appendChild(img);
  el.appendChild(imgArea);
  return el;
}


function setMainPhaseUI(enabled) {
  const endTurnBtn = document.getElementById("end-turn-btn");
  if (endTurnBtn) {
    endTurnBtn.disabled = !enabled;
  }
}

// ============================================================
// デバッグ用
// ============================================================

function logState() {
  console.log("--- 状態 ---");
  console.log(`  ターン: ${gameState.turn} / フェーズ: ${gameState.phase}`);
  console.log(`  P: 支持率${gameState.player.approval}% 資金${gameState.player.funds}億 手札${gameState.player.hand.length} 場${gameState.player.field.length} 山${gameState.player.deck.length}`);
  console.log(`  C: 支持率${gameState.cpu.approval}% 資金${gameState.cpu.funds}億 手札${gameState.cpu.hand.length} 場${gameState.cpu.field.length} 山${gameState.cpu.deck.length}`);
}

// ============================================================
// 画面遷移: 政党選択
// ============================================================

function selectParty(party) {
  // 政党を一時保持してレベル選択画面へ
  gameState._pendingParty = party;
  document.getElementById("party-select-screen").classList.add("hidden");
  document.getElementById("level-select-screen").classList.remove("hidden");
}

async function selectLevel(level) {
  gameState.cpuLevel = level;

  // ローディング画面表示
  document.getElementById("level-select-screen").classList.add("hidden");
  document.getElementById("loading-screen").classList.remove("hidden");

  // Canvas カード画像を未生成なら生成
  if (cardImageCache.size === 0) {
    await document.fonts.ready;
    await buildAllCardImages();
  }

  document.getElementById("loading-screen").classList.add("hidden");

  // BGM再生（ユーザー操作後なので自動再生ポリシーをクリア）
  const bgm = document.getElementById("bgm");
  if (bgm) { bgm.volume = 0.4; bgm.play().catch(() => {}); }

  initGame(gameState._pendingParty);
}

// ============================================================
// 初期化
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  // カードデータを JSON から読み込む（並列）
  try {
    [POLITICIAN_CARDS, OPTION_CARDS] = await Promise.all([
      fetch("assets/data/politician_cards.json").then(r => r.json()).then(data =>
        data.flatMap(g => g.politicians.map(p => ({ ...p, party: g.party })))
      ),
      fetch("assets/data/option_cards.json").then(r => r.json()),
    ]);
  } catch (e) {
    console.error("カードデータの読み込みに失敗:", e);
  }

  // 全カード画像をバックグラウンドでプリロード（完了を待たない）
  const allImages = [
    ...POLITICIAN_CARDS.map(c => c.image),
    ...OPTION_CARDS.map(c => c.image),
    "assets/icons/coin.webp",
  ];
  Promise.all(allImages.map(src => new Promise(resolve => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  }))).then(() => console.log(`[プリロード完了] ${allImages.length}枚`));

  const verEl = document.getElementById("app-version");
  if (verEl) verEl.textContent = `ver ${APP_VERSION}`;

  document.querySelectorAll(".party-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      playSE("assets/audio/se/menu_start.mp3", 0.7);
      selectParty(btn.dataset.party);
    });
  });

  document.querySelectorAll(".level-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      playSE("assets/audio/se/menu_start.mp3", 0.7);
      selectLevel(Number(btn.dataset.level));
    });
  });

  document.getElementById("level-back-btn").addEventListener("click", () => {
    document.getElementById("level-select-screen").classList.add("hidden");
    document.getElementById("party-select-screen").classList.remove("hidden");
  });

  document.getElementById("menu-back-btn").addEventListener("click", () => {
    document.getElementById("back-to-menu-dialog").classList.remove("hidden");
  });

  document.getElementById("back-to-menu-no").addEventListener("click", () => {
    document.getElementById("back-to-menu-dialog").classList.add("hidden");
  });

  document.getElementById("back-to-menu-yes").addEventListener("click", () => {
    document.getElementById("back-to-menu-dialog").classList.add("hidden");
    // BGM停止
    const bgm = document.getElementById("bgm");
    if (bgm) { bgm.pause(); bgm.currentTime = 0; }
    // 画面切り替え
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("party-select-screen").classList.remove("hidden");
  });

  document.getElementById("end-turn-btn").addEventListener("click", () => {
    const btn = document.getElementById("end-turn-btn");
    btn.classList.remove("btn-pulse");
    void btn.offsetWidth;
    btn.classList.add("btn-pulse");
    if (gameState.currentPlayer === "player") {
      endPlayerTurn();
    }
  });

  renderGame();
});
