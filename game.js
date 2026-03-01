// ============================================================
// カードデータ定義
// ============================================================

const POLITICIAN_CARDS = [
  // --- 自民党 ---
  {
    id: "s-ishiba",
    name: "S・イシバ",
    gender: "男",
    party: "自民党",
    image: "assets/politicians/jimin/s-ishiba.png",
    type: "politician",
    abilities: [
      {
        name: "一口でおにぎり",
        effectText: "支持率-5%、政治資金+7億",
        description: "おにぎりの産地が注目され、地方団体からの献金",
        cost: 0,
        effect: "ishiba_1"
      },
      {
        name: "ゲル顔で威嚇",
        effectText: "相手の支持率-8%、【次ターン】相手の能力コスト+1億",
        description: "独特の表情で相手を威圧",
        cost: 4,
        effect: "ishiba_2"
      }
    ]
  },
  {
    id: "s-takaichi",
    name: "S・タカイチ",
    gender: "女",
    party: "自民党",
    image: "assets/politicians/jimin/s-takaichi.png",
    type: "politician",
    abilities: [
      {
        name: "早苗ネーム連呼",
        effectText: "支持率+8%、政治資金-2億",
        description: "自分の名前を連呼して存在感アピール",
        cost: 2,
        effect: "takaichi_1"
      },
      {
        name: "靖国参拝決行",
        effectText: "支持率+12%、【次ターン開始時】相手の支持率-4%",
        description: "保守層に強烈アピール、反発も招く",
        cost: 5,
        effect: "takaichi_2"
      }
    ]
  },
  {
    id: "s-koizumi",
    name: "S・コイズミ",
    gender: "男",
    party: "自民党",
    image: "assets/politicians/jimin/s-koizumi.png",
    type: "politician",
    abilities: [
      {
        name: "セクシー発言",
        effectText: "支持率+15% or -10%",
        description: "「気候変動はセクシーに」などの迷言で物議",
        cost: 1,
        effect: "koizumi_1"
      },
      {
        name: "レジ袋有料化",
        effectText: "相手の支持率-5%、自分の支持率-3%、政治資金+6億",
        description: "環境アピールだが不評",
        cost: 2,
        effect: "koizumi_2"
      }
    ]
  },
  {
    id: "t-kono",
    name: "T・コウノ",
    gender: "男",
    party: "自民党",
    image: "assets/politicians/jimin/t-kono.png",
    type: "politician",
    abilities: [
      {
        name: "Twitterブロック祭り",
        effectText: "支持率-3%、政治資金+2億、次の相手ターンの支持率低下を1回無効化",
        description: "批判者を片っ端からブロック",
        cost: 2,
        effect: "kono_1"
      },
      {
        name: "ハンコ廃止！",
        effectText: "支持率+9%、【次ターン】自分の資金収入+3億",
        description: "デジタル化推進で支持獲得",
        cost: 4,
        effect: "kono_2"
      }
    ]
  },
  {
    id: "y-suga",
    name: "Y・スガ",
    gender: "男",
    party: "自民党",
    image: "assets/politicians/jimin/y-suga.png",
    type: "politician",
    abilities: [
      {
        name: "ガースーです",
        effectText: "支持率+8%（場が1枚以下なら追加+4%）",
        description: "独特の自己紹介で親しみアピール",
        cost: 3,
        effect: "suga_1"
      },
      {
        name: "パンケーキ会食",
        effectText: "政治資金+4億、【次ターン】最初に受ける支持率低下を4%軽減",
        description: "メディアと懐柔策",
        cost: 2,
        effect: "suga_2"
      }
    ]
  },

  // --- 国民民主党 ---
  {
    id: "y-tamaki",
    name: "Y・タマキ",
    gender: "男",
    party: "国民民主党",
    image: "assets/politicians/kokumin/y-tamaki.png",
    type: "politician",
    abilities: [
      {
        name: "文春砲サバイバル",
        effectText: "支持率-8%、政治資金+10億",
        description: "不倫疑惑報道を乗り越える",
        cost: 2,
        effect: "tamaki_1"
      },
      {
        name: "手取りを増やす！",
        effectText: "支持率+10%、政治資金+5億",
        description: "国民の手取りアップを訴求",
        cost: 4,
        effect: "tamaki_2"
      }
    ]
  },
  {
    id: "y-mori",
    name: "Y・モリ",
    gender: "男",
    party: "国民民主党",
    image: "assets/politicians/kokumin/y-mori.png",
    type: "politician",
    abilities: [
      {
        name: "若手のフットワーク",
        effectText: "支持率+9%、【次ターン】自分の能力コスト全て-1億",
        description: "身軽に動いて支持獲得",
        cost: 3,
        effect: "mori_1"
      },
      {
        name: "次世代の星",
        effectText: "支持率+7%（場が2枚以下なら追加+5%）",
        description: "若手ならではのフレッシュさ",
        cost: 3,
        effect: "mori_2"
      }
    ]
  },
  {
    id: "k-shinba",
    name: "K・シンバ",
    gender: "男",
    party: "国民民主党",
    image: "assets/politicians/kokumin/k-shinba.png",
    type: "politician",
    abilities: [
      {
        name: "静岡茶で一服",
        effectText: "政治資金+6億、次の相手ターンの支持率低下を1回無効化",
        description: "お茶を飲んで一息",
        cost: 2,
        effect: "shinba_1"
      },
      {
        name: "国対の調整力",
        effectText: "支持率+6%、【次ターン】自分の場の全カードのコスト-2億",
        description: "水面下の調整で場を整える",
        cost: 4,
        effect: "shinba_2"
      }
    ]
  },
  {
    id: "k-ushida",
    name: "M・ウシダ",
    gender: "女",
    party: "国民民主党",
    image: "assets/politicians/kokumin/k-ushida.png",
    type: "politician",
    abilities: [
      {
        name: "日銀理論で論破",
        effectText: "相手の支持率-8%、政治資金+7億",
        description: "経済理論で相手を圧倒",
        cost: 5,
        effect: "ushida_1"
      },
      {
        name: "金融緩和論",
        effectText: "支持率+8% or -3%、政治資金+4億",
        description: "難しい経済政策を語る",
        cost: 3,
        effect: "ushida_2"
      }
    ]
  },
  {
    id: "t-ito",
    name: "T・イトウ",
    gender: "女",
    party: "国民民主党",
    image: "assets/politicians/kokumin/t-ito.png",
    type: "politician",
    abilities: [
      {
        name: "元アナの美声",
        effectText: "支持率+10%、【次ターン開始】自分の支持率+2%",
        description: "元アナウンサーの滑舌と声で訴求力UP",
        cost: 4,
        effect: "ito_1"
      },
      {
        name: "ママ目線の追及",
        effectText: "支持率+9%、相手の支持率-3%",
        description: "子育て世代の代弁で共感",
        cost: 4,
        effect: "ito_2"
      }
    ]
  },

  // --- チームみらい ---
  {
    id: "t-anno",
    name: "T・アンノ",
    gender: "男",
    party: "チームみらい",
    image: "assets/politicians/mirai/t-anno.png",
    type: "politician",
    abilities: [
      {
        name: "ビジョン宣言",
        effectText: "支持率+6%（場が3枚なら追加+4%）",
        description: "理想的なビジョンを力強く訴える",
        cost: 3,
        effect: "anno_1"
      },
      {
        name: "マニフェスト",
        effectText: "支持率+5%",
        description: "公約を発表して共感を集める",
        cost: 2,
        effect: "anno_2"
      }
    ]
  },
  {
    id: "s-takayama",
    name: "S・タカヤマ",
    gender: "男",
    party: "チームみらい",
    image: "assets/politicians/mirai/s-takayama.png",
    type: "politician",
    abilities: [
      {
        name: "草の根運動",
        effectText: "支持率+4%",
        description: "地道な草の根活動で支持を広げる",
        cost: 1,
        effect: "takayama_1"
      },
      {
        name: "SNSバズ",
        effectText: "支持率+7%",
        description: "SNSで話題を作りバズらせる",
        cost: 3,
        effect: "takayama_2"
      }
    ]
  },
  {
    id: "k-muto",
    name: "K・ムトウ",
    gender: "女",
    party: "チームみらい",
    image: "assets/politicians/mirai/k-muto.png",
    type: "politician",
    abilities: [
      {
        name: "構造改革",
        effectText: "相手の支持率-5%、支持率+5%",
        description: "既存システムを大胆に改革",
        cost: 5,
        effect: "muto_1"
      },
      {
        name: "規制緩和",
        effectText: "支持率+6%",
        description: "規制緩和で経済活性化を訴える",
        cost: 3,
        effect: "muto_2"
      }
    ]
  },
  {
    id: "e-suda",
    name: "E・スダ",
    gender: "男",
    party: "チームみらい",
    image: "assets/politicians/mirai/e-suda.png",
    type: "politician",
    abilities: [
      {
        name: "テクノ政策",
        effectText: "相手の場のランダム1枚を次の相手のターンで使用不可",
        description: "先進技術で相手の動きを妨害",
        cost: 4,
        effect: "suda_1"
      },
      {
        name: "AI推進",
        effectText: "支持率+5%",
        description: "AI活用で社会の効率化を訴える",
        cost: 3,
        effect: "suda_2"
      }
    ]
  },
  {
    id: "y-mineshima",
    name: "Y・ミネシマ",
    gender: "男",
    party: "チームみらい",
    image: "assets/politicians/mirai/y-mineshima.png",
    type: "politician",
    abilities: [
      {
        name: "超党派連携",
        effectText: "このターンのみ、自分の全カードの能力コスト-1億",
        description: "超党派で協力して政策を実現",
        cost: 2,
        effect: "mineshima_1"
      },
      {
        name: "多様性推進",
        effectText: "支持率+5%、相手の支持率-3%",
        description: "多様性を推進し共感を獲得",
        cost: 3,
        effect: "mineshima_2"
      }
    ]
  }
];

