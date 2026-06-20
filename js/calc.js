/* ============================================================
   Calcule — BMR (Mifflin-St Jeor), necesar caloric, hidratare
   ============================================================ */

const Calc = {
  // Rata metabolică de bază
  bmr({ gender, weightKg, heightCm, age }) {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return gender === "F" ? base - 161 : base + 5;
  },

  activityMultiplier(level) {
    return { sedentar: 1.2, moderat: 1.5, intens: 1.75 }[level] || 1.3;
  },

  // Necesar caloric de menținere
  maintenanceCalories(profile) {
    return Math.round(this.bmr(profile) * this.activityMultiplier(profile.activity));
  },

  // Țintă calorică pentru slăbit: deficit 18%, cu prag minim de siguranță 1300 kcal
  targetCalories(profile) {
    const maint = this.maintenanceCalories(profile);
    const target = Math.round(maint * 0.82);
    return Math.max(target, 1300);
  },

  // Necesar de apă: 33ml/kg (în intervalul recomandat 30-40ml/kg), rotunjit la 50ml
  waterTargetMl(weightKg) {
    const raw = weightKg * 33;
    return Math.round(raw / 50) * 50;
  },

  bmi(weightKg, heightCm) {
    const h = heightCm / 100;
    return +(weightKg / (h * h)).toFixed(1);
  },

  // Calorii arse: MET × greutate (kg) × ore
  activityKcal(met, weightKg, minutes) {
    return Math.round(met * weightKg * (minutes / 60));
  }
};
