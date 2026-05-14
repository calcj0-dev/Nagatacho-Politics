'use strict';

// ⑩ スコアリング定数のグリッドサーチ最適化
// 使用方法: node sim/tune.js [games_per_combo]
// 例: node sim/tune.js 300
//
// Lv5(B) vs Lv3(A) の勝率を最大化する定数セットを探索する。
// 完了後に "▶ game.js に反映するコマンド" を出力する。

const { SimGame } = require('./sim');

// ---- チューニング対象パラメータとその探索範囲 ----
// 値を増やすと精度が上がるが実行時間も増える（3値×6パラメータ = 729通り）
const GRID = {
  attackBase:        [80,  120, 160],
  nearWinBonus:      [60,  100, 140],
  criticalSealBonus: [100, 150, 200],
  behindBonus:       [30,   60,  90],
  lateBonus:         [60,  100, 140],
  surgeBonus:        [40,   80, 120],
};

// チューニングしない定数は DEFAULT のまま
const FIXED = {
  usedAttackPenalty: 30,
  selfNearWinBonus:  50,
  midBehindBonus:    40,
};

// ---- グリッド展開 ----
function cartesian(grid) {
  const keys = Object.keys(grid);
  const vals = keys.map(k => grid[k]);
  const results = [];

  function rec(i, cur) {
    if (i === keys.length) { results.push({ ...cur }); return; }
    for (const v of vals[i]) {
      cur[keys[i]] = v;
      rec(i + 1, cur);
    }
  }
  rec(0, {});
  return results;
}

// ---- N ゲームの勝率を計測 ----
function evaluate(params, gamesPerCombo) {
  let winsB = 0;
  for (let i = 0; i < gamesPerCombo; i++) {
    const g = new SimGame(3, 5, false, params); // A=Lv3, B=Lv5
    const r = g.run();
    if (r.winner === 'B') winsB++;
  }
  return winsB / gamesPerCombo;
}

// ---- メイン ----
function main() {
  const gamesPerCombo = Math.max(100, parseInt(process.argv[2] ?? '300', 10) || 300);
  const combos = cartesian(GRID);
  const total  = combos.length;

  console.log(`グリッドサーチ開始: ${total} 通り × ${gamesPerCombo} ゲーム = ${(total * gamesPerCombo).toLocaleString()} ゲーム`);
  console.log('（数分かかる場合があります）\n');

  const results = [];
  const startMs = Date.now();

  for (let ci = 0; ci < combos.length; ci++) {
    const params = { ...combos[ci], ...FIXED };
    const winRate = evaluate(params, gamesPerCombo);
    results.push({ params, winRate });

    // 進捗表示（10件ごと）
    if ((ci + 1) % 10 === 0 || ci === combos.length - 1) {
      const pct = ((ci + 1) / total * 100).toFixed(0);
      const elapsed = ((Date.now() - startMs) / 1000).toFixed(0);
      process.stdout.write(`\r進捗: ${ci + 1}/${total} (${pct}%)  経過: ${elapsed}s`);
    }
  }

  console.log('\n');

  // 勝率降順でソート
  results.sort((a, b) => b.winRate - a.winRate);

  // ---- TOP 5 を表示 ----
  console.log('=== TOP 5 定数セット (Lv5 vs Lv3 勝率) ===\n');
  for (let i = 0; i < Math.min(5, results.length); i++) {
    const { params, winRate } = results[i];
    console.log(`#${i + 1}  勝率: ${(winRate * 100).toFixed(1)}%`);
    const p = params;
    console.log(`  attackBase=${p.attackBase}  nearWinBonus=${p.nearWinBonus}  criticalSealBonus=${p.criticalSealBonus}`);
    console.log(`  behindBonus=${p.behindBonus}  lateBonus=${p.lateBonus}  surgeBonus=${p.surgeBonus}`);
    console.log();
  }

  // ---- 最良定数を game.js 反映用コマンドとして出力 ----
  const best = results[0].params;
  const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);
  console.log(`完了 (${elapsed}s)\n`);
  console.log('▶ game.js の getScore5 に反映する値 (cpuPhaseAbilities 内):');
  console.log(`  sc += ${best.attackBase};                          // attackBase`);
  console.log(`  if (playerNearWin)  sc += ${best.nearWinBonus};   // nearWinBonus`);
  console.log(`  if (playerCritical && isSeal) sc += ${best.criticalSealBonus}; // criticalSealBonus`);
  console.log(`  if (approvalDiff < -10) sc += ${best.behindBonus}; // behindBonus`);
  console.log(`  if (playerSurge >= 10)  sc += ${best.surgeBonus};  // surgeBonus`);
  console.log(`  if (phase === 'late') sc += ${best.lateBonus};     // lateBonus`);

  // 現在の DEFAULT_PARAMS との差分
  const def = SimGame.DEFAULT_PARAMS;
  const changed = Object.keys(best).filter(k => def[k] !== undefined && def[k] !== best[k]);
  if (changed.length === 0) {
    console.log('\n（現在の DEFAULT_PARAMS が既に最適値です）');
  } else {
    console.log('\n変更が必要な定数:');
    changed.forEach(k => console.log(`  ${k}: ${def[k]} → ${best[k]}`));
  }
}

main();
