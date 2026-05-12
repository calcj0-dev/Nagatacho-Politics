"""
ヘッドレス・ゲームシミュレーター
使用方法: python sim/sim.py [levelA] [levelB] [games]
例:       python sim/sim.py 3 5 1000
"""

import json, random, sys
from pathlib import Path
from copy import deepcopy

DATA_DIR = Path(__file__).parent.parent / "assets" / "data"
_raw = json.loads((DATA_DIR / "politician_cards.json").read_text(encoding="utf-8"))
POLITICIAN_CARDS = [
    {**p, "party": g["party"]}
    for g in _raw
    for p in g["politicians"]
]
OPTION_CARDS = json.loads((DATA_DIR / "option_cards.json").read_text(encoding="utf-8"))

PARTIES = ["自民党", "国民民主党", "チームみらい", "維新の会", "参政党", "中道改革連合"]

# ---- デフォルト定数（tune.py で最適化する） ----
# tune.py グリッドサーチ（Phase1+Phase2 各729通り×150ゲーム）で最適化済みの定数
DEFAULT_PARAMS = dict(
    # --- 能力スコア (getScore5 / Lv3) ---
    attackBase         = 160,
    nearWinBonus       = 140,  #  60→140 (tune Lv3vsLv2)
    criticalSealBonus  = 200,  # 150→200 (tune Lv3vsLv2)
    behindBonus        =  60,  #  90→60  (tune Lv3vsLv2)
    surgeBonus         =  80,  # 120→80  (tune Lv3vsLv2)
    usedAttackPenalty  =  30,
    selfNearWinBonus   =  50,
    lateBonus          = 140,
    # --- オプションスコア (score_option) ---
    optAttackBehind    =  10,  #  30→10  (tune Lv3vsLv2)
    optAttackHighOp    =  20,  #  40→20  (tune Lv3vsLv2)
    optSealAllPer      =  30,  #  10→30  (tune Lv3vsLv2)
    optFundLow         =  40,
    optDrawEarly       =  15,  #  25→15  (tune Lv3vsLv2)
    optShieldBehind    =  20,  #  10→20  (tune Lv3vsLv2)
)

def clamp(v, lo, hi):
    return max(lo, min(hi, v))

