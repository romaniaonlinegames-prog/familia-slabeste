/* ============================================================
   Storage — interfață simplă peste Sync (Firestore sau localStorage,
   transparent). Restul aplicației nu trebuie să știe care e sursa.
   ============================================================ */

const Storage = {
  KEY_PROFILES: "profiles",
  KEY_WEIGHTS: "weights",
  KEY_CHECKS: "checks",
  KEY_SETTINGS: "settings",
  KEY_SHOPPING: "shopping",
  KEY_ACTIVITY: "activity",
  KEY_GROCERY_COSTS: "groceryCosts",
  KEY_DAY_NOTES: "dayNotes",
  KEY_CURRENT_WEEK: "currentWeek",
  KEY_WEEK_HISTORY: "weekHistory",

  get(key, fallback) {
    const v = Sync.get(key);
    return (v === undefined || v === null) ? fallback : v;
  },

  set(key, value) {
    Sync.set(key, value);
  },

  isOffline() {
    return !!Sync.offlineMode;
  },

  // --- Profiluri ---
  getProfiles() {
    return this.get(this.KEY_PROFILES, null);
  },
  setProfiles(profiles) {
    this.set(this.KEY_PROFILES, profiles);
  },

  // --- Istoric greutate: { bogdan: [{date, kg}], carmen: [...] } ---
  getWeights() {
    return this.get(this.KEY_WEIGHTS, { bogdan: [], carmen: [] });
  },
  addWeight(profileId, kg) {
    const w = this.getWeights();
    if (!w[profileId]) w[profileId] = [];
    const today = new Date().toISOString().slice(0, 10);
    const idx = w[profileId].findIndex(e => e.date === today);
    if (idx >= 0) w[profileId][idx].kg = kg;
    else w[profileId].push({ date: today, kg });
    w[profileId].sort((a, b) => a.date.localeCompare(b.date));
    this.set(this.KEY_WEIGHTS, w);
    return w;
  },

  // --- Bife mese/apă: { "2026-06-20": { "luni:breakfast": true, "waterglass:0": true } } ---
  getChecks() {
    return this.get(this.KEY_CHECKS, {});
  },
  toggleCheck(dateKey, itemKey) {
    const checks = this.getChecks();
    if (!checks[dateKey]) checks[dateKey] = {};
    checks[dateKey][itemKey] = !checks[dateKey][itemKey];
    this.set(this.KEY_CHECKS, checks);
    return checks[dateKey][itemKey];
  },
  isChecked(dateKey, itemKey) {
    const checks = this.getChecks();
    return !!(checks[dateKey] && checks[dateKey][itemKey]);
  },

  // --- Listă cumpărături ---
  getShoppingChecks() {
    return this.get(this.KEY_SHOPPING, {});
  },
  toggleShoppingItem(itemName) {
    const s = this.getShoppingChecks();
    s[itemName] = !s[itemName];
    this.set(this.KEY_SHOPPING, s);
    return s[itemName];
  },

  // --- Setări ---
  getSettings() {
    return this.get(this.KEY_SETTINGS, {
      notificationsEnabled: false,
      mealTimes: { ...MEAL_TIMES },
      waterReminderStart: "08:00",
      waterReminderEnd: "21:00",
      waterReminderEveryMin: 120
    });
  },
  setSettings(settings) {
    this.set(this.KEY_SETTINGS, settings);
  },

  // --- Activitate: { bogdan: [{date, type, minutes, kcal, steps?}], carmen: [...] } ---
  getActivity() {
    return this.get(this.KEY_ACTIVITY, { bogdan: [], carmen: [] });
  },
  addActivity(profileId, entry) {
    const a = this.getActivity();
    if (!a[profileId]) a[profileId] = [];
    a[profileId].push(entry);
    this.set(this.KEY_ACTIVITY, a);
    return a;
  },
  todayActivity(profileId) {
    const a = this.getActivity();
    const today = new Date().toISOString().slice(0, 10);
    return (a[profileId] || []).filter(e => e.date === today);
  },
  todayActivityKcal(profileId) {
    return this.todayActivity(profileId).reduce((s, e) => s + (e.kcal || 0), 0);
  },
  todayActivitySteps(profileId) {
    return this.todayActivity(profileId).reduce((s, e) => s + (e.steps || 0), 0);
  },

  // --- Costuri cumpărături: [{date, amount}] ---
  getGroceryCosts() {
    return this.get(this.KEY_GROCERY_COSTS, []);
  },
  addGroceryCost(amount) {
    const list = this.getGroceryCosts();
    const today = new Date().toISOString().slice(0, 10);
    const idx = list.findIndex(e => e.date === today);
    if (idx >= 0) list[idx].amount = amount;
    else list.push({ date: today, amount });
    list.sort((a, b) => a.date.localeCompare(b.date));
    this.set(this.KEY_GROCERY_COSTS, list);
    return list;
  },

  // --- Note zilnice (abateri de la meniu): { "2026-06-20": "text" } ---
  getDayNotes() {
    return this.get(this.KEY_DAY_NOTES, {});
  },
  getDayNote(dateKey) {
    return this.getDayNotes()[dateKey] || "";
  },
  setDayNote(dateKey, text) {
    const notes = this.getDayNotes();
    if (text && text.trim()) notes[dateKey] = text.trim();
    else delete notes[dateKey];
    this.set(this.KEY_DAY_NOTES, notes);
    return notes;
  },

  // --- Meniul săptămânii curente (generat) — dacă lipsește, se folosește WEEK1 din data.js ---
  getCurrentWeek() {
    const stored = this.get(this.KEY_CURRENT_WEEK, null);
    return stored && stored.week ? stored : { week: WEEK1, generatedAt: null, label: "Meniu inițial" };
  },
  setCurrentWeek(week, label) {
    const entry = { week, generatedAt: new Date().toISOString(), label: label || "Săptămână generată" };
    this.set(this.KEY_CURRENT_WEEK, entry);
    return entry;
  },

  // --- Istoric săptămâni — array, cele mai vechi primele ---
  getWeekHistory() {
    return this.get(this.KEY_WEEK_HISTORY, []);
  },
  archiveCurrentWeekToHistory() {
    const current = this.getCurrentWeek();
    if (!current.generatedAt) return; // nu arhivăm meniul inițial implicit
    const history = this.getWeekHistory();
    history.push(current);
    this.set(this.KEY_WEEK_HISTORY, history);
  }
};
