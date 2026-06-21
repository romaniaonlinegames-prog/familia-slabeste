/* ============================================================
   Notificări — programare locală pentru mese (cu 15 min înainte)
   și pentru hidratare, pe baza orelor din Setări.

   Notă onestă despre limitări: notificările funcționează cel mai
   bine pe Android, cu aplicația instalată ("Add to Home Screen") și
   ținută deschisă/în fundal. Pe iPhone, Safari/PWA au notificări
   foarte limitate — Apple controlează asta, nu aplicația în sine.
   Fără un backend cu push server, nu există nicio metodă 100%
   garantată să trezească telefonul exact la oră dacă aplicația e
   complet închisă de mult timp. Implementarea de mai jos face
   "best effort": recalculează și reprogramează la fiecare
   deschidere și verifică activ din minut în minut cât timp
   pagina e activă.
   ============================================================ */

const Notifications = {
  timers: [],

  async requestPermission() {
    if (!("Notification" in window)) return "unsupported";
    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied") return "denied";
    return await Notification.requestPermission();
  },

  clearAll() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  },

  fire(title, body, tag) {
    if (Notification.permission !== "granted") return;
    // Preferă Service Worker (rămâne vizibilă chiar dacă tab-ul e în fundal)
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, { body, tag, icon: "icons/icon-192.png", badge: "icons/icon-192.png" });
      });
    } else {
      new Notification(title, { body, icon: "icons/icon-192.png" });
    }
  },

  minutesUntil(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);
    let diffMs = target - now;
    if (diffMs < 0) return null; // a trecut deja azi
    return diffMs / 60000;
  },

  scheduleAt(minutesFromNow, title, body, tag) {
    if (minutesFromNow < 0) return;
    const ms = minutesFromNow * 60000;
    // setTimeout e fiabil doar până la ~24 zile și doar cât pagina rămâne activă;
    // suficient pentru reprogramare zilnică la fiecare deschidere a aplicației.
    const id = setTimeout(() => this.fire(title, body, tag), ms);
    this.timers.push(id);
  },

  // Reprogramează toate notificările pentru ZIUA CURENTĂ pe baza setărilor
  scheduleToday(dayKey, dayPlan) {
    this.clearAll();
    const settings = Storage.getSettings();
    if (!settings.notificationsEnabled || Notification.permission !== "granted") return;

    // Notificări de masă, cu 15 minute înainte
    if (!dayPlan.freeDay) {
      MEAL_ORDER.forEach(mealType => {
        const recipeId = dayPlan[mealType];
        if (!recipeId || recipeId === "note") return;
        const recipe = RECIPES[recipeId];
        const mealTime = settings.mealTimes[mealType];
        const minsUntilMeal = this.minutesUntil(mealTime);
        if (minsUntilMeal === null) return;
        const minsUntilReminder = minsUntilMeal - 15;
        if (minsUntilReminder >= 0) {
          this.scheduleAt(
            minsUntilReminder,
            `${MEAL_LABELS[mealType]} în 15 minute 🍽️`,
            recipe ? recipe.title : "E aproape ora mesei",
            `meal-${mealType}`
          );
        }
      });
    }

    // Notificări de hidratare, la interval fix între ora de start și de sfârșit
    const [startH, startM] = settings.waterReminderStart.split(":").map(Number);
    const [endH, endM] = settings.waterReminderEnd.split(":").map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    const step = settings.waterReminderEveryMin;
    const slots = [];
    for (let t = startMin; t <= endMin; t += step) slots.push(t);

    const profiles = Storage.getProfiles();
    const adults = profiles ? Object.values(profiles).filter(p => p.trackWeight) : [];
    const avgWeight = adults.length ? adults.reduce((s, p) => s + p.weightKg, 0) / adults.length : 80;
    const totalTarget = Calc.waterTargetMl(avgWeight);
    const perSlot = Math.round(totalTarget / slots.length / 50) * 50;

    slots.forEach((slotMin, i) => {
      const hh = String(Math.floor(slotMin / 60)).padStart(2, "0");
      const mm = String(slotMin % 60).padStart(2, "0");
      const minsUntil = this.minutesUntil(`${hh}:${mm}`);
      if (minsUntil === null) return;
      this.scheduleAt(
        minsUntil,
        "Pauză de apă 💧",
        `Bea ${perSlot} ml apă acum. Bifează în aplicație după.`,
        `water-${i}`
      );
    });
  }
};
