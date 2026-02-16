// ============================================================
// カードデータ定義
// ============================================================

const POLITICIAN_CARDS = [
  // --- 自民党 ---
  {
    id: "ishiba",
    name: "S・イシバ",
    gender: "男",
    party: "自民党",
    image: "assets/politicians/ishiba.png",
    type: "politician",
    abilities: [
      {
        name: "一口でおにぎり",
        description: "自分の支持率-5%。おにぎりの産地が注目され、地方団体からの献金で政治資金+7億円を即時獲得",
        cost: 0,
        effect: "ishiba_1"
      },
      {
        name: "ゲル顔で威嚇",
        description: "独特の表情で相手を威圧。相手の支持率-8%、さらに相手の次ターンの能力コスト+1億",
        cost: 4,
        effect: "ishiba_2"
      }
    ]
  },
  {
    id: "takaichi",
    name: "S・タカイチ",
    gender: "女",
    party: "自民党",
    image: "assets/politicians/takaichi.png",
    type: "politician",
    abilities: [
      {
        name: "早苗ネーム連呼",
        description: "自分の名前を連呼して存在感アピール。支持率+8%、政治資金-2億",
        cost: 2,
        effect: "takaichi_1"
      },
      {
        name: "靖国参拝決行",
        description: "支持率+12%、ただし次のターン相手の攻撃効果が1.5倍になる",
        cost: 5,
        effect: "takaichi_2"
      }
    ]
  },
  {
    id: "koizumi",
    name: "S・コイズミ",
    gender: "男",
    party: "自民党",
    image: "assets/politicians/koizumi.png",
    type: "politician",
    abilities: [
      {
        name: "セクシー発言",
        description: "「気候変動はセクシーに」などの迷言で物議。ランダムで支持率+15%か-10%",
        cost: 1,
        effect: "koizumi_1"
      },
      {
        name: "レジ袋有料化",
        description: "環境アピールだが不評。相手の支持率-5%、自分も-3%だが政治資金+6億",
        cost: 2,
        effect: "koizumi_2"
      }
    ]
  },
  {
    id: "kono",
    name: "T・コウノ",
    gender: "男",
    party: "自民党",
    image: "assets/politicians/kono.png",
    type: "politician",
    abilities: [
      {
        name: "Twitterブロック祭り",
        description: "批判者を片っ端からブロック。相手の次の攻撃を無効化するが、自分の支持率-3%",
        cost: 2,
        effect: "kono_1"
      },
      {
        name: "ハンコ廃止！",
        description: "デジタル化推進で支持率+9%、次のターンの資金収入+3億",
        cost: 4,
        effect: "kono_2"
      }
    ]
  },
  {
    id: "suga",
    name: "Y・スガ",
    gender: "男",
    party: "自民党",
    image: "assets/politicians/suga.png",
    type: "politician",
    abilities: [
      {
        name: "ガースーです",
        description: "独特の自己紹介で親しみアピール。支持率+8%、さらに場にカードが1枚以下なら追加+4%",
        cost: 3,
        effect: "suga_1"
      },
      {
        name: "パンケーキ会食",
        description: "メディアと懐柔策。相手の次の攻撃-4%、政治資金+4億",
        cost: 2,
        effect: "suga_2"
      }
    ]
  },

  // --- 国民民主党 ---
  {
    id: "tamaki",
    name: "Y・タマキ",
    gender: "男",
    party: "国民民主党",
    image: "assets/politicians/tamaki.png",
    type: "politician",
    abilities: [
      {
        name: "文春砲サバイバル",
        description: "不倫疑惑報道を乗り越える。自分の支持率-8%だが、政治資金+10億獲得＆次の2ターン相手の攻撃無効",
        cost: 0,
        effect: "tamaki_1"
      },
      {
        name: "手取りを増やす！",
        description: "国民の手取りアップを訴求。支持率+10%、政治資金+5億",
        cost: 4,
        effect: "tamaki_2"
      }
    ]
  },
  {
    id: "mori",
    name: "Y・モリ",
    gender: "男",
    party: "国民民主党",
    image: "assets/politicians/mori.png",
    type: "politician",
    abilities: [
      {
        name: "若手のフットワーク",
        description: "身軽に動いて支持獲得。支持率+9%、次のターンの能力コストが全て-1億",
        cost: 3,
        effect: "mori_1"
      },
      {
        name: "次世代の星",
        description: "若手ならではのフレッシュさ。支持率+7%、さらに場のカードが2枚以下なら追加+5%",
        cost: 3,
        effect: "mori_2"
      }
    ]
  },
  {
    id: "shinba",
    name: "K・シンバ",
    gender: "男",
    party: "国民民主党",
    image: "assets/politicians/shinba.png",
    type: "politician",
    abilities: [
      {
        name: "静岡茶で一服",
        description: "お茶を飲んで一息。政治資金+8億、次のターンの防御効果+50%",
        cost: 2,
        effect: "shinba_1"
      },
      {
        name: "国対の調整力",
        description: "水面下の調整で場を整える。自分の場の全カードの次ターンコスト-2億、支持率+6%",
        cost: 4,
        effect: "shinba_2"
      }
    ]
  },
  {
    id: "otsuka",
    name: "K・オオツカ",
    gender: "男",
    party: "国民民主党",
    image: "assets/politicians/otsuka.png",
    type: "politician",
    abilities: [
      {
        name: "日銀理論で論破",
        description: "経済理論で相手を圧倒。相手の支持率-8%、自分の政治資金+7億",
        cost: 5,
        effect: "otsuka_1"
      },
      {
        name: "金融緩和論",
        description: "難しい経済政策を語る。支持率+8%、政治資金+4億、ただしランダムで-3%の可能性も",
        cost: 3,
        effect: "otsuka_2"
      }
    ]
  },
  {
    id: "ito",
    name: "T・イトウ",
    gender: "女",
    party: "国民民主党",
    image: "assets/politicians/ito.png",
    type: "politician",
    abilities: [
      {
        name: "元アナの美声",
        description: "元アナウンサーの滑舌と声で訴求力UP。支持率+10%、次のターンも+4%の追加効果",
        cost: 4,
        effect: "ito_1"
      },
      {
        name: "ママ目線の追及",
        description: "子育て世代の代弁で共感を得る。支持率+9%、相手の支持率-3%",
        cost: 4,
        effect: "ito_2"
      }
    ]
  },

  // --- チームみらい ---
  {
    id: "mirai_taro",
    name: "未来太郎",
    gender: "男",
    party: "チームみらい",
    image: "assets/politicians/mirai_taro.png",
    type: "politician",
    abilities: [
      {
        name: "ビジョン宣言",
        description: "支持率+6%、場のカードが3枚なら追加+4%",
        cost: 3,
        effect: "mirai_taro_1"
      },
      {
        name: "マニフェスト",
        description: "支持率+4%",
        cost: 2,
        effect: "mirai_taro_2"
      }
    ]
  },
  {
    id: "kibou_hanako",
    name: "希望花子",
    gender: "女",
    party: "チームみらい",
    image: "assets/politicians/kibou_hanako.png",
    type: "politician",
    abilities: [
      {
        name: "草の根運動",
        description: "支持率+4%",
        cost: 1,
        effect: "kibou_hanako_1"
      },
      {
        name: "SNSバズ",
        description: "支持率+7%",
        cost: 3,
        effect: "kibou_hanako_2"
      }
    ]
  },
  {
    id: "kaikaku_ichiro",
    name: "改革一郎",
    gender: "男",
    party: "チームみらい",
    image: "assets/politicians/kaikaku_ichiro.png",
    type: "politician",
    abilities: [
      {
        name: "構造改革",
        description: "相手の支持率-5%、自分の支持率+5%",
        cost: 5,
        effect: "kaikaku_ichiro_1"
      },
      {
        name: "規制緩和",
        description: "支持率+6%",
        cost: 3,
        effect: "kaikaku_ichiro_2"
      }
    ]
  },
  {
    id: "senshin_jiro",
    name: "先進次郎",
    gender: "男",
    party: "チームみらい",
    image: "assets/politicians/senshin_jiro.png",
    type: "politician",
    abilities: [
      {
        name: "テクノ政策",
        description: "相手の場からランダムに1枚選び、次の相手のターンで能力使用不可にする",
        cost: 4,
        effect: "senshin_jiro_1"
      },
      {
        name: "AI推進",
        description: "支持率+5%",
        cost: 3,
        effect: "senshin_jiro_2"
      }
    ]
  },
  {
    id: "kyosei_saburo",
    name: "共生三郎",
    gender: "男",
    party: "チームみらい",
    image: "assets/politicians/kyosei_saburo.png",
    type: "politician",
    abilities: [
      {
        name: "超党派連携",
        description: "自分の全カードの能力コスト-1(自分のそのターンのみ)",
        cost: 3,
        effect: "kyosei_saburo_1"
      },
      {
        name: "多様性推進",
        description: "支持率+4%、相手の支持率-2%",
        cost: 4,
        effect: "kyosei_saburo_2"
      }
    ]
  }
];

