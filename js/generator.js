/* ============================================================
   generator.js — generează un meniu săptămânal nou din baza de rețete,
   pe baza țintei calorice (calculată din greutate/înălțime/obiectiv).

   Structură: mesele se grupează pe "blocuri" de 2-3 zile (aceeași
   rețetă, gătită o dată) ca să nu fie nevoie de gătit zilnic.
   Gustarea se alege mereu doar din rețete fără gătit, individual pe
   zi, ca să "completeze" diferența până la ținta calorică a zilei.
   ============================================================ */

const DAY_SHAPE = {
  luni: { breakfast: "A", lunch: "A", dinner: "A" },
  marti: { breakfast: "A", lunch: "A", dinner: "A" },
  miercuri: { breakfast: "A", lunch: "B", dinner: "A" },
  joi: { breakfast: "B", lunch: "B", dinner: "B" },
  vineri: { breakfast: "B", lunch: "Fri", dinner: "Fri" },
  duminica: { breakfast: "A", lunch: null, dinner: "A" }
};

const Generator = {
  MEAL_ALLOCATION: { breakfast: 0.25, lunch: 0.35, dinner: 0.30 },

  poolByType(type) {
    return Object.entries(RECIPES)
      .filter(([, r]) => r.type === type && (type !== "snack" || r.noCook))
      .map(([id]) => id);
  },

  // Alege reteta cu kcal cea mai apropiată de țintă, preferând pe cele
  // nefolosite recent (săptămâna anterioară), ca să existe variație reală.
  pickClosest(candidateIds, targetKcal, recentIds, alreadyPicked) {
    let pool = candidateIds.filter(id => !alreadyPicked.includes(id));
    if (!pool.length) pool = candidateIds;
    const fresh = pool.filter(id => !recentIds.includes(id));
    const finalPool = fresh.length ? fresh : pool;
    let best = finalPool[0], bestDiff = Infinity;
    finalPool.forEach(id => {
      const diff = Math.abs(RECIPES[id].kcal - targetKcal);
      if (diff < bestDiff) { bestDiff = diff; best = id; }
    });
    return best;
  },

  // dailyTarget: ținta calorică zilnică a familiei (calculată din profilul
  // cu nevoia mai mică, vezi App). recentIds: rețetele folosite săptămâna
  // anterioară, evitate dacă se poate, pentru variație.
  generateWeek(dailyTarget, recentIds = []) {
    const picked = [];
    const pick = (type, allocKey) => {
      const candidates = this.poolByType(type);
      const target = Math.round(dailyTarget * this.MEAL_ALLOCATION[allocKey]);
      const id = this.pickClosest(candidates, target, recentIds, picked);
      picked.push(id);
      return id;
    };

    const blocks = {
      breakfast: { A: pick("breakfast", "breakfast"), B: pick("breakfast", "breakfast") },
      lunch: { A: pick("lunch", "lunch"), B: pick("lunch", "lunch"), Fri: pick("lunch", "lunch") },
      dinner: { A: pick("dinner", "dinner"), B: pick("dinner", "dinner"), Fri: pick("dinner", "dinner") }
    };

    const snackPool = this.poolByType("snack");
    const week = {};

    Object.entries(DAY_SHAPE).forEach(([day, shape]) => {
      const bId = blocks.breakfast[shape.breakfast];
      const lId = shape.lunch ? blocks.lunch[shape.lunch] : null;
      const dId = blocks.dinner[shape.dinner];
      const partial = RECIPES[bId].kcal + (lId ? RECIPES[lId].kcal : 0) + RECIPES[dId].kcal;
      const gap = Math.max(120, Math.min(280, dailyTarget - partial));
      const snackId = this.pickClosest(snackPool, gap, recentIds, []);

      week[day] = {
        breakfast: bId,
        snack: snackId,
        lunch: lId || "note",
        dinner: dId
      };
    });

    week.sambata = { freeDay: true, note: "Zi liberă — ieșiți, comandați sau gătiți ceva special, fără presiune. Reveniți la plan duminică seara." };
    week.duminica.prepDay = true;
    week.duminica.note = `Ziua pregătirilor: gătiți ${RECIPES[week.duminica.dinner].title} (ține până miercuri). Prânzul e din resturi de sâmbătă.`;

    const usedRecipeIds = [...new Set([
      ...Object.values(blocks.breakfast), ...Object.values(blocks.lunch), ...Object.values(blocks.dinner),
      ...Object.values(week).map(d => d.snack).filter(Boolean)
    ])];

    return { week, usedRecipeIds };
  },

  dayKcalTotal(dayPlan) {
    if (dayPlan.freeDay) return null;
    return MEAL_ORDER.reduce((sum, t) => {
      const rid = dayPlan[t];
      return sum + (rid && rid !== "note" && RECIPES[rid] ? RECIPES[rid].kcal : 0);
    }, 0);
  }
};
