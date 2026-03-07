// ============================================================
// バージョン
// ============================================================
const APP_VERSION = "0.1.10";

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
        cost: 1,
        effect: "ishiba_1"
      },
      {
        name: "ゲル顔プレス",
        effectText: "相手の場のカード1枚を次ターン使用不可（ランダム）",
        description: "圧倒的な表情圧で記者会見の場が一瞬にして凍りつく",
        cost: 3,
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
        description: "自分の名前を繰り返すだけで保守クラスタがざわめく",
        cost: 2,
        effect: "takaichi_1"
      },
      {
        name: "靖国参拝決行",
        effectText: "支持率+12%、【次ターン開始時】相手の支持率-4%",
        description: "外交部から止められても笑顔で参拝、毎年恒例の風物詩",
        cost: 4,
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
        description: "予想外のワードチョイスで世界中のメディアが注目、話題性は抜群",
        cost: 1,
        effect: "koizumi_1"
      },
      {
        name: "レジ袋有料化",
        effectText: "相手の手札をランダム1枚捨て札に、政治資金+3億",
        description: "日本のプラごみ削減に一石を投じた勇気ある一手",
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
        name: "Xブロック祭り",
        effectText: "支持率-3%、政治資金+2億、次の相手ターンの支持率低下を1回無効化",
        description: "批判コメントを片っ端からブロック、タイムラインを完璧に最適化",
        cost: 1,
        effect: "kono_1"
      },
      {
        name: "ハンコ廃止！",
        effectText: "支持率+6%、山札から1枚ドロー",
        description: "日本のハンコ文化に終止符、デジタル行政の扉を開く",
        cost: 2,
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
        name: "パンケーキ会食",
        effectText: "政治資金+4億、【次ターン】最初に受ける支持率低下を4%軽減",
        description: "パンケーキで心をつかむ",
        cost: 2,
        effect: "suga_2"
      },
      {
        name: "ガースーです",
        effectText: "支持率+8%（場が1枚以下なら追加+4%）",
        description: "まさかの自己紹介で場が和む",
        cost: 3,
        effect: "suga_1"
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
        description: "不倫報道後に逆に知名度爆上がり",
        cost: 1,
        effect: "tamaki_1"
      },
      {
        name: "手取りを増やす！",
        effectText: "相手の支持率が自分の場のカード枚数×4%DOWN",
        description: "シンプルな一言が有権者の心に刺さる",
        cost: 3,
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
        name: "国会デビュー質疑",
        effectText: "支持率+9%、【次ターン】自分の能力コスト全て-1億",
        description: "初々しさが逆に好評、SNSで話題に",
        cost: 2,
        effect: "mori_1"
      },
      {
        name: "次世代の星",
        effectText: "支持率+7%（場が2枚以下なら追加+5%）",
        description: "若手ならではの突破力で党の顔へ急浮上",
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
        description: "お茶を一杯飲む間に根回し完了",
        cost: 2,
        effect: "shinba_1"
      },
      {
        name: "永田町の根回し王",
        effectText: "相手の政治家カードの能力2を全て次ターン封印",
        description: "誰も気づかないうちに話がまとまっている",
        cost: 4,
        effect: "shinba_2"
      }
    ]
  },
  {
    id: "k-furukawa",
    name: "M・フルカワ",
    gender: "男",
    party: "国民民主党",
    image: "assets/politicians/kokumin/k-furukawa.png",
    type: "politician",
    abilities: [
      {
        name: "キャリア官僚の洗礼",
        effectText: "相手の支持率-8%、政治資金+7億",
        description: "財務省仕込みの論理で委員会を制す",
        cost: 1,
        effect: "furukawa_1"
      },
      {
        name: "国家戦略会議召集",
        effectText: "支持率+8% or -3%、政治資金+4億",
        description: "有識者を束ね、政策を一気に動かす",
        cost: 3,
        effect: "furukawa_2"
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
        name: "元NHKアナの本気",
        effectText: "支持率+10%、【次ターン開始】自分の支持率+2%",
        description: "流暢な語り口で視聴者を魅了",
        cost: 2,
        effect: "ito_1"
      },
      {
        name: "ママ目線の予算追及",
        effectText: "支持率が自分の手札のカード枚数×2%UP",
        description: "子育て世代の声を国会へ届ける",
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
        name: "未来への投資",
        effectText: "5ターン後に政治資金+10億を取得",
        description: "スタートアップ精神で政界に風穴",
        cost: 1,
        effect: "anno_1"
      },
      {
        name: "デジタル民主主義",
        effectText: "支持率+6%（場が3枚なら追加+4%）",
        description: "テクノロジーで民意を政治へ直結",
        cost: 3,
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
        name: "社会保険料で混乱！",
        effectText: "支持率+4%",
        description: "ミスを動画で謝罪、誠実さで逆に人気UP",
        cost: 1,
        effect: "takayama_1"
      },
      {
        name: "BCGメソッド炸裂",
        effectText: "支持率が自分の場のカード枚数×4%UP",
        description: "コンサル仕込みの戦略で議会を制す",
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
        name: "ママエンジニアの本気",
        effectText: "支持率+6%",
        description: "育児と仕事を両立するパワフルな行動力",
        cost: 1,
        effect: "muto_2"
      },
      {
        name: "NPOから永田町へ",
        effectText: "相手の支持率-5%、支持率+5%",
        description: "地域支援の経験が国政レベルで開花",
        cost: 3,
        effect: "muto_1"
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
        name: "文化人類学で論破",
        effectText: "支持率+5%",
        description: "東大文人類の視点が政界に新風を送る",
        cost: 1,
        effect: "suda_2"
      },
      {
        name: "まちづくりDX",
        effectText: "相手の支持率が自分の手札のカード枚数×2%DOWN",
        description: "地方の課題をデジタルで一気に解決",
        cost: 4,
        effect: "suda_1"
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
        name: "ビリヤードの撞き方",
        effectText: "このターンのみ、自分の全カードの能力コスト-1億",
        description: "趣味の精密さが政策立案に活きる",
        cost: 2,
        effect: "mineshima_1"
      },
      {
        name: "マネーフォワードDX",
        effectText: "支持率+5%、相手の支持率-3%",
        description: "バックオフィスを丸ごとデジタル化する",
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
    effectDescription: "両プレイヤーの政治資金が50%没収される",
    image: "assets/options/trump_tariff.png",
    type: "option",
    effect: "trump_tariff",
    count:1
  },
  {
    id: "kioku_ni_gozaimasen",
    name: "記憶にございません",
    description: "国会答弁の定番フレーズで追及をかわし、無敵状態。",
    effectDescription: "自分の場の政治家カードを指定し、現在のターンのみ能力の政治資金コストをゼロにする",
    image: "assets/options/kioku_ni_gozaimasen.png",
    type: "option",
    effect: "kioku_ni_gozaimasen",
    count:1
  },
  {
    id: "kenkin_party",
    name: "政治献金パーティー",
    description: "豪華ホテルの「勉強会」で資金集め。",
    effectDescription: "政治資金+5億円を即時獲得",
    image: "assets/options/kenkin_party.png",
    type: "option",
    effect: "kenkin_party",
    count:2
  },
  {
    id: "gaitou_enzetsu",
    name: "街頭演説の神対応",
    description: "厳しいヤジをユーモアで返し、聴衆を味方につける。",
    effectDescription: "支持率+4%。場にカードが2枚以上なら追加で+8%",
    image: "assets/options/gaitou_enzetsu.png",
    type: "option",
    effect: "gaitou_enzetsu",
    count:1
  },
  {
    id: "drill_hakai",
    name: "ドリル破壊",
    description: "物理的に証拠を消し去る強硬手段。",
    effectDescription: "次に受ける支持率低下を1回無効化",
    image: "assets/options/drill_hakai.png",
    type: "option",
    effect: "drill_hakai",
    count:1
  },
  {
    id: "tounai_kaikaku",
    name: "政党内改革",
    description: "旧弊を打破する「トカゲの尻尾切り」か「刷新」か。",
    effectDescription: "自分の場の政治家カード1枚を捨て札にし、手札から別の政治家カードを場に出す",
    image: "assets/options/tounai_kaikaku.png",
    type: "option",
    effect: "tounai_kaikaku",
    count:1
  },
  {
    id: "toushu_touron",
    name: "党首討論",
    description: "2分割画面で映し出される、言葉の真剣勝負。",
    effectDescription: "支持率が上がる（ランダム）",
    image: "assets/options/toushu_touron.png",
    type: "option",
    effect: "toushu_touron",
    count:1
  },
  {
    id: "yukiguni_yukikaki",
    name: "雪国の雪かき",
    description: "演説のため歩道の雪を路上に撒き散らす姿がSNSで炎上。",
    effectDescription: "相手の支持率-5%",
    image: "assets/options/yukiguni_yukikaki.png",
    type: "option",
    effect: "yukiguni_yukikaki",
    count:1
  },
  {
    id: "kono_hage",
    name: "このハゲェー！！",
    description: "秘書への苛烈な暴言録音がSNSで大拡散。",
    effectDescription: "相手の支持率-5%。相手の場に女性政治家がいれば追加で-7%",
    image: "assets/options/kono_hage.png",
    type: "option",
    effect: "kono_hage",
    count:2
  },
  {
    id: "netenai_jiman",
    name: "寝てない自慢",
    description: "災害の緊急対応で「不眠不休」をアピールし、同情と期待を買う。",
    effectDescription: "自分の支持率+4%",
    image: "assets/options/netenai_jiman.png",
    type: "option",
    effect: "netenai_jiman",
    count:1
  },
  {
    id: "masukomi_taisaku",
    name: "マスコミ対策",
    description: "記者クラブとの会食や巧妙な情報操作で報道をコントロール。",
    effectDescription: "次の相手ターンの支持率上昇を1回無効化",
    image: "assets/options/masukomi_taisaku.png",
    type: "option",
    effect: "masukomi_taisaku",
    count:1
  },
  {
    id: "ouen_enzetsu",
    name: "応援演説",
    description: "有名人がマイクを握り、新たな支持者を呼び込む。",
    effectDescription: "自分の山札から政治家カードをランダムで1枚手札に加える",
    image: "assets/options/ouen_enzetsu.png",
    type: "option",
    effect: "ouen_enzetsu",
    count:2
  },
  {
    id: "kinkyuu_yoron",
    name: "緊急世論調査",
    description: "リアルタイムの支持率を分析し、戦術を修正する。",
    effectDescription: "即座に支持率を確認できる",
    image: "assets/options/kinkyuu_yoron.png",
    type: "option",
    effect: "kinkyuu_yoron",
    count:1
  },
  {
    id: "giinkaikan_furin",
    name: "議員会館不倫",
    description: "議員宿舎での密会がスクープされ、政界に激震。",
    effectDescription: "相手の支持率-8%。ただし自分も巻き添えで-3%",
    image: "assets/options/giinkaikan_furin.png",
    type: "option",
    effect: "giinkaikan_furin",
    count:1
  },
  {
    id: "yaji_gassen",
    name: "ヤジ合戦",
    description: "与野党入り乱れての怒鳴り合い。議長のマイクが虚しく響く。",
    effectDescription: "相手の場の政治家カード全員の能力をこのターン封じる",
    image: "assets/options/yaji_gassen.png",
    type: "option",
    effect: "yaji_gassen",
    count:2
  },
  {
    id: "gyuuho_senjutsu",
    name: "牛歩戦術",
    description: "採決のたびに亀より遅く投票所へ向かう。議長も失笑。",
    effectDescription: "相手は次のターンのドローをスキップする",
    image: "assets/options/gyuuho_senjutsu.png",
    type: "option",
    effect: "gyuuho_senjutsu",
    count:2
  },
  {
    id: "kokkai_inemuri",
    name: "国会居眠り",
    description: "ズラリと並んだ議員が全員スヤスヤ。重要法案の採決中でも爆睡。",
    effectDescription: "山札から2枚ドロー",
    image: "assets/options/kokkai_inemuri.png",
    type: "option",
    effect: "kokkai_inemuri",
    count:2
  },
  {
    id: "zouzei_megane",
    name: "増税メガネ",
    description: "「財源が必要です」と一言。国民の財布から素早く3億が消えた。",
    effectDescription: "相手の政治資金から3億徴収し、自分が得る",
    image: "assets/options/zouzei_megane.png",
    type: "option",
    effect: "zouzei_megane",
    count:2
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
  pendingEffects: []       // 遅延効果（5ターン後投資返却など）
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
  if (amount < 0) {
    amount = applyDefenses(player, amount);
  } else if (amount > 0) {
    const blockIdx = player.shields.indexOf("block_approval_up");
    if (blockIdx >= 0) {
      player.shields.splice(blockIdx, 1);
      console.log("  シールド発動: 支持率上昇を無効化");
      amount = 0;
    }
  }
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
    if (opponent.field.length > 0) {
      const target = opponent.field[Math.floor(Math.random() * opponent.field.length)];
      target.disabled = true;
      msgs.push(`${target.name}の能力を次ターン封印！`);
    } else {
      msgs.push("相手の場にカードがなく空振り…");
    }
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
    if (opponent.hand.length > 0) {
      const idx = Math.floor(Math.random() * opponent.hand.length);
      const discarded = opponent.hand.splice(idx, 1)[0];
      opponent.discard.push(discarded);
      msgs.push("相手の手札から1枚を捨て札にした！");
    } else {
      msgs.push("相手の手札がなく空振り…");
    }
    changeFunds(self, 3);
    msgs.push("政治資金+3億円を獲得！");
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
    const m1 = changeApproval(self, 6);
    if (m1) msgs.push(m1);
    if (self.hand.length >= 7) {
      msgs.push("手札が上限（7枚）のためドロー不可…");
    } else if (self.deck.length > 0) {
      const drawn = self.deck.shift();
      self.hand.push(drawn);
      msgs.push(`${drawn.name}を手札に加えた！`);
    } else {
      msgs.push("山札がなくドロー不可…");
    }
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
    const politicians = opponent.field.filter(c => c.type === "politician");
    if (politicians.length === 0) {
      msgs.push("相手の場に政治家カードがなく空振り…");
      return msgs;
    }
    politicians.forEach(c => { c.sealedAbility2 = true; });
    msgs.push("相手の全政治家カードの能力2を封印！");
    return msgs;
  },
  furukawa_1(self, opponent) {
    const msgs = [];
    const m1 = changeApproval(opponent, -8);
    if (m1) msgs.push(m1);
    changeFunds(self, 7);
    msgs.push("政治資金+7億円を獲得！");
    return msgs;
  },
  furukawa_2(self, _opponent) {
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

  // --- チームみらい ---
  anno_1(self, opponent) {
    const msgs = [];
    const returnTurn = gameState.turn + 5;
    const isPlayer = self === gameState.player;
    gameState.pendingEffects.push({ type: "anno_invest", player: isPlayer ? "player" : "cpu", returnTurn, amount: 10 });
    msgs.push(`投資完了！5ターン後（第${returnTurn}ターン）に+10億で返却！`);
    return msgs;
  },
  anno_2(self, opponent) {
    const msgs = [];
    let bonus = 0;
    if (self.field.length >= 3) bonus = 4;
    const m1 = changeApproval(self, 6 + bonus);
    if (m1) msgs.push(m1);
    if (bonus > 0) msgs.push("場のカードが3枚で追加+4%！");
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
  drill_hakai(self, opponent) {
    const msgs = [];
    self.shields.push("block_approval_down");
    msgs.push("次の支持率低下を一度だけスキップ！");
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
  masukomi_taisaku(_self, opponent) {
    const msgs = [];
    opponent.shields.push("block_approval_up");
    msgs.push("次の相手ターンの支持率上昇を1回無効化！");
    return msgs;
  },
  ouen_enzetsu(self, opponent) {
    const msgs = [];
    if (self.hand.length >= 7) {
      msgs.push("手札が上限（7枚）のためドロー不可…");
      return msgs;
    }
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
    let count = 0;
    opponent.field.forEach(card => {
      if (!opponent.usedAbilities[card.instanceId]) {
        card.disabled = true;
        count++;
      }
    });
    msgs.push(count > 0 ? `相手の政治家${count}人の能力を封じた！` : "相手の場に政治家カードがない…");
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
  p.usedOptionThisTurn = false;

  // disabled解除・sealedAbility2解除（前ターンで封印されたカードを復帰）
  p.field.forEach(c => { c.disabled = false; c.sealedAbility2 = false; });

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

function startCpuTurn() {
  const c = gameState.cpu;
  gameState.currentPlayer = "cpu";

  c.placedThisTurn = false;
  c.usedAbilities = {};
  c.usedOptionThisTurn = false;
  c.field.forEach(card => { card.disabled = false; card.sealedAbility2 = false; });

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
        showActionBanner([`${card.name} を場に出した！`], false, () => cpuPhaseAbilities());
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
    const afford1 = !card.sealedAbility2 && c.funds >= costs[1];
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
              () => {
                cpuCheckWinAndEnd();
              }
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
  if (card.image) imageDiv.style.backgroundImage = `url(${card.image})`;

  // zoom-ability-overlay を構築
  const abilityOverlay = document.createElement("div");
  abilityOverlay.className = "zoom-ability-overlay";

  card.abilities.forEach((ability, aIdx) => {
    const item = document.createElement("div");
    item.className = "zoom-ability-item";

    const nameRow = document.createElement("div");
    nameRow.className = "zoom-ability-name";
    const coins = ability.cost > 0 ? COIN_IMG.repeat(ability.cost) : '<span class="funds-zero">—</span>';
    nameRow.innerHTML = `<span class="zoom-ability-cost">${coins}</span>${ability.name}`;
    item.appendChild(nameRow);

    if (ability.effectText) {
      const effectRow = document.createElement("div");
      effectRow.className = "zoom-ability-effect";
      effectRow.textContent = ability.effectText;
      item.appendChild(effectRow);
    }

    // 発動した能力を黄色く光らせる
    if (aIdx === abilityIndex) {
      item.style.background = "rgba(255,220,50,0.45)";
      item.style.boxShadow = "0 0 18px 6px rgba(255,220,50,0.85)";
      item.style.borderRadius = "4px";
    } else {
      item.style.opacity = "0.45";
    }

    abilityOverlay.appendChild(item);
  });

  imageDiv.appendChild(abilityOverlay);
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
  const clone = createCardElement(card);
  Object.assign(clone.style, {
    position: "fixed",
    left: rect.left + "px", top: rect.top + "px",
    width: rect.width + "px", height: rect.height + "px",
    margin: "0", zIndex: "1000", pointerEvents: "none",
    transformOrigin: "center center", transition: "none",
  });
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
    clone.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
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

// 場の政治家カードを選択させるUI（kioku_ni_gozaimasen用）
function showFieldCardPicker(fieldCards, callback) {
  const wrap = document.createElement("div");
  Object.assign(wrap.style, {
    position: "fixed", inset: "0", background: "rgba(0,0,0,0.72)",
    zIndex: "3000", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "16px",
  });

  const title = document.createElement("div");
  Object.assign(title.style, { color: "#fff", fontSize: "1rem", fontWeight: "bold", marginBottom: "4px" });
  title.textContent = "コストを0にする政治家カードを選択";
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
        const effectiveCost = (isFieldPlayer && p.zeroCostCardId === card.instanceId)
          ? 0
          : Math.max(0, ability.cost - costReduction);

        // 使用済みカード: 使った能力だけ表示、それ以外は非表示
        if (isFieldPlayer && usedIdx >= 0 && aIdx !== usedIdx) return;

        const item = document.createElement("div");
        item.className = "zoom-ability-item";

        // 能力2封印判定
        const isSealed = isFieldPlayer && aIdx === 1 && card.sealedAbility2;

        // スタイル判定
        if (isFieldPlayer) {
          if (usedIdx >= 0) {
            // 使用済み能力として表示
            item.classList.add("ability-used");
          } else if (isSealed) {
            // 能力2封印中: グレーアウト
            item.classList.add("inactive");
          } else if (p.funds < effectiveCost) {
            // 資金不足: グレーアウト（非表示にはしない）
            item.classList.add("inactive");
          }
        }

        const nameRow = document.createElement("div");
        nameRow.className = "zoom-ability-name";
        if (isSealed) {
          nameRow.innerHTML = `${ability.name}（封印中）`;
        } else {
          const coins = effectiveCost > 0 ? COIN_IMG.repeat(effectiveCost) : '<span class="funds-zero">—</span>';
          nameRow.innerHTML = `<span class="zoom-ability-cost">${coins}</span>${ability.name}`;
        }
        item.appendChild(nameRow);

        if (ability.effectText) {
          const effectRow = document.createElement("div");
          effectRow.className = "zoom-ability-effect";
          effectRow.textContent = isSealed ? "【封印中】次のターンまで使用不可" : ability.effectText;
          item.appendChild(effectRow);
        }

        // 場のプレイヤーカード: クリックで能力発動
        if (isFieldPlayer && usedIdx < 0 && !isSealed && p.funds >= effectiveCost) {
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

// 政治資金をコイン画像で表現するヘルパー
// 10億ごとに大きなコイン(内側に"10")、1億ごとに通常コイン
const COIN_IMG = '<img class="coin-icon" src="assets/icons/coin.png" alt="億">';
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
    requestAnimationFrame(() => {
      showCpuStatDelta((delta > 0 ? "+" : "") + delta + "億", dir, true);
    });
  }
  if (gameState.cpu._approvalFlash) {
    const { dir, delta } = gameState.cpu._approvalFlash;
    delete gameState.cpu._approvalFlash;
    requestAnimationFrame(() => {
      showCpuStatDelta((delta > 0 ? "+" : "") + delta + "%", dir, false);
    });
  }
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
  slot.style.cursor = "default";
  slot.onclick = null;

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

  const fan = document.createElement("div");
  fan.className = "discard-fan";

  // 枚数に応じてカード同士の重なり幅を計算（全体が CARD_W〜MAX_FAN_W に収まるよう）
  const CARD_W = 36;
  const MAX_FAN_W = 90;
  const n = pile.length;
  const negMargin = n > 1
    ? Math.min(0, Math.round((MAX_FAN_W - CARD_W * n) / (n - 1)))
    : 0;

  pile.forEach((card, i) => {
    const cardEl = document.createElement("div");
    cardEl.className = "discard-fan-card";
    if (i > 0) cardEl.style.marginLeft = `${negMargin}px`;
    cardEl.style.zIndex = String(i + 1);

    const img = document.createElement("img");
    img.className = "discard-fan-img";
    img.src = card.image;
    img.alt = card.name;
    img.onerror = () => {
      img.style.display = "none";
      cardEl.style.background = card.type === "politician"
        ? "linear-gradient(160deg, #2a0a18 0%, #4a1a28 100%)"
        : "linear-gradient(160deg, #0a1a2e 0%, #0f2a4a 100%)";
    };
    cardEl.appendChild(img);

    cardEl.addEventListener("click", e => {
      e.stopPropagation();
      showCardZoom(card, "view");
    });
    fan.appendChild(cardEl);
  });

  slot.appendChild(fan);
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
    if (s === "block_approval_down") tags.push({ label: `🛡 支持率低下を1回無効化`, type: "shield" });
    if (s === "block_approval_up")   tags.push({ label: `📵 支持率上昇を1回無効化`, type: "debuff" });
    if (s === "block_attack")        tags.push({ label: `🛡 攻撃を1回無効化`,       type: "shield" });
  });

  // 次ターンボーナス
  const nb = ps.nextTurnBonuses;
  if (nb.costReduction   > 0) tags.push({ label: `🔧 次ターン コスト-${nb.costReduction}億`,                   type: "buff"   });
  if (nb.fundBonus       > 0) tags.push({ label: `${COIN_IMG} 次ターン 資金+${nb.fundBonus}億`,                 type: "buff"   });
  if (nb.approvalBonus   > 0) tags.push({ label: `📈 次ターン 支持率+${nb.approvalBonus}%`,                    type: "buff"   });
  if (nb.approvalBonus   < 0) tags.push({ label: `📉 次ターン 支持率${nb.approvalBonus}%`,                     type: "debuff" });
  if (nb.attackReduction > 0) tags.push({ label: `🛡 次ターン ダメージ-${nb.attackReduction}%`,                type: "shield" });

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
    el.innerHTML = label;
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
    el.textContent = "🂠";
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
        showCardZoom(card, "view");
      }
    });
    el.addEventListener("touchcancel", () => { swipeStartY = null; });

    // タップ → フォーカス移動 or アクション
    el.addEventListener("click", (e) => {
      if (didSwipe) { didSwipe = false; return; } // スワイプ後のclickは無視
      e.stopPropagation();
      if (gameState.currentPlayer !== "player") {
        showCardZoom(card, "view");
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

function createCardElement(card) {
  const el = document.createElement("div");
  el.className = `card card-${card.type}`;
  el.dataset.instanceId = card.instanceId;

  // 画像エリア
  const imgArea = document.createElement("div");
  imgArea.className = "card-img-area";

  const img = document.createElement("img");
  img.className = "card-photo";
  img.alt = card.name;
  img.src = card.image;
  img.onload = () => el.classList.add("has-image");
  img.onerror = () => el.classList.add("no-image");
  imgArea.appendChild(img);

  el.appendChild(imgArea);

  // 情報パネル（オプションカード）
  if (card.type === "option") {
    const panel = document.createElement("div");
    panel.className = "card-abilities-panel";
    const inner = document.createElement("div");
    inner.className = "ability-panel-inner";
    if (card.effectDescription) {
      const effectEl = document.createElement("div");
      effectEl.className = "ability-name-text option-effect-text";
      effectEl.textContent = card.effectDescription;
      inner.appendChild(effectEl);
    }
    panel.appendChild(inner);
    el.appendChild(panel);
  }

  // 能力パネル（政治家カードのみ）
  if (card.type === "politician" && card.abilities) {
    const panel = document.createElement("div");
    panel.className = "card-abilities-panel";
    const inner = document.createElement("div");
    inner.className = "ability-panel-inner";
    card.abilities.forEach((ability, i) => {
      if (i > 0) {
        const sep = document.createElement("div");
        sep.className = "card-ability-sep";
        inner.appendChild(sep);
      }
      const row = document.createElement("div");
      row.className = "card-ability-row";

      const costEl = document.createElement("span");
      costEl.className = "ability-cost-icons";
      costEl.innerHTML = COIN_IMG.repeat(ability.cost);
      row.appendChild(costEl);

      const nameEl = document.createElement("span");
      nameEl.className = "ability-name-text";
      nameEl.textContent = ability.name;
      row.appendChild(nameEl);

      inner.appendChild(row);
    });
    panel.appendChild(inner);
    el.appendChild(panel);
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
  const verEl = document.getElementById("app-version");
  if (verEl) verEl.textContent = `ver ${APP_VERSION}`;

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
