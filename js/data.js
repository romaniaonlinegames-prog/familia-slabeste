/* ============================================================
   Familia Slăbește — bază de date rețete + meniu Săptămâna 1
   Rețetele sunt adaptate (porții, ingrediente, pași rescriși) după
   cărțile personale "BT FIT" cumpărate de utilizator, exclusiv
   pentru uz personal în familie. Fără broccoli sau dovlecei.
   ============================================================ */

const MEAL_TIMES = {
  breakfast: "08:00",
  lunch: "13:00",
  snack: "16:30",
  dinner: "19:30"
};

const MEAL_LABELS = {
  breakfast: "Mic dejun",
  lunch: "Prânz",
  snack: "Gustare",
  dinner: "Cină"
};

// Categorii pentru lista de cumpărături, în ordinea rafturilor tipice Lidl
const SHOP_CATEGORIES = [
  "Lactate & ouă",
  "Carne & pește",
  "Legume & fructe",
  "Cămară & cereale",
  "Condimente & altele"
];

const RECIPES = {
  omleta_spanac: {
    title: "Omletă cu spanac și ceapă verde",
    type: "breakfast",
    servings: 1,
    kcal: 170, protein: 18, carbs: 4, fat: 9,
    ingredients: [
      { name: "albușuri", qty: "3 buc", cat: "Lactate & ouă" },
      { name: "ou întreg", qty: "1 buc", cat: "Lactate & ouă" },
      { name: "spanac proaspăt", qty: "o mână", cat: "Legume & fructe" },
      { name: "ceapă verde", qty: "1 fir", cat: "Legume & fructe" },
      { name: "sare, piper", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Călește spanacul tocat și ceapa verde 1-2 minute într-o tigaie antiaderentă.",
      "Bate ouăle cu sare și piper, toarnă peste legume.",
      "Gătește la foc mic, acoperit, până se leagă omleta."
    ],
    tip: "Merge bine cu 2 felii de roșie alături."
  },
  terci_ovaz_mere: {
    title: "Terci de ovăz cu mere și scorțișoară",
    type: "breakfast",
    servings: 2,
    kcal: 250, protein: 9, carbs: 40, fat: 5,
    ingredients: [
      { name: "fulgi de ovăz", qty: "50 g", cat: "Cămară & cereale" },
      { name: "lapte degresat", qty: "200 ml", cat: "Lactate & ouă" },
      { name: "măr", qty: "1 buc, ras", cat: "Legume & fructe" },
      { name: "scorțișoară", qty: "1 vârf de linguriță", cat: "Condimente & altele" }
    ],
    steps: [
      "Fierbe ovăzul în lapte la foc mic 6-8 minute, amestecând des.",
      "Adaugă mărul ras și scorțișoara, mai lasă 1-2 minute.",
      "Servește cald."
    ],
    tip: "Poți schimba mărul cu pară sau banană pentru variație."
  },
  bowl_iaurt_fructe: {
    title: "Bowl cu iaurt grecesc și fructe de pădure",
    type: "breakfast",
    servings: 1,
    kcal: 300, protein: 24, carbs: 35, fat: 8,
    ingredients: [
      { name: "iaurt grecesc 2%", qty: "200 g", cat: "Lactate & ouă" },
      { name: "afine sau fructe de pădure", qty: "80 g", cat: "Legume & fructe" },
      { name: "granola fără zahăr adăugat", qty: "20 g", cat: "Cămară & cereale" },
      { name: "miere", qty: "1 linguriță (opțional)", cat: "Cămară & cereale" }
    ],
    steps: [
      "Pune iaurtul rece într-un bol.",
      "Adaugă fructele și granola deasupra.",
      "Un fir subțire de miere, dacă vrei puțină dulceață în plus."
    ],
    tip: "Bun și ca gustare de după-amiază, nu doar mic dejun."
  },
  paine_proteica: {
    title: "Pâine proteică cu ovăz și brânză",
    type: "breakfast",
    servings: 4,
    kcal: 491, protein: 32, carbs: 62, fat: 13,
    ingredients: [
      { name: "fulgi de ovăz", qty: "350 g", cat: "Cămară & cereale" },
      { name: "ouă întregi", qty: "2 buc", cat: "Lactate & ouă" },
      { name: "albușuri", qty: "4 buc", cat: "Lactate & ouă" },
      { name: "brânză light (cottage)", qty: "500 g", cat: "Lactate & ouă" },
      { name: "praf de copt", qty: "10 g", cat: "Cămară & cereale" }
    ],
    steps: [
      "Amestecă toate ingredientele până obții o compoziție densă și omogenă.",
      "Toarnă în tavă de chec tapetată cu hârtie de copt.",
      "Coace la 165°C, 55-60 minute, până trece testul scobitorii.",
      "Lasă la răcit complet înainte de feliat."
    ],
    tip: "Se ține 3-4 zile la frigider — bună de pregătit duminica pentru toată săptămâna."
  },
  salata_pui_naut: {
    title: "Salată cu piept de pui, năut și ardei",
    type: "lunch",
    servings: 4,
    kcal: 378, protein: 40, carbs: 27, fat: 11,
    ingredients: [
      { name: "piept de pui gătit", qty: "130 g", cat: "Carne & pește" },
      { name: "năut fiert", qty: "70 g", cat: "Cămară & cereale" },
      { name: "ardei gras", qty: "80 g", cat: "Legume & fructe" },
      { name: "salată verde", qty: "50 g", cat: "Legume & fructe" },
      { name: "castraveți", qty: "90 g", cat: "Legume & fructe" },
      { name: "ulei de măsline", qty: "6 g", cat: "Condimente & altele" }
    ],
    steps: [
      "Taie puiul, ardeiul și castraveții cuburi.",
      "Amestecă-le într-un bol cu năutul și frunzele de salată.",
      "Stropește cu ulei, asezonează după gust și amestecă bine."
    ],
    tip: "Gătește puiul acoperit, la foc mediu, 4-5 min pe parte, apoi lasă-l 2-3 min înainte să-l tai — rămâne fraged."
  },
  salata_telina_pui: {
    title: "Salată de țelină cu pui",
    type: "lunch",
    servings: 2,
    kcal: 198, protein: 29, carbs: 10, fat: 6,
    ingredients: [
      { name: "piept de pui fiert", qty: "200 g", cat: "Carne & pește" },
      { name: "țelină crudă", qty: "200 g, răzuită", cat: "Legume & fructe" },
      { name: "morcov", qty: "100 g, ras", cat: "Legume & fructe" },
      { name: "iaurt grecesc 2%", qty: "100 g", cat: "Lactate & ouă" },
      { name: "ulei de măsline", qty: "1 linguriță", cat: "Condimente & altele" }
    ],
    steps: [
      "Amestecă țelina, morcovul și puiul tăiat cubulețe într-un bol.",
      "Adaugă iaurtul, uleiul, sare, piper și zeamă de lămâie.",
      "Lasă la rece 20-30 minute să se îmbine aromele."
    ],
    tip: "Pentru gust mai dulceag, adaugă un măr mic ras."
  },
  tocana_pui_legume: {
    title: "Tocăniță de pui cu legume",
    type: "dinner",
    servings: 4,
    kcal: 250, protein: 35, carbs: 8, fat: 8,
    ingredients: [
      { name: "piept de pui", qty: "500 g", cat: "Carne & pește" },
      { name: "ceapă", qty: "1 buc", cat: "Legume & fructe" },
      { name: "ardei", qty: "1 buc", cat: "Legume & fructe" },
      { name: "roșii cuburi (conservă)", qty: "1 conservă", cat: "Cămară & cereale" },
      { name: "oregano, sare, piper", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Călește ceapa și ardeiul 3-4 minute.",
      "Adaugă puiul tăiat cuburi și lasă să prindă puțină culoare.",
      "Pune roșiile și condimentele, fierbe la foc mic 20 de minute."
    ],
    tip: "Servește cu cartofi la cuptor sau orez — varianta perfectă de masă comună pentru toată familia."
  },
  sarmale_light: {
    title: "Sarmale light",
    type: "dinner",
    servings: 4,
    kcal: 209, protein: 25, carbs: 11, fat: 7,
    ingredients: [
      { name: "carne tocată slabă (pui/curcan)", qty: "400 g", cat: "Carne & pește" },
      { name: "orez", qty: "60 g", cat: "Cămară & cereale" },
      { name: "ceapă", qty: "80 g, tocată", cat: "Legume & fructe" },
      { name: "ulei de măsline", qty: "20 g", cat: "Condimente & altele" },
      { name: "frunze de varză murată", qty: "400 g", cat: "Legume & fructe" },
      { name: "roșii pasate", qty: "150 g", cat: "Cămară & cereale" },
      { name: "sare, piper, cimbru, foi de dafin", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Călește ceapa în puțin ulei până se rumenește ușor.",
      "Amestecă ceapa cu carnea, orezul spălat și condimentele.",
      "Rulează compoziția în foi de varză.",
      "Așază sarmalele în oală, adaugă dafin și roșiile pasate deasupra.",
      "Fierbe la foc mic ~60 minute (sau la cuptor, 180°C, 90 minute, acoperite)."
    ],
    tip: "Se fac perfect duminica în cantitate mare — se păstrează bine și a doua/a treia zi."
  },
  somon_cartof_dulce: {
    title: "Somon cu cartof dulce și salată verde",
    type: "dinner",
    servings: 2,
    kcal: 380, protein: 28, carbs: 22, fat: 18,
    ingredients: [
      { name: "file de somon", qty: "100 g", cat: "Carne & pește" },
      { name: "cartof dulce", qty: "120 g", cat: "Legume & fructe" },
      { name: "salată verde", qty: "50 g", cat: "Legume & fructe" },
      { name: "castravete", qty: "50 g", cat: "Legume & fructe" },
      { name: "ulei de măsline", qty: "5 g", cat: "Condimente & altele" }
    ],
    steps: [
      "Coace cartoful dulce tăiat cuburi la cuptor, 25 minute.",
      "Gătește somonul în tigaie, 3-4 minute pe fiecare parte.",
      "Taie legumele proaspete și asamblează farfuria, cu un fir de ulei deasupra."
    ],
    tip: "Condimentează cu lămâie, cimbru sau usturoi pudră."
  },
  pui_crocant_orez: {
    title: "Pui crocant cu orez și usturoi",
    type: "lunch",
    servings: 2,
    kcal: 470, protein: 39, carbs: 53, fat: 8,
    ingredients: [
      { name: "pulpă de pui dezosată, fără piele", qty: "350 g", cat: "Carne & pește" },
      { name: "albuș de ou", qty: "1 buc", cat: "Lactate & ouă" },
      { name: "amidon de porumb", qty: "3 linguri", cat: "Cămară & cereale" },
      { name: "făină", qty: "2 linguri", cat: "Cămară & cereale" },
      { name: "usturoi tocat", qty: "1 linguriță", cat: "Condimente & altele" },
      { name: "miere", qty: "1 lingură", cat: "Cămară & cereale" },
      { name: "sos de soia", qty: "1 lingură", cat: "Condimente & altele" },
      { name: "orez", qty: "1 cană, fiert", cat: "Cămară & cereale" },
      { name: "semințe de susan", qty: "1 linguriță", cat: "Condimente & altele" }
    ],
    steps: [
      "Fierbe orezul separat.",
      "Taie puiul cuburi, trece-l prin albuș, apoi prin amidon + făină + condimente.",
      "Gătește la air fryer 10 minute la 200°C (sau la cuptor, întorcând la jumătate).",
      "Pregătește glazura din usturoi, miere și sos de soia, amestecă peste pui până se lipește bine.",
      "Servește cu orez, presărat cu susan."
    ],
    tip: "E favoritul copiilor din casă — perfectă pentru ziua mai consistentă din mijlocul săptămânii."
  },
  frigarui_pui: {
    title: "Frigărui de pui cu legume",
    type: "lunch",
    servings: 2,
    kcal: 230, protein: 30, carbs: 10, fat: 5,
    ingredients: [
      { name: "piept de pui", qty: "100 g", cat: "Carne & pește" },
      { name: "ardei roșu", qty: "50 g", cat: "Legume & fructe" },
      { name: "ciuperci", qty: "50 g", cat: "Legume & fructe" },
      { name: "ceapă", qty: "1 buc", cat: "Legume & fructe" }
    ],
    steps: [
      "Condimentează pieptul de pui și taie-l cuburi.",
      "Coace puiul la cuptor 10-12 minute.",
      "Coace legumele separat 15-18 minute.",
      "Asamblează totul pe frigărui la final."
    ],
    tip: "Bune și la grătar vara, în weekend, când Sâmbăta e ziua liberă din plan."
  },
  papanasi_cuptor: {
    title: "Papanași la cuptor cu brânză și iaurt",
    type: "snack",
    servings: 4,
    kcal: 190, protein: 14, carbs: 16, fat: 7,
    ingredients: [
      { name: "brânză de vaci degresată", qty: "300 g", cat: "Lactate & ouă" },
      { name: "ouă", qty: "2 buc", cat: "Lactate & ouă" },
      { name: "griș", qty: "2 linguri", cat: "Cămară & cereale" },
      { name: "făină", qty: "2 linguri", cat: "Cămară & cereale" },
      { name: "coajă de lămâie, vanilie", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Amestecă toate ingredientele până obții o pastă groasă.",
      "Formează discuri mici și așază-le în tavă.",
      "Coace 25-30 minute la 180°C."
    ],
    tip: "Servește cu iaurt și puțină dulceață fără zahăr — desertul tradițional, varianta ușoară."
  },
  mar_copt: {
    title: "Mere coapte cu scorțișoară",
    type: "snack",
    servings: 2,
    kcal: 90, protein: 1, carbs: 22, fat: 0,
    ingredients: [
      { name: "mere", qty: "2 buc", cat: "Legume & fructe" },
      { name: "scorțișoară", qty: "după gust", cat: "Condimente & altele" },
      { name: "nuci (opțional)", qty: "o mână", cat: "Cămară & cereale" }
    ],
    steps: [
      "Scobește mijlocul merelor.",
      "Presară scorțișoară (și nuci tocate, dacă vrei) în mijloc.",
      "Coace 20-25 minute la 180°C, până se înmoaie."
    ],
    tip: "Gustare dulce fără zahăr adăugat, bună și pentru cei mici."
  },
  budinca_chia_iaurt: {
    title: "Budincă de iaurt cu semințe de chia",
    type: "snack",
    servings: 2,
    kcal: 150, protein: 10, carbs: 12, fat: 7,
    ingredients: [
      { name: "iaurt grecesc proteic", qty: "250 g", cat: "Lactate & ouă" },
      { name: "semințe de chia", qty: "25 g", cat: "Cămară & cereale" },
      { name: "miere", qty: "1 lingură", cat: "Cămară & cereale" }
    ],
    steps: [
      "Amestecă iaurtul, semințele de chia și mierea într-un bol.",
      "Împarte în 2 recipiente.",
      "Lasă la frigider minimum 3 ore (sau peste noapte)."
    ],
    tip: "Se pregătește din timp — perfectă de luat la pachet."
  },
  muffin_morcov_mar: {
    title: "Muffin cu morcov, măr și iaurt",
    type: "snack",
    servings: 6,
    kcal: 220, protein: 11, carbs: 28, fat: 6,
    ingredients: [
      { name: "morcov", qty: "40 g, ras", cat: "Legume & fructe" },
      { name: "măr", qty: "50 g, ras", cat: "Legume & fructe" },
      { name: "ou", qty: "1 buc", cat: "Lactate & ouă" },
      { name: "iaurt grecesc 2%", qty: "50 g", cat: "Lactate & ouă" },
      { name: "făină integrală", qty: "30 g", cat: "Cămară & cereale" },
      { name: "scorțișoară", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Rade morcovul și mărul.",
      "Bate oul, amestecă-l cu iaurtul, făina și scorțișoara.",
      "Încorporează morcovul și mărul ras.",
      "Toarnă în forme de muffin, coace 25 minute la 180°C."
    ],
    tip: "Bun pentru cutia de pachet a lui Ștefan la grădiniță."
  }
};

// Plan Săptămâna 1 — bază comună de familie (Bogdan + Carmen + Ștefan,
// cu porție de copil mai mică, conform regulii "mărimea pumnului = porția lui")
const WEEK1 = {
  luni: { breakfast: "omleta_spanac", lunch: "salata_pui_naut", dinner: "tocana_pui_legume", snack: "budinca_chia_iaurt" },
  marti: { breakfast: "terci_ovaz_mere", lunch: "salata_telina_pui", dinner: "sarmale_light", snack: "mar_copt" },
  miercuri: { breakfast: "bowl_iaurt_fructe", lunch: "frigarui_pui", dinner: "somon_cartof_dulce", snack: "muffin_morcov_mar" },
  joi: { breakfast: "paine_proteica", lunch: "pui_crocant_orez", dinner: "tocana_pui_legume", snack: "papanasi_cuptor" },
  vineri: { breakfast: "omleta_spanac", lunch: "salata_pui_naut", dinner: "somon_cartof_dulce", snack: "mar_copt" },
  sambata: { freeDay: true, note: "Zi liberă — ieșiți, comandați sau gătiți ceva special, fără presiune. Reveniți la plan duminică seara." },
  duminica: { prepDay: true, breakfast: "bowl_iaurt_fructe", lunch: "note", dinner: "sarmale_light", note: "Ziua pregătirilor: gătiți sarmalele și tocănița pentru săptămâna următoare. Prânzul e din resturi de sâmbătă." }
};

// Listă de cumpărături Săptămâna 1 — cantități reale, gândite pentru cumpărat
// o singură dată, nu pentru calcul exact de rețetă (acela e pe ecranul
// fiecărei rețete, cu gramaje precise). Aici rotunjim la ce găsești pe raft.
const SHOPPING_LIST_WEEK1 = [
  {
    category: "Lactate & ouă",
    items: [
      { name: "Ouă", qty: "20 buc (2 cutii de 10)" },
      { name: "Iaurt grecesc (2% sau proteic)", qty: "800 g (4-5 căni de 170-200g)" },
      { name: "Lapte degresat", qty: "1 cutie (folosești doar 200ml, restul se păstrează)" },
      { name: "Brânză de vaci / cottage degresată", qty: "800 g (2 pachete de ~400g)" }
    ]
  },
  {
    category: "Carne & pește",
    items: [
      { name: "Piept de pui", qty: "1.6 kg" },
      { name: "Pulpă de pui dezosată, fără piele", qty: "350 g" },
      { name: "Carne tocată slabă (pui sau curcan)", qty: "800 g" },
      { name: "File de somon", qty: "2 bucăți (~200 g)" }
    ]
  },
  {
    category: "Legume & fructe",
    items: [
      { name: "Ceapă", qty: "6 cepe medii" },
      { name: "Ceapă verde", qty: "1 legătură" },
      { name: "Ardei gras / roșu / kapia", qty: "6 bucăți" },
      { name: "Salată verde", qty: "1 căpățână sau 2 pungi" },
      { name: "Castraveți", qty: "4 bucăți" },
      { name: "Mere", qty: "6 bucăți" },
      { name: "Țelină rădăcină", qty: "1 bucată" },
      { name: "Morcovi", qty: "3 bucăți" },
      { name: "Varză murată", qty: "1 kg (borcan sau pungă)" },
      { name: "Afine sau fructe de pădure", qty: "200 g (proaspete sau congelate)" },
      { name: "Cartof dulce", qty: "3 bucăți medii (~250g)" },
      { name: "Ciuperci", qty: "100 g" },
      { name: "Spanac proaspăt", qty: "1 pungă" }
    ]
  },
  {
    category: "Cămară & cereale",
    items: [
      { name: "Fulgi de ovăz", qty: "500 g (1 pachet)" },
      { name: "Orez", qty: "250 g" },
      { name: "Roșii pasate (borcan)", qty: "350 g" },
      { name: "Roșii cuburi, conservă", qty: "2 conserve" },
      { name: "Semințe de chia", qty: "1 pachet mic" },
      { name: "Miere", qty: "1 borcan" },
      { name: "Nuci", qty: "100 g" },
      { name: "Granola fără zahăr adăugat", qty: "1 pachet mic" },
      { name: "Praf de copt", qty: "1 plic" },
      { name: "Amidon de porumb", qty: "1 pachet mic" },
      { name: "Făină albă", qty: "100 g" },
      { name: "Făină integrală", qty: "50 g (sau înlocuiești cu albă)" },
      { name: "Griș", qty: "100 g" },
      { name: "Semințe de susan", qty: "1 plic mic" }
    ]
  },
  {
    category: "Condimente & altele",
    items: [
      { name: "Ulei de măsline", qty: "verifică ce ai acasă" },
      { name: "Sos de soia", qty: "1 sticlă mică" },
      { name: "Condimente de bază (sare, piper, scorțișoară, cimbru, dafin, usturoi pudră, boia)", qty: "verifică ce mai ai acasă" }
    ]
  }
];

const DAY_LABELS = {
  luni: "Luni", marti: "Marți", miercuri: "Miercuri", joi: "Joi",
  vineri: "Vineri", sambata: "Sâmbătă", duminica: "Duminică"
};

// Presetări activitate, cu valori MET (Metabolic Equivalent of Task)
// folosite pentru estimarea caloriilor arse: kcal = MET × kg × ore
const ACTIVITY_PRESETS = [
  { id: "mers", label: "Mers pe jos", icon: "🚶", met: 3.5 },
  { id: "mers_alert", label: "Mers alert", icon: "🚶‍♂️", met: 4.3 },
  { id: "alergare", label: "Alergare", icon: "🏃", met: 8.0 },
  { id: "ciclism", label: "Ciclism", icon: "🚴", met: 6.0 },
  { id: "treaba_casa", label: "Treabă prin casă", icon: "🧹", met: 3.0 },
  { id: "joaca_copil", label: "Joacă cu Ștefan", icon: "🧒", met: 4.0 },
  { id: "sport_sala", label: "Sport / Sală", icon: "🏋️", met: 5.5 },
  { id: "altceva", label: "Altceva", icon: "✨", met: 4.0 }
];
