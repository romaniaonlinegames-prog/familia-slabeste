/* ============================================================
   shopping.js — agregă ingredientele din rețetele unei săptămâni
   într-o listă de cumpărături practică (cantități reale, nu fragmente
   de rețetă). Tratează ouăle special (albuș/gălbenuș/ou întreg = tot
   "ouă" la cumpărat), restul ingredientelor le adună după nume+unitate.
   ============================================================ */

const ShoppingGen = {
  EGG_WORDS: ["ou", "albuș", "gălbenuș"],

  isEgg(name) {
    const n = name.toLowerCase();
    return this.EGG_WORDS.some(w => n.includes(w));
  },

  capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  },

  parseQty(qtyRaw) {
    let qty = qtyRaw.trim()
      .replace(/^1\/2\b/, "0.5")
      .replace(/^1\/4\b/, "0.25")
      .replace(/^3\/4\b/, "0.75");
    const m = qty.match(/^([\d.,]+)\s*([a-zA-Zăâîșțé%]*)/i);
    if (!m) return null;
    const num = parseFloat(m[1].replace(",", "."));
    if (isNaN(num)) return null;
    return { num, unit: (m[2] || "buc").toLowerCase() };
  },

  // Toate rețetele distincte folosite în săptămână (o dată per rețetă,
  // indiferent pe câte zile se repetă — fiindcă se gătesc o singură dată).
  collectUniqueRecipes(week) {
    const ids = new Set();
    Object.values(week).forEach(day => {
      if (day.freeDay) return;
      MEAL_ORDER.forEach(t => {
        const rid = day[t];
        if (rid && rid !== "note" && RECIPES[rid]) ids.add(rid);
      });
    });
    return [...ids];
  },

  forWeek(week) {
    const recipeIds = this.collectUniqueRecipes(week);
    let eggUnits = 0;
    const merged = {};
    const unmerged = {};

    recipeIds.forEach(rid => {
      RECIPES[rid].ingredients.forEach(ing => {
        if (this.isEgg(ing.name)) {
          const parsed = this.parseQty(ing.qty);
          eggUnits += parsed ? Math.ceil(parsed.num) : 1;
          return;
        }
        const parsed = this.parseQty(ing.qty);
        const mergeableUnits = ["g", "kg", "ml", "l", "buc"];
        if (parsed && mergeableUnits.includes(parsed.unit)) {
          let num = parsed.num, unit = parsed.unit;
          if (unit === "kg") { num *= 1000; unit = "g"; }
          if (unit === "l") { num *= 1000; unit = "ml"; }
          const key = ing.name.toLowerCase() + "|" + unit;
          if (!merged[key]) merged[key] = { name: ing.name, unit, total: 0, cat: ing.cat };
          merged[key].total += num;
        } else {
          const key = ing.name.toLowerCase();
          if (!unmerged[key]) unmerged[key] = { name: ing.name, qtys: [], cat: ing.cat };
          unmerged[key].qtys.push(ing.qty);
        }
      });
    });

    const byCat = {};
    SHOP_CATEGORIES.forEach(c => byCat[c] = []);

    if (eggUnits > 0) {
      const rounded = Math.ceil(eggUnits / 5) * 5;
      const boxNote = rounded >= 10 ? ` (${Math.ceil(rounded / 10)} cutii de 10)` : "";
      byCat["Lactate & ouă"].push({ name: "Ouă", qty: `${rounded} buc${boxNote}` });
    }

    Object.values(merged).forEach(m => {
      let display;
      if (m.unit === "g" && m.total >= 1000) display = +(m.total / 1000).toFixed(1) + " kg";
      else if (m.unit === "ml" && m.total >= 1000) display = +(m.total / 1000).toFixed(1) + " l";
      else display = Math.round(m.total) + " " + m.unit;
      const cat = byCat[m.cat] ? m.cat : "Condimente & altele";
      byCat[cat].push({ name: this.capitalize(m.name), qty: display });
    });

    Object.values(unmerged).forEach(u => {
      const cat = byCat[u.cat] ? u.cat : "Condimente & altele";
      byCat[cat].push({ name: this.capitalize(u.name), qty: u.qtys.join(" + ") });
    });

    return SHOP_CATEGORIES
      .map(cat => ({ category: cat, items: byCat[cat] }))
      .filter(g => g.items.length);
  }
};
