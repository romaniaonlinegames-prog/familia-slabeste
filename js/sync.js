/* ============================================================
   sync.js — strat de sincronizare prin Firebase Firestore

   Dacă firebase-config.js încă are valorile placeholder, aplicația
   funcționează "solo" (localStorage, ca înainte) — nimic nu se rupe
   dacă nu ai configurat încă Firebase, dar nici nu sincronizează
   între telefoane până nu o faci.

   Autentificare cu email + parolă (NU anonimă) — accesul e restricționat
   prin regulile Firestore doar la cele două adrese de email din
   firestore.rules.txt. Conturile se creează manual din Firebase Console
   (Authentication → Users → Add user), nu există formular de
   înregistrare în aplicație.

   SDK-ul Firebase se încarcă DOAR dacă firebase-config.js chiar a fost
   completat — altfel aplicația nu depinde deloc de gstatic.com, ca să
   nu se poată bloca la încărcare din cauza rețelei.
   ============================================================ */

import { firebaseConfig, FAMILY_ID } from "./firebase-config.js";

const DOC_NAMES = ["profiles", "weights", "checks", "shopping", "settings", "activity", "groceryCosts", "dayNotes"];
const FIREBASE_SDK_VERSION = "10.14.1";

const Sync = {
  offlineMode: false,
  authStatus: "offline", // "offline" | "needs-login" | "online"
  cache: {},
  changeCallback: null,
  _db: null,
  _auth: null,
  _authMod: null,

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
  // Rezolvă după ce știm starea: offline / needs-login / online (deja logat din sesiune anterioară)
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

        authMod.onAuthStateChanged(this._auth, (user) => {
          if (resolved) return;
          if (user) {
            this.authStatus = "online";
            this.subscribeAll();
          } else {
            this.authStatus = "needs-login";
          }
          finish();
        }, () => {
          console.error("Eroare la verificarea sesiunii, trec pe mod local");
          this.fallbackToOffline();
          finish();
        });

        // siguranță: dacă Firebase nu răspunde deloc
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

  // Apelat din ecranul de logare. Aruncă eroare cu mesaj prietenos dacă eșuează.
  async login(email, password) {
    if (!this._auth || !this._authMod) throw new Error("Firebase nu e inițializat");
    try {
      await this._authMod.signInWithEmailAndPassword(this._auth, email, password);
      this.authStatus = "online";
      this.subscribeAll();
    } catch (e) {
      const map = {
        "auth/invalid-credential": "Email sau parolă greșită.",
        "auth/invalid-email": "Adresa de email nu e validă.",
        "auth/user-not-found": "Nu există cont cu acest email — verifică în Firebase Console.",
        "auth/wrong-password": "Parolă greșită.",
        "auth/too-many-requests": "Prea multe încercări greșite — așteaptă puțin și reîncearcă."
      };
      throw new Error(map[e.code] || "Eroare la logare: " + e.message);
    }
  },

  async logout() {
    if (this._auth && this._authMod) {
      await this._authMod.signOut(this._auth);
    }
    this.authStatus = "needs-login";
  },

  subscribeAll() {
    DOC_NAMES.forEach((name) => {
      const ref = this._doc(this._db, "families", FAMILY_ID, "data", name);
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
    const ref = this._doc(this._db, "families", FAMILY_ID, "data", name);
    this._setDoc(ref, { payload: value, updatedAt: this._serverTimestamp() }).catch((err) => {
      console.error("Eroare la salvare în cloud", name, err);
    });
  }
};

window.Sync = Sync;
