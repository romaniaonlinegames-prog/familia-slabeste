/* ============================================================
   Familia Slăbește — app.js (logica principală)
   ============================================================ */

const DAY_KEY_BY_JSDAY = ["duminica", "luni", "marti", "miercuri", "joi", "vineri", "sambata"];

const App = {
  tab: "azi",
  profiles: null,

  async init() {
    // Plasă de siguranță absolută: dacă modulul sync.js n-a apucat deloc
    // să se încarce (eroare de rețea/script), definim aici un Sync minimal
    // bazat direct pe localStorage, ÎNAINTE de orice alt cod care îl
    // folosește — ca aplicația să meargă oricum, indiferent ce se întâmplă.
    if (typeof Sync === "undefined" || !Sync) {
      window.Sync = {
        offlineMode: true,
        authStatus: "offline",
        cache: {},
        loadLocalCache() {
          ["profiles", "weights", "checks", "shopping", "settings", "activity"].forEach(name => {
            try {
              const raw = localStorage.getItem("fs_" + name);
              this.cache[name] = raw ? JSON.parse(raw) : null;
            } catch (e) { this.cache[name] = null; }
          });
        },
        async init() { this.loadLocalCache(); },
        get(name) { return this.cache[name]; },
        set(name, value) {
          this.cache[name] = value;
          try { localStorage.setItem("fs_" + name, JSON.stringify(value)); } catch (e) {}
        }
      };
      Sync.loadLocalCache();
    }

    this.bindNav();
    this.bindTopbar();
    this.registerSW();

    // Buton de urgență: dacă încărcarea durează prea mult, utilizatorul
    // poate continua manual, fără să aștepte sau să rămână blocat.
    let skipped = false;
    const skipBtn = document.getElementById("loading-skip");
    const skipTimer = setTimeout(() => { if (skipBtn) skipBtn.style.display = "inline-flex"; }, 4000);
    const skipPromise = new Promise((resolve) => {
      if (skipBtn) skipBtn.addEventListener("click", () => { skipped = true; resolve("skipped"); });
    });

    // Plasă de siguranță: dacă sincronizarea nu răspunde în 10 secunde
    // dintr-un motiv neprevăzut, pornim oricum aplicația în mod local,
    // ca să nu rămână nimeni blocat pe ecranul de încărcare.
    let timeoutId;
    const timeoutFallback = new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        console.error("Sincronizarea a depășit timpul limită, pornesc în mod local");
        resolve("timeout");
      }, 10000);
    });

    try {
      await Promise.race([
        Sync.init((docName, data) => this.onRemoteChange(docName, data)),
        timeoutFallback,
        skipPromise
      ]);
    } catch (e) {
      console.error("Eroare neașteptată la pornire, continui în mod local", e);
    }
    clearTimeout(timeoutId);
    clearTimeout(skipTimer);
    if (skipBtn) skipBtn.style.display = "none";

    if (skipped) {
      // utilizatorul a apăsat manual "Continuă fără sincronizare"
      Sync.offlineMode = true;
      Sync.authStatus = "offline";
      if (Sync.loadLocalCache) Sync.loadLocalCache();
    } else if (!Sync.authStatus) {
      // stare neașteptată (n-ar trebui să se întâmple) — plasă de siguranță finală
      Sync.offlineMode = true;
      Sync.authStatus = "offline";
      if (Sync.loadLocalCache) Sync.loadLocalCache();
    }

    this.updateSyncBadge();
    document.getElementById("loading-screen").classList.add("hidden");

    if (Sync.authStatus === "needs-login") {
      this.renderLogin();
      return;
    }

    this.profiles = Storage.getProfiles();
    if (!this.profiles) {
      this.renderOnboarding();
    } else {
      this.switchTab("azi");
    }
  },

  renderLogin() {
    const c = document.getElementById("app-content");
    c.innerHTML = `
      <div class="onb-hero">
        <div class="big">🔒</div>
        <h1>Conectare</h1>
        <p style="color:var(--ink-soft)">Intră cu email-ul și parola create în Firebase Console, pentru tine sau Carmen.</p>
      </div>
      <div class="card">
        <label>Email</label>
        <input type="text" id="login-email" autocomplete="username" placeholder="bogdan@exemplu.ro">
        <label>Parolă</label>
        <input type="password" id="login-password" autocomplete="current-password" placeholder="parola ta">
        <p id="login-error" style="color:var(--danger);font-size:13px;display:none;margin-top:10px"></p>
        <button class="btn btn-primary" style="margin-top:14px" id="login-submit">Conectează-te</button>
      </div>
      <p style="text-align:center;font-size:12px;color:var(--ink-soft)">Nu ai cont încă? Se creează manual din Firebase Console → Authentication → Users → Add user.</p>
    `;
    const submit = async () => {
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      const errEl = document.getElementById("login-error");
      const btn = document.getElementById("login-submit");
      errEl.style.display = "none";
      if (!email || !password) return;
      btn.textContent = "Se conectează…";
      btn.disabled = true;
      try {
        await Sync.login(email, password);
        this.updateSyncBadge();
        this.profiles = Storage.getProfiles();
        if (!this.profiles) this.renderOnboarding();
        else this.switchTab("azi");
      } catch (e) {
        errEl.textContent = e.message;
        errEl.style.display = "block";
        btn.textContent = "Conectează-te";
        btn.disabled = false;
      }
    };
    document.getElementById("login-submit").addEventListener("click", submit);
    document.getElementById("login-password").addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
  },

  updateSyncBadge() {
    const badge = document.getElementById("sync-badge");
    if (Storage.isOffline()) {
      badge.textContent = "📴 doar local";
      badge.classList.add("show", "offline");
    } else {
      badge.textContent = "☁️ sincronizat";
      badge.classList.add("show");
      badge.classList.remove("offline");
    }
  },

  // Re-randează tab-ul curent când vine o schimbare de pe celălalt telefon,
  // dar nu dacă cineva tastează ceva chiar acum (ca să nu pierdem input-ul).
  onRemoteChange(docName, data) {
    if (!this.profiles && docName !== "profiles") return;
    const relevantTabs = {
      profiles: ["azi", "progres", "profil"],
      weights: ["progres"],
      checks: ["azi"],
      shopping: ["cumparaturi"],
      settings: ["profil", "azi"],
      activity: ["azi", "progres"]
    };
    if (docName === "profiles" && data && !this.profiles) {
      this.profiles = data;
    }
    const active = document.activeElement;
    const isTyping = active && ["INPUT", "SELECT", "TEXTAREA"].includes(active.tagName);
    if (isTyping) return;
    if (relevantTabs[docName] && relevantTabs[docName].includes(this.tab) && this.profiles) {
      this.switchTab(this.tab);
    }
  },

  bindNav() {
    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => {
        if (!this.profiles) return;
        this.switchTab(btn.dataset.tab);
      });
    });
  },

  bindTopbar() {
    document.getElementById("btn-notif").addEventListener("click", async () => {
      const status = await Notifications.requestPermission();
      const settings = Storage.getSettings();
      if (status === "granted") {
        settings.notificationsEnabled = true;
        Storage.setSettings(settings);
        document.getElementById("btn-notif").classList.add("active");
        this.toast("Notificări activate ✅");
        this.scheduleTodayNotifications();
      } else if (status === "denied") {
        this.toast("Notificările sunt blocate din setările telefonului");
      } else if (status === "unsupported") {
        this.toast("Telefonul/browserul ăsta nu suportă notificări web");
      }
    });
    const settings = Storage.getSettings();
    if (settings.notificationsEnabled && Notification?.permission === "granted") {
      document.getElementById("btn-notif").classList.add("active");
    }
  },

  switchTab(tab) {
    this.tab = tab;
    document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
    const map = {
      azi: () => this.renderAzi(),
      meniu: () => this.renderMeniu(),
      cumparaturi: () => this.renderCumparaturi(),
      progres: () => this.renderProgres(),
      profil: () => this.renderProfil()
    };
    (map[tab] || map.azi)();
    document.getElementById("app-content").scrollTo(0, 0);
    window.scrollTo(0, 0);
  },

  toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  },

  todayKey() {
    return DAY_KEY_BY_JSDAY[new Date().getDay()];
  },

  dateKey() {
    return new Date().toISOString().slice(0, 10);
  },

  registerSW() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  },

  scheduleTodayNotifications() {
    const dk = this.todayKey();
    Notifications.scheduleToday(dk, WEEK1[dk]);
  },

  // ============================================================
  // ONBOARDING
  // ============================================================
  renderOnboarding() {
    const c = document.getElementById("app-content");
    c.innerHTML = `
      <div class="onb-hero">
        <div class="big">🌿</div>
        <h1>Bine ați venit!</h1>
        <p style="color:var(--ink-soft)">Hai să configurăm profilurile familiei ca să personalizăm mesele, apa și obiectivele.</p>
      </div>

      <div class="card">
        <h2>👤 Bogdan</h2>
        ${this.profileFormFields("bogdan", { age: 35, weightKg: 120, heightCm: 178, gender: "M" })}
      </div>

      <div class="card">
        <h2>👤 Carmen</h2>
        ${this.profileFormFields("carmen", { age: 34, weightKg: 80, heightCm: 165, gender: "F" })}
      </div>

      <div class="card">
        <h2>🧒 Ștefan</h2>
        <p style="font-size:13px;color:var(--ink-soft);margin-top:-4px">
          Ștefan participă la mesele de familie, cu porție de copil. Nu urmărim greutatea lui și nu facem
          restricție calorică pentru el — la 4 ani, ce contează e un obicei alimentar sănătos, nu un număr pe cântar.
          Dacă aveți o îngrijorare reală despre greutatea lui, cel mai bun pas e un consult la medicul pediatru.
        </p>
        <label>Vârstă</label>
        <input type="number" id="onb-stefan-age" value="4" min="1" max="17">
      </div>

      <button class="btn btn-primary" id="onb-save">Salvează și continuă</button>
    `;

    c.querySelectorAll(".seg").forEach(seg => {
      seg.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          seg.querySelectorAll("button").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
        });
      });
    });

    document.getElementById("onb-save").addEventListener("click", () => this.saveOnboarding());
  },

  profileFormFields(id, d) {
    return `
      <div class="field-row">
        <div>
          <label>Vârstă</label>
          <input type="number" id="onb-${id}-age" value="${d.age}">
        </div>
        <div>
          <label>Greutate (kg)</label>
          <input type="number" id="onb-${id}-weight" value="${d.weightKg}" step="0.1">
        </div>
      </div>
      <div class="field-row">
        <div>
          <label>Înălțime (cm)</label>
          <input type="number" id="onb-${id}-height" value="${d.heightCm}">
        </div>
        <div>
          <label>Gen</label>
          <select id="onb-${id}-gender">
            <option value="M" ${d.gender === "M" ? "selected" : ""}>Bărbat</option>
            <option value="F" ${d.gender === "F" ? "selected" : ""}>Femeie</option>
          </select>
        </div>
      </div>
      <label>Nivel de activitate</label>
      <div class="seg" id="onb-${id}-activity">
        <button type="button" data-v="sedentar" class="${id === 'bogdan' ? '' : 'active'}">Sedentar</button>
        <button type="button" data-v="moderat" class="active">Moderat</button>
        <button type="button" data-v="intens">Intens</button>
      </div>
    `;
  },

  readActivitySeg(id) {
    const seg = document.getElementById(`onb-${id}-activity`);
    const active = seg.querySelector("button.active");
    return active ? active.dataset.v : "moderat";
  },

  saveOnboarding() {
    const buildProfile = (id, name, trackWeight) => ({
      id, name,
      age: +document.getElementById(`onb-${id}-age`).value || 30,
      weightKg: +document.getElementById(`onb-${id}-weight`).value || 70,
      heightCm: +document.getElementById(`onb-${id}-height`).value || 170,
      gender: document.getElementById(`onb-${id}-gender`).value,
      activity: this.readActivitySeg(id),
      goal: "slabit",
      trackWeight
    });

    const profiles = {
      bogdan: buildProfile("bogdan", "Bogdan", true),
      carmen: buildProfile("carmen", "Carmen", true),
      stefan: {
        id: "stefan", name: "Ștefan",
        age: +document.getElementById("onb-stefan-age").value || 4,
        trackWeight: false
      }
    };

    Storage.setProfiles(profiles);
    Storage.addWeight("bogdan", profiles.bogdan.weightKg);
    Storage.addWeight("carmen", profiles.carmen.weightKg);
    this.profiles = profiles;
    this.toast("Profiluri salvate 🎉");
    this.switchTab("azi");
  },

  // ============================================================
  // TAB: AZI
  // ============================================================
  renderAzi() {
    const c = document.getElementById("app-content");
    const dk = this.todayKey();
    const plan = WEEK1[dk];
    const dateKey = this.dateKey();
    const settings = Storage.getSettings();

    let mealsHtml = "";
    if (plan.freeDay) {
      mealsHtml = `<div class="card"><div class="free-day-note">🎉 ${plan.note}</div></div>`;
    } else {
      mealsHtml = `<div class="card">` + ["breakfast", "lunch", "snack", "dinner"].map(type => {
        const rid = plan[type];
        if (!rid || rid === "note") return "";
        const r = RECIPES[rid];
        const itemKey = `${dk}:${type}`;
        const checked = Storage.isChecked(dateKey, itemKey);
        return `
          <div class="meal-row">
            <button class="meal-check ${checked ? "checked" : ""}" data-mealkey="${itemKey}">${checked ? "✓" : ""}</button>
            <div class="meal-info" data-recipe="${rid}">
              <div class="meal-time">${settings.mealTimes[type]} · ${MEAL_LABELS[type]}</div>
              <div class="meal-title ${checked ? "done" : ""}">${r.title}</div>
              <div class="meal-sub">${r.kcal} kcal</div>
            </div>
            <div class="chev">›</div>
          </div>`;
      }).join("") + (plan.note ? `<p style="margin-top:10px;font-size:12.5px;color:var(--ink-soft)">📝 ${plan.note}</p>` : "") + `</div>`;
    }

    // Water
    const adults = ["bogdan", "carmen"].map(id => this.profiles[id]);
    const avgW = adults.reduce((s, p) => s + p.weightKg, 0) / adults.length;
    const target = Calc.waterTargetMl(avgW);
    const waterChecks = Storage.getChecks()[dateKey] || {};
    const glassesLogged = Object.keys(waterChecks).filter(k => k.startsWith("waterglass:")).length;
    const glassSize = 250;
    const drunk = glassesLogged * glassSize;
    const pct = Math.min(100, Math.round((drunk / target) * 100));

    // Activitate
    if (!this._activityPerson) this._activityPerson = "bogdan";
    const actPerson = this._activityPerson;
    const todayActs = Storage.todayActivity(actPerson);
    const todayKcal = Storage.todayActivityKcal(actPerson);
    const todaySteps = Storage.todayActivitySteps(actPerson);

    c.innerHTML = `
      <h1>${DAY_LABELS[dk]}</h1>

      <div class="water-card">
        <div class="water-top">
          <div class="water-amount">${drunk} ml</div>
          <div class="water-target">din ${target} ml țintă</div>
        </div>
        <div class="water-bar-track"><div class="water-bar-fill" style="width:${pct}%"></div></div>
        <div class="water-actions">
          <button class="glass-btn" id="water-add">+ 1 pahar (250ml)</button>
          <button class="glass-btn" id="water-undo">– anulează</button>
        </div>
      </div>

      <div class="section-title">Mesele zilei</div>
      ${mealsHtml}

      <div class="section-title">Mișcare azi</div>
      <div class="card">
        <div class="seg" id="activity-person-toggle">
          <button data-p="bogdan" class="${actPerson === "bogdan" ? "active" : ""}">Bogdan</button>
          <button data-p="carmen" class="${actPerson === "carmen" ? "active" : ""}">Carmen</button>
        </div>

        ${todayActs.length ? `
          <div style="margin-top:10px">
            ${todayActs.map(e => `
              <div class="activity-log-item">
                <span class="ic">${e.icon || "✨"}</span>
                <span class="meta">${e.type}${e.minutes ? " · " + e.minutes + " min" : ""}${e.steps ? " · " + e.steps + " pași" : ""}</span>
                <span class="kcal">${e.kcal} kcal</span>
              </div>
            `).join("")}
            <p style="font-size:12.5px;color:var(--ink-soft);margin-top:6px">Total azi: <b>${todayKcal} kcal</b>${todaySteps ? ` · ${todaySteps} pași` : ""}</p>
          </div>
        ` : `<p style="font-size:13px;color:var(--ink-soft);margin-top:10px">Nimic logat azi încă.</p>`}

        <div class="activity-grid" id="activity-presets">
          ${ACTIVITY_PRESETS.map(p => `
            <button class="activity-preset" data-id="${p.id}">
              <span class="ic">${p.icon}</span>${p.label}
            </button>
          `).join("")}
        </div>
        <div id="activity-duration-row" style="display:none;margin-top:12px">
          <label>Durată (minute)</label>
          <input type="number" id="activity-minutes" value="30" min="1">
          <button class="btn btn-primary" style="margin-top:8px" id="activity-save">Salvează</button>
        </div>

        <button class="btn btn-outline" style="margin-top:12px" id="pedometer-toggle">📍 Contor de pași (experimental)</button>
        <div id="pedometer-area"></div>
      </div>

      <div class="section-title">Note despre ziua de azi</div>
      <div class="card">
        <p style="font-size:12.5px;color:var(--ink-soft);margin-top:-4px">Ai mâncat ceva în plus sau ai sărit o masă? Notează aici, pe scurt.</p>
        <textarea id="day-note" rows="3" placeholder="ex: am mâncat și o felie de pizza la prânz">${Storage.getDayNote(dateKey)}</textarea>
        <button class="btn btn-ghost" style="margin-top:10px" id="save-day-note">Salvează nota</button>
      </div>

      <div class="section-title">Greutate rapidă</div>
      <div class="card">
        <div class="field-row">
          <div>
            <label>Bogdan (kg)</label>
            <input type="number" step="0.1" id="qw-bogdan" placeholder="${this.lastWeight("bogdan")}">
          </div>
          <div>
            <label>Carmen (kg)</label>
            <input type="number" step="0.1" id="qw-carmen" placeholder="${this.lastWeight("carmen")}">
          </div>
        </div>
        <button class="btn btn-ghost" style="margin-top:10px" id="qw-save">Salvează cântărirea de azi</button>
      </div>
    `;

    c.querySelectorAll(".meal-check").forEach(btn => {
      btn.addEventListener("click", () => {
        Storage.toggleCheck(dateKey, btn.dataset.mealkey);
        this.renderAzi();
      });
    });
    c.querySelectorAll(".meal-info").forEach(el => {
      el.addEventListener("click", () => this.openRecipeModal(el.dataset.recipe));
    });
    document.getElementById("water-add").addEventListener("click", () => {
      const checks = Storage.getChecks();
      if (!checks[dateKey]) checks[dateKey] = {};
      const n = Object.keys(checks[dateKey]).filter(k => k.startsWith("waterglass:")).length;
      checks[dateKey][`waterglass:${n}`] = true;
      Storage.set(Storage.KEY_CHECKS, checks);
      this.renderAzi();
    });
    document.getElementById("water-undo").addEventListener("click", () => {
      const checks = Storage.getChecks();
      const keys = Object.keys(checks[dateKey] || {}).filter(k => k.startsWith("waterglass:"));
      if (keys.length) {
        delete checks[dateKey][keys[keys.length - 1]];
        Storage.set(Storage.KEY_CHECKS, checks);
        this.renderAzi();
      }
    });
    document.getElementById("qw-save").addEventListener("click", () => {
      const bw = +document.getElementById("qw-bogdan").value;
      const cw = +document.getElementById("qw-carmen").value;
      if (bw) Storage.addWeight("bogdan", bw);
      if (cw) Storage.addWeight("carmen", cw);
      if (bw || cw) { this.toast("Greutate salvată 📈"); this.renderAzi(); }
    });
    document.getElementById("save-day-note").addEventListener("click", () => {
      const text = document.getElementById("day-note").value;
      Storage.setDayNote(dateKey, text);
      this.toast("Notă salvată 📝");
    });

    // Activitate — schimbare persoană
    document.querySelectorAll("#activity-person-toggle button").forEach(btn => {
      btn.addEventListener("click", () => {
        this._activityPerson = btn.dataset.p;
        this.renderAzi();
      });
    });

    // Activitate — selectare preset + salvare
    let selectedPreset = null;
    document.querySelectorAll("#activity-presets .activity-preset").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#activity-presets .activity-preset").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedPreset = ACTIVITY_PRESETS.find(p => p.id === btn.dataset.id);
        document.getElementById("activity-duration-row").style.display = "block";
      });
    });
    document.getElementById("activity-save").addEventListener("click", () => {
      if (!selectedPreset) return;
      const minutes = +document.getElementById("activity-minutes").value || 30;
      const weightKg = this.profiles[this._activityPerson].weightKg;
      const kcal = Calc.activityKcal(selectedPreset.met, weightKg, minutes);
      Storage.addActivity(this._activityPerson, {
        date: dateKey, type: selectedPreset.label, icon: selectedPreset.icon, minutes, kcal
      });
      this.toast(`${selectedPreset.label} salvată — ${kcal} kcal 🔥`);
      this.renderAzi();
    });

    // Contor de pași experimental
    document.getElementById("pedometer-toggle").addEventListener("click", () => this.togglePedometer());

    if (Storage.getSettings().notificationsEnabled) this.scheduleTodayNotifications();
  },

  lastWeight(id) {
    const w = Storage.getWeights()[id] || [];
    return w.length ? w[w.length - 1].kg : this.profiles[id].weightKg;
  },

  // ============================================================
  // CONTOR DE PAȘI (experimental)
  // ============================================================
  async togglePedometer() {
    const area = document.getElementById("pedometer-area");
    if (!area) return;

    if (!Pedometer.isSupported()) {
      this.toast("Telefonul/browserul ăsta nu suportă senzori de mișcare");
      return;
    }

    if (Pedometer.active) {
      const steps = Pedometer.stop();
      const weightKg = this.profiles[this._activityPerson].weightKg;
      const { kcal } = Pedometer.estimate(steps, weightKg);
      const minutes = this._pedoStart ? Math.max(1, Math.round((Date.now() - this._pedoStart) / 60000)) : 1;
      if (steps > 10) {
        Storage.addActivity(this._activityPerson, {
          date: this.dateKey(), type: "Pași (contor live)", icon: "📍", minutes, steps, kcal
        });
        this.toast(`${steps} pași salvați — ${kcal} kcal 🔥`);
      } else {
        this.toast("Prea puțini pași detectați, nu am salvat");
      }
      this.renderAzi();
      return;
    }

    const granted = await Pedometer.requestPermissionIfNeeded();
    if (!granted) {
      this.toast("Ai nevoie să permiți accesul la senzorul de mișcare");
      return;
    }
    this._pedoStart = Date.now();
    Pedometer.start((steps) => {
      const el = document.getElementById("pedometer-live-count");
      if (el) el.textContent = steps;
    });
    area.innerHTML = `
      <div class="pedometer-card">
        <div class="pedometer-count" id="pedometer-live-count">0</div>
        <div class="pedometer-sub">pași — ține telefonul în mână și plimbă-te. Apasă din nou butonul de mai sus ca să oprești și să salvezi.</div>
      </div>
    `;
    document.getElementById("pedometer-toggle").textContent = "⏹️ Oprește și salvează";
  },

  // ============================================================
  // TAB: MENIU
  // ============================================================
  renderMeniu() {
    const c = document.getElementById("app-content");
    const days = Object.keys(WEEK1);
    c.innerHTML = `
      <h1>Meniu — Săptămâna 1</h1>
      <p style="color:var(--ink-soft);font-size:13px">Bază comună de familie: aceeași mâncare pentru toți, porție de copil mai mică pentru Ștefan. Fără broccoli, fără dovlecei.</p>
      ${days.map(dk => {
        const plan = WEEK1[dk];
        let kcal = 0;
        if (!plan.freeDay) {
          ["breakfast", "lunch", "snack", "dinner"].forEach(t => {
            if (plan[t] && plan[t] !== "note") kcal += RECIPES[plan[t]].kcal;
          });
        }
        return `
          <div class="card day-card">
            <button class="day-head" data-day="${dk}">
              <b>${DAY_LABELS[dk]}</b>
              <span class="day-kcal">${plan.freeDay ? "zi liberă" : kcal + " kcal"}</span>
            </button>
            <div class="day-body" id="day-body-${dk}">
              ${plan.freeDay
                ? `<div class="free-day-note">${plan.note}</div>`
                : ["breakfast", "lunch", "snack", "dinner"].map(t => {
                    if (!plan[t] || plan[t] === "note") return "";
                    const r = RECIPES[plan[t]];
                    return `<div class="meal-row" data-recipe="${plan[t]}" style="cursor:pointer">
                      <div class="meal-info">
                        <div class="meal-time">${MEAL_LABELS[t]}</div>
                        <div class="meal-title">${r.title}</div>
                        <div class="meal-sub">${r.kcal} kcal · ${r.protein}g proteină</div>
                      </div>
                      <div class="chev">›</div>
                    </div>`;
                  }).join("") + (plan.note ? `<p style="font-size:12.5px;color:var(--ink-soft);margin-top:8px">📝 ${plan.note}</p>` : "")
              }
            </div>
          </div>
        `;
      }).join("")}
    `;

    c.querySelectorAll(".day-head").forEach(btn => {
      btn.addEventListener("click", () => {
        document.getElementById(`day-body-${btn.dataset.day}`).classList.toggle("open");
      });
    });
    c.querySelectorAll("[data-recipe]").forEach(el => {
      el.addEventListener("click", (e) => { e.stopPropagation(); this.openRecipeModal(el.dataset.recipe); });
    });
    const todayBody = document.getElementById(`day-body-${this.todayKey()}`);
    if (todayBody) todayBody.classList.add("open");
  },

  openRecipeModal(rid) {
    const r = RECIPES[rid];
    if (!r) return;
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-sheet" style="position:relative">
        <button class="modal-close-btn" id="modal-x">✕</button>
        <div class="modal-close"></div>
        <h2>${r.title}</h2>
        <span class="pill">${MEAL_LABELS[r.type]} · ${r.servings} porții</span>
        <div class="macro-row">
          <div class="macro-chip"><b>${r.kcal}</b>kcal</div>
          <div class="macro-chip"><b>${r.protein}g</b>proteină</div>
          <div class="macro-chip"><b>${r.carbs}g</b>carbo</div>
          <div class="macro-chip"><b>${r.fat}g</b>grăsime</div>
        </div>
        <h3 style="margin-top:16px">Ingrediente</h3>
        ${r.ingredients.map(i => `<div class="recipe-ing"><span>${i.name}</span><span class="shop-qty">${i.qty}</span></div>`).join("")}
        <h3 style="margin-top:16px">Mod de preparare</h3>
        <ol class="recipe-steps">${r.steps.map(s => `<li>${s}</li>`).join("")}</ol>
        ${r.tip ? `<p style="font-size:13px;color:var(--ink-soft);margin-top:10px">💡 ${r.tip}</p>` : ""}
      </div>
    `;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    overlay.querySelector("#modal-x").addEventListener("click", close);
  },

  // ============================================================
  // TAB: CUMPĂRĂTURI
  // ============================================================
  renderCumparaturi() {
    const c = document.getElementById("app-content");
    const checks = Storage.getShoppingChecks();
    const allKeys = SHOPPING_LIST_WEEK1.flatMap(g => g.items.map(it => `${g.category}:${it.name}`));
    const checkedCount = allKeys.filter(k => checks[k]).length;
    const costs = Storage.getGroceryCosts();
    const lastCosts = costs.slice(-5).reverse();

    c.innerHTML = `
      <h1>Listă cumpărături</h1>
      <p style="color:var(--ink-soft);font-size:13px">Cantități reale pentru toată Săptămâna 1 — cumperi o dată, bifezi pe măsură ce iei de pe raft.</p>

      <div class="card card-tight" style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:800;font-size:15px">${checkedCount} / ${allKeys.length} luate</span>
        <button class="btn btn-ghost" style="width:auto;padding:8px 14px;font-size:12.5px" id="reset-shopping">Resetează bifele</button>
      </div>

      ${SHOPPING_LIST_WEEK1.map(group => `
        <div class="section-title">${group.category}</div>
        <div class="card card-tight">
          ${group.items.map(it => {
            const key = `${group.category}:${it.name}`;
            const done = !!checks[key];
            return `<div class="shop-item ${done ? "done" : ""}" data-key="${key}">
              <button class="meal-check ${done ? "checked" : ""}" style="width:22px;height:22px;font-size:11px">${done ? "✓" : ""}</button>
              <span class="shop-name">${it.name}</span>
              <span class="shop-qty">${it.qty}</span>
            </div>`;
          }).join("")}
        </div>
      `).join("")}

      <div class="section-title">Cost cumpărături</div>
      <div class="card">
        <p style="font-size:13px;color:var(--ink-soft);margin-top:-4px">Notează suma de pe bon, ca să vezi în timp cât cheltuiți pe săptămână.</p>
        <label>Sumă cheltuită (lei)</label>
        <input type="number" step="0.1" id="grocery-cost-input" placeholder="ex. 285">
        <button class="btn btn-primary" style="margin-top:10px" id="save-grocery-cost">Salvează costul</button>
        ${lastCosts.length ? `
          <div class="section-title" style="margin-top:18px">Istoric</div>
          ${lastCosts.map(e => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line);font-size:13.5px">
              <span style="color:var(--ink-soft)">${e.date}</span>
              <b>${e.amount} lei</b>
            </div>`).join("")}
        ` : ""}
      </div>
    `;

    c.querySelectorAll(".shop-item").forEach(el => {
      el.addEventListener("click", () => {
        Storage.toggleShoppingItem(el.dataset.key);
        this.renderCumparaturi();
      });
    });

    document.getElementById("reset-shopping").addEventListener("click", () => {
      Storage.set(Storage.KEY_SHOPPING, {});
      this.toast("Bife resetate 🔄");
      this.renderCumparaturi();
    });

    document.getElementById("save-grocery-cost").addEventListener("click", () => {
      const val = +document.getElementById("grocery-cost-input").value;
      if (!val) return;
      Storage.addGroceryCost(val);
      this.toast("Cost salvat 💰");
      this.renderCumparaturi();
    });
  },

  // ============================================================
  // TAB: PROGRES
  // ============================================================
  renderProgres() {
    const c = document.getElementById("app-content");
    const weights = Storage.getWeights();
    c.innerHTML = `
      <h1>Progres</h1>
      ${["bogdan", "carmen"].map(id => this.renderProfileProgress(id, weights[id] || [])).join("")}

      <div class="section-title">Ștefan</div>
      <div class="card">
        <div class="profile-card">
          <div class="avatar kid">Ș</div>
          <div class="profile-meta">
            <h3>Ștefan, ${this.profiles.stefan.age} ani</h3>
            <div class="profile-stats">Participă la mesele de familie, fără urmărire de greutate.</div>
          </div>
        </div>
      </div>
    `;
    this.bindProgressEvents();
  },

  renderProfileProgress(id, entries) {
    const p = this.profiles[id];
    const maint = Calc.maintenanceCalories(p);
    const target = Calc.targetCalories(p);
    const bmi = Calc.bmi(entries.length ? entries[entries.length - 1].kg : p.weightKg, p.heightCm);
    const start = entries.length ? entries[0].kg : p.weightKg;
    const current = entries.length ? entries[entries.length - 1].kg : p.weightKg;
    const diff = (current - start).toFixed(1);

    return `
      <div class="section-title">${p.name}</div>
      <div class="card">
        <div class="macro-row">
          <div class="macro-chip"><b>${current}</b>kg acum</div>
          <div class="macro-chip"><b>${diff <= 0 ? diff : "+" + diff}</b>kg total</div>
          <div class="macro-chip"><b>${bmi}</b>IMC</div>
        </div>
        ${this.renderChart(entries)}
        <div class="btn-row" style="margin-top:10px">
          <button class="btn btn-outline" data-toggle-add="${id}">+ Adaugă cântărire</button>
        </div>
        <div id="add-weight-${id}" style="display:none;margin-top:10px">
          <div class="field-row">
            <div><label>Greutate (kg)</label><input type="number" step="0.1" id="nw-${id}"></div>
            <div><label>Dată</label><input type="date" id="nd-${id}" value="${this.dateKey()}"></div>
          </div>
          <button class="btn btn-primary" style="margin-top:8px" data-save-weight="${id}">Salvează</button>
        </div>
        <div class="section-title" style="margin-top:18px">Necesar caloric estimat</div>
        <p style="font-size:13px;margin-top:-4px">Menținere: <b>${maint} kcal/zi</b> · Țintă slăbit: <b>${target} kcal/zi</b></p>

        <div class="section-title" style="margin-top:18px">Mișcare — ultimele 7 zile</div>
        ${this.renderActivityWeekSummary(id)}
      </div>
    `;
  },

  renderActivityWeekSummary(id) {
    const all = (Storage.getActivity()[id] || []);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 6);
    const cutoffKey = cutoff.toISOString().slice(0, 10);
    const recent = all.filter(e => e.date >= cutoffKey);
    if (!recent.length) {
      return `<p style="font-size:13px;color:var(--ink-soft);margin-top:-4px">Nimic logat încă în Mișcare (tab Azi).</p>`;
    }
    const totalKcal = recent.reduce((s, e) => s + (e.kcal || 0), 0);
    const totalMin = recent.reduce((s, e) => s + (e.minutes || 0), 0);
    const totalSteps = recent.reduce((s, e) => s + (e.steps || 0), 0);
    return `
      <div class="macro-row" style="margin-top:-4px">
        <div class="macro-chip"><b>${totalKcal}</b>kcal arse</div>
        <div class="macro-chip"><b>${totalMin}</b>minute</div>
        ${totalSteps ? `<div class="macro-chip"><b>${totalSteps}</b>pași</div>` : ""}
      </div>
    `;
  },

  renderChart(entries) {
    if (entries.length < 2) {
      return `<div class="chart-empty">Adaugă cel puțin 2 cântăriri ca să apară graficul.</div>`;
    }
    const w = 500, h = 140, pad = 24;
    const kgs = entries.map(e => e.kg);
    const min = Math.min(...kgs) - 0.5, max = Math.max(...kgs) + 0.5;
    const xStep = (w - pad * 2) / (entries.length - 1);
    const yFor = (kg) => h - pad - ((kg - min) / (max - min)) * (h - pad * 2);
    const points = entries.map((e, i) => `${pad + i * xStep},${yFor(e.kg)}`).join(" ");
    const dots = entries.map((e, i) => `<circle cx="${pad + i * xStep}" cy="${yFor(e.kg)}" r="3.5" fill="#2F5233" />`).join("");
    return `
      <div class="chart-wrap">
        <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
          <polyline points="${points}" fill="none" stroke="#2F5233" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
          ${dots}
        </svg>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--ink-soft)">
        <span>${entries[0].date}</span><span>${entries[entries.length - 1].date}</span>
      </div>
    `;
  },

  bindProgressEvents() {
    document.querySelectorAll("[data-toggle-add]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.toggleAdd;
        const el = document.getElementById(`add-weight-${id}`);
        el.style.display = el.style.display === "none" ? "block" : "none";
      });
    });
    document.querySelectorAll("[data-save-weight]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.saveWeight;
        const kg = +document.getElementById(`nw-${id}`).value;
        if (!kg) return;
        Storage.addWeight(id, kg);
        this.toast("Cântărire salvată 📈");
        this.renderProgres();
      });
    });
  },

  // ============================================================
  // TAB: PROFIL / FAMILIA / SETĂRI
  // ============================================================
  renderProfil() {
    const c = document.getElementById("app-content");
    const settings = Storage.getSettings();
    c.innerHTML = `
      <h1>Familia & Setări</h1>

      ${["bogdan", "carmen"].map(id => {
        const p = this.profiles[id];
        return `
        <div class="card">
          <div class="profile-card">
            <div class="avatar">${p.name[0]}</div>
            <div class="profile-meta">
              <h3>${p.name}</h3>
              <div class="profile-stats">${p.age} ani · ${p.heightCm} cm · ${p.weightKg} kg start</div>
            </div>
          </div>
          <label>Greutate curentă (kg)</label>
          <input type="number" step="0.1" id="ed-${id}-weight" value="${p.weightKg}">
          <label>Înălțime (cm)</label>
          <input type="number" id="ed-${id}-height" value="${p.heightCm}">
          <label>Nivel activitate</label>
          <div class="seg" id="ed-${id}-activity">
            <button type="button" data-v="sedentar" class="${p.activity === 'sedentar' ? 'active' : ''}">Sedentar</button>
            <button type="button" data-v="moderat" class="${p.activity === 'moderat' ? 'active' : ''}">Moderat</button>
            <button type="button" data-v="intens" class="${p.activity === 'intens' ? 'active' : ''}">Intens</button>
          </div>
        </div>`;
      }).join("")}

      <div class="card">
        <div class="profile-card">
          <div class="avatar kid">Ș</div>
          <div class="profile-meta"><h3>Ștefan</h3><div class="profile-stats">${this.profiles.stefan.age} ani · doar mese de familie</div></div>
        </div>
      </div>

      <button class="btn btn-primary" id="save-profiles">Salvează modificările</button>

      <div class="section-title">Ore mese</div>
      <div class="card">
        ${["breakfast", "lunch", "snack", "dinner"].map(t => `
          <label>${MEAL_LABELS[t]}</label>
          <input type="time" id="time-${t}" value="${settings.mealTimes[t]}">
        `).join("")}
        <button class="btn btn-ghost" style="margin-top:10px" id="save-times">Salvează orele</button>
      </div>

      <div class="section-title">Hidratare — notificări</div>
      <div class="card">
        <div class="field-row">
          <div><label>Start</label><input type="time" id="water-start" value="${settings.waterReminderStart}"></div>
          <div><label>Stop</label><input type="time" id="water-end" value="${settings.waterReminderEnd}"></div>
        </div>
        <label>La fiecare</label>
        <select id="water-every">
          <option value="60" ${settings.waterReminderEveryMin == 60 ? "selected" : ""}>60 minute</option>
          <option value="90" ${settings.waterReminderEveryMin == 90 ? "selected" : ""}>90 minute</option>
          <option value="120" ${settings.waterReminderEveryMin == 120 ? "selected" : ""}>2 ore</option>
          <option value="150" ${settings.waterReminderEveryMin == 150 ? "selected" : ""}>2.5 ore</option>
        </select>
        <button class="btn btn-ghost" style="margin-top:10px" id="save-water">Salvează</button>
      </div>

      <div class="section-title">Notificări</div>
      <div class="card">
        <p style="font-size:13px">Stare: <b>${Notification?.permission === "granted" && settings.notificationsEnabled ? "Activate ✅" : "Dezactivate"}</b></p>
        <p style="font-size:12.5px;color:var(--ink-soft)">Funcționează cel mai bine pe Android, cu aplicația adăugată pe ecranul principal și ținută deschisă în fundal. Pe iPhone, Apple limitează notificările web — nu ține de aplicație.</p>
        <button class="btn btn-outline" id="toggle-notif">${settings.notificationsEnabled ? "Dezactivează notificările" : "Activează notificările"}</button>
      </div>

      <div class="section-title">Sincronizare</div>
      <div class="card">
        ${Storage.isOffline() ? `
          <p style="font-size:13px">Stare: <b>📴 doar pe acest telefon</b></p>
          <p style="font-size:12.5px;color:var(--ink-soft)">Firebase nu e configurat încă — vezi README.md, secțiunea „Sincronizare", ca Bogdan și Carmen să vadă datele unul altuia în timp real.</p>
        ` : `
          <p style="font-size:13px">Stare: <b>☁️ sincronizat live</b></p>
          <p style="font-size:12.5px;color:var(--ink-soft)">Conectat ca <b>${Sync._auth?.currentUser?.email || "—"}</b>. Orice schimbare făcută pe un telefon apare automat și pe celălalt, în câteva secunde.</p>
          <button class="btn btn-outline" style="margin-top:10px" id="logout-btn">Deconectează-te</button>
        `}
      </div>

      <p style="text-align:center;font-size:11.5px;color:var(--ink-soft);margin-top:18px">Familia Slăbește · v3</p>
    `;

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await Sync.logout();
        location.reload();
      });
    }

    document.getElementById("save-profiles").addEventListener("click", () => {
      ["bogdan", "carmen"].forEach(id => {
        const p = this.profiles[id];
        p.weightKg = +document.getElementById(`ed-${id}-weight`).value || p.weightKg;
        p.heightCm = +document.getElementById(`ed-${id}-height`).value || p.heightCm;
        const seg = document.getElementById(`ed-${id}-activity`);
        p.activity = seg.querySelector("button.active")?.dataset.v || p.activity;
      });
      Storage.setProfiles(this.profiles);
      this.toast("Profiluri actualizate ✅");
    });

    c.querySelectorAll(".seg").forEach(seg => {
      seg.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          seg.querySelectorAll("button").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
        });
      });
    });

    document.getElementById("save-times").addEventListener("click", () => {
      const s = Storage.getSettings();
      ["breakfast", "lunch", "snack", "dinner"].forEach(t => {
        s.mealTimes[t] = document.getElementById(`time-${t}`).value;
      });
      Storage.setSettings(s);
      this.toast("Ore salvate ✅");
      this.scheduleTodayNotifications();
    });

    document.getElementById("save-water").addEventListener("click", () => {
      const s = Storage.getSettings();
      s.waterReminderStart = document.getElementById("water-start").value;
      s.waterReminderEnd = document.getElementById("water-end").value;
      s.waterReminderEveryMin = +document.getElementById("water-every").value;
      Storage.setSettings(s);
      this.toast("Salvat ✅");
      this.scheduleTodayNotifications();
    });

    document.getElementById("toggle-notif").addEventListener("click", async () => {
      const s = Storage.getSettings();
      if (!s.notificationsEnabled) {
        const status = await Notifications.requestPermission();
        if (status === "granted") {
          s.notificationsEnabled = true;
          Storage.setSettings(s);
          this.toast("Notificări activate ✅");
          this.scheduleTodayNotifications();
        } else {
          this.toast("Permisiune neacordată");
        }
      } else {
        s.notificationsEnabled = false;
        Storage.setSettings(s);
        Notifications.clearAll();
        this.toast("Notificări dezactivate");
      }
      this.renderProfil();
    });
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