const OPTION_CARDS = [
  {
    id: "trump_tariff",
    name: "トランプ関税",
    description: "外圧による経済パニック。",
    effectDescription: "両プレイヤーの政治資金が30%没収される",
    image: "assets/options/trump_tariff.png",
    type: "option",
    effect: "trump_tariff"
  },
  {
    id: "kioku_ni_gozaimasen",
    name: "記憶にございません",
    description: "国会答弁の定番フレーズで追及をかわす。",
    effectDescription: "次に受ける支持率低下を1回無効化。ただし次の自分のターンはドロー不可",
    image: "assets/options/kioku_ni_gozaimasen.png",
    type: "option",
    effect: "kioku_ni_gozaimasen"
  },
  {
    id: "kenkin_party",
    name: "政治献金パーティー",
    description: "豪華ホテルの「勉強会」で資金集め。",
    effectDescription: "政治資金+8億円を即時獲得",
    image: "assets/options/kenkin_party.png",
    type: "option",
    effect: "kenkin_party"
  },
  {
    id: "gaitou_enzetsu",
    name: "街頭演説の神対応",
    description: "厳しいヤジをユーモアで返し、聴衆を味方につける。",
    effectDescription: "支持率+4%。場にカードが2枚以上なら代わりに+8%",
    image: "assets/options/gaitou_enzetsu.png",
    type: "option",
    effect: "gaitou_enzetsu"
  },
  {
    id: "drill_hakai",
    name: "ドリル破壊",
    description: "物理的に証拠を消し去る強硬手段。",
    effectDescription: "次に受ける支持率低下を1回スキップ。ただし政治資金-5億",
    image: "assets/options/drill_hakai.png",
    type: "option",
    effect: "drill_hakai"
  },
  {
    id: "tounai_kaikaku",
    name: "政党内改革",
    description: "旧弊を打破する「トカゲの尻尾切り」か「刷新」か。",
    effectDescription: "自分の場の政治家カード1枚を捨て札にし、手札から別の政治家カードを場に出す",
    image: "assets/options/tounai_kaikaku.png",
    type: "option",
    effect: "tounai_kaikaku"
  },
  {
    id: "toushu_touron",
    name: "党首討論",
    description: "2分割画面で映し出される、言葉の真剣勝負。",
    effectDescription: "支持率が上がる（状況に応じて効果が変動）",
    image: "assets/options/toushu_touron.png",
    type: "option",
    effect: "toushu_touron"
  },
  {
    id: "yukiguni_yukikaki",
    name: "雪国の雪かき",
    description: "演説のため歩道の雪を路上に撒き散らす姿がSNSで炎上。",
    effectDescription: "相手の支持率-5%",
    image: "assets/options/yukiguni_yukikaki.png",
    type: "option",
    effect: "yukiguni_yukikaki"
  },
  {
    id: "kono_hage",
    name: "このハゲェー！！",
    description: "秘書への苛烈な暴言録音がSNSで大拡散。",
    effectDescription: "相手の支持率-5%。相手の場に女性政治家がいれば更に-7%",
    image: "assets/options/kono_hage.png",
    type: "option",
    effect: "kono_hage"
  },
  {
    id: "netenai_jiman",
    name: "寝てない自慢",
    description: "災害の緊急対応で「不眠不休」をアピールし、同情と期待を買う。",
    effectDescription: "自分の支持率+4%",
    image: "assets/options/netenai_jiman.png",
    type: "option",
    effect: "netenai_jiman"
  },
  {
    id: "masukomi_taisaku",
    name: "マスコミ対策",
    description: "記者クラブとの会食や巧妙な情報操作で報道をコントロール。",
    effectDescription: "次の相手ターンに受ける支持率低下を1回無効化",
    image: "assets/options/masukomi_taisaku.png",
    type: "option",
    effect: "masukomi_taisaku"
  },
  {
    id: "ouen_enzetsu",
    name: "応援演説",
    description: "「党の顔」がマイクを握り、新たな人材を呼び込む。",
    effectDescription: "自分の山札から政治家カードをランダムで1枚手札に加える",
    image: "assets/options/ouen_enzetsu.png",
    type: "option",
    effect: "ouen_enzetsu"
  },
  {
    id: "kinkyuu_yoron",
    name: "緊急世論調査",
    description: "リアルタイムの支持率を分析し、戦術を修正する。",
    effectDescription: "即座に自分の支持率を確認できる",
    image: "assets/options/kinkyuu_yoron.png",
    type: "option",
    effect: "kinkyuu_yoron"
  },
  {
    id: "giinkaikan_furin",
    name: "議員会館不倫",
    description: "議員宿舎での密会がスクープされ、政界に激震。",
    effectDescription: "相手の支持率-8%。ただし自分も巻き添えで-3%",
    image: "assets/options/giinkaikan_furin.png",
    type: "option",
    effect: "giinkaikan_furin"
  }
];

// 政党リスト
const PARTIES = ["自民党", "国民民主党", "チームみらい"];

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
    shields: [],             // 無効化系効果
    currentTurnCostReduction: 0, // このターンのみ有効なコスト軽減（ターン開始時にnextTurnBonusesから転写）
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
  instanceIdCounter: 0
};

// カードインスタンスを生成（同じカード定義から複数インスタンスを作る）
function createCardInstance(cardDef) {
  gameState.instanceIdCounter++;
  return {
    ...cardDef,
    instanceId: gameState.instanceIdCounter,
    disabled: false // 能力使用不可フラグ
  };
}

// ============================================================
// デッキ構築
// ============================================================

