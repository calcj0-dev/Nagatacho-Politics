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
        effectText: "支持率+12%、【次ターン】相手の攻撃効果×1.5",
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
        effectText: "【次ターン】相手の攻撃を無効化、支持率-3%、政治資金+2億",
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
        effectText: "政治資金+4億、【次ターン】相手の攻撃-4%",
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
        effectText: "政治資金+6億、【次ターン】相手の攻撃を50%軽減",
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
        effectText: "支持率+4%、相手の支持率-2%",
        description: "多様性を推進し共感を獲得",
        cost: 4,
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
    effectDescription: "相手からの支持率低下を一度だけ無効化。ただし効果発動後の自分のターンにドロー不可",
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
    effectDescription: "次の支持率が下がるイベントを一度だけスキップ。ただし政治資金-5億",
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
    effectDescription: "次の相手のターンで受ける支持率減少を無効化",
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

function initGame(playerParty, playerInitialCardId) {
  // プレイヤー側
  const playerCards = buildDeck(playerParty);
  const initialCard = playerCards.politicians.find(c => c.id === playerInitialCardId);
  const remainingPoliticians = playerCards.politicians.filter(c => c.instanceId !== initialCard.instanceId);

  gameState.player = createPlayerState();
  gameState.player.party = playerParty;
  gameState.player.field = [initialCard];
  gameState.player.deck = shuffleArray([...remainingPoliticians, ...playerCards.options]);
  gameState.player.hand = gameState.player.deck.splice(0, 3);

  // CPU側: プレイヤーと異なる政党からランダム選択
  const cpuParties = PARTIES.filter(p => p !== playerParty);
  const cpuParty = cpuParties[Math.floor(Math.random() * cpuParties.length)];
  const cpuCards = buildDeck(cpuParty);
  const cpuInitial = cpuCards.politicians[Math.floor(Math.random() * cpuCards.politicians.length)];
  const cpuRemaining = cpuCards.politicians.filter(c => c.instanceId !== cpuInitial.instanceId);

  gameState.cpu = createPlayerState();
  gameState.cpu.party = cpuParty;
  gameState.cpu.field = [cpuInitial];
  gameState.cpu.deck = shuffleArray([...cpuRemaining, ...cpuCards.options]);
  gameState.cpu.hand = gameState.cpu.deck.splice(0, 3);

  gameState.turn = 1;
  gameState.currentPlayer = "player";
  gameState.phase = "playing";

  console.log("[initGame] ゲーム開始");
  console.log(`  プレイヤー: ${playerParty}, 場: ${initialCard.name}`);
  console.log(`  CPU: ${cpuParty}, 場: ${cpuInitial.name}`);
  logState();

  startPlayerTurn();
}

// ============================================================
// 効果処理
// ============================================================

// 支持率変更（クランプ付き）- 変動メッセージを返す
function changeApproval(player, amount) {
  const before = player.approval;
  player.approval = clamp(player.approval + amount, 0, 100);
  const after = player.approval;
  const who = player === gameState.player ? "あなた" : "相手";
  if (after > before) return `${who}の支持率が上がった！`;
  if (after < before) return `${who}の支持率が下がった…`;
  return null;
}

