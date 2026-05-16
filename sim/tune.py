"""
グリッドサーチで Lv5 AI のスコアリング定数を最適化する
使用方法: python sim/tune.py [games_per_combo]
例:       python sim/tune.py 300

Phase 1 (能力スコア) と Phase 2 (オプションスコア) を順番に実行する。
各 Phase で前の Phase の最良値を固定したうえで次を探索する。
"""

import sys, time, itertools
from sim import SimGame, DEFAULT_PARAMS

# ---- Phase 1: 能力スコア定数 (getScore5) ----
GRID_ABILITY = {
    "attackBase":        [80,  120, 160],
    "nearWinBonus":      [60,  100, 140],
    "criticalSealBonus": [100, 150, 200],
    "behindBonus":       [30,   60,  90],
    "lateBonus":         [60,  100, 140],
    "surgeBonus":        [40,   80, 120],
}

# ---- Phase 2: オプションスコア定数 (score_option) ----
GRID_OPTION = {
    "optAttackBehind": [10, 20, 30],
    "optAttackHighOp": [20, 30, 40],
    "optSealAllPer":   [10, 20, 30],
    "optFundLow":      [20, 30, 40],
    "optDrawEarly":    [ 5, 15, 25],
    "optShieldBehind": [10, 20, 30],
}


def run_grid(grid, fixed_params, n, label):
    keys   = list(grid.keys())
    combos = list(itertools.product(*[grid[k] for k in keys]))
    total  = len(combos)

    print(f"\n=== {label} ===")
    print(f"グリッドサーチ: {total}通り x {n}ゲーム = {total*n:,}ゲーム")
    print("しばらくお待ちください...\n")

    results = []
    start = time.time()

    for ci, combo in enumerate(combos):
        params = {**fixed_params, **dict(zip(keys, combo))}
        wins_b = sum(1 for _ in range(n) if SimGame(2, 3, params=params).run()["winner"] == "B")
        win_rate = wins_b / n
        results.append((win_rate, dict(zip(keys, combo))))

        if (ci + 1) % 20 == 0 or ci == total - 1:
            elapsed = time.time() - start
            eta = elapsed / (ci + 1) * (total - ci - 1)
            pct = (ci + 1) / total * 100
            print(f"  {ci+1}/{total} ({pct:.0f}%)  経過:{elapsed:.0f}s  残り:{eta:.0f}s", end="\r")

    print()
    results.sort(key=lambda x: -x[0])

    print(f"\n--- TOP 5 ({label}) ---\n")
    for i, (wr, p) in enumerate(results[:5]):
        print(f"#{i+1}  勝率: {wr*100:.1f}%")
        for k in keys:
            arrow = " <--変更" if p[k] != DEFAULT_PARAMS.get(k) else ""
            print(f"  {k}: {p[k]}{arrow}")
        print()

    elapsed = time.time() - start
    print(f"完了 ({elapsed:.1f}s)")
    return results[0]  # (win_rate, best_combo_dict)


def main():
    n = max(100, int(sys.argv[1]) if len(sys.argv) > 1 else 200)

    # Phase 1: 能力スコア最適化（オプション定数はDEFAULTで固定）
    fixed1 = {k: DEFAULT_PARAMS[k] for k in DEFAULT_PARAMS if k not in GRID_ABILITY}
    best1_wr, best1_params = run_grid(GRID_ABILITY, fixed1, n, "Phase 1: 能力スコア")

    # Phase 2: オプションスコア最適化（Phase 1 の最良値を固定）
    fixed2 = {**fixed1, **best1_params}
    best2_wr, best2_params = run_grid(GRID_OPTION, fixed2, n, "Phase 2: オプションスコア")

    # 最終結果
    final_params = {**fixed2, **best2_params}
    print("\n" + "="*50)
    print(f"最終勝率 (Lv3 vs Lv2): {best2_wr*100:.1f}%")
    print("="*50)

    changed = {k: v for k, v in final_params.items() if DEFAULT_PARAMS.get(k) != v}
    if not changed:
        print("\n現在の定数が既に最適値です。変更不要です。")
        return

    print("\n変更が必要な定数:")
    for k, v in changed.items():
        print(f"  {k}: {DEFAULT_PARAMS.get(k)} -> {v}")

    print("\ngame.js の更新箇所:")
    ability_map = {
        "attackBase":        "sc += {v};",
        "nearWinBonus":      "if (playerNearWin)  score += {v};",
        "criticalSealBonus": "if (playerCritical && isSeal) score += {v};",
        "behindBonus":       "if (approvalDiff < -10) score += {v};",
        "lateBonus":         "if (phase === 'late') score += {v};",
        "surgeBonus":        "if (playerSurge >= 10)  score += {v};",
    }
    option_map = {
        "optAttackBehind": "if (approvalDiff < 0) score += {v};  // attack tag",
        "optAttackHighOp": "if (p.approval >= 55) score += {v};  // attack tag",
        "optSealAllPer":   "score += p.field.length * {v};        // seal_all tag",
        "optFundLow":      "if (c.funds <= 1) score += {v};       // fund_gain tag",
        "optDrawEarly":    "if (phase === 'early') score += {v};  // draw tag",
        "optShieldBehind": "if (approvalDiff < -10) score += {v}; // shield tag",
    }
    for k, v in changed.items():
        tmpl = ability_map.get(k) or option_map.get(k)
        if tmpl:
            print(f"  // {k}: {DEFAULT_PARAMS.get(k)} -> {v}")
            print(f"  {tmpl.format(v=v)}")


if __name__ == "__main__":
    main()