function buildDeck(party) {
  const politicians = POLITICIAN_CARDS.filter(c => c.party === party).map(createCardInstance);
  const options = [];
  // オプションカード14種 × 2枚 = 28枚
  for (const optDef of OPTION_CARDS) {
    options.push(createCardInstance(optDef));
    options.push(createCardInstance(optDef));
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
  if (amount < 0) amount = applyDefenses(player, amount);
  player.approval = clamp(player.approval + amount, 0, 100);
  const after = player.approval;
  if (after !== before) player._approvalFlash = { dir: after > before ? "up" : "down", delta: after - before };
  const who = player === gameState.player ? "あなた" : "相手";
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
  ishiba_1(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, -5);
    if (m1) msgs.push(m1);
    changeFunds(self, 7);
    msgs.push("政治資金+7億円を獲得！");
    return msgs;
  },
  ishiba_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(opponent, -8);
    if (m1) msgs.push(m1);
    opponent.nextTurnBonuses.costReduction -= 1; // コスト増加 = マイナスの軽減
    msgs.push("相手の次ターンの能力コスト+1億！");
    return msgs;
  },
  takaichi_1(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 8);
    if (m1) msgs.push(m1);
    changeFunds(self, -2);
    msgs.push("政治資金-2億円…");
    return msgs;
  },
  takaichi_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 12);
    if (m1) msgs.push(m1);
    opponent.nextTurnBonuses.approvalBonus = (opponent.nextTurnBonuses.approvalBonus || 0) - 4;
    msgs.push("【次ターン開始時】相手の支持率-4%！");
    return msgs;
  },
  koizumi_1(self, opponent) {
    const msgs = [];
    if (Math.random() < 0.5) {
      const m1 = changeApproval(self, 15);
      if (m1) msgs.push(m1);
    } else {
      const m1 = changeApproval(self, -10);
      if (m1) msgs.push(m1);
    }
    return msgs;
  },
  koizumi_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(opponent, -5);
    if (m1) msgs.push(m1);
    const m2 = changeApproval(self, -3);
    if (m2) msgs.push(m2);
    changeFunds(self, 6);
    msgs.push("政治資金+6億円を獲得！");
    return msgs;
  },
  kono_1(self, opponent) {
    const msgs = [];
    self.shields.push("block_approval_down");
    const m1 = changeApproval(self, -3);
    if (m1) msgs.push(m1);
    changeFunds(self, 2);
    msgs.push("政治資金+2億円を獲得！");
    msgs.push("次の相手ターンに受ける支持率低下を1回無効化！");
    return msgs;
  },
  kono_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 9);
    if (m1) msgs.push(m1);
    self.nextTurnBonuses.fundBonus += 3;
    msgs.push("次のターンの資金収入+3億！");
    return msgs;
  },
  suga_1(self, opponent) {
    const msgs = [];
    let bonus = 0;
    if (self.field.length <= 1) bonus = 4;
    const m1 = changeApproval(self, 8 + bonus);
    if (m1) msgs.push(m1);
    return msgs;
  },
  suga_2(self, opponent) {
    const msgs = [];
    // 【フェーズ4】applyDefenses() 統合後に attackReduction が機能予定（自分が受けるダメージを軽減）
    self.nextTurnBonuses.attackReduction += 4;
    changeFunds(self, 4);
    msgs.push("政治資金+4億円を獲得！");
    msgs.push("【次ターン】最初に受ける支持率低下を4%軽減！");
    return msgs;
  },

  // --- 国民民主党 ---
  tamaki_1(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, -8);
    if (m1) msgs.push(m1);
    changeFunds(self, 10);
    msgs.push("政治資金+10億円を獲得！");
    return msgs;
  },
  tamaki_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 10);
    if (m1) msgs.push(m1);
    changeFunds(self, 5);
    msgs.push("政治資金+5億円を獲得！");
    return msgs;
  },
  mori_1(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 9);
    if (m1) msgs.push(m1);
    self.nextTurnBonuses.costReduction += 1;
    msgs.push("次のターンの能力コスト-1億！");
    return msgs;
  },
  mori_2(self, opponent) {
    const msgs = [];
    let bonus = 0;
    if (self.field.length <= 2) bonus = 5;
    const m1 = changeApproval(self, 7 + bonus);
    if (m1) msgs.push(m1);
    return msgs;
  },
  shinba_1(self, opponent) {
    const msgs = [];
    changeFunds(self, 6);
    msgs.push("政治資金+6億円を獲得！");
    self.shields.push("block_approval_down");
    msgs.push("次の相手ターンに受ける支持率低下を1回無効化！");
    return msgs;
  },
  shinba_2(self, opponent) {
    const msgs = [];
    self.nextTurnBonuses.costReduction += 2;
    const m1 = changeApproval(self, 6);
    if (m1) msgs.push(m1);
    msgs.push("自分の場の全カードの次ターンコスト-2億！");
    return msgs;
  },
  ushida_1(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(opponent, -8);
    if (m1) msgs.push(m1);
    changeFunds(self, 7);
    msgs.push("政治資金+7億円を獲得！");
    return msgs;
  },
  ushida_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 8);
    if (m1) msgs.push(m1);
    changeFunds(self, 4);
    msgs.push("政治資金+4億円を獲得！");
    if (Math.random() < 0.3) {
      const m2 = changeApproval(self, -3);
      if (m2) msgs.push(m2);
    }
    return msgs;
  },
  ito_1(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 10);
    if (m1) msgs.push(m1);
    self.nextTurnBonuses.approvalBonus = 2;
    msgs.push("【次ターン開始】自分の支持率+2%！");
    return msgs;
  },
  ito_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 9);
    if (m1) msgs.push(m1);
    const m2 = changeApproval(opponent, -3);
    if (m2) msgs.push(m2);
    return msgs;
  },

  // --- チームみらい ---
  anno_1(self, opponent) {
    const msgs = [];
    let bonus = 0;
    if (self.field.length >= 3) bonus = 4;
    const m1 = changeApproval(self, 6 + bonus);
    if (m1) msgs.push(m1);
    return msgs;
  },
  anno_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 5);
    if (m1) msgs.push(m1);
    return msgs;
  },
  takayama_1(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 4);
    if (m1) msgs.push(m1);
    return msgs;
  },
  takayama_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 7);
    if (m1) msgs.push(m1);
    return msgs;
  },
  muto_1(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(opponent, -5);
    if (m1) msgs.push(m1);
    const m2 = changeApproval(self, 5);
    if (m2) msgs.push(m2);
    return msgs;
  },
  muto_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 6);
    if (m1) msgs.push(m1);
    return msgs;
  },
  suda_1(self, opponent) {
    const msgs = [];
    if (opponent.field.length > 0) {
      const target = opponent.field[Math.floor(Math.random() * opponent.field.length)];
      target.disabled = true;
      msgs.push(`${target.name}の能力を次ターン封印！`);
    } else {
      msgs.push("相手の場にカードがなく空振り…");
    }
    return msgs;
  },
  suda_2(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(self, 5);
    if (m1) msgs.push(m1);
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
    const m1 = changeApproval(self, 5);
    if (m1) msgs.push(m1);
    const m2 = changeApproval(opponent, -3);
    if (m2) msgs.push(m2);
    return msgs;
  }
};

