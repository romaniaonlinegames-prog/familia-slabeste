/* ============================================================
   pedometer.js — contor de pași EXPERIMENTAL

   Funcționează DOAR cât pagina e activă pe ecran și telefonul e ținut
   în mână (folosește accelerometrul prin DeviceMotion). Nu numără pași
   în fundal, cu ecranul stins sau cu telefonul în buzunar — browserele
   nu permit acces la senzorul de pași nativ al telefonului (acela e
   rezervat aplicațiilor instalate din App Store/Play Store).

   Algoritm simplu: detectează vârfuri în accelerația verticală/totală
   peste un prag, cu un interval minim între pași ca să nu numere dublu.
   ============================================================ */

const Pedometer = {
  active: false,
  steps: 0,
  lastStepTime: 0,
  threshold: 11.5,        // m/s² — prag peste gravitație (~9.8) pentru a detecta un pas
  minStepIntervalMs: 280, // interval minim realist între doi pași
  onUpdate: null,
  _handler: null,

  async requestPermissionIfNeeded() {
    if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
      // iOS 13+: trebuie cerută explicit, dintr-un gest al utilizatorului (click pe buton)
      const result = await DeviceMotionEvent.requestPermission();
      return result === "granted";
    }
    return true; // Android / alte browsere nu cer permisiune explicită
  },

  isSupported() {
    return typeof DeviceMotionEvent !== "undefined";
  },

  start(onUpdate) {
    if (!this.isSupported()) return false;
    this.steps = 0;
    this.lastStepTime = 0;
    this.onUpdate = onUpdate;
    this._handler = (event) => this._handleMotion(event);
    window.addEventListener("devicemotion", this._handler);
    this.active = true;
    return true;
  },

  stop() {
    if (this._handler) window.removeEventListener("devicemotion", this._handler);
    this.active = false;
    return this.steps;
  },

  _handleMotion(event) {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;
    const magnitude = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);
    const now = Date.now();
    if (magnitude > this.threshold && (now - this.lastStepTime) > this.minStepIntervalMs) {
      this.lastStepTime = now;
      this.steps++;
      if (this.onUpdate) this.onUpdate(this.steps);
    }
  },

  // Estimare grosieră: ~0.0008 km/pas, ~0.04 kcal/pas la 70kg (scalat cu greutatea)
  estimate(steps, weightKg) {
    const km = +(steps * 0.0008).toFixed(2);
    const kcalEst = Math.round(steps * 0.04 * (weightKg / 70));
    return { km, kcal: kcalEst };
  }
};