// 資金変更
function changeFunds(player, amount) {
  player.funds = Math.max(0, player.funds + amount);
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
    // 【フェーズ4】攻撃ダメージ計算時に attackMultiplier を適用予定
    opponent.nextTurnBonuses.attackMultiplier = 1.5;
    msgs.push("【次ターン】相手の攻撃効果×1.5！");
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
    // 【フェーズ4】applyDefenses() 統合後に block_attack シールドが機能予定
    self.shields.push("block_attack");
    const m1 = changeApproval(self, -3);
    if (m1) msgs.push(m1);
    changeFunds(self, 2);
    msgs.push("政治資金+2億円を獲得！");
    msgs.push("【次ターン】相手の攻撃を無効化！");
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
    msgs.push("【次ターン】相手の攻撃-4%！");
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
    // 【フェーズ4】applyDefenses() 統合後に defenseBonus が機能予定
    self.nextTurnBonuses.defenseBonus = 50;
    msgs.push("【次ターン】相手の攻撃を50%軽減！");
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
    const m1 = changeApproval(self, 4);
    if (m1) msgs.push(m1);
    const m2 = changeApproval(opponent, -2);
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
    msgs.push("相手からの支持率低下を一度だけ無効化！");
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
    msgs.push("次の相手のターンで受ける支持率減少を無効化！");
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
  p.funds += 3 + bonus;
  p.nextTurnBonuses.fundBonus = 0;
  console.log(`[ターン${gameState.turn}] プレイヤーのターン開始 - 資金+${3 + bonus}億 (合計${p.funds}億)`);

  // ② ドローフェーズ
  if (p.skipNextDraw) {
    console.log("  ドロースキップ");
    p.skipNextDraw = false;
  } else if (p.deck.length > 0) {
    const drawn = p.deck.shift();
    p.hand.push(drawn);
    console.log(`  ドロー: ${drawn.name}`);
  } else {
    console.log("  山札なし - ドロー不可");
  }

  // ③ メインフェーズ: UI操作待ち
  renderGame();
  setMainPhaseUI(true);
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
  if (c.skipNextDraw) {
    c.skipNextDraw = false;
  } else if (c.deck.length > 0) {
    const drawn = c.deck.shift();
    c.hand.push(drawn);
    console.log(`  CPUドロー: ${drawn.name}`);
  }

  renderGame();

  // 「CPU思考中...」バナー → メインフェーズへ
  const thinkingBanner = document.createElement("div");
  thinkingBanner.id = "cpu-thinking";
  thinkingBanner.textContent = "CPU 思考中...";
  document.body.appendChild(thinkingBanner);

  setTimeout(() => {
    thinkingBanner.remove();
    cpuPhasePlace();
  }, 900);
}

// CPUアクションバナーを表示して onDone を呼ぶ（ノンブロッキング）
// isPlayer=true → 青系(プレイヤー) / false → 橙系(CPU)
function showActionBanner(lines, isPlayer, onDone) {
  let banner = document.getElementById("action-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "action-banner";
    document.body.appendChild(banner);
  }
  banner.className = isPlayer ? "banner-player" : "banner-cpu";
  banner.innerHTML = lines.map(l => `<div>${l}</div>`).join("");
  banner.style.opacity = "1";
  banner.style.display = "block";
  setTimeout(() => {
    banner.style.opacity = "0";
    setTimeout(() => {
      banner.style.display = "none";
      onDone();
    }, 400);
  }, 1100);
}

// フェーズ1: 政治家カードを場に出す
function cpuPhasePlace() {
  const c = gameState.cpu;
  if (!c.placedThisTurn && c.field.length < 3) {
    const idx = c.hand.findIndex(card => card.type === "politician");
    if (idx >= 0) {
      const card = c.hand.splice(idx, 1)[0];
      c.field.push(card);
      c.placedThisTurn = true;
      console.log(`  CPU: ${card.name}を場に出した`);
      renderGame();
      showActionBanner([`${card.name} を場に出した！`], false, () => cpuPhaseAbilities());
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
    renderGame();
    showActionBanner(
      [`${action.card.name}「${ability.name}」を発動！`, ...effectMsgs],
      false,
      () => cpuExecuteNextAbility(abilityActions, idx + 1)
    );
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
      renderGame();
      showActionBanner(
        [`${card.name} を使用！`, ...effectMsgs],
        false,
        () => cpuCheckWinAndEnd()
      );
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
    // CPUのターン終了 → 情勢調査チェック → 次ターン
    if (gameState.turn % 5 === 0) {
      console.log(`[情勢調査] ターン${gameState.turn}: プレイヤー${gameState.player.approval}% / CPU${gameState.cpu.approval}%`);
      showSurveyOverlay(() => {
        advanceToNextTurn();
      });
      return;
    }

    advanceToNextTurn();
  }
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
    p.usedAbilities[card.instanceId] = true;
    console.log(`[能力発動] ${card.name}: ${ability.name}（コスト${effectiveCost}億）`);
    const msgs = executeEffect(ability.effect, "player");
    renderGame();
    showActionBanner([`「${ability.name}」発動！`, ...msgs], true, () => {
      const result = checkWinCondition();
      if (result) {
        gameState.phase = "finished";
        showFinishOverlay(result);
        return;
      }
    });
  });
}