// オプション効果マップ
const OPTION_EFFECTS = {
  trump_tariff(self, opponent) {
    const msgs = [];
    const selfLoss = Math.floor(self.funds * 0.3);
    const oppLoss = Math.floor(opponent.funds * 0.3);
    changeFunds(self, -selfLoss);
    changeFunds(opponent, -oppLoss);
    msgs.push(`両者の政治資金が没収された！（自分-${selfLoss}億、相手-${oppLoss}億）`);
    return msgs;
  },
  kioku_ni_gozaimasen(self, opponent) {
    const msgs = [];
    self.shields.push("block_approval_down");
    self.skipNextDraw = true;
    msgs.push("次に受ける支持率低下を1回無効化！");
    msgs.push("ただし次のターンはドロー不可…");
    return msgs;
  },
  kenkin_party(self, opponent) {
    const msgs = [];
    changeFunds(self, 8);
    msgs.push("政治資金+8億円を獲得！");
    return msgs;
  },
  gaitou_enzetsu(self, opponent) {
    const msgs = [];
    const bonus = self.field.length >= 2 ? 8 : 4;
    const m1 = changeApproval(self, bonus);
    if (m1) msgs.push(m1);
    return msgs;
  },
  drill_hakai(self, opponent) {
    const msgs = [];
    self.shields.push("block_approval_down");
    changeFunds(self, -5);
    msgs.push("次の支持率低下を一度だけスキップ！");
    msgs.push("政治資金-5億円…");
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
    self.field.push(added);
    msgs.push(`${removed.name}を捨て、${added.name}を場に出した！`);
    return msgs;
  },
  toushu_touron(self, opponent) {
    const msgs = [];
    // 内部処理で判定、結果は「上がった」のみ表示
    const bonus = self.approval < opponent.approval ? 10 : 4;
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
  masukomi_taisaku(self, opponent) {
    const msgs = [];
    self.shields.push("block_approval_down");
    msgs.push("次の相手ターンに受ける支持率低下を1回無効化！");
    return msgs;
  },
  ouen_enzetsu(self, opponent) {
    const msgs = [];
    const politicianIdx = self.deck.findIndex(c => c.type === "politician");
    if (politicianIdx >= 0) {
      const drawn = self.deck.splice(politicianIdx, 1)[0];
      self.hand.push(drawn);
      msgs.push(`${drawn.name}を手札に加えた！`);
    } else {
      msgs.push("山札に政治家カードがなく空振り…");
    }
    return msgs;
  },
  kinkyuu_yoron(self, opponent) {
    const msgs = [];
    msgs.push(`あなたの現在の支持率: ${self.approval}%`);
    return msgs;
  },
  giinkaikan_furin(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(opponent, -8);
    if (m1) msgs.push(m1);
    const m2 = changeApproval(self, -3);
    if (m2) msgs.push(m2);
    return msgs;
  }
};

// 攻撃系の支持率低下にシールド/防御ボーナスを適用
function applyDefenses(target, amount) {
  if (amount >= 0) return amount; // 上昇は防御不要

  // シールドチェック（block_approval_down）
  const shieldIdx = target.shields.indexOf("block_approval_down");
  if (shieldIdx >= 0) {
    target.shields.splice(shieldIdx, 1);
    console.log("  シールド発動: 支持率低下を無効化");
    return 0;
  }

  // block_attack シールド
  const blockIdx = target.shields.indexOf("block_attack");
  if (blockIdx >= 0) {
    target.shields.splice(blockIdx, 1);
    console.log("  シールド発動: 攻撃を無効化");
    return 0;
  }

  // immune シールド
  const immuneIdx = target.shields.indexOf("immune");
  if (immuneIdx >= 0) {
    target.shields.splice(immuneIdx, 1);
    console.log("  シールド発動: 免疫で無効化");
    return 0;
  }

  // 防御ボーナス
  if (target.nextTurnBonuses.defenseBonus > 0) {
    const reduction = Math.floor(Math.abs(amount) * target.nextTurnBonuses.defenseBonus / 100);
    console.log(`  防御ボーナス: ${reduction}%軽減`);
    return amount + reduction;
  }

  // 攻撃軽減
  if (target.nextTurnBonuses.attackReduction > 0) {
    const red = target.nextTurnBonuses.attackReduction;
    target.nextTurnBonuses.attackReduction = 0;
    return amount + red;
  }

  return amount;
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

function startPlayerTurn() {
  const p = gameState.player;
  gameState.currentPlayer = "player";

  // リセット
  p.placedThisTurn = false;
  p.usedAbilities = {};
  p.usedOptionThisTurn = false;

  // disabled解除（前ターンで封印されたカードを復帰）
  p.field.forEach(c => { c.disabled = false; });

  // 次ターンボーナスの支持率ボーナスを適用
  if (p.nextTurnBonuses.approvalBonus) {
    changeApproval(p, p.nextTurnBonuses.approvalBonus);
    p.nextTurnBonuses.approvalBonus = 0;
  }

  // 次ターンボーナスのコスト軽減を転写してリセット（これで永久蓄積を防ぐ）
  p.currentTurnCostReduction = p.nextTurnBonuses.costReduction;
  p.nextTurnBonuses.costReduction = 0;

  // ① 資金フェーズ
  const bonus = p.nextTurnBonuses.fundBonus;
  const income = 3 + bonus;
  p.funds += income;
  p._fundsFlash = { dir: "up", delta: income };
  p.nextTurnBonuses.fundBonus = 0;
  console.log(`[ターン${gameState.turn}] プレイヤーのターン開始 - 資金+${income}億 (合計${p.funds}億)`);

  // ② ドローフェーズ
  let playerDrew = false;
  if (p.skipNextDraw) {
    console.log("  ドロースキップ");
    p.skipNextDraw = false;
  } else if (p.deck.length > 0) {
    const drawn = p.deck.shift();
    p.hand.push(drawn);
    console.log(`  ドロー: ${drawn.name}`);
    playerDrew = true;
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
  renderGame(); // ← ここでゲーム画面へ遷移（フラッシュなし）
  if (savedFundsFlash)    gameState.player._fundsFlash    = savedFundsFlash;
  if (savedApprovalFlash) gameState.player._approvalFlash = savedApprovalFlash;

  showTurnBanner(true, () => {
    renderGame(); // ← バナー後にフラッシュ発火
    if (playerDrew) {
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

function startCpuTurn() {
  const c = gameState.cpu;
  gameState.currentPlayer = "cpu";

  c.placedThisTurn = false;
  c.usedAbilities = {};
  c.usedOptionThisTurn = false;
  c.field.forEach(card => { card.disabled = false; });

  if (c.nextTurnBonuses.approvalBonus) {
    changeApproval(c, c.nextTurnBonuses.approvalBonus);
    c.nextTurnBonuses.approvalBonus = 0;
  }

  c.currentTurnCostReduction = c.nextTurnBonuses.costReduction;
  c.nextTurnBonuses.costReduction = 0;

  // ① 資金フェーズ
  const bonus = c.nextTurnBonuses.fundBonus;
  c.funds += 3 + bonus;
  c.nextTurnBonuses.fundBonus = 0;
  console.log(`[ターン${gameState.turn}] CPUのターン開始 - 資金+${3 + bonus}億 (合計${c.funds}億)`);

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
        cpuPhasePlace();
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
  if (!c.placedThisTurn && c.field.length < 3) {
    const idx = c.hand.findIndex(card => card.type === "politician");
    if (idx >= 0) {
      // アニメーション用に配置前の位置を取得
      const srcEl = document.querySelector("#cpu-hand .card-back");
      const destEl = document.querySelector("#cpu-field .field-empty-slot");

      const card = c.hand.splice(idx, 1)[0];
      c.field.push(card);
      c.placedThisTurn = true;
      console.log(`  CPU: ${card.name}を場に出した`);

      const afterPlace = () => {
        renderGame();
        // 着地アニメーション
        const cpuFieldCards = document.querySelectorAll("#cpu-field .card");
        const newCard = cpuFieldCards[cpuFieldCards.length - 1];
        if (newCard) newCard.classList.add("card-landing");
        showActionBanner([`${card.name} を場に出した！`], false, () => cpuPhaseAbilities());
      };

      if (srcEl && destEl) {
        animateCardFly(srcEl, destEl, false, afterPlace);
      } else {
        afterPlace();
      }
      return;
    }
  }
  cpuPhaseAbilities();
}

// フェーズ2: 能力の発動（1つずつ順番に）
function cpuPhaseAbilities() {
  const c = gameState.cpu;
  const cr = c.currentTurnCostReduction || 0;
  const abilityActions = [];
  for (const card of c.field) {
    if (c.usedAbilities[card.instanceId] || card.disabled) continue;
    const costs = card.abilities.map(a => Math.max(0, a.cost - cr));
    const afford0 = c.funds >= costs[0];
    const afford1 = c.funds >= costs[1];
    let chosen = -1;
    if (afford0 && afford1) {
      chosen = costs[1] >= costs[0] ? 1 : 0;
    } else if (afford1) {
      chosen = 1;
    } else if (afford0) {
      chosen = 0;
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
    if (c.funds < effectiveCost) {
      const altIdx = 1 - abilityIdx;
      const altCost = Math.max(0, action.card.abilities[altIdx].cost - cr);
      if (c.funds >= altCost) {
        abilityIdx = altIdx;
        effectiveCost = altCost;
      } else {
        idx++; continue;
      }
    }
    c.funds -= effectiveCost;
    c.usedAbilities[action.card.instanceId] = true;
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
  cpuPhaseOption();
}

// フェーズ3: オプションカード使用
function cpuPhaseOption() {
  const c = gameState.cpu;
  if (!c.usedOptionThisTurn) {
    const optionIdx = c.hand.findIndex(card => card.type === "option");
    if (optionIdx >= 0) {
      const card = c.hand.splice(optionIdx, 1)[0];
      c.discard.push(card);
      c.usedOptionThisTurn = true;
      const effectMsgs = executeEffect(card.effect, "cpu");
      console.log(`  CPU: ${card.name}を使用`);
      playOptionCardAnimation(card, null, true, () => {
        animateCardToDiscard(card, false, () => {
          renderGame(); // カード・捨て札アニメーション後に支持率・資金フラッシュを発火
          setTimeout(() => {
            showActionBanner(
              [`${card.name} を使用！`, ...effectMsgs],
              false,
              () => cpuCheckWinAndEnd()
            );
          }, 700);
        });
      });
      return;
    }
  }
  cpuCheckWinAndEnd();
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
  const srcRect = srcEl.getBoundingClientRect();
  const destRect = destEl.getBoundingClientRect();

  const clone = srcEl.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.left = srcRect.left + "px";
  clone.style.top = srcRect.top + "px";
  clone.style.width = srcRect.width + "px";
  clone.style.height = srcRect.height + "px";
  clone.style.margin = "0";
  clone.style.zIndex = "500";
  clone.style.pointerEvents = "none";
  clone.style.transition = "none";
  clone.style.transform = "none";
  document.body.appendChild(clone);

  clone.getBoundingClientRect(); // force layout

  requestAnimationFrame(() => {
    clone.style.transition = [
      "left 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      "top 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      "width 0.33s ease",
      "height 0.33s ease",
      "box-shadow 0.38s ease",
      "transform 0.38s ease"
    ].join(", ");
    clone.style.left = destRect.left + "px";
    clone.style.top = destRect.top + "px";
    clone.style.width = destRect.width + "px";
    clone.style.height = destRect.height + "px";
    clone.style.transform = "scale(1.04)";
    clone.style.boxShadow = isPlayer
      ? "0 8px 28px rgba(74, 171, 240, 0.65)"
      : "0 8px 28px rgba(240, 160, 32, 0.65)";
  });

  setTimeout(() => {
    clone.remove();
    onDone();
  }, 410);
}

// 手札から政治家カードを場に出す
function playCardToField(handIndex) {
  const p = gameState.player;
  const card = p.hand[handIndex];

  if (!card || card.type !== "politician") return false;
  if (p.placedThisTurn) return false;
  if (p.field.length >= 3) return false;

  p.hand.splice(handIndex, 1);
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
  if (p.usedAbilities[card.instanceId]) return;

  const ability = card.abilities[abilityIndex];
  const effectiveCost = Math.max(0, ability.cost - (p.currentTurnCostReduction || 0));
  if (p.funds < effectiveCost) return;

  // 確認ダイアログ表示
  showConfirmDialog(card.name, ability.name, ability.effectText || "", ability.description || "", effectiveCost, () => {
    p.funds -= effectiveCost;
    p.usedAbilities[card.instanceId] = abilityIndex + 1; // 1 or 2 (常にtruthyで0を避ける)
    console.log(`[能力発動] ${card.name}: ${ability.name}（コスト${effectiveCost}億）`);
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

  const cardEls = container.querySelectorAll(".card");
  const cardEl = cardEls[fieldIndex];
  if (!cardEl) { callback(); return; }

  // 元カードを一瞬発光させる
  cardEl.classList.add("card-ability-glow");
  cardEl.addEventListener("animationend", () => cardEl.classList.remove("card-ability-glow"), { once: true });

  const rect = cardEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

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

  // カードのクローン
  const clone = cardEl.cloneNode(true);
  const ps = side === "cpu" ? gameState.cpu : gameState.player;
  const cardData = ps.field[fieldIndex];
  if (cardData && cardData.image) {
    clone.style.backgroundImage = `url(${cardData.image})`;
    clone.classList.add("has-image");
  }
  Object.assign(clone.style, {
    position: "fixed",
    left: rect.left + "px", top: rect.top + "px",
    width: rect.width + "px", height: rect.height + "px",
    margin: "0", zIndex: "1000", pointerEvents: "none",
    transformOrigin: "center center", transition: "none",
  });
  document.body.appendChild(clone);

  const targetLine = clone.querySelectorAll(".card-ability-line")[abilityIndex];

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
    clone.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
    clone.style.boxShadow = "0 0 60px 16px rgba(255,220,50,0.35)";
  }));

  // Step 2: 能力行グロー（拡大完了後、3秒静止）
  timers.push(setTimeout(() => {
    if (finished) return;
    clone.style.boxShadow = "0 0 80px 24px rgba(255,220,50,0.6)";
    if (targetLine) {
      targetLine.style.transition = "background 0.2s, box-shadow 0.2s, color 0.2s";
      targetLine.style.background = "rgba(255,220,50,0.55)";
      targetLine.style.boxShadow = "0 0 16px 6px rgba(255,220,50,0.9)";
      targetLine.style.color = "#1a1a00";
      targetLine.style.borderRadius = "3px";
    }
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

  // カード要素を新規作成（backgroundImage を直接設定して非同期ロード競合を回避）
  const clone = createCardElement(card);
  if (card.image) {
    clone.style.backgroundImage = `url(${card.image})`;
    clone.classList.add("has-image");
  }
  Object.assign(clone.style, {
    position: "fixed",
    left: rect.left + "px", top: rect.top + "px",
    width: rect.width + "px", height: rect.height + "px",
    margin: "0", zIndex: "1000", pointerEvents: "none",
    transformOrigin: "center center", transition: "none",
  });
  document.body.appendChild(clone);

  const targetDesc = clone.querySelector(".card-desc");

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
    clone.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
    clone.style.boxShadow = "0 0 60px 16px rgba(255,220,50,0.35)";
  }));

  // Step 2: カード説明グロー（拡大完了後、3秒静止）
  timers.push(setTimeout(() => {
    if (finished) return;
    clone.style.boxShadow = "0 0 80px 24px rgba(255,220,50,0.6)";
    if (targetDesc) {
      targetDesc.style.transition = "background 0.2s, box-shadow 0.2s, color 0.2s";
      targetDesc.style.background = "rgba(255,220,50,0.55)";
      targetDesc.style.boxShadow = "0 0 16px 6px rgba(255,220,50,0.9)";
      targetDesc.style.color = "#1a1a00";
      targetDesc.style.borderRadius = "3px";
    }
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
    const msgs = executeEffect(card.effect, "player");
    playOptionCardAnimation(card, cardRect, false, () => {
      animateCardToDiscard(card, true, () => {
        renderGame(); // カード・捨て札アニメーション後に支持率・資金フラッシュを発火
        setTimeout(() => {
          showActionBanner([`「${card.name}」使用！`, ...msgs], true, () => {
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

// 情勢調査オーバーレイ
function showSurveyOverlay(onClose) {
  const pa = gameState.player.approval;
  const ca = gameState.cpu.approval;
  showOverlay(`
    <h2>情勢調査結果</h2>
    <div class="survey-bar">
      <div class="survey-row">
        <span>あなた:</span>
        <div class="bar-container"><div class="bar bar-player" style="width:0%"></div></div>
        <span>${pa}%</span>
      </div>
      <div class="survey-row">
        <span>CPU:</span>
        <div class="bar-container"><div class="bar bar-cpu" style="width:0%"></div></div>
        <span>${ca}%</span>
      </div>
    </div>
    <div class="overlay-buttons">
      <button id="survey-ok" class="overlay-btn btn-confirm">続ける</button>
    </div>
  `);
  // オーバーレイコンテンツ スライドイン
  const content = document.getElementById("overlay-content");
  content.classList.remove("survey-overlay-enter");
  void content.offsetWidth;
  content.classList.add("survey-overlay-enter");
  // バーを0%から実値へアニメーション（スライドイン後）
  setTimeout(() => {
    const barPlayer = document.querySelector(".bar-player");
    const barCpu = document.querySelector(".bar-cpu");
    if (barPlayer) barPlayer.style.width = `${pa}%`;
    if (barCpu) barCpu.style.width = `${ca}%`;
  }, 200);
  document.getElementById("survey-ok").addEventListener("click", () => {
    hideOverlay();
    if (onClose) onClose();
  });
}

// 終了画面オーバーレイ
function showFinishOverlay(result) {
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

  // 最終支持率を履歴に追記（ゲーム途中終了のケースに対応）
  const hist = gameState.approvalHistory;
  const lastTurn = hist.length > 0 ? hist[hist.length - 1].turn : -1;
  if (lastTurn !== gameState.turn) {
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
    svg += `<line x1="${pl}" y1="${y}" x2="${pl + cw}" y2="${y}" stroke="rgba(255,255,255,${a === 50 ? 0.18 : 0.08})" stroke-width="1"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
    svg += `<text x="${pl - 4}" y="${y + 4}" text-anchor="end" font-size="9" fill="#555">${a}%</text>`;
  });

  // X軸ラベル（最大7本）
  const step = Math.max(1, Math.ceil(hist.length / 7));
  hist.forEach((d, i) => {
    if (i % step === 0 || i === hist.length - 1) {
      svg += `<text x="${px(d.turn)}" y="${H - 6}" text-anchor="middle" font-size="9" fill="#555">${d.turn}T</text>`;
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
  const img = new Image();
  img.src = card.image;
  img.onload = () => {
    imageDiv.style.backgroundImage = `url(${card.image})`;
  };
  img.onerror = () => {
    imageDiv.classList.add("no-image");
    imageDiv.textContent = card.name;
  };

  // 政治家カード: 画像上に白半透明枠で能力を配置
  let infoPanel = null;
  if (card.type === "politician" && card.abilities) {
    const abilityOverlay = document.createElement("div");
    abilityOverlay.className = "zoom-ability-overlay";

    const isFieldPlayer = context === "field";
    const isCpuView = context === "view";
    const p = gameState.player;
    const costReduction = isFieldPlayer ? (p.currentTurnCostReduction || 0) : 0;

    // 相手カード閲覧時: 能力詳細パネルを用意
    if (isCpuView) {
      infoPanel = document.createElement("div");
      infoPanel.className = "card-zoom-info";
      infoPanel.innerHTML = `<div class="card-zoom-hint">能力をクリックで詳細表示</div>`;
    }

    // 封印中: 全能力を非表示にして通知のみ
    if (isFieldPlayer && card.disabled) {
      const notice = document.createElement("div");
      notice.className = "ability-disabled-notice";
      notice.textContent = "封印中 — このカードは使用できません";
      abilityOverlay.appendChild(notice);
    } else {
      const usedVal = isFieldPlayer ? p.usedAbilities[card.instanceId] : 0;
      const usedIdx = usedVal ? usedVal - 1 : -1; // 使用した能力のインデックス（0 or 1）、未使用は-1

      card.abilities.forEach((ability, aIdx) => {
        const effectiveCost = Math.max(0, ability.cost - costReduction);

        // 使用済みカード: 使った能力だけ表示、それ以外は非表示
        if (isFieldPlayer && usedIdx >= 0 && aIdx !== usedIdx) return;

        const item = document.createElement("div");
        item.className = "zoom-ability-item";

        // スタイル判定
        if (isFieldPlayer) {
          if (usedIdx >= 0) {
            // 使用済み能力として表示
            item.classList.add("ability-used");
          } else if (p.funds < effectiveCost) {
            // 資金不足: グレーアウト（非表示にはしない）
            item.classList.add("inactive");
          }
        }

        const nameRow = document.createElement("div");
        nameRow.className = "zoom-ability-name";
        nameRow.innerHTML = `${ability.name}（${fundsToHtml(effectiveCost)}）`;
        item.appendChild(nameRow);

        if (ability.effectText) {
          const effectRow = document.createElement("div");
          effectRow.className = "zoom-ability-effect";
          effectRow.textContent = ability.effectText;
          item.appendChild(effectRow);
        }

        // 場のプレイヤーカード: クリックで確認ダイアログ（未使用・資金十分時のみ）
        if (isFieldPlayer && usedIdx < 0 && p.funds >= effectiveCost) {
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            overlay.remove();
            useAbility(index, aIdx);
          });
        }

        // 相手カード閲覧: クリックで能力名・効果・説明を表示
        if (isCpuView && infoPanel) {
          item.style.cursor = "pointer";
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            abilityOverlay.querySelectorAll(".zoom-ability-item").forEach(el => el.classList.remove("selected"));
            item.classList.add("selected");
            infoPanel.innerHTML = [
              `<div class="card-zoom-name">${ability.name}</div>`,
              ability.effectText   ? `<div class="card-zoom-effect">${ability.effectText}</div>`   : "",
              ability.description  ? `<div class="card-zoom-desc">${ability.description}</div>`    : "",
            ].join("");
          });
        }

        abilityOverlay.appendChild(item);
      });
    }

    imageDiv.appendChild(abilityOverlay);
  }

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
      <h2>手札が上限を超えています</h2>
      <p>捨てるカードを選んでください（あと${remaining}枚）</p>
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

// 政治資金を💰絵文字で表現するヘルパー
// 10億ごとに大きな💰(内側に"10")、1億ごとに💰
function fundsToHtml(amount) {
  if (amount <= 0) return '<span class="funds-zero">—</span>';
  const groups = Math.floor(amount / 10);
  const singles = amount % 10;
  let html = '';
  for (let i = 0; i < groups; i++) {
    html += '<span class="funds-big">💰<span class="funds-num">10</span></span>';
  }
  for (let i = 0; i < singles; i++) {
    html += '💰';
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

// 政治資金変動フローティングテキスト
function showFundsDelta(delta, x, y, dir) {
  const el = document.createElement("div");
  el.className = `funds-delta funds-delta-${dir}`;
  el.textContent = (delta > 0 ? "+" : "") + delta + "億";
  el.style.left = x + "px";
  el.style.top = y + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// 支持率変動フローティングテキスト
function showApprovalDelta(delta, x, y, dir) {
  const el = document.createElement("div");
  el.className = `approval-delta approval-delta-${dir}`;
  el.textContent = (delta > 0 ? "+" : "") + delta + "%";
  el.style.left = x + "px";
  el.style.top = y + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
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
  renderFieldCards("cpu-field", gameState.cpu.field, false);
  renderDeckSlot("cpu-deck", gameState.cpu.deck.length);
  renderDiscardSlot("cpu-discard", gameState.cpu.discard);
  renderActiveEffects("cpu-deck", gameState.cpu, "before");

  // プレイヤー情報
  document.getElementById("player-party").textContent = gameState.player.party || "???";
  document.getElementById("player-funds").innerHTML = fundsToHtml(gameState.player.funds);
  if (gameState.player._fundsFlash) {
    const { dir, delta } = gameState.player._fundsFlash;
    delete gameState.player._fundsFlash;
    requestAnimationFrame(() => {
      const fundsEl = document.getElementById("player-funds");
      const rect = fundsEl.getBoundingClientRect();
      showFundsDelta(delta, rect.right + 6, rect.top + rect.height / 2, dir);
    });
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
  renderActiveEffects("player-deck", gameState.player);

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
  back.textContent = deckCount > 0 ? "🂠" : "";
  const countEl = document.createElement("div");
  countEl.className = "deck-count";
  countEl.textContent = `${deckCount}枚`;
  slot.appendChild(back);
  slot.appendChild(countEl);
}

function renderDiscardSlot(slotId, pile) {
  const slot = document.getElementById(slotId);
  if (!slot) return;
  slot.innerHTML = "";

  const label = document.createElement("div");
  label.className = "discard-label";
  label.textContent = "捨て札";
  slot.appendChild(label);

  if (pile.length === 0) {
    const empty = document.createElement("div");
    empty.className = "discard-slot-empty";
    empty.textContent = "－";
    slot.appendChild(empty);
    return;
  }

  const topCard = pile[pile.length - 1];
  const preview = document.createElement("div");
  preview.className = `discard-slot-preview ${topCard.type === "politician" ? "discard-slot-politician" : "discard-slot-option"}`;
  preview.textContent = topCard.name;
  slot.appendChild(preview);

  const countEl = document.createElement("div");
  countEl.className = "deck-count";
  countEl.textContent = `${pile.length}枚`;
  slot.appendChild(countEl);

  slot.style.cursor = "pointer";
  slot.onclick = () => showDiscardOverlay(pile, slotId === "player-discard");
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

  const list = document.createElement("div");
  list.className = "discard-overlay-list";

  [...pile].reverse().forEach(card => {
    const item = document.createElement("div");
    item.className = `discard-overlay-item ${card.type === "politician" ? "card-politician" : "card-option"}`;

    let html = `<div class="discard-overlay-name">${card.name}</div>`;
    if (card.type === "politician" && card.abilities) {
      html += card.abilities.map(ab =>
        `<div class="discard-overlay-ability"><span class="doa-name">${ab.name}</span><span class="doa-cost">${ab.cost}億</span><span class="doa-effect">${ab.effectText || ""}</span></div>`
      ).join("");
    } else if (card.description) {
      html += `<div class="discard-overlay-desc">${card.description}</div>`;
    }
    item.innerHTML = html;
    list.appendChild(item);
  });
  box.appendChild(list);

  const closeBtn = document.createElement("button");
  closeBtn.className = "card-zoom-close";
  closeBtn.textContent = "閉じる";
  closeBtn.addEventListener("click", () => overlay.remove());
  box.appendChild(closeBtn);

  overlay.appendChild(box);
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// 特殊効果バッジを描画。position="before" で先頭挿入（CPU用）、省略で末尾追加（プレイヤー用）
function renderActiveEffects(slotId, ps, position = "after") {
  const slot = document.getElementById(slotId);
  if (!slot) return;

  const tags = []; // { label, type }

  // シールド
  ps.shields.forEach(s => {
    if (s === "block_approval_down") tags.push({ label: "🛡 支持率低下を1回無効化", type: "shield" });
    if (s === "block_attack")        tags.push({ label: "🛡 攻撃を1回無効化",       type: "shield" });
  });

  // 次ターンボーナス
  const nb = ps.nextTurnBonuses;
  if (nb.costReduction   > 0) tags.push({ label: `🔧 次ターン コスト-${nb.costReduction}億`,    type: "buff"   });
  if (nb.fundBonus       > 0) tags.push({ label: `💰 次ターン 資金+${nb.fundBonus}億`,           type: "buff"   });
  if (nb.approvalBonus   > 0) tags.push({ label: `📈 次ターン 支持率+${nb.approvalBonus}%`,      type: "buff"   });
  if (nb.approvalBonus   < 0) tags.push({ label: `📉 次ターン 支持率${nb.approvalBonus}%`,       type: "debuff" });
  if (nb.attackReduction > 0) tags.push({ label: `🛡 次ターン ダメージ-${nb.attackReduction}%`,  type: "shield" });

  // このターン限定コスト軽減
  if (ps.currentTurnCostReduction > 0) {
    tags.push({ label: `⚡ このターン コスト-${ps.currentTurnCostReduction}億`, type: "current" });
  }

  if (tags.length === 0) return;

  const panel = document.createElement("div");
  panel.className = "active-effects";
  tags.forEach(({ label, type }) => {
    const el = document.createElement("div");
    el.className = `effect-tag effect-${type}`;
    el.textContent = label;
    panel.appendChild(el);
  });
  if (position === "before") {
    slot.insertBefore(panel, slot.firstChild);
  } else {
    slot.appendChild(panel);
  }
}

function renderFieldCards(containerId, cards, isPlayer) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let idx = 0; idx < 3; idx++) {
    if (idx < cards.length) {
      const card = cards[idx];
      const el = createCardElement(card);
      // 小さいカード上に能力名+コストを表示
      if (card.type === "politician" && card.abilities) {
        const abilitySummary = document.createElement("div");
        abilitySummary.className = "card-ability-summary";
        const costReduction = isPlayer ? (gameState.player.currentTurnCostReduction || 0) : 0;
        card.abilities.forEach(ability => {
          const line = document.createElement("div");
          line.className = "card-ability-line";
          line.textContent = ability.name;
          abilitySummary.appendChild(line);
        });
        el.appendChild(abilitySummary);
      }
      el.addEventListener("click", () => {
        clearHandSelection();
        const isMobile = window.matchMedia("(pointer: coarse)").matches;
        if (isPlayer && gameState.currentPlayer === "player") {
          if (isMobile) {
            showCardActionMenu(card, idx, true, el);
          } else {
            showCardZoom(card, "field", idx);
          }
        } else {
          showCardZoom(card, "view");
        }
      });
      container.appendChild(el);
    } else {
      const empty = document.createElement("div");
      empty.className = "field-empty-slot";
      // プレイヤーの場: 未配置ならドロップターゲットにする
      if (isPlayer && gameState.currentPlayer === "player" && !gameState.player.placedThisTurn) {
        empty.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          empty.classList.add("drag-over");
        });
        empty.addEventListener("dragleave", () => empty.classList.remove("drag-over"));
        empty.addEventListener("drop", (e) => {
          e.preventDefault();
          empty.classList.remove("drag-over");
          const handIdx = parseInt(e.dataTransfer.getData("text/plain"), 10);
          if (isNaN(handIdx)) return;
          const draggedCard = gameState.player.hand[handIdx];
          if (!draggedCard || draggedCard.type !== "politician") return; // オプションカードは弾く
          const srcEl = document.querySelectorAll("#player-hand .card")[handIdx];
          if (srcEl) {
            animateCardFly(srcEl, empty, true, () => playCardToField(handIdx));
          } else {
            playCardToField(handIdx);
          }
        });
      }
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
    el.textContent = "🂠";
    container.appendChild(el);
  });
}

let _handTooltipEl = null;
let selectedHandIndex = null; // タップ選択中の手札インデックス

function showHandTooltip(card, cardEl) {
  hideHandTooltip();
  const tip = document.createElement("div");
  tip.className = "card-tooltip";

  if (card.type === "politician" && card.abilities) {
    let html = `<div class="tip-card-name">${card.name}</div>`;
    card.abilities.forEach(ab => {
      html += `<div class="tip-ability">
        <span class="tip-ability-name">${ab.name}</span>
        <span class="tip-ability-cost">${ab.cost}億</span>
        <div class="tip-ability-effect">${ab.effectText || ""}</div>
      </div>`;
    });
    tip.innerHTML = html;
  } else {
    tip.innerHTML = `<div class="tip-card-name">${card.name}</div>
      ${card.effectText ? `<div class="tip-ability-effect">${card.effectText}</div>` : ""}
      ${card.description ? `<div class="tip-desc">${card.description}</div>` : ""}`;
  }

  document.body.appendChild(tip);
  _handTooltipEl = tip;

  const rect = cardEl.getBoundingClientRect();
  const tipH = tip.offsetHeight;
  const tipW = tip.offsetWidth;
  let top = rect.top - tipH - 10;
  if (top < 4) top = rect.bottom + 10;
  let left = rect.left + rect.width / 2 - tipW / 2;
  left = Math.max(4, Math.min(left, window.innerWidth - tipW - 4));
  tip.style.top = `${top}px`;
  tip.style.left = `${left}px`;
}

function hideHandTooltip() {
  if (_handTooltipEl) {
    _handTooltipEl.remove();
    _handTooltipEl = null;
  }
}

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
      hideHandTooltip();
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
      const srcEl = document.querySelectorAll("#player-hand .card")[idx];
      srcEl
        ? animateCardFly(srcEl, slot, true, () => playCardToField(idx))
        : playCardToField(idx);
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
        clearHandSelection();
        const srcEl = document.querySelectorAll("#player-hand .card")[handIdx];
        if (srcEl) {
          animateCardFly(srcEl, slot, true, () => playCardToField(handIdx));
        } else {
          playCardToField(handIdx);
        }
      };
      slot._slotTapHandler = handler;
      slot.addEventListener("click", handler);
    });
  }
}

// フィールドカードタップ時のアクションメニュー
function showCardActionMenu(card, fieldIndex, isPlayer, anchorEl) {
  document.querySelectorAll(".card-action-menu").forEach(el => el.remove());

  const menu = document.createElement("div");
  menu.className = "card-action-menu";

  if (isPlayer && gameState.currentPlayer === "player" && card.type === "politician") {
    const p = gameState.player;
    const costReduction = p.currentTurnCostReduction || 0;
    const usedVal = p.usedAbilities[card.instanceId];

    if (card.disabled) {
      const msg = document.createElement("div");
      msg.className = "cam-status-msg";
      msg.textContent = "封印中";
      menu.appendChild(msg);
    } else if (usedVal) {
      const msg = document.createElement("div");
      msg.className = "cam-status-msg";
      msg.textContent = "使用済み";
      menu.appendChild(msg);
    } else if (card.abilities) {
      card.abilities.forEach((ability, aIdx) => {
        const effectiveCost = Math.max(0, ability.cost - costReduction);
        const canUse = p.funds >= effectiveCost;
        const btn = document.createElement("button");
        btn.className = "cam-btn" + (canUse ? "" : " cam-btn-disabled");
        const nameSpan = document.createElement("span");
        nameSpan.textContent = ability.name;
        const costSpan = document.createElement("span");
        costSpan.className = "cam-cost";
        costSpan.textContent = effectiveCost + "億";
        btn.appendChild(nameSpan);
        btn.appendChild(costSpan);
        if (canUse) {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.remove();
            useAbility(fieldIndex, aIdx);
          });
        }
        menu.appendChild(btn);
      });
    }
  }

  const detailBtn = document.createElement("button");
  detailBtn.className = "cam-btn cam-btn-detail";
  detailBtn.textContent = "詳細確認";
  detailBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.remove();
    showCardZoom(card, isPlayer && gameState.currentPlayer === "player" ? "field" : "view", fieldIndex);
  });
  menu.appendChild(detailBtn);

  // いったん非表示で追加してサイズ計測
  menu.style.visibility = "hidden";
  document.body.appendChild(menu);
  const menuRect = menu.getBoundingClientRect();
  const cardRect = anchorEl.getBoundingClientRect();

  let left = cardRect.left + cardRect.width / 2;
  let top = cardRect.top - menuRect.height - 10;
  if (top < 8) top = cardRect.bottom + 10;

  const halfW = menuRect.width / 2;
  left = Math.max(halfW + 8, Math.min(window.innerWidth - halfW - 8, left));
  top  = Math.max(8, Math.min(window.innerHeight - menuRect.height - 8, top));

  menu.style.left = left + "px";
  menu.style.top  = top  + "px";
  menu.style.visibility = "";

  // 外側クリックで閉じる
  const dismiss = (e) => {
    if (!menu.contains(e.target)) {
      menu.remove();
      document.removeEventListener("click", dismiss, true);
    }
  };
  setTimeout(() => document.addEventListener("click", dismiss, true), 0);
}

function renderHand() {
  const container = document.getElementById("player-hand");
  container.innerHTML = "";
  container.classList.toggle("hand-locked", gameState.currentPlayer !== "player");
  gameState.player.hand.forEach((card, idx) => {
    const el = createCardElement(card);
    // 手札の政治家カードにも能力サマリーを表示
    if (card.type === "politician" && card.abilities) {
      const abilitySummary = document.createElement("div");
      abilitySummary.className = "card-ability-summary";
      card.abilities.forEach(ability => {
        const line = document.createElement("div");
        line.className = "card-ability-line";
        line.textContent = ability.name;
        abilitySummary.appendChild(line);
      });
      el.appendChild(abilitySummary);
    }
    const canPlace = card.type === "politician"
      && gameState.currentPlayer === "player"
      && !gameState.player.placedThisTurn
      && gameState.player.field.length < 3;
    const canUseOption = card.type === "option"
      && gameState.currentPlayer === "player"
      && !gameState.player.usedOptionThisTurn;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      // モバイル: タップ選択方式
      // 選択中であれば選択状態を復元
      if (selectedHandIndex === idx) el.classList.add("card-selected");

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        hideHandTooltip();
        if (gameState.currentPlayer !== "player") {
          showCardZoom(card, "view");
          return;
        }
        if (canUseOption && !canPlace) {
          // オプション: タップで即使用
          clearHandSelection();
          useOptionCard(idx);
        } else if (canPlace) {
          // 政治家: タップ選択切り替え
          if (selectedHandIndex === idx) {
            clearHandSelection();
          } else {
            selectHandCard(idx, el, canPlace);
          }
        } else {
          showCardZoom(card, "view");
        }
      });
    } else {
      // デスクトップ: ホバーツールチップ + クリック詳細 + ドラッグ操作
      el.addEventListener("mouseenter", () => showHandTooltip(card, el));
      el.addEventListener("mouseleave", hideHandTooltip);
      let _dragged = false;
      el.addEventListener("click", () => {
        if (_dragged) return;
        hideHandTooltip();
        if (gameState.currentPlayer !== "player") return;
        showCardZoom(card, "view");
      });
      if (canPlace || canUseOption) {
        el.draggable = true;
        el.addEventListener("dragstart", (e) => {
          _dragged = true;
          e.dataTransfer.setData("text/plain", String(idx));
          e.dataTransfer.effectAllowed = "move";
          hideHandTooltip();
          setTimeout(() => el.classList.add("dragging"), 0);
          if (canUseOption) showOptionDropZone(idx);
        });
        el.addEventListener("dragend", () => {
          el.classList.remove("dragging");
          document.querySelectorAll(".field-empty-slot.drag-over")
            .forEach(s => s.classList.remove("drag-over"));
          hideOptionDropZone();
          setTimeout(() => { _dragged = false; }, 0);
        });
      }
    }
    container.appendChild(el);
  });

  // モバイルのみファン効果を適用
  if (window.matchMedia("(pointer: coarse)").matches) {
    applyHandFan(container);
  }
}

// 手札ファン（扇形）レイアウト
function applyHandFan(container) {
  const cards = [...container.querySelectorAll(".card")];
  const n = cards.length;
  cards.forEach((card, i) => {
    if (n < 2) {
      card.style.transform = "";
      card.style.marginLeft = "";
      card.style.zIndex = "";
      return;
    }
    const t = (i / (n - 1)) - 0.5;          // -0.5 〜 0.5
    const angle = t * Math.min(14, n * 3);   // 枚数に応じた最大角度
    const yOffset = Math.abs(t) * 10;        // 端ほど下がる
    card.style.transform = `rotate(${angle}deg) translateY(${yOffset}px)`;
    card.style.transformOrigin = "bottom center";
    card.style.marginLeft = i === 0 ? "0" : "-8px";
    card.style.zIndex = String(Math.round((1 - Math.abs(t)) * 10)); // 中央が前面
  });
}

function createCardElement(card) {
  const el = document.createElement("div");
  el.className = `card card-${card.type}`;
  el.dataset.instanceId = card.instanceId;

  // 画像のフォールバック
  const img = new Image();
  img.src = card.image;
  img.onload = () => {
    el.style.backgroundImage = `url(${card.image})`;
    el.classList.add("has-image");
  };
  img.onerror = () => {
    el.classList.add("no-image");
  };

  const nameLabel = document.createElement("div");
  nameLabel.className = "card-name";
  nameLabel.textContent = card.name;
  el.appendChild(nameLabel);

  if (card.type === "option") {
    const descLabel = document.createElement("div");
    descLabel.className = "card-desc";
    descLabel.textContent = card.description;
    el.appendChild(descLabel);
  }

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
  initGame(party);
}

// ============================================================
// 初期化
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".party-btn").forEach(btn => {
    btn.addEventListener("click", () => selectParty(btn.dataset.party));
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
