/* ============================================================
   sync.js — strat de sincronizare prin Firebase Firestore, cu
   conturi proprii (email + parolă, NU Google) și familii separate
   prin cod scurt.

   Model de date:
   - users/{uid}            → { familyId, email }  — cont -> familie
   - families/{familyId}/data/{document} → datele reale (mese, greutate etc.)

   Dacă firebase-config.js încă are valorile placeholder, aplicația
   funcționează "solo" (localStorage) — nimic nu se rupe dacă nu ai
   configurat încă Firebase.

   SDK-ul Firebase se încarcă DOAR dacă firebase-config.js a fost
   completat — altfel aplicația nu depinde deloc de gstatic.com, ca
   să nu se poată bloca la încărcare din cauza rețelei.
   ============================================================ */

import { firebaseConfig } from "./firebase-config.js";

const DOC_NAMES = ["profiles", "weights", "checks", "shopping", "settings", "activity", "groceryCosts", "dayNotes", "currentWeek", "weekHistory"];
const FIREBASE_SDK_VERSION = "10.14.1";
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // fără O/0, I/1 — greu de confundat

const Sync = {
  offlineMode: false,
  authStatus: "offline", // "offline" | "needs-login" | "needs-family" | "online"
  familyId: null,
  cache: {},
  changeCallback: null,
  _db: null,
  _auth: null,
  _authMod: null,
  _uid: null,
  _pendingAuthResolve: null,
  _pendingAuthReject: null,

  isPlaceholder() {
    return !firebaseConfig.apiKey || firebaseConfig.apiKey === "INLOCUIESTE_AICI";
  },

  // --- mod offline (fără Firebase configurat, sau dacă ceva eșuează) ---
  loadLocalCache() {
    DOC_NAMES.forEach(name => {
      try {
        const raw = localStorage.getItem("fs_" + name);
        this.cache[name] = raw ? JSON.parse(raw) : null;
      } catch (e) {
        this.cache[name] = null;
      }
    });
  },

  saveLocal(name, value) {
    try { localStorage.setItem("fs_" + name, JSON.stringify(value)); } catch (e) {}
  },

  fallbackToOffline() {
    this.offlineMode = true;
    this.authStatus = "offline";
    this.loadLocalCache();
  },

  // --- API public ---
  async init(onChange) {
    this.changeCallback = onChange;

    if (this.isPlaceholder()) {
      this.fallbackToOffline();
      return;
    }

    try {
      const [{ initializeApp }, firestoreMod, authMod] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-auth.js`)
      ]);

      const app = initializeApp(firebaseConfig);
      this._db = firestoreMod.getFirestore(app);
      this._doc = firestoreMod.doc;
      this._getDoc = firestoreMod.getDoc;
      this._setDoc = firestoreMod.setDoc;
      this._onSnapshot = firestoreMod.onSnapshot;
      this._serverTimestamp = firestoreMod.serverTimestamp;
      firestoreMod.enableIndexedDbPersistence(this._db).catch(() => {
        // eșuează silențios dacă e deja deschis în alt tab — nu e critic
      });

      this._authMod = authMod;
      this._auth = authMod.getAuth(app);

      await new Promise((resolve) => {
        let resolved = false;
        const finish = () => { if (!resolved) { resolved = true; resolve(); } };

        authMod.onAuthStateChanged(this._auth, async (user) => {
          if (user) {
            await this._afterAuth(user);
          } else {
            this.authStatus = "needs-login";
          }
          if (this._pendingAuthResolve) {
            const r = this._pendingAuthResolve;
            this._pendingAuthResolve = null;
            this._pendingAuthReject = null;
            r();
          }
          finish();
        }, () => {
          console.error("Eroare la verificarea sesiunii, trec pe mod local");
          this.fallbackToOffline();
          finish();
        });

        setTimeout(() => {
          if (!resolved) {
            console.error("Firebase nu a răspuns la timp, trec pe mod local");
            this.fallbackToOffline();
            finish();
          }
        }, 6000);
      });
    } catch (e) {
      console.error("Firebase indisponibil, trec pe mod local", e);
      this.fallbackToOffline();
    }
  },

  // Apelat după orice autentificare reușită (sesiune veche redeschisă,
  // sau login/signup proaspăt) — decide dacă userul are deja o familie.
  async _afterAuth(user) {
    this._uid = user.uid;
    try {
      const ref = this._doc(this._db, "users", user.uid);
      const snap = await this._getDoc(ref);
      if (snap.exists() && snap.data().familyId) {
        this.familyId = snap.data().familyId;
        this.authStatus = "online";
        this.subscribeAll();
      } else {
        this.authStatus = "needs-family";
      }
    } catch (e) {
      console.error("Eroare la citirea contului, trec pe mod local", e);
      this.fallbackToOffline();
    }
  },

  _waitForAuthSettled() {
    return new Promise((resolve, reject) => {
      this._pendingAuthResolve = resolve;
      this._pendingAuthReject = reject;
    });
  },

  _mapAuthError(e) {
    const map = {
      "auth/invalid-credential": "Email sau parolă greșită.",
      "auth/invalid-email": "Adresa de email nu e validă.",
      "auth/user-not-found": "Nu există cont cu acest email.",
      "auth/wrong-password": "Parolă greșită.",
      "auth/too-many-requests": "Prea multe încercări greșite — așteaptă puțin și reîncearcă.",
      "auth/email-already-in-use": "Există deja un cont cu acest email — încearcă să te conectezi.",
      "auth/weak-password": "Parola trebuie să aibă cel puțin 6 caractere."
    };
    return new Error(map[e.code] || "Eroare: " + e.message);
  },

  // Logare cu cont existent
  async login(email, password) {
    if (!this._auth || !this._authMod) throw new Error("Firebase nu e inițializat");
    const waiter = this._waitForAuthSettled();
    try {
      await this._authMod.signInWithEmailAndPassword(this._auth, email, password);
    } catch (e) {
      this._pendingAuthResolve = null;
      this._pendingAuthReject = null;
      throw this._mapAuthError(e);
    }
    await waiter;
  },

  // Cont nou — doar email (poate fi orice) + parolă, fără alte date
  async signup(email, password) {
    if (!this._auth || !this._authMod) throw new Error("Firebase nu e inițializat");
    const waiter = this._waitForAuthSettled();
    try {
      await this._authMod.createUserWithEmailAndPassword(this._auth, email, password);
    } catch (e) {
      this._pendingAuthResolve = null;
      this._pendingAuthReject = null;
      throw this._mapAuthError(e);
    }
    await waiter;
  },

  async logout() {
    if (this._auth && this._authMod) {
      await this._authMod.signOut(this._auth);
    }
    this.familyId = null;
    this.authStatus = "needs-login";
  },

  generateFamilyCode() {
    let code = "";
    for (let i = 0; i < 6; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    return code;
  },

  // Creează o familie nouă (cod generat automat) sau te alătură uneia
  // existente (cod introdus manual) — same operație, doar sursa codului diferă.
  async setupFamily(code) {
    const clean = (code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!clean) throw new Error("Cod invalid.");
    const ref = this._doc(this._db, "users", this._uid);
    await this._setDoc(ref, {
      familyId: clean,
      email: this._auth.currentUser ? this._auth.currentUser.email : null,
      updatedAt: this._serverTimestamp()
    });
    this.familyId = clean;
    this.authStatus = "online";
    this.subscribeAll();
  },

  subscribeAll() {
    DOC_NAMES.forEach((name) => {
      const ref = this._doc(this._db, "families", this.familyId, "data", name);
      this._onSnapshot(ref, (snap) => {
        this.cache[name] = snap.exists() ? snap.data().payload : null;
        if (this.changeCallback) this.changeCallback(name, this.cache[name]);
      }, (err) => {
        console.error("Eroare sincronizare", name, err);
      });
    });
  },

  get(name) {
    return this.cache[name];
  },

  set(name, value) {
    this.cache[name] = value;
    if (this.offlineMode) {
      this.saveLocal(name, value);
      return;
    }
    const ref = this._doc(this._db, "families", this.familyId, "data", name);
    this._setDoc(ref, { payload: value, updatedAt: this._serverTimestamp() }).catch((err) => {
      console.error("Eroare la salvare în cloud", name, err);
    });
  }
};

window.Sync = Sync;
