/* ============================================================
   Configurare Firebase — COMPLETEAZĂ ÎNAINTE DE A PUBLICA APLICAȚIA

   1. Mergi pe https://console.firebase.google.com și creează un proiect
      nou, gratuit (planul "Spark" — nu cere card bancar).
   2. În meniul din stânga: Build → Firestore Database → "Create database"
      → pornește în "test mode" (sau folosește regulile din
      firestore.rules.txt, recomandat).
   3. În meniul din stânga: Build → Authentication → Sign-in method →
      activează "Anonymous".
   4. Project settings (rotița ⚙) → secțiunea "Your apps" → "</>" (Web app)
      → înregistrează o aplicație → copiază obiectul firebaseConfig de
      acolo și înlocuiește-l mai jos.
   ============================================================ */

const firebaseConfig = {
  apiKey: "INLOCUIESTE_AICI",
  authDomain: "INLOCUIESTE_AICI.firebaseapp.com",
  projectId: "INLOCUIESTE_AICI",
  storageBucket: "INLOCUIESTE_AICI.appspot.com",
  messagingSenderId: "INLOCUIESTE_AICI",
  appId: "INLOCUIESTE_AICI"
};

// Identificator unic pentru familia voastră — orice șir de litere/cifre,
// gândește-l ca pe o "parolă" simplă a contului vostru de date.
// Lasă-l așa cum e sau schimbă-l cu altceva greu de ghicit; important e
// să fie LA FEL pe toate telefoanele (e oricum copiat automat, pentru că
// toți deschideți același link al aplicației).
const FAMILY_ID = "bogdan-carmen-stefan-2026";