class SimGame:
    def __init__(self, level_a, level_b, verbose=False, params=None):
        self.level_a = level_a
        self.level_b = level_b
        self.verbose = verbose
        self.params  = {**DEFAULT_PARAMS, **(params or {})}
        self.id_ctr  = 0
        self.turn    = 1
        self.A = self.B = None
        self.pending = []
        self.history = []  # [{"A": approval, "B": approval}]

    def log(self, msg):
        if self.verbose:
            print(msg)

    # ---- 状態 ----
    def new_state(self, party):
        return dict(
            party=party, approval=30, funds=0,
            hand=[], field=[], deck=[], discard=[],
            placed_this_turn=False, used_abilities={},
            used_option_this_turn=False, skip_next_draw=False,
            seal_all_next_turn=False, block_option_next_turn=False,
            shields=[], cost_reduction=0, zero_cost_card_id=None,
            next_bonuses=dict(fund=0, cost=0, defense=0, attack_reduction=0),
        )

    def mk_card(self, d):
        self.id_ctr += 1
        c = dict(d)
        c["instance_id"] = self.id_ctr
        c["disabled"] = False
        c["sealed_ability2"] = False
        return c

    def build_deck(self, party):
        politicians = [self.mk_card(c) for c in POLITICIAN_CARDS if c["party"] == party]
        options = []
        for d in OPTION_CARDS:
            for _ in range(d.get("count", 2)):
                options.append(self.mk_card(d))
        deck = politicians + options
        random.shuffle(deck)
        return deck

    def init(self):
        parties = random.sample(PARTIES, 2)
        party_a, party_b = parties[0], parties[1]

        deck_a = self.build_deck(party_a)
        pi = next((i for i, c in enumerate(deck_a) if c["type"] == "politician"), -1)
        if pi > 2:
            deck_a[0], deck_a[pi] = deck_a[pi], deck_a[0]
        self.A = self.new_state(party_a)
        self.A["deck"] = deck_a
        self.A["hand"] = [self.A["deck"].pop(0) for _ in range(3)]

        deck_b = self.build_deck(party_b)
        pi = next((i for i, c in enumerate(deck_b) if c["type"] == "politician"), -1)
        if pi > 2:
            deck_b[0], deck_b[pi] = deck_b[pi], deck_b[0]
        self.B = self.new_state(party_b)
        self.B["deck"] = deck_b
        self.B["hand"] = [self.B["deck"].pop(0) for _ in range(3)]

        self.turn = 1
        self.pending = []
        self.history = [{"A": 30, "B": 30}]
        self.log(f"[Init] A={party_a}(Lv{self.level_a}) vs B={party_b}(Lv{self.level_b})")

    def sides(self, side):
        if side == "A":
            return self.A, self.B
        return self.B, self.A

    # ---- 効果 ----
    def apply_defenses(self, target, amount):
        if amount >= 0:
            return amount
        for key in ["block_approval_down_drill", "block_approval_down", "block_attack", "immune"]:
            if key in target["shields"]:
                target["shields"].remove(key)
                return 0
        if target["next_bonuses"]["defense"] > 0:
            r = int(abs(amount) * target["next_bonuses"]["defense"] / 100)
            target["next_bonuses"]["defense"] = 0
            return amount + r
        if target["next_bonuses"]["attack_reduction"] > 0:
            r = target["next_bonuses"]["attack_reduction"]
            target["next_bonuses"]["attack_reduction"] = 0
            return amount + r
        return amount

    def change_approval(self, target, amount):
        if amount < 0:
            amount = self.apply_defenses(target, amount)
        elif amount > 0:
            if "block_approval_up_masukomi" in target["shields"]:
                target["shields"].remove("block_approval_up_masukomi")
                return
            if "block_approval_up" in target["shields"]:
                target["shields"].remove("block_approval_up")
                return
        target["approval"] = clamp(target["approval"] + amount, 0, 100)

    def change_funds(self, target, amount):
        target["funds"] = max(0, target["funds"] + amount)

    def process_pending(self):
        keep = []
        for e in self.pending:
            if e["return_turn"] == self.turn:
                t = self.A if e["side"] == "A" else self.B
                self.change_funds(t, e["amount"])
            else:
                keep.append(e)
        self.pending = keep

    def check_win(self):
        pa, pb = self.A["approval"], self.B["approval"]
        if pa >= 100 and pb >= 100: return "draw"
        if pa <= 0   and pb <= 0:   return "draw"
        if pa >= 100: return "A"
        if pb >= 100: return "B"
        if pa <= 0:   return "B"
        if pb <= 0:   return "A"
        return None

    def game_phase(self):
        if self.turn <= 8:  return "early"
        if self.turn <= 16: return "mid"
        return "late"

    def approval_surge(self, opponent_side):
        if len(self.history) < 2:
            return 0
        return self.history[-1][opponent_side] - self.history[-2][opponent_side]

    def most_threatening(self, field):
        best, best_t = None, -1
        for card in field:
            threat = 0
            for i, ab in enumerate(card.get("abilities", [])):
                if i == 1 and card.get("sealed_ability2"):
                    continue
                tags = ab.get("tags", [])
                if "attack" in tags or "seal" in tags:
                    threat += ab.get("aiThreat", 0) * 20 + ab.get("cost", 0) * 10
                else:
                    threat += ab.get("cost", 0) * 3
            if threat > best_t:
                best_t = threat
                best = card
        return best

    # ---- 能力効果 ----
    def exec_ability(self, effect_id, side):
        self_, opp = self.sides(side)
        G = self

        def seal_target(field):
            return G.most_threatening(field) or field[0]

        fx = {
            "ishiba_1":    lambda: (G.change_approval(self_, -3), G.change_funds(self_, 5)),
            "ishiba_2":    lambda: opp["field"] and seal_target(opp["field"]).__setitem__("sealed_next_turn", True),
            "takaichi_1":  lambda: G.change_approval(self_, 8),
            "takaichi_2":  lambda: (G.change_approval(self_, 12), G.change_approval(opp, -4)),
            "koizumi_1":   lambda: G.change_approval(self_, 15 if random.random() < 0.5 else -10),
            "koizumi_2":   lambda: opp["hand"] and opp["discard"].append(opp["hand"].pop(random.randrange(len(opp["hand"])))),
            "kono_1":      lambda: self_["shields"].append("block_approval_down"),
            "kono_2":      lambda: (G.change_approval(self_, 6), self_["deck"] and self_["hand"].append(self_["deck"].pop(0))),
            "suga_1":      lambda: G.change_funds(self_, 3),
            "suga_2":      lambda: G.change_approval(self_, 8 + (4 if len(self_["field"]) == 1 else 0)),
            "tamaki_1":    lambda: self_["field"] and G.change_approval(opp, -(len(self_["field"]) * 4)),
            "tamaki_2":    lambda: G.change_funds(self_, 5),
            "mori_1":      lambda: (G.change_approval(self_, 5), self_.__setitem__("cost_reduction", self_["cost_reduction"] + 1)),
            "mori_2":      lambda: G.change_approval(self_, 7 + (8 if len(self_["field"]) <= 2 else 0)),
            "shinba_1":    lambda: G.change_approval(self_, 5),
            "shinba_2":    lambda: opp["field"] and seal_target(opp["field"]).__setitem__("sealed_next_turn", True),
            "furukawa_1":  lambda: G.change_approval(opp, -5),
            "furukawa_2":  lambda: G.change_approval(self_, 10 if random.random() < 0.5 else -3),
            "ito_1":       lambda: self_["hand"] and G.change_approval(self_, len(self_["hand"]) * 2),
            "ito_2":       lambda: [self_["hand"].append(self_["deck"].pop(0)) for _ in range(min(2, len(self_["deck"])))],
            "anno_1":      lambda: G.pending.append({"side": side, "return_turn": G.turn + 5, "amount": 5}),
            "anno_2":      lambda: G.change_approval(self_, 6 + (10 if len(self_["field"]) >= 3 else 0)),
            "takayama_1":  lambda: (G.change_approval(self_, 4), opp.__setitem__("block_option_next_turn", True)),
            "takayama_2":  lambda: self_["field"] and G.change_approval(self_, len(self_["field"]) * 4),
            "muto_1":      lambda: G.change_approval(self_, 6),
            "muto_2":      lambda: (G.change_approval(opp, -10), G.change_approval(self_, 5)),
            "suda_1":      lambda: G.change_approval(self_, 5),
            "suda_2":      lambda: self_["hand"] and G.change_approval(opp, -(len(self_["hand"]) * 2)),
            "mineshima_1": lambda: self_.__setitem__("cost_reduction", self_["cost_reduction"] + 1),
            "mineshima_2": lambda: (G.change_approval(self_, 15), G.change_approval(opp, -10)),
            "saito_a_1":   lambda: G.change_approval(self_, 5),
            "saito_a_2":   lambda: (G.change_approval(self_, 15), self_.__setitem__("skip_next_draw", True)),
            "fujita_1":    lambda: G.change_approval(self_, 6),
            "fujita_2":    lambda: self_["deck"] and self_["hand"].append(self_["deck"].pop(0)),
            "nakatsuka_1": lambda: G.change_approval(self_, 10),
            "nakatsuka_2": lambda: G.change_funds(self_, 6),
            "baba_1":      lambda: G.change_approval(self_, 8),
            "baba_2":      lambda: G.change_approval(self_, 15 if random.random() < 0.5 else 5),
            "maehara_1":   lambda: G.change_funds(self_, random.randint(0, 5)),
            "maehara_2":   lambda: G.change_approval(self_, 9),
            "kamiya_1":    lambda: G.change_approval(self_, random.randint(0, 10)),
            "kamiya_2":    lambda: (G.change_approval(self_, 10), G.change_approval(opp, -4)),
            "ando_1":      lambda: G.change_approval(self_, 5),
            "ando_2":      lambda: G.change_approval(self_, 10),
            "toyota_1":    lambda: G.change_approval(self_, 10),
            "toyota_2":    lambda: G.change_approval(self_, 7 + (13 if sum(1 for c in self_["field"] if c.get("gender") == "女") >= 2 else 0)),
            "yoshikawa_1": lambda: G.change_approval(self_, 6),
            "yoshikawa_2": lambda: (G.change_approval(self_, 6), opp.__setitem__("block_option_next_turn", True)),
            "mogami_1":    lambda: G.change_approval(self_, 4),
            "mogami_2":    lambda: self_.__setitem__("cost_reduction", 99),
            "noda_1":      lambda: G.change_approval(self_, 6),
            "noda_2":      lambda: (G.change_approval(self_, -5), G.change_funds(self_, 4)),
            "izumi_1":     lambda: G.change_approval(self_, 5),
            "izumi_2":     lambda: G.change_approval(opp, -25),
            "ogawa_1":     lambda: opp["field"] and seal_target(opp["field"]).__setitem__("sealed_next_turn", True),
            "ogawa_2":     lambda: G.change_approval(self_, 9),
            "isa_1":       lambda: G.change_approval(self_, 5),
            "isa_2":       lambda: G.change_approval(self_, len(self_["hand"]) * 3),
            "saito_t_1":   lambda: self_["deck"] and self_["hand"].append(self_["deck"].pop(0)),
            "saito_t_2":   lambda: (G.change_approval(self_, 15), G.change_approval(opp, -10)),
        }
        fn = fx.get(effect_id)
        if fn:
            fn()
        else:
            self.log(f"  [WARN] 未定義の能力: {effect_id}")

    # ---- オプション効果 ----
    def exec_option(self, effect_id, side):
        self_, opp = self.sides(side)
        G = self

        def do():
            if effect_id == "trump_tariff":
                G.change_funds(self_, -int(self_["funds"] * 0.5))
                G.change_funds(opp,   -int(opp["funds"]   * 0.5))
            elif effect_id == "kioku_ni_gozaimasen":
                pass  # zero_cost_card_id は phase_option で設定済み
            elif effect_id == "kenkin_party":
                G.change_funds(self_, 5)
            elif effect_id == "gaitou_enzetsu":
                G.change_approval(self_, 4)
                if len(self_["field"]) >= 2:
                    G.change_approval(self_, 8)
            elif effect_id == "drill_hakai":
                self_["shields"].append("block_approval_down_drill")
            elif effect_id == "tounai_kaikaku":
                if not self_["field"]: return
                pol_i = next((i for i, c in enumerate(self_["hand"]) if c["type"] == "politician"), -1)
                if pol_i < 0: return
                rm_i = random.randrange(len(self_["field"]))
                removed = self_["field"].pop(rm_i)
                self_["discard"].append(removed)
                added = self_["hand"].pop(pol_i)
                added["field_slot"] = removed.get("field_slot", rm_i)
                self_["field"].append(added)
            elif effect_id == "toushu_touron":
                G.change_approval(self_, random.randint(1, 10))
            elif effect_id == "yukiguni_yukikaki":
                G.change_approval(opp, -5)
            elif effect_id == "kono_hage":
                has_fem = any(c.get("gender") == "女" for c in opp["field"])
                G.change_approval(opp, -12 if has_fem else -5)
            elif effect_id == "netenai_jiman":
                G.change_approval(self_, 4)
            elif effect_id == "masukomi_taisaku":
                opp["shields"].append("block_approval_up_masukomi")
            elif effect_id == "ouen_enzetsu":
                pi = next((i for i, c in enumerate(self_["deck"]) if c["type"] == "politician"), -1)
                if pi >= 0:
                    self_["hand"].append(self_["deck"].pop(pi))
            elif effect_id == "kinkyuu_yoron":
                pass
            elif effect_id == "giinkaikan_furin":
                G.change_approval(opp, -8)
                G.change_approval(self_, -3)
            elif effect_id == "yaji_gassen":
                if opp["field"]:
                    opp["seal_all_next_turn"] = True
            elif effect_id == "gyuuho_senjutsu":
                opp["skip_next_draw"] = True
            elif effect_id == "kokkai_inemuri":
                for _ in range(2):
                    if self_["deck"]:
                        self_["hand"].append(self_["deck"].pop(0))
            elif effect_id == "zouzei_megane":
                amt = min(3, opp["funds"])
                G.change_funds(opp, -amt)
                G.change_funds(self_, amt)
            else:
                G.log(f"  [WARN] 未定義のオプション: {effect_id}")
        do()

    # ---- AI ----
    def score_option(self, card, self_, opp):
        diff  = self_["approval"] - opp["approval"]
        phase = self.game_phase()
        tags  = card.get("tags", [])
        blocked  = any(s in self_["shields"] for s in ["block_approval_up_masukomi", "block_approval_up"])
        p_shield = any(s in opp["shields"] for s in ["block_approval_down", "block_approval_down_drill"])

        score = card.get("aiBaseScore", 30)

        P = self.params
        if "attack" in tags:
            if p_shield:                score -= 25
            if diff < 0:                score += P["optAttackBehind"]
            if opp["approval"] >= 55:   score += P["optAttackHighOp"]
        if "seal_all" in tags:
            if not opp["field"]: return 0
            score += len(opp["field"]) * P["optSealAllPer"]
        if "self_boost" in tags:
            if blocked: return 0
            if self_["approval"] >= 60: score += 20
        if "fund_gain" in tags:
            if self_["funds"] <= 1:     score += P["optFundLow"]
            elif self_["funds"] >= 6:   score -= 20
        if "draw" in tags:
            if phase == "early":        score += P["optDrawEarly"]
            if phase == "late":         score -= 15
        if "shield" in tags:
            if diff >= 0:               score -= 15
            if diff < -10:              score += P["optShieldBehind"]
        if "draw_block" in tags and phase == "late":  score += 25
        if "block_boost" in tags and diff > 0:        score += 20

        eff = card.get("effect", "")
        if eff == "kenkin_party":
            score = 90 if self_["funds"] <= 1 else 55 if self_["funds"] <= 3 else 25
        elif eff == "zouzei_megane":
            if opp["funds"] >= 3: score += 20
            elif opp["funds"] == 0: score -= 30
        elif eff == "trump_tariff":
            if opp["funds"] > self_["funds"] + 2: score += 30
            elif opp["funds"] <= self_["funds"]:  score -= 20
        elif eff == "kioku_ni_gozaimasen":
            max_c = max((sum(a.get("cost", 0) for a in c.get("abilities", [])) for c in self_["field"]), default=0)
            score = 100 if max_c >= 5 else 65 if max_c >= 3 else 25
        elif eff == "tounai_kaikaku":
            best_h = max((sum(a.get("cost", 0) for a in c.get("abilities", [])) for c in self_["hand"] if c["type"] == "politician"), default=0)
            worst_f = min((sum(a.get("cost", 0) for a in c.get("abilities", [])) for c in self_["field"]), default=float("inf"))
            score = 65 if best_h > worst_f + 3 else 15
        elif eff == "gaitou_enzetsu":
            score = score + 45 if len(self_["field"]) >= 2 else score - 20
        elif eff == "kono_hage":
            if any(c.get("gender") == "女" for c in opp["field"]): score += 50

        return max(0, score)

    def best_option_idx(self, hand, self_, opp, level):
        if level == 3:
            best_i, best_s = -1, -1
            for i, c in enumerate(hand):
                if c["type"] != "option": continue
                s = self.score_option(c, self_, opp)
                if s > best_s: best_s = s; best_i = i
            return best_i
        return next((i for i, c in enumerate(hand) if c["type"] == "option"), -1)

    # ---- ターン ----
    def run_turn(self, side, level):
        self_, opp = self.sides(side)

        self_["placed_this_turn"] = False
        self_["used_abilities"] = {}
        self_["used_option_this_turn"] = self_.get("block_option_next_turn", False)
        self_["block_option_next_turn"] = False

        self_["shields"] = [s for s in self_["shields"]
                            if s not in ("block_approval_down", "block_approval_down_drill")]
        self_["zero_cost_card_id"] = None
        for c in self_["field"]:
            c["disabled"] = False
            c["sealed_ability2"] = False

        if self_["seal_all_next_turn"]:
            for c in self_["field"]: c["disabled"] = True
            self_["seal_all_next_turn"] = False

        for c in self_["field"]:
            if c.get("sealed_next_turn"):
                c["disabled"] = True
                c["sealed_next_turn"] = False

        self.process_pending()

        self_["cost_reduction"] = self_["next_bonuses"]["cost"]
        self_["next_bonuses"]["cost"] = 0
        self_["funds"] += 1 + self_["next_bonuses"]["fund"]
        self_["next_bonuses"]["fund"] = 0

        if self_["skip_next_draw"]:
            self_["skip_next_draw"] = False
        elif self_["deck"]:
            self_["hand"].append(self_["deck"].pop(0))

        self.log(f"[T{self.turn}][{side}Lv{level}] {self_['party']} {self_['approval']}% / {self_['funds']}億")

        opt_i = self.best_option_idx(self_["hand"], self_, opp, level)
        opt_card = self_["hand"][opt_i] if opt_i >= 0 else None

        phases = ["place", "abilities", "option"]
        if level >= 3 and opt_card:
            prio = opt_card.get("aiTiming", "last")
            if prio == "first":          phases = ["option", "place", "abilities"]
            elif prio == "before_ability": phases = ["place", "option", "abilities"]

        self._skip_log = []  # 能力スキップ記録をリセット
        for ph in phases:
            if ph == "place":     self.phase_place(side, level)
            elif ph == "abilities": self.phase_abilities(side, level)
            elif ph == "option":    self.phase_option(side, level)

        self.phase_discard(side, level)
        # このターンの B スキップログを呼び出し元に返すため保存
        if side == "B":
            self._b_skip_this_turn = [s for s in self._skip_log if s["side"] == "B"]

    def phase_place(self, side, level):
        self_, opp = self.sides(side)
        if level == 1 and random.random() < 0.35: return
        if self_["placed_this_turn"] or len(self_["field"]) >= 3: return

        pols = [(i, c) for i, c in enumerate(self_["hand"]) if c["type"] == "politician"]
        if not pols: return

        if level == 3:
            pf = len(opp["field"])
            def score3(c):
                total = sum(a.get("cost", 0) for a in c.get("abilities", []))
                has_atk = any("attack" in a.get("tags", []) or "seal" in a.get("tags", []) for a in c.get("abilities", []))
                return total + (60 if pf >= 2 and has_atk else 0)
            idx = max(pols, key=lambda ic: score3(ic[1]))[0]
        else:
            idx = pols[0][0]

        card = self_["hand"].pop(idx)
        used_slots = {c.get("field_slot") for c in self_["field"]}
        card["field_slot"] = next((s for s in [0, 1, 2] if s not in used_slots), len(self_["field"]))
        self_["field"].append(card)
        self_["placed_this_turn"] = True
        self.log(f"  [Place] {card['name']}")

    def phase_abilities(self, side, level):
        self_, opp = self.sides(side)
        cr = self_["cost_reduction"]
        actions = []
        P = self.params

        for card in self_["field"]:
            iid = card["instance_id"]
            if self_["used_abilities"].get(iid) or card.get("disabled"): continue
            abs_ = card.get("abilities", [])
            if len(abs_) < 2: continue
            costs = [max(0, abs_[i].get("cost", 0) - cr) for i in range(2)]

            def is_useful(eff):
                if eff == "kono_1": return bool(opp["field"])
                return (eff not in ("ishiba_2", "shinba_2", "ogawa_1")) or bool(opp["field"])

            a0 = self_["funds"] >= costs[0] and is_useful(abs_[0].get("effect", ""))
            a1 = not card.get("sealed_ability2") and self_["funds"] >= costs[1] and is_useful(abs_[1].get("effect", ""))

            if level == 1 and random.random() < 0.3: continue

            chosen = -1
            action_score = 0

            if level == 1:
                opts = ([0] if a0 else []) + ([1] if a1 else [])
                if opts: chosen = random.choice(opts)

            elif level == 2:
                def s2(i):
                    tags = abs_[i].get("tags", [])
                    sc = costs[i] * 10
                    if ("attack" in tags or "seal" in tags) and opp["field"]:
                        sc += 30
                        if opp["approval"] > self_["approval"]: sc += 20
                    return sc
                if a0 and a1: chosen = 1 if s2(1) >= s2(0) else 0
                elif a1: chosen = 1
                elif a0: chosen = 0

            else:  # Lv3
                diff = self_["approval"] - opp["approval"]
                phase = self.game_phase()
                op_near_win  = opp["approval"] >= 55
                self_near_win = self_["approval"] >= 55
                op_critical  = opp["approval"] >= 60
                op_surge = self.approval_surge("B" if side == "A" else "A")
                op_used_atk = any(
                    any(t in abs_x.get("tags", []) for t in ("attack", "seal"))
                    for fc in opp["field"]
                    for ui in [opp["used_abilities"].get(fc["instance_id"])]
                    if ui
                    for abs_x in [fc.get("abilities", [])[ui - 1]] if ui <= len(fc.get("abilities", []))
                )

                def s5(i):
                    tags = abs_[i].get("tags", [])
                    is_atk = "attack" in tags or "seal" in tags
                    is_sl  = "seal" in tags
                    sc = costs[i] * 3
                    if is_atk:
                        sc += P["attackBase"]
                        if op_near_win:             sc += P["nearWinBonus"]
                        if op_critical and is_sl:   sc += P["criticalSealBonus"]
                        if diff < -10:              sc += P["behindBonus"]
                        if op_surge >= 10:          sc += P["surgeBonus"]
                        if op_used_atk:             sc -= P["usedAttackPenalty"]
                    else:
                        if self_near_win:           sc += P["selfNearWinBonus"]
                        if diff < -15:              sc -= 20
                        if op_surge >= 10:          sc -= 40
                    if phase == "late":             sc += P["lateBonus"]
                    return sc

                if a0 and a1: chosen = 1 if s5(1) >= s5(0) else 0
                elif a1: chosen = 1
                elif a0: chosen = 0
                if chosen >= 0: action_score = s5(chosen)

            if chosen >= 0:
                actions.append({"card": card, "idx": chosen, "cost": costs[chosen], "score": action_score})

        def sort_key(a):
            has_cr = "cost_reduce" in (a["card"]["abilities"][a["idx"]].get("tags") or [])
            if level == 3:
                return (0 if has_cr else 1, -a["score"])
            else:
                return (0 if has_cr else 1, a["cost"])
        actions.sort(key=sort_key)

        for act in actions:
            iid = act["card"]["instance_id"]
            if self_["used_abilities"].get(iid): continue
            cur_cr = self_["cost_reduction"]
            ai = act["idx"]
            ec = max(0, act["card"]["abilities"][ai].get("cost", 0) - cur_cr)

            if ai == 1 and act["card"].get("sealed_ability2"):
                alt = max(0, act["card"]["abilities"][0].get("cost", 0) - cur_cr)
                if self_["funds"] >= alt: ai, ec = 0, alt
                else:
                    self._skip_log.append({"funds": self_["funds"], "min_cost": alt, "side": side})
                    continue
            elif self_["funds"] < ec:
                alt_i = 1 - ai
                if alt_i == 1 and act["card"].get("sealed_ability2"):
                    self._skip_log.append({"funds": self_["funds"], "min_cost": ec, "side": side})
                    continue
                alt_c = max(0, act["card"]["abilities"][alt_i].get("cost", 0) - cur_cr)
                if self_["funds"] >= alt_c: ai, ec = alt_i, alt_c
                else:
                    min_c = min(ec, alt_c)
                    self._skip_log.append({"funds": self_["funds"], "min_cost": min_c, "side": side})
                    continue

            if self_["zero_cost_card_id"] == iid: ec = 0

            self_["funds"] -= ec
            self_["used_abilities"][iid] = ai + 1
            eff = act["card"]["abilities"][ai].get("effect", "")
            self.log(f"  [Ability] {act['card']['name']} cost={ec}")
            self.exec_ability(eff, side)

    def phase_option(self, side, level):
        self_, opp = self.sides(side)
        if level == 1 and random.random() < 0.5: return
        if self_["used_option_this_turn"]: return

        if level == 2:
            diff = self_["approval"] - opp["approval"]
            if self.game_phase() == "early" and diff > 20 and random.random() < 0.4: return

        if level == 3:
            diff = self_["approval"] - opp["approval"]
            remaining = 25 - self.turn
            surge = self.approval_surge("B" if side == "A" else "A")
            if surge < 10 and diff > 30 and remaining > 10: return

        opt_i = self.best_option_idx(self_["hand"], self_, opp, level)
        if opt_i < 0: return

        card = self_["hand"].pop(opt_i)
        self_["discard"].append(card)
        self_["used_option_this_turn"] = True

        if card.get("effect") == "kioku_ni_gozaimasen" and self_["field"]:
            target = max(self_["field"], key=lambda c: sum(a.get("cost", 0) for a in c.get("abilities", [])))
            self_["zero_cost_card_id"] = target["instance_id"]

        self.log(f"  [Option] {card['name']}")
        self.exec_option(card.get("effect", ""), side)

    def phase_discard(self, side, level):
        self_, opp = self.sides(side)
        while len(self_["hand"]) > 7:
            if level == 3:
                # 政治家・オプション問わず価値が最も低いカードを捨てる
                field_full = len(self_["field"]) >= 3
                def card_val3(c):
                    if c["type"] == "option":
                        return self.score_option(c, self_, opp) * 2 + 50
                    # 政治家: コスト合計 + 攻撃/封印タグボーナス
                    total = sum(a.get("cost", 0) for a in c.get("abilities", []))
                    has_atk = any("attack" in a.get("tags", []) or "seal" in a.get("tags", [])
                                  for a in c.get("abilities", []))
                    has_cr = any("cost_reduce" in a.get("tags", []) for a in c.get("abilities", []))
                    v = total * 8 + (50 if has_atk else 0) + (40 if has_cr else 0)
                    if field_full: v -= 60  # 場が満杯なら政治家の価値を下げる
                    return v
                di = min(range(len(self_["hand"])), key=lambda i: card_val3(self_["hand"][i]))
            elif level >= 2:
                def val(c):
                    return self.score_option(c, self_, opp) + 30 if c["type"] == "option" \
                           else sum(a.get("cost", 0) for a in c.get("abilities", [])) * 8
                di = min(range(len(self_["hand"])), key=lambda i: val(self_["hand"][i]))
            else:
                opt_i = next((i for i, c in enumerate(self_["hand"]) if c["type"] == "option"), -1)
                di = opt_i if opt_i >= 0 else len(self_["hand"]) - 1
            self_["discard"].append(self_["hand"].pop(di))

    # ---- ゲーム実行 ----
    def run(self):
        self.init()
        # ターン毎の詳細ログ (side="B" の Lv3 を追跡)
        b_stats = []  # [{"turn": t, "opt_used": bool, "opt_in_hand": int, "funds_after": int}]
        for t in range(1, 26):
            self.turn = t
            self.history.append({"A": self.A["approval"], "B": self.B["approval"]})
            self.run_turn("A", self.level_a)
            w = self.check_win()
            if w:
                self.history.append({"A": self.A["approval"], "B": self.B["approval"]})
                return {"winner": w, "turns": t,
                        "final_a": self.A["approval"], "final_b": self.B["approval"],
                        "history": self.history, "b_stats": b_stats}

            # B ターン前の状態を保存してから実行
            b_opts_before = sum(1 for c in self.B["hand"] if c["type"] == "option")
            self._b_skip_this_turn = []
            self.run_turn("B", self.level_b)
            skips = self._b_skip_this_turn
            b_stats.append({
                "turn":        t,
                "opt_used":    self.B["used_option_this_turn"],
                "opt_in_hand": b_opts_before,
                "funds_after": self.B["funds"],
                "skip_count":  len(skips),
                # スキップ時「あと何億あれば使えたか」の合計（機会損失）
                "skip_gap":    sum(max(0, s["min_cost"] - s["funds"]) for s in skips),
            })
            w = self.check_win()
            if w:
                self.history.append({"A": self.A["approval"], "B": self.B["approval"]})
                return {"winner": w, "turns": t,
                        "final_a": self.A["approval"], "final_b": self.B["approval"],
                        "history": self.history, "b_stats": b_stats}

        fa, fb = self.A["approval"], self.B["approval"]
        winner = "A" if fa > fb else ("B" if fb > fa else "draw")
        return {"winner": winner, "turns": 25,
                "final_a": fa, "final_b": fb,
                "history": self.history, "b_stats": b_stats}


