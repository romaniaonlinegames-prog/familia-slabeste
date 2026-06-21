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

  // Procent față de necesarul de menținere, în funcție de obiectiv
  GOAL_FACTORS: { slabit: 0.82, mentinere: 1.0, ingrasare: 1.15 },

  GOAL_LABELS: { slabit: "Slăbit", mentinere: "Menținere", ingrasare: "Îngrășare" },

  // Țintă calorică pentru orice obiectiv. Pentru slăbit, păstrăm pragul
  // minim de siguranță 1300 kcal (recomandarea cărții — nu coborî sub
  // el fără sfat profesional). Pentru menținere/îngrășare nu se aplică
  // un prag minim, fiindcă nu e o restricție.
  targetCaloriesForGoal(profile, goal) {
    const maint = this.maintenanceCalories(profile);
    const factor = this.GOAL_FACTORS[goal] || this.GOAL_FACTORS.slabit;
    const target = Math.round(maint * factor);
    return goal === "slabit" ? Math.max(target, 1300) : target;
  },

  // Țintă calorică pe baza obiectivului salvat în profil (implicit: slăbit)
  targetCalories(profile) {
    return this.targetCaloriesForGoal(profile, profile.goal || "slabit");
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