// オプションカード使用: 確認ダイアログ → 実行 → 結果表示
function useOptionCard(handIndex) {
  const p = gameState.player;
  const card = p.hand[handIndex];

  if (!card || card.type !== "option") return;
  if (p.usedOptionThisTurn) return;

  const effectText = card.effectDescription || "";
  const desc = card.description || "";
  showConfirmDialog(card.name, card.name, effectText, desc, 0, () => {
    p.hand.splice(handIndex, 1);
    p.discard.push(card);
    p.usedOptionThisTurn = true;
    console.log(`[オプション使用] ${card.name}`);
    const msgs = executeEffect(card.effect, "player");
    renderGame();
    showActionBanner([`「${card.name}」使用！`, ...msgs], true, () => {
      const result = checkWinCondition();
      if (result) {
        gameState.phase = "finished";
        showFinishOverlay(result);
        return;
      }
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
  // バーを0%から実値へアニメーション
  setTimeout(() => {
    const barPlayer = document.querySelector(".bar-player");
    const barCpu = document.querySelector(".bar-cpu");
    if (barPlayer) barPlayer.style.width = `${pa}%`;
    if (barCpu) barCpu.style.width = `${ca}%`;
  }, 50);
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

  if (result.includes("プレイヤーの勝利")) {
    title = "総理大臣就任！";
    subtitle = result;
  } else if (result.includes("CPUの勝利")) {
    title = "政党解散…";
    subtitle = result;
  } else {
    title = "引き分け";
    subtitle = "両者互角の戦いでした";
  }

  showOverlay(`
    <h2>${title}</h2>
    <p>${subtitle}</p>
    <p>あなた: ${pa}% / CPU: ${ca}%</p>
    <div class="overlay-buttons">
      <button id="finish-retry" class="overlay-btn btn-confirm">もう一度遊ぶ</button>
    </div>
  `);
  document.getElementById("finish-retry").addEventListener("click", () => {
    hideOverlay();
    gameState.phase = "party_select";
    gameState.player = createPlayerState();
    gameState.cpu = createPlayerState();
    renderGame();
  });
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
  if (card.type === "politician" && card.abilities) {
    const abilityOverlay = document.createElement("div");
    abilityOverlay.className = "zoom-ability-overlay";

    const isFieldPlayer = context === "field";
    const p = gameState.player;
    const costReduction = isFieldPlayer ? (p.currentTurnCostReduction || 0) : 0;

    card.abilities.forEach((ability, aIdx) => {
      const item = document.createElement("div");
      item.className = "zoom-ability-item";
      const effectiveCost = Math.max(0, ability.cost - costReduction);

      // 無効判定（場のプレイヤーカードのみ）
      let inactive = false;
      if (isFieldPlayer) {
        const isUsed = p.usedAbilities[card.instanceId];
        const cantAfford = p.funds < effectiveCost;
        const isDisabled = card.disabled;
        inactive = isUsed || cantAfford || isDisabled;
        if (inactive) item.classList.add("inactive");
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

      // 場のプレイヤーカード: クリックで確認ダイアログ
      if (isFieldPlayer && !inactive) {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          overlay.remove();
          useAbility(index, aIdx);
        });
      }

      abilityOverlay.appendChild(item);
    });

    imageDiv.appendChild(abilityOverlay);
  }

  container.appendChild(imageDiv);

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
      overlay.remove();
      playCardToField(index);
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

function renderGame() {
  if (gameState.phase === "party_select") {
    showScreen("party-select-screen");
    return;
  }
  if (gameState.phase === "card_select") {
    showScreen("card-select-screen");
    renderCardSelect();
    return;
  }

  showScreen("game-screen");

  // ターン情報
  const turnsUntilSurvey = 5 - (gameState.turn % 5 || 5);
  const turnOwner = gameState.currentPlayer === "player" ? "【あなたのターン】" : "【CPUのターン…】";
  document.getElementById("turn-info").textContent =
    `ターン: ${gameState.turn}/25　情勢調査まで: あと${turnsUntilSurvey}ターン　${turnOwner}`;

  // CPU情報
  document.getElementById("cpu-party").textContent = gameState.cpu.party || "???";
  document.getElementById("cpu-funds").innerHTML = fundsToHtml(gameState.cpu.funds);
  document.getElementById("cpu-approval").textContent = "???";
  renderFieldCards("cpu-field", gameState.cpu.field, false);
  renderDeckSlot("cpu-deck", gameState.cpu.deck.length);

  // プレイヤー情報
  document.getElementById("player-party").textContent = gameState.player.party || "???";
  document.getElementById("player-funds").innerHTML = fundsToHtml(gameState.player.funds);
  document.getElementById("player-approval").textContent = "???";
  renderFieldCards("player-field", gameState.player.field, true);
  renderDeckSlot("player-deck", gameState.player.deck.length);

  // CPU手札（裏向き）
  renderCpuHand();

  // 手札
  renderHand();

  // デバッグ情報
  document.getElementById("debug-info").textContent =
    `[DEBUG] P支持率:${gameState.player.approval}% C支持率:${gameState.cpu.approval}% P資金:${gameState.player.funds}億 P手札:${gameState.player.hand.length} P山札:${gameState.player.deck.length} C山札:${gameState.cpu.deck.length}`;
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
          const effectiveCost = Math.max(0, ability.cost - costReduction);
          line.innerHTML = `${ability.name}(${fundsToHtml(effectiveCost)})`;
          abilitySummary.appendChild(line);
        });
        el.appendChild(abilitySummary);
      }
      el.addEventListener("click", () => {
        if (isPlayer && gameState.currentPlayer === "player") {
          showCardZoom(card, "field", idx);
        } else {
          showCardZoom(card, "view");
        }
      });
      container.appendChild(el);
    } else {
      const empty = document.createElement("div");
      empty.className = "field-empty-slot";
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

function renderHand() {
  const container = document.getElementById("player-hand");
  container.innerHTML = "";
  gameState.player.hand.forEach((card, idx) => {
    const el = createCardElement(card);
    // 手札の政治家カードにも能力サマリーを表示
    if (card.type === "politician" && card.abilities) {
      const abilitySummary = document.createElement("div");
      abilitySummary.className = "card-ability-summary";
      card.abilities.forEach(ability => {
        const line = document.createElement("div");
        line.className = "card-ability-line";
        line.innerHTML = `${ability.name}(${fundsToHtml(ability.cost)})`;
        abilitySummary.appendChild(line);
      });
      el.appendChild(abilitySummary);
    }
    el.addEventListener("click", () => {
      if (gameState.currentPlayer !== "player") return;
      if (card.type === "politician") {
        showCardZoom(card, "hand-politician", idx);
      } else {
        showCardZoom(card, "hand-option", idx);
      }
    });
    container.appendChild(el);
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

function renderCardSelect() {
  const container = document.getElementById("card-select-list");
  container.innerHTML = "";
  const politicians = POLITICIAN_CARDS.filter(c => c.party === gameState.player.party);
  politicians.forEach(card => {
    const el = createCardElement(createCardInstance(card));
    el.addEventListener("click", () => {
      initGame(gameState.player.party, card.id);
    });
    container.appendChild(el);
  });
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
  gameState.player.party = party;
  gameState.phase = "card_select";
  renderGame();
}

// ============================================================
// 初期化
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".party-btn").forEach(btn => {
    btn.addEventListener("click", () => selectParty(btn.dataset.party));
  });

  document.getElementById("end-turn-btn").addEventListener("click", () => {
    if (gameState.currentPlayer === "player") {
      endPlayerTurn();
    }
  });

  renderGame();
});