def print_stats(level_a, level_b, games, results):
    w_a   = [r for r in results if r["winner"] == "A"]
    w_b   = [r for r in results if r["winner"] == "B"]
    draws = [r for r in results if r["winner"] == "draw"]
    n = len(results)

    print(f"\n{'='*52}")
    print(f" 敗因分析: Lv{level_a}(A) vs Lv{level_b}(B)  {n}ゲーム")
    print(f"{'='*52}")
    print(f" Lv{level_a}(A) 勝利: {len(w_a):5d}  ({len(w_a)/n*100:.1f}%)")
    print(f" Lv{level_b}(B) 勝利: {len(w_b):5d}  ({len(w_b)/n*100:.1f}%)")
    print(f" 引き分け:      {len(draws):5d}  ({len(draws)/n*100:.1f}%)")

    # ---- 終了ターン分布 ----
    print(f"\n── 終了ターン分布 (Lv{level_a}勝 / Lv{level_b}勝) ──")
    buckets = [(1,5),(6,10),(11,15),(16,20),(21,25)]
    for lo, hi in buckets:
        ca = sum(1 for r in w_a if lo <= r["turns"] <= hi)
        cb = sum(1 for r in w_b if lo <= r["turns"] <= hi)
        bar_a = "#" * (ca * 30 // max(len(w_a),1))
        bar_b = "#" * (cb * 30 // max(len(w_b),1))
        print(f"  T{lo:2d}-{hi:2d}  A:{ca:4d} {bar_a}")
        print(f"         B:{cb:4d} {bar_b}")

    # ---- 敗者の最終支持率（Aが負けた試合） ----
    if w_b:
        loser_ap = [r["final_a"] for r in w_b]
        print(f"\n── Lv{level_a}(A)が負けた試合での最終支持率 ──")
        buckets2 = [(0,39),(40,59),(60,79),(80,99)]
        for lo, hi in buckets2:
            c = sum(1 for v in loser_ap if lo <= v <= hi)
            pct = c / len(loser_ap) * 100
            bar = "#" * int(pct / 2)
            print(f"  {lo:3d}〜{hi:3d}%:  {c:4d}件 ({pct:5.1f}%) {bar}")
        print(f"  平均: {sum(loser_ap)/len(loser_ap):.1f}%  "
              f"最大: {max(loser_ap)}%  最小: {min(loser_ap)}%")

    # ---- 支持率推移（平均） ----
    max_t = max(r["turns"] for r in results)
    print(f"\n── 平均支持率推移 (A=Lv{level_a} / B=Lv{level_b}) ──")
    print(f"  {'ターン':>4}  {'A勝試合':>8}  {'B勝試合':>8}")
    for t in [1, 3, 5, 8, 10, 13, 15, 18, 20, 23, 25]:
        def avg_at(group, side):
            vals = [r["history"][min(t-1, len(r["history"])-1)][side]
                    for r in group if len(r["history"]) >= t]
            return sum(vals)/len(vals) if vals else 0
        aa = avg_at(w_a, "A"); ab = avg_at(w_a, "B")
        ba = avg_at(w_b, "A"); bb = avg_at(w_b, "B")
        print(f"  T{t:2d}:  A={aa:4.0f}% B={ab:4.0f}%  |  A={ba:4.0f}% B={bb:4.0f}%")

    # ---- 逆転が起きたターン（Aが一度でもリードしたのに負けた試合） ----
    if w_b:
        reversals = []
        for r in w_b:
            lead_turns = [i for i, h in enumerate(r["history"]) if h["A"] >= h["B"]]
            if lead_turns:
                reversals.append(lead_turns[-1] + 1)
        if reversals:
            print(f"\n── 逆転負け (Aが一時リードしてたのに負けた試合) ──")
            print(f"  該当: {len(reversals)}件 / {len(w_b)}件 ({len(reversals)/len(w_b)*100:.1f}%)")
            avg_t = sum(reversals) / len(reversals)
            print(f"  リードを失ったターン（平均）: T{avg_t:.1f}")
            buckets3 = [(1,5),(6,10),(11,15),(16,20),(21,25)]
            for lo, hi in buckets3:
                c = sum(1 for t in reversals if lo <= t <= hi)
                if c:
                    print(f"    T{lo}-{hi}: {c}件")

    # ---- オプションカード使用分析 ----
    def opt_stats(group, label):
        all_stats = [s for r in group for s in r.get("b_stats", [])]
        avail = [s for s in all_stats if s["opt_in_hand"] > 0]
        used  = [s for s in avail      if s["opt_used"]]
        rate  = len(used) / len(avail) * 100 if avail else 0
        print(f"  {label}: オプション使用率 {rate:.1f}%  "
              f"({len(used)}/{len(avail)}ターン, オプション手札あり)")
        # フェーズ別（序盤T1-8, 中盤T9-16, 終盤T17-25）
        for phase, lo, hi in [("序盤T1-8 ", 1, 8), ("中盤T9-16", 9, 16), ("終盤T17-25", 17, 25)]:
            a2 = [s for s in avail if lo <= s["turn"] <= hi]
            u2 = [s for s in a2    if s["opt_used"]]
            r2 = len(u2) / len(a2) * 100 if a2 else 0
            print(f"    {phase}: {r2:.1f}%  ({len(u2)}/{len(a2)})")

    print(f"\n── B(Lv{level_b}) オプションカード使用率 ──")
    opt_stats(w_b, "B勝試合")
    opt_stats(w_a, "B負試合")

    # ---- 資金余剰分析 ----
    def funds_stats(group, label):
        all_stats = [s for r in group for s in r.get("b_stats", [])]
        if not all_stats: return
        avg_f = sum(s["funds_after"] for s in all_stats) / len(all_stats)
        # 2億以上余った割合（もったいないターン）
        waste = sum(1 for s in all_stats if s["funds_after"] >= 2)
        waste_pct = waste / len(all_stats) * 100
        print(f"  {label}: 平均余剰資金 {avg_f:.2f}億  "
              f"2億以上余ったターン {waste_pct:.1f}%")
        # フェーズ別
        for phase, lo, hi in [("序盤T1-8 ", 1, 8), ("中盤T9-16", 9, 16), ("終盤T17-25", 17, 25)]:
            ps = [s for s in all_stats if lo <= s["turn"] <= hi]
            if not ps: continue
            pf = sum(s["funds_after"] for s in ps) / len(ps)
            pw = sum(1 for s in ps if s["funds_after"] >= 2) / len(ps) * 100
            print(f"    {phase}: 平均 {pf:.2f}億  無駄 {pw:.1f}%")

    print(f"\n── B(Lv{level_b}) ターン終了時余剰資金 ──")
    funds_stats(w_b, "B勝試合")
    funds_stats(w_a, "B負試合")

    # ---- 能力スキップ分析 ----
    def skip_stats(group, label):
        all_stats = [s for r in group for s in r.get("b_stats", [])]
        if not all_stats: return
        total_turns  = len(all_stats)
        skip_turns   = sum(1 for s in all_stats if s["skip_count"] > 0)
        total_skips  = sum(s["skip_count"] for s in all_stats)
        total_gap    = sum(s["skip_gap"]   for s in all_stats)
        print(f"  {label}: スキップ発生 {skip_turns/total_turns*100:.1f}%のターン  "
              f"平均スキップ {total_skips/total_turns:.2f}回/ターン  "
              f"平均不足資金 {total_gap/total_turns:.2f}億/ターン")
        for phase, lo, hi in [("序盤T1-8 ", 1, 8), ("中盤T9-16", 9, 16), ("終盤T17-25", 17, 25)]:
            ps = [s for s in all_stats if lo <= s["turn"] <= hi]
            if not ps: continue
            sk = sum(s["skip_count"] for s in ps) / len(ps)
            gp = sum(s["skip_gap"]   for s in ps) / len(ps)
            st = sum(1 for s in ps if s["skip_count"] > 0) / len(ps) * 100
            print(f"    {phase}: スキップ率 {st:.1f}%  平均 {sk:.2f}回  不足 {gp:.2f}億")

    print(f"\n── B(Lv{level_b}) 能力スキップ（資金不足） ──")
    skip_stats(w_b, "B勝試合")
    skip_stats(w_a, "B負試合")


# ---- メイン ----
def main():
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    verbose = "-v" in sys.argv or "--verbose" in sys.argv
    stats   = "-s" in sys.argv or "--stats" in sys.argv
    level_a = max(1, min(3, int(args[0]) if args else 2))
    level_b = max(1, min(3, int(args[1]) if len(args) > 1 else 3))
    games   = max(1, int(args[2]) if len(args) > 2 else 1000)

    print(f"\nシミュレーション: Lv{level_a}(A) vs Lv{level_b}(B)  {games}ゲーム\n")

    results = []
    w_a = w_b = draws = total_t = 0
    for _ in range(games):
        r = SimGame(level_a, level_b, verbose).run()
        results.append(r)
        total_t += r["turns"]
        if r["winner"] == "A": w_a += 1
        elif r["winner"] == "B": w_b += 1
        else: draws += 1

    if stats:
        print_stats(level_a, level_b, games, results)
    else:
        print(f"---- 結果 ({games}ゲーム) ----")
        print(f"Lv{level_a}(A) 勝利: {w_a:5d}  ({w_a/games*100:.1f}%)")
        print(f"Lv{level_b}(B) 勝利: {w_b:5d}  ({w_b/games*100:.1f}%)")
        print(f"引き分け:       {draws:5d}  ({draws/games*100:.1f}%)")
        print(f"平均ターン数:   {total_t/games:.1f}")


if __name__ == "__main__":
    main()