const OPTION_CARDS = [
  {
    id: "trump_tariff",
    name: "トランプ関税",
    description: "外圧による経済パニック。",
    image: "assets/options/trump_tariff.png",
    type: "option",
    effect: "trump_tariff"
  },
  {
    id: "kioku_ni_gozaimasen",
    name: "記憶にございません",
    description: "国会答弁の定番フレーズで追及をかわす。",
    image: "assets/options/kioku_ni_gozaimasen.png",
    type: "option",
    effect: "kioku_ni_gozaimasen"
  },
  {
    id: "kenkin_party",
    name: "政治献金パーティー",
    description: "豪華ホテルの「勉強会」で資金集め。",
    image: "assets/options/kenkin_party.png",
    type: "option",
    effect: "kenkin_party"
  },
  {
    id: "gaitou_enzetsu",
    name: "街頭演説の神対応",
    description: "厳しいヤジをユーモアで返し、聴衆を味方につける。",
    image: "assets/options/gaitou_enzetsu.png",
    type: "option",
    effect: "gaitou_enzetsu"
  },
  {
    id: "drill_hakai",
    name: "ドリル破壊",
    description: "物理的に証拠を消し去る強硬手段。",
    image: "assets/options/drill_hakai.png",
    type: "option",
    effect: "drill_hakai"
  },
  {
    id: "tounai_kaikaku",
    name: "政党内改革",
    description: "旧弊を打破する「トカゲの尻尾切り」か「刷新」か。",
    image: "assets/options/tounai_kaikaku.png",
    type: "option",
    effect: "tounai_kaikaku"
  },
  {
    id: "toushu_touron",
    name: "党首討論",
    description: "2分割画面で映し出される、言葉の真剣勝負。",
    image: "assets/options/toushu_touron.png",
    type: "option",
    effect: "toushu_touron"
  },
  {
    id: "yukiguni_yukikaki",
    name: "雪国の雪かき",
    description: "演説のため歩道の雪を路上に撒き散らす姿がSNSで炎上。",
    image: "assets/options/yukiguni_yukikaki.png",
    type: "option",
    effect: "yukiguni_yukikaki"
  },
  {
    id: "kono_hage",
    name: "このハゲェー！！",
    description: "秘書への苛烈な暴言録音がSNSで大拡散。",
    image: "assets/options/kono_hage.png",
    type: "option",
    effect: "kono_hage"
  },
  {
    id: "netenai_jiman",
    name: "寝てない自慢",
    description: "災害の緊急対応で「不眠不休」をアピールし、同情と期待を買う。",
    image: "assets/options/netenai_jiman.png",
    type: "option",
    effect: "netenai_jiman"
  },
  {
    id: "masukomi_taisaku",
    name: "マスコミ対策",
    description: "記者クラブとの会食や巧妙な情報操作で報道をコントロール。",
    image: "assets/options/masukomi_taisaku.png",
    type: "option",
    effect: "masukomi_taisaku"
  },
  {
    id: "ouen_enzetsu",
    name: "応援演説",
    description: "「党の顔」がマイクを握り、新たな人材を呼び込む。",
    image: "assets/options/ouen_enzetsu.png",
    type: "option",
    effect: "ouen_enzetsu"
  },
  {
    id: "kinkyuu_yoron",
    name: "緊急世論調査",
    description: "リアルタイムの支持率を分析し、戦術を修正する。",
    image: "assets/options/kinkyuu_yoron.png",
    type: "option",
    effect: "kinkyuu_yoron"
  },
  {
    id: "giinkaikan_furin",
    name: "議員会館不倫",
    description: "議員宿舎での密会がスクープされ、政界に激震。",
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
    funds: 3,
    hand: [],
    field: [],
    deck: [],
    discard: [],
    placedThisTurn: false,
    usedAbilities: {},       // { cardInstanceId: true }
    usedOptionThisTurn: false,
    skipNextDraw: false,
    shields: [],             // 無効化系効果
    nextTurnBonuses: {
      fundBonus: 0,
      costReduction: 0,
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

  // ③ メインフェーズ: CPU自動行動（フェーズ3で実装、今はパス）
  console.log("  CPU: パス（AI未実装）");

  // ④ エンドフェーズ
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

  endTurn();
}

function endPlayerTurn() {
  const p = gameState.player;

  // ④ エンドフェーズ: 手札上限チェック
  if (p.hand.length > 7) {
    // 手札超過 → 捨て札選択UI表示（フェーズ2で実装、今は自動で末尾を捨てる）
    while (p.hand.length > 7) {
      const discarded = p.hand.pop();
      p.discard.push(discarded);
      console.log(`  手札超過: ${discarded.name}を捨てた（暫定自動処理）`);
    }
  }

  setMainPhaseUI(false);
  endTurn();
}

function endTurn() {
  // 勝敗判定（フェーズ3で本実装）
  const result = checkWinCondition();
  if (result) {
    gameState.phase = "finished";
    console.log(`[ゲーム終了] ${result}`);
    renderGame();
    return;
  }

  if (gameState.currentPlayer === "player") {
    // プレイヤーのターン終了 → CPUのターン
    startCpuTurn();
  } else {
    // CPUのターン終了 → 情勢調査チェック → 次ターン
    if (gameState.turn % 5 === 0) {
      console.log(`[情勢調査] ターン${gameState.turn}: プレイヤー${gameState.player.approval}% / CPU${gameState.cpu.approval}%`);
      showSurveyOverlay();
    }

    // 25ターン到達チェック
    if (gameState.turn >= 25) {
      gameState.phase = "finished";
      const result25 = gameState.player.approval > gameState.cpu.approval ? "プレイヤーの勝利"
        : gameState.player.approval < gameState.cpu.approval ? "CPUの勝利"
        : "引き分け";
      console.log(`[25ターン終了] ${result25} (${gameState.player.approval}% vs ${gameState.cpu.approval}%)`);
      renderGame();
      return;
    }

    gameState.turn++;
    startPlayerTurn();
  }

  logState();
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

  if (!card || card.type !== "politician") {
    console.log("政治家カードではありません");
    return false;
  }
  if (p.placedThisTurn) {
    console.log("このターンは既にカードを場に出しました");
    return false;
  }
  if (p.field.length >= 3) {
    console.log("場が上限（3枚）です");
    return false;
  }

  p.hand.splice(handIndex, 1);
  p.field.push(card);
  p.placedThisTurn = true;
  console.log(`${card.name}を場に出した`);
  renderGame();
  return true;
}

// 能力発動（スタブ）
function useAbility(fieldIndex, abilityIndex) {
  const p = gameState.player;
  const card = p.field[fieldIndex];

  if (!card) return false;
  if (p.usedAbilities[card.instanceId]) {
    console.log(`${card.name}は既に能力を使用済みです`);
    return false;
  }

  const ability = card.abilities[abilityIndex];
  if (p.funds < ability.cost) {
    console.log(`資金不足: ${ability.name}（コスト${ability.cost}億 / 所持${p.funds}億）`);
    return false;
  }

  p.funds -= ability.cost;
  p.usedAbilities[card.instanceId] = true;
  console.log(`[能力発動] ${card.name}: ${ability.name}（コスト${ability.cost}億）`);
  // 効果はフェーズ2以降で実装
  console.log(`  → 効果: ${ability.description}（未実装）`);
  renderGame();
  return true;
}

// オプションカード使用（スタブ）
function useOptionCard(handIndex) {
  const p = gameState.player;
  const card = p.hand[handIndex];

  if (!card || card.type !== "option") {
    console.log("オプションカードではありません");
    return false;
  }
  if (p.usedOptionThisTurn) {
    console.log("このターンは既にオプションカードを使用しました");
    return false;
  }

  p.hand.splice(handIndex, 1);
  p.discard.push(card);
  p.usedOptionThisTurn = true;
  console.log(`[オプション使用] ${card.name}: ${card.description}（未実装）`);
  renderGame();
  return true;
}

// ============================================================
// UI描画
// ============================================================

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(el => el.classList.add("hidden"));
  document.getElementById(screenId).classList.remove("hidden");
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
  document.getElementById("turn-info").textContent =
    `ターン: ${gameState.turn}/25　情勢調査まで: あと${5 - (gameState.turn % 5 || 5)}ターン`;

  // CPU情報
  document.getElementById("cpu-party").textContent = gameState.cpu.party || "???";
  document.getElementById("cpu-funds").textContent = "?億円";
  document.getElementById("cpu-approval").textContent = "???";
  renderFieldCards("cpu-field", gameState.cpu.field, false);

  // プレイヤー情報
  document.getElementById("player-party").textContent = gameState.player.party || "???";
  document.getElementById("player-funds").textContent = `${gameState.player.funds}億円`;
  document.getElementById("player-approval").textContent = "???";
  renderFieldCards("player-field", gameState.player.field, true);

  // 手札
  renderHand();

  // デバッグ情報（コンソール用）
  document.getElementById("debug-info").textContent =
    `[DEBUG] P支持率:${gameState.player.approval}% C支持率:${gameState.cpu.approval}% P山札:${gameState.player.deck.length} C山札:${gameState.cpu.deck.length}`;
}

function renderFieldCards(containerId, cards, isPlayer) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  cards.forEach((card, idx) => {
    const el = createCardElement(card);
    if (isPlayer && gameState.currentPlayer === "player") {
      // 能力ボタンを追加
      const abilities = document.createElement("div");
      abilities.className = "card-abilities";
      card.abilities.forEach((ability, aIdx) => {
        const btn = document.createElement("button");
        btn.className = "ability-btn";
        btn.textContent = `${ability.name}(${ability.cost}億)`;
        const isUsed = gameState.player.usedAbilities[card.instanceId];
        const cantAfford = gameState.player.funds < ability.cost;
        if (isUsed || cantAfford) {
          btn.disabled = true;
          btn.classList.add("disabled");
        }
        btn.addEventListener("click", () => useAbility(idx, aIdx));
        abilities.appendChild(btn);
      });
      el.appendChild(abilities);
    }
    container.appendChild(el);
  });
}

function renderHand() {
  const container = document.getElementById("player-hand");
  container.innerHTML = "";
  gameState.player.hand.forEach((card, idx) => {
    const el = createCardElement(card);
    el.addEventListener("click", () => {
      if (gameState.currentPlayer !== "player") return;
      if (card.type === "politician") {
        playCardToField(idx);
      } else {
        useOptionCard(idx);
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

  // テキスト表示（画像がない場合のフォールバック、および画像がある場合のラベル）
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
      renderGame();
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

function showSurveyOverlay() {
  // フェーズ3で本実装。今はコンソール出力のみ。
  console.log("（情勢調査オーバーレイ - 未実装）");
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
  // 政党選択ボタン
  document.querySelectorAll(".party-btn").forEach(btn => {
    btn.addEventListener("click", () => selectParty(btn.dataset.party));
  });

  // ターン終了ボタン
  document.getElementById("end-turn-btn").addEventListener("click", () => {
    if (gameState.currentPlayer === "player") {
      endPlayerTurn();
    }
  });

  renderGame();
});
