/* ============================================================
   Familia Slăbește — bază de date rețete + meniu Săptămâna 1
   Rețetele sunt adaptate (porții, ingrediente, pași rescriși) după
   cărțile personale "BT FIT" cumpărate de utilizator, exclusiv
   pentru uz personal în familie. Fără broccoli sau dovlecei.
   ============================================================ */

const MEAL_TIMES = {
  breakfast: "08:00",
  snack: "11:00",
  lunch: "14:00",
  dinner: "18:00"
};

const MEAL_ORDER = ["breakfast", "snack", "lunch", "dinner"];

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
    title: "Bowl cu iaurt grecesc, granola și fructe de pădure",
    type: "breakfast",
    servings: 1,
    kcal: 500, protein: 33, carbs: 48, fat: 21,
    ingredients: [
      { name: "iaurt grecesc 2%", qty: "250 g", cat: "Lactate & ouă" },
      { name: "granola fără zahăr adăugat", qty: "30 g", cat: "Cămară & cereale" },
      { name: "afine sau fructe de pădure", qty: "80 g", cat: "Legume & fructe" },
      { name: "nuci sau migdale", qty: "15 g", cat: "Cămară & cereale" },
      { name: "miere", qty: "1 linguriță" , cat: "Cămară & cereale" }
    ],
    steps: [
      "Pune iaurtul rece într-un bol.",
      "Adaugă granola, fructele și nucile deasupra.",
      "Un fir subțire de miere, dacă vrei puțină dulceață în plus."
    ],
    tip: "Porție de adult, gândită să țină de foame până la gustarea de la 11:00. Se face în 2 minute, fără gătit."
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
    title: "Salată cu piept de pui, năut și avocado",
    type: "lunch",
    servings: 4,
    kcal: 680, protein: 60, carbs: 34, fat: 28,
    ingredients: [
      { name: "piept de pui gătit", qty: "180 g", cat: "Carne & pește" },
      { name: "năut fiert", qty: "100 g", cat: "Cămară & cereale" },
      { name: "ardei gras", qty: "100 g", cat: "Legume & fructe" },
      { name: "salată verde", qty: "60 g", cat: "Legume & fructe" },
      { name: "castraveți", qty: "110 g", cat: "Legume & fructe" },
      { name: "avocado", qty: "1/2 bucată (~50g)", cat: "Legume & fructe" },
      { name: "ulei de măsline", qty: "10 g", cat: "Condimente & altele" }
    ],
    steps: [
      "Taie puiul, ardeiul, castraveții și avocado cuburi.",
      "Amestecă-le într-un bol cu năutul și frunzele de salată.",
      "Stropește cu ulei, asezonează după gust și amestecă bine."
    ],
    tip: "Gătește puiul acoperit, la foc mediu, 4-5 min pe parte, apoi lasă-l 2-3 min înainte să-l tai — rămâne fraged. Porție de adult — se ține bine la frigider, bună de gătit o dată și mâncat 2 zile la rând."
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
    title: "Tocăniță de pui cu legume și cartofi",
    type: "dinner",
    servings: 4,
    kcal: 480, protein: 40, carbs: 52, fat: 12,
    ingredients: [
      { name: "piept de pui", qty: "500 g", cat: "Carne & pește" },
      { name: "ceapă", qty: "1 buc", cat: "Legume & fructe" },
      { name: "ardei", qty: "1 buc", cat: "Legume & fructe" },
      { name: "roșii cuburi (conservă)", qty: "1 conservă", cat: "Cămară & cereale" },
      { name: "cartofi", qty: "800 g (200g/porție)", cat: "Legume & fructe" },
      { name: "oregano, sare, piper", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Călește ceapa și ardeiul 3-4 minute.",
      "Adaugă puiul tăiat cuburi și lasă să prindă puțină culoare.",
      "Pune roșiile și condimentele, fierbe la foc mic 20 de minute.",
      "Coace separat cartofii la cuptor, tăiați felii, 25-30 minute, sau fierbe-i ca piure."
    ],
    tip: "Se reîncălzește excelent — bună de gătit o dată și mâncat 2-3 zile la rând."
  },
  sarmale_light: {
    title: "Sarmale light cu piure",
    type: "dinner",
    servings: 4,
    kcal: 460, protein: 34, carbs: 40, fat: 16,
    ingredients: [
      { name: "carne tocată slabă (pui/curcan)", qty: "650 g", cat: "Carne & pește" },
      { name: "orez", qty: "100 g", cat: "Cămară & cereale" },
      { name: "ceapă", qty: "130 g, tocată", cat: "Legume & fructe" },
      { name: "ulei de măsline", qty: "30 g", cat: "Condimente & altele" },
      { name: "frunze de varză murată", qty: "650 g", cat: "Legume & fructe" },
      { name: "roșii pasate", qty: "240 g", cat: "Cămară & cereale" },
      { name: "cartofi (pt. piure)", qty: "600 g (150g/porție)", cat: "Legume & fructe" },
      { name: "iaurt grecesc 2%", qty: "150 g (topping)", cat: "Lactate & ouă" },
      { name: "sare, piper, cimbru, foi de dafin", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Călește ceapa în puțin ulei până se rumenește ușor.",
      "Amestecă ceapa cu carnea, orezul spălat și condimentele.",
      "Rulează compoziția în foi de varză (porții mai generoase, ~7-8 sarmale/persoană).",
      "Așază sarmalele în oală, adaugă dafin și roșiile pasate deasupra.",
      "Fierbe la foc mic ~60 minute (sau la cuptor, 180°C, 90 minute, acoperite).",
      "Fierbe separat cartofii și fă piure, servește alături, cu un strop de iaurt deasupra sarmalelor."
    ],
    tip: "Se fac perfect duminica în cantitate mare — chiar se îmbunătățesc gustativ a doua și a treia zi. Gândite să țină 3 zile la rând fără să mai gătești."
  },
  somon_cartof_dulce: {
    title: "Somon cu cartof dulce și salată verde",
    type: "dinner",
    servings: 2,
    kcal: 580, protein: 40, carbs: 38, fat: 28,
    ingredients: [
      { name: "file de somon", qty: "150 g", cat: "Carne & pește" },
      { name: "cartof dulce", qty: "200 g", cat: "Legume & fructe" },
      { name: "salată verde", qty: "50 g", cat: "Legume & fructe" },
      { name: "castravete", qty: "50 g", cat: "Legume & fructe" },
      { name: "ulei de măsline", qty: "8 g", cat: "Condimente & altele" }
    ],
    steps: [
      "Coace cartoful dulce tăiat cuburi la cuptor, 25 minute.",
      "Gătește somonul în tigaie, 3-4 minute pe fiecare parte.",
      "Taie legumele proaspete și asamblează farfuria, cu un fir de ulei deasupra."
    ],
    tip: "Condimentează cu lămâie, cimbru sau usturoi pudră. Bun proaspăt — somonul nu se reîncălzește la fel de bine."
  },
  pui_crocant_orez: {
    title: "Pui crocant cu orez și usturoi",
    type: "lunch",
    servings: 2,
    kcal: 560, protein: 42, carbs: 68, fat: 10,
    ingredients: [
      { name: "pulpă de pui dezosată, fără piele", qty: "350 g", cat: "Carne & pește" },
      { name: "albuș de ou", qty: "1 buc", cat: "Lactate & ouă" },
      { name: "amidon de porumb", qty: "3 linguri", cat: "Cămară & cereale" },
      { name: "făină", qty: "2 linguri", cat: "Cămară & cereale" },
      { name: "usturoi tocat", qty: "1 linguriță", cat: "Condimente & altele" },
      { name: "miere", qty: "1 lingură", cat: "Cămară & cereale" },
      { name: "sos de soia", qty: "1 lingură", cat: "Condimente & altele" },
      { name: "orez", qty: "1 cană și jumătate, fiert", cat: "Cămară & cereale" },
      { name: "semințe de susan", qty: "1 linguriță", cat: "Condimente & altele" }
    ],
    steps: [
      "Fierbe orezul separat.",
      "Taie puiul cuburi, trece-l prin albuș, apoi prin amidon + făină + condimente.",
      "Gătește la air fryer 10 minute la 200°C (sau la cuptor, întorcând la jumătate).",
      "Pregătește glazura din usturoi, miere și sos de soia, amestecă peste pui până se lipește bine.",
      "Servește cu orez, presărat cu susan."
    ],
    tip: "E favoritul copiilor din casă — bun de gătit proaspăt, fiindcă puiul crocant își pierde din textură dacă stă prea mult."
  },
  frigarui_pui: {
    title: "Frigărui de pui cu legume și cartofi copți",
    type: "lunch",
    servings: 2,
    kcal: 600, protein: 58, carbs: 40, fat: 20,
    ingredients: [
      { name: "piept de pui", qty: "180 g", cat: "Carne & pește" },
      { name: "ardei roșu", qty: "50 g", cat: "Legume & fructe" },
      { name: "ciuperci", qty: "50 g", cat: "Legume & fructe" },
      { name: "ceapă", qty: "1 buc", cat: "Legume & fructe" },
      { name: "cartofi", qty: "200 g", cat: "Legume & fructe" },
      { name: "ulei de măsline", qty: "8 g", cat: "Condimente & altele" }
    ],
    steps: [
      "Condimentează pieptul de pui și taie-l cuburi.",
      "Coace puiul la cuptor 10-12 minute.",
      "Coace legumele și cartofii tăiați felii, cu puțin ulei, separat, 20-25 minute.",
      "Asamblează totul pe frigărui la final, alături de cartofii copți."
    ],
    tip: "Bune și la grătar vara, în weekend, când Sâmbăta e ziua liberă din plan. Se reîncălzesc bine 2 zile la rând."
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
  },

  snack_mar_migdale: {
    title: "Măr cu migdale",
    type: "snack",
    servings: 1,
    kcal: 210, protein: 5, carbs: 28, fat: 9,
    noCook: true,
    ingredients: [
      { name: "măr", qty: "1 bucată", cat: "Legume & fructe" },
      { name: "migdale", qty: "20 g (~15 buc)", cat: "Cămară & cereale" }
    ],
    steps: [
      "Spală și taie mărul felii.",
      "Servește alături de migdale."
    ],
    tip: "Fără gătit deloc — gata în 1 minut. Migdalele încetinesc absorbția zahărului din măr, bune pentru rezistența la insulină."
  },

  snack_iaurt_afine: {
    title: "Iaurt grecesc cu afine și nuci",
    type: "snack",
    servings: 1,
    kcal: 220, protein: 23, carbs: 14, fat: 8,
    noCook: true,
    ingredients: [
      { name: "iaurt grecesc 2%", qty: "200 g", cat: "Lactate & ouă" },
      { name: "afine sau fructe de pădure", qty: "50 g", cat: "Legume & fructe" },
      { name: "nuci", qty: "10 g", cat: "Cămară & cereale" }
    ],
    steps: [
      "Pune iaurtul într-un bol.",
      "Adaugă afinele și nucile deasupra."
    ],
    tip: "Fără gătit — direct din frigider. Gustare bogată în proteină, ține de foame până la masa următoare."
  },

  snack_oua_cherry: {
    title: "Ouă fierte cu roșii cherry",
    type: "snack",
    servings: 1,
    kcal: 170, protein: 14, carbs: 4, fat: 12,
    noCook: true,
    ingredients: [
      { name: "ouă", qty: "2 buc", cat: "Lactate & ouă" },
      { name: "roșii cherry", qty: "80 g", cat: "Legume & fructe" },
      { name: "sare, piper", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Fierbe ouăle din timp (10-12 minute), pregătite pentru 2-3 zile la rând, ținute la frigider.",
      "La gustare, curăță un ou, taie-l în jumătate, servește cu roșiile cherry."
    ],
    tip: "Fierbe 6-8 ouă duminica, în lot — apoi gustarea asta nu mai cere deloc gătit zilnic, doar curățat coaja."
  },

  // ---- Extindere Iunie 2026: rețete suplimentare pentru generatorul de meniu ----

  salata_ou_naut: {
    title: "Salată cu ou, năut și telemea",
    type: "lunch",
    servings: 4,
    kcal: 560, protein: 38, carbs: 41, fat: 24,
    ingredients: [
      { name: "ouă fierte", qty: "2 buc", cat: "Lactate & ouă" },
      { name: "năut fiert", qty: "125 g", cat: "Cămară & cereale" },
      { name: "salată verde", qty: "85 g", cat: "Legume & fructe" },
      { name: "ardei gras", qty: "85 g", cat: "Legume & fructe" },
      { name: "telemea light", qty: "55 g", cat: "Lactate & ouă" },
      { name: "ulei de măsline", qty: "7 g", cat: "Condimente & altele" }
    ],
    steps: [
      "Fierbe ouăle 8-10 minute, taie-le felii.",
      "Taie ardeiul cuburi și rupe salata verde.",
      "Amestecă într-un bol năutul, oul, legumele și telemeaua tăiată cuburi.",
      "Stropește cu ulei și amestecă ușor."
    ],
    tip: "Dacă folosești năut la conservă, clătește-l bine sub jet de apă rece."
  },

  salata_curcan_rosii: {
    title: "Salată cu curcan, roșii uscate și semințe",
    type: "lunch",
    servings: 4,
    kcal: 540, protein: 54, carbs: 27, fat: 19,
    ingredients: [
      { name: "piept de curcan", qty: "180 g", cat: "Carne & pește" },
      { name: "roșii uscate", qty: "35 g", cat: "Cămară & cereale" },
      { name: "salată verde", qty: "85 g", cat: "Legume & fructe" },
      { name: "castraveți", qty: "125 g", cat: "Legume & fructe" },
      { name: "ardei gras", qty: "100 g", cat: "Legume & fructe" },
      { name: "semințe de floarea-soarelui", qty: "17 g", cat: "Cămară & cereale" },
      { name: "ulei de măsline", qty: "7 g", cat: "Condimente & altele" }
    ],
    steps: [
      "Gătește pieptul de curcan pe grătar sau în tigaie, 6-7 minute.",
      "Taie roșiile uscate și legumele.",
      "Combină totul într-un bol cu semințele și frunzele de salată.",
      "Stropește cu ulei și amestecă bine."
    ],
    tip: "Hidratează roșiile uscate 5 minute în apă caldă dacă sunt prea tari."
  },

  bol_halloumi_naut: {
    title: "Bol cu halloumi și năut (vegetarian)",
    type: "lunch",
    servings: 2,
    kcal: 520, protein: 35, carbs: 38, fat: 23,
    ingredients: [
      { name: "halloumi light", qty: "80 g", cat: "Lactate & ouă" },
      { name: "năut fiert", qty: "105 g", cat: "Cămară & cereale" },
      { name: "morcov", qty: "65 g", cat: "Legume & fructe" },
      { name: "ardei gras", qty: "65 g", cat: "Legume & fructe" },
      { name: "salată verde", qty: "65 g", cat: "Legume & fructe" },
      { name: "ulei de măsline", qty: "7 g", cat: "Condimente & altele" },
      { name: "oțet balsamic", qty: "13 ml", cat: "Condimente & altele" },
      { name: "miere", qty: "7 g", cat: "Cămară & cereale" }
    ],
    steps: [
      "Prăjește halloumi în tigaie fără ulei, 2-3 minute pe fiecare parte.",
      "Taie legumele și amestecă-le cu năutul.",
      "Pregătește dressingul din oțet, ulei și miere.",
      "Adaugă halloumi peste salată și toarnă dressingul."
    ],
    tip: "Singura masă vegetariană din meniu — bună de alternat când vreți o zi mai ușoară, fără carne."
  },

  salata_calda_pui_porumb: {
    title: "Salată caldă cu pui, porumb și sos de iaurt",
    type: "lunch",
    servings: 2,
    kcal: 480, protein: 60, carbs: 22, fat: 13,
    ingredients: [
      { name: "piept de pui", qty: "350 g", cat: "Carne & pește" },
      { name: "boia dulce, chimen, usturoi pudră", qty: "după gust", cat: "Condimente & altele" },
      { name: "varză albă", qty: "100 g, tocată fin", cat: "Legume & fructe" },
      { name: "porumb fiert, scurs", qty: "250 g", cat: "Cămară & cereale" },
      { name: "ceapă roșie", qty: "1/2 bucată mică", cat: "Legume & fructe" },
      { name: "iaurt grecesc proteic", qty: "80 g", cat: "Lactate & ouă" },
      { name: "maioneză light", qty: "15 g", cat: "Condimente & altele" },
      { name: "telemea light", qty: "20 g", cat: "Lactate & ouă" },
      { name: "lămâie sau lime", qty: "1/2 bucată", cat: "Legume & fructe" }
    ],
    steps: [
      "Gătește pieptul de pui condimentat în tigaie, lasă-l 2-3 min, apoi taie-l cuburi.",
      "În aceeași tigaie, rumenește puțin porumbul.",
      "Amestecă iaurtul cu maioneza și zeama de lămâie pentru sos.",
      "Combină varza, porumbul, ceapa, puiul, brânza și sosul într-un bol."
    ],
    tip: "Cea mai proteică salată din meniu — foarte săturoasă, bună pentru zile active."
  },

  salata_ton_porumb: {
    title: "Salată de ton cu porumb (fără gătit)",
    type: "lunch",
    servings: 2,
    kcal: 380, protein: 42, carbs: 26, fat: 13,
    noCook: true,
    ingredients: [
      { name: "ton în suc propriu, scurs", qty: "160 g", cat: "Carne & pește" },
      { name: "porumb fiert", qty: "100 g", cat: "Cămară & cereale" },
      { name: "castraveți murați", qty: "100 g", cat: "Legume & fructe" },
      { name: "ceapă roșie", qty: "50 g, tocată", cat: "Legume & fructe" },
      { name: "ou fiert", qty: "1 gălbenuș", cat: "Lactate & ouă" },
      { name: "iaurt grecesc 2%", qty: "80 g", cat: "Lactate & ouă" },
      { name: "muștar", qty: "1 linguriță", cat: "Condimente & altele" },
      { name: "ulei de măsline", qty: "5 g", cat: "Condimente & altele" }
    ],
    steps: [
      "Amestecă tonul cu porumbul, castraveții tocați și ceapa.",
      "Separat, pasează gălbenușul fiert cu iaurtul, muștarul și uleiul.",
      "Combină totul și lasă la rece 20 de minute."
    ],
    tip: "Singura masă principală complet fără gătit — perfectă pentru o zi fără chef de bucătărie."
  },

  wrap_pui_crema: {
    title: "Wrap cu pui cremos și brânză",
    type: "lunch",
    servings: 2,
    kcal: 580, protein: 48, carbs: 42, fat: 24,
    ingredients: [
      { name: "piept de pui", qty: "300 g, cuburi", cat: "Carne & pește" },
      { name: "usturoi", qty: "2 căței, tocați", cat: "Condimente & altele" },
      { name: "lapte 1.5%", qty: "100 ml", cat: "Lactate & ouă" },
      { name: "cremă de brânză light", qty: "40 g", cat: "Lactate & ouă" },
      { name: "cașcaval light ras", qty: "50 g", cat: "Lactate & ouă" },
      { name: "lipii proteice", qty: "2 buc", cat: "Cămară & cereale" },
      { name: "boia, sare, ierburi italiene", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Condimentează puiul și gătește-l cu usturoiul tocat până se rumenește.",
      "Adaugă laptele și crema de brânză, fierbe 5 minute la foc mic până devine cremos.",
      "Presară cașcavalul, lasă să se topească.",
      "Umple lipiile cu amestecul, rulează și servește (sau coace 10 min la 180°C pentru crustă crocantă)."
    ],
    tip: "Se păstrează la frigider 3-4 zile — bun de reîncălzit la cuptor sau air fryer."
  },

  pui_cremos_cartofi: {
    title: "Pui cremos cu cartofi și brânză",
    type: "dinner",
    servings: 4,
    kcal: 520, protein: 46, carbs: 38, fat: 17,
    ingredients: [
      { name: "cartofi", qty: "800 g, cuburi", cat: "Legume & fructe" },
      { name: "usturoi pudră", qty: "1 lingură", cat: "Condimente & altele" },
      { name: "piept de pui", qty: "500 g, cuburi", cat: "Carne & pește" },
      { name: "ceapă", qty: "1 buc, tocată", cat: "Legume & fructe" },
      { name: "pastă de roșii", qty: "1 lingură", cat: "Cămară & cereale" },
      { name: "supă de pui", qty: "300 ml", cat: "Cămară & cereale" },
      { name: "smântână light pentru gătit", qty: "120 ml", cat: "Lactate & ouă" },
      { name: "brânză rasă (mozzarella/cașcaval light)", qty: "100 g", cat: "Lactate & ouă" }
    ],
    steps: [
      "Amestecă cartofii cu usturoi pudră, sare, piper și coace-i 20 minute la 200°C.",
      "Gătește puiul condimentat în tigaie, adaugă ceapa, apoi pasta de roșii.",
      "Toarnă supa și smântâna, fierbe 5-7 minute până devine cremos.",
      "Adaugă cartofii, presară brânza și gratinează 5-7 minute."
    ],
    tip: "Bun de gătit o dată, ține 2-3 zile la frigider, se reîncălzește excelent."
  },

  chiftelute_curcan_morcov: {
    title: "Chiftelițe de curcan cu morcov, la cuptor",
    type: "dinner",
    servings: 4,
    kcal: 400, protein: 32, carbs: 28, fat: 14,
    ingredients: [
      { name: "carne tocată de curcan", qty: "500 g", cat: "Carne & pește" },
      { name: "morcov", qty: "1 mic, ras", cat: "Legume & fructe" },
      { name: "ouă", qty: "2 buc", cat: "Lactate & ouă" },
      { name: "fulgi de ovăz", qty: "3 linguri", cat: "Cămară & cereale" },
      { name: "ceapă", qty: "1 mică, tocată", cat: "Legume & fructe" },
      { name: "usturoi", qty: "2 căței", cat: "Condimente & altele" },
      { name: "cartofi sau orez (garnitură)", qty: "600 g", cat: "Legume & fructe" },
      { name: "sare, piper, cimbru", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Amestecă morcovul ras cu restul ingredientelor pentru chiftelițe.",
      "Formează bilute mici, așază-le pe hârtie de copt.",
      "Coace la 190°C, 25-30 minute, până se rumenesc.",
      "Servește cu cartofi copți sau orez fiert alături."
    ],
    tip: "Se congelează excelent — fă o tură dublă și ai cină gata pentru altă săptămână."
  },

  lasagna_carne_slaba: {
    title: "Lasagna cu carne slabă și spanac",
    type: "dinner",
    servings: 6,
    kcal: 420, protein: 36, carbs: 30, fat: 14,
    ingredients: [
      { name: "foi de lasagna", qty: "9 buc", cat: "Cămară & cereale" },
      { name: "carne tocată de curcan/pui", qty: "500 g", cat: "Carne & pește" },
      { name: "spanac congelat", qty: "500 g", cat: "Legume & fructe" },
      { name: "brânză de vaci", qty: "455 g", cat: "Lactate & ouă" },
      { name: "ceapă", qty: "1 medie", cat: "Legume & fructe" },
      { name: "usturoi", qty: "2 căței", cat: "Condimente & altele" },
      { name: "suc de roșii fără zahăr", qty: "1000 g", cat: "Cămară & cereale" },
      { name: "cașcaval light", qty: "100 g", cat: "Lactate & ouă" }
    ],
    steps: [
      "Călește ceapa și usturoiul, adaugă carnea, apoi sucul de roșii.",
      "Amestecă brânza de vaci cu spanacul decongelat și scurs.",
      "Într-o tavă, alternează foi — amestec brânză/spanac — carne — cașcaval.",
      "Coace 30 minute cu folie, apoi 30 minute fără folie, la 180°C."
    ],
    tip: "Porție generoasă, gătită o dată — perfectă pentru o seară de weekend când vreți ceva consistent."
  },

  french_toast_banane: {
    title: "French toast cu banane și scorțișoară",
    type: "breakfast",
    servings: 1,
    kcal: 430, protein: 27, carbs: 54, fat: 11,
    ingredients: [
      { name: "pâine integrală", qty: "4 felii", cat: "Cămară & cereale" },
      { name: "albușuri", qty: "4 buc", cat: "Lactate & ouă" },
      { name: "banană", qty: "1 buc, coaptă", cat: "Legume & fructe" },
      { name: "scorțișoară, vanilie", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Amestecă albușurile cu scorțișoara, vanilia și un praf de sare.",
      "Înmoaie feliile de pâine în amestec.",
      "Prăjește-le într-o tigaie antiaderentă.",
      "Servește cu banană tăiată deasupra."
    ],
    tip: "Adaugă iaurt grecesc deasupra pentru și mai multă proteină."
  },

  clatite_ovaz_banana: {
    title: "Clătite de ovăz cu banană",
    type: "breakfast",
    servings: 1,
    kcal: 440, protein: 20, carbs: 60, fat: 12,
    ingredients: [
      { name: "banane", qty: "2 buc", cat: "Legume & fructe" },
      { name: "albușuri", qty: "4 buc", cat: "Lactate & ouă" },
      { name: "fulgi de ovăz", qty: "80 g", cat: "Cămară & cereale" },
      { name: "scorțișoară, vanilie", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Pasează bananele și amestecă-le cu albușurile, ovăzul, scorțișoara și vanilia.",
      "Coace clătite mici într-o tigaie antiaderentă, 2-3 minute pe fiecare parte."
    ],
    tip: "Adaugă un strop de iaurt grecesc sau o linguriță de unt de arahide deasupra."
  },

  budinca_chia_mere: {
    title: "Budincă de chia cu mere și scorțișoară",
    type: "snack",
    servings: 2,
    kcal: 200, protein: 18, carbs: 16, fat: 5,
    noCook: true,
    ingredients: [
      { name: "iaurt grecesc 0%", qty: "150 g", cat: "Lactate & ouă" },
      { name: "semințe de chia", qty: "15 g", cat: "Cămară & cereale" },
      { name: "îndulcitor", qty: "după gust", cat: "Cămară & cereale" },
      { name: "măr", qty: "1/2 bucată, rasă", cat: "Legume & fructe" },
      { name: "scorțișoară", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Amestecă iaurtul, chia și îndulcitorul.",
      "Lasă la frigider minimum 3 ore.",
      "Adaugă mărul ras și scorțișoara înainte de servire."
    ],
    tip: "Fără gătit — doar amestecat și lăsat la rece. Bun de pregătit din timp, pentru 2-3 zile."
  },

  budinca_chia_branza_banana: {
    title: "Budincă de chia cu brânză dulce și banană",
    type: "snack",
    servings: 2,
    kcal: 230, protein: 11, carbs: 27, fat: 8,
    noCook: true,
    ingredients: [
      { name: "lapte 1.5%", qty: "150 ml", cat: "Lactate & ouă" },
      { name: "semințe de chia", qty: "15 g", cat: "Cămară & cereale" },
      { name: "banană", qty: "80 g", cat: "Legume & fructe" },
      { name: "brânză dulce 5%", qty: "70 g", cat: "Lactate & ouă" },
      { name: "esență de vanilie", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Amestecă laptele cu chia și vanilia, lasă la rece 20-30 minute.",
      "Pasează banana și amestec-o cu brânza dulce.",
      "Combină totul într-un borcan sau bol."
    ],
    tip: "Fără gătit — gata în 5 minute de lucru efectiv, restul stă la frigider."
  },

  oua_umplute_ton: {
    title: "Ouă umplute cu ton și iaurt",
    type: "snack",
    servings: 2,
    kcal: 200, protein: 25, carbs: 2, fat: 11,
    noCook: true,
    ingredients: [
      { name: "ouă fierte", qty: "4 buc", cat: "Lactate & ouă" },
      { name: "ton în conservă, în suc propriu", qty: "80 g", cat: "Carne & pește" },
      { name: "iaurt grecesc", qty: "50 g", cat: "Lactate & ouă" },
      { name: "sare, piper, zeamă de lămâie", qty: "după gust", cat: "Condimente & altele" }
    ],
    steps: [
      "Taie ouăle fierte în jumătate, scoate gălbenușurile.",
      "Pasează gălbenușurile cu tonul, iaurtul și condimentele.",
      "Umple jumătățile de ou cu compoziția."
    ],
    tip: "Fierbe ouăle din timp, în lot — montarea durează doar 3-4 minute."
  }
};

// Plan Săptămâna 1 — bază comună de familie (Bogdan + Carmen + Ștefan,
// cu porție de copil mai mică, conform regulii "mărimea pumnului = porția lui").
// Mesele se repetă în blocuri de 2-3 zile (mic dejun, prânz, cină) ca să nu
// gătiți zilnic — gustarea e mereu fără gătit (fructe, iaurt, ouă fierte din timp).
// Totaluri calorice/zi: ~1770-1900 kcal — porție de adult cu nevoie moderată
// (apropiată de ținta Carmenei). Bogdan, fiind mai mare, ar trebui să adauge
// o porție în plus de proteină la prânz și cină (ex. 50-80g carne în plus)
// ca să ajungă spre ținta lui de ~2600 kcal — vezi nota din tab-ul Meniu.
const WEEK1 = {
  luni: { breakfast: "bowl_iaurt_fructe", snack: "snack_mar_migdale", lunch: "salata_pui_naut", dinner: "sarmale_light" },
  marti: { breakfast: "bowl_iaurt_fructe", snack: "snack_iaurt_afine", lunch: "salata_pui_naut", dinner: "sarmale_light" },
  miercuri: { breakfast: "bowl_iaurt_fructe", snack: "snack_oua_cherry", lunch: "frigarui_pui", dinner: "sarmale_light" },
  joi: { breakfast: "paine_proteica", snack: "snack_mar_migdale", lunch: "frigarui_pui", dinner: "tocana_pui_legume" },
  vineri: { breakfast: "paine_proteica", snack: "snack_iaurt_afine", lunch: "pui_crocant_orez", dinner: "somon_cartof_dulce" },
  sambata: { freeDay: true, note: "Zi liberă — ieșiți, comandați sau gătiți ceva special, fără presiune. Reveniți la plan duminică seara." },
  duminica: { prepDay: true, breakfast: "bowl_iaurt_fructe", snack: "snack_oua_cherry", lunch: "note", dinner: "sarmale_light", note: "Ziua pregătirilor: gătiți sarmalele (țin 3 zile, Luni-Marți-Miercuri) și fierbeți 6-8 ouă pentru gustările săptămânii. Prânzul e din resturi de sâmbătă." }
};

// Ce repetă cu ce, ca să fie clar dintr-o privire la gătit:
// • Mic dejun: bowl iaurt (Luni-Marți-Miercuri, fără gătit) · pâine proteică (Joi-Vineri, coaptă o dată)
// • Prânz: salată de pui (Luni-Marți) · frigărui (Miercuri-Joi) · pui crocant (Vineri, proaspăt)
// • Cină: sarmale (Luni-Marți-Miercuri, gătite Duminică) · tocăniță (Joi) · somon (Vineri, proaspăt)
// • Gustare: mereu fără gătit — fructe, iaurt sau ouă fierte pregătite din timp

// Listă de cumpărături Săptămâna 1 — cantități reale, gândite pentru cumpărat
// o singură dată, nu pentru calcul exact de rețetă (acela e pe ecranul
// fiecărei rețete, cu gramaje precise). Aici rotunjim la ce găsești pe raft.
const SHOPPING_LIST_WEEK1 = [
  {
    category: "Lactate & ouă",
    items: [
      { name: "Ouă", qty: "15 buc (1.5 cutii de 10)" },
      { name: "Iaurt grecesc 2%", qty: "1.5 kg (7-8 căni de 200g)" },
      { name: "Brânză cottage / light", qty: "500 g (1 pachet)" }
    ]
  },
  {
    category: "Carne & pește",
    items: [
      { name: "Piept de pui", qty: "1.2 kg" },
      { name: "Pulpă de pui dezosată, fără piele", qty: "350 g" },
      { name: "Carne tocată slabă (pui sau curcan)", qty: "650 g" },
      { name: "File de somon", qty: "150 g (1-2 bucăți)" }
    ]
  },
  {
    category: "Legume & fructe",
    items: [
      { name: "Cartofi", qty: "1.8 kg" },
      { name: "Ceapă", qty: "5 cepe medii" },
      { name: "Ardei gras / roșu", qty: "5 bucăți" },
      { name: "Salată verde", qty: "1 căpățână" },
      { name: "Castraveți", qty: "4 bucăți" },
      { name: "Avocado", qty: "1 bucată" },
      { name: "Ciuperci", qty: "100 g" },
      { name: "Roșii cherry", qty: "200 g (1 cutie)" },
      { name: "Varză murată", qty: "700 g (1 borcan sau pungă)" },
      { name: "Cartof dulce", qty: "1-2 bucăți (~200g)" },
      { name: "Mere", qty: "3 bucăți" },
      { name: "Afine sau fructe de pădure", qty: "400 g (proaspete sau congelate)" },
      { name: "Nuci", qty: "80 g" },
      { name: "Migdale", qty: "40 g" }
    ]
  },
  {
    category: "Cămară & cereale",
    items: [
      { name: "Granola fără zahăr adăugat", qty: "1 pachet (125g)" },
      { name: "Fulgi de ovăz", qty: "400 g" },
      { name: "Orez", qty: "250 g" },
      { name: "Roșii pasate (borcan)", qty: "250 g" },
      { name: "Roșii cuburi, conservă", qty: "1 conservă" },
      { name: "Amidon de porumb", qty: "1 pachet mic" },
      { name: "Făină", qty: "50 g" },
      { name: "Miere", qty: "1 borcan" },
      { name: "Semințe de susan", qty: "1 plic mic" }
    ]
  },
  {
    category: "Condimente & altele",
    items: [
      { name: "Ulei de măsline", qty: "verifică ce ai acasă" },
      { name: "Sos de soia", qty: "1 sticlă mică" },
      { name: "Usturoi", qty: "1 căpățână" },
      { name: "Condimente de bază (sare, piper, cimbru, dafin, oregano, boia)", qty: "verifică ce mai ai acasă" }
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
