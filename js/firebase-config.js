/* ============================================================
   Configurare Firebase — deja completată cu datele proiectului
   "familia-slabeste".

   Dacă vreodată recreezi proiectul Firebase sau adaugi o altă aplicație
   web, ia noile valori din Firebase Console → Settings (rotița ⚙) →
   Project settings → secțiunea "Your apps" → și înlocuiește-le mai jos.
   ============================================================ */

export const firebaseConfig = {
  apiKey: "AIzaSyCmN4cmyICUq1W9yHaLbKFMa3_Ud5vWIus",
  authDomain: "familia-slabeste.firebaseapp.com",
  projectId: "familia-slabeste",
  storageBucket: "familia-slabeste.firebasestorage.app",
  messagingSenderId: "57927489764",
  appId: "1:57927489764:web:f1a80b21df4e9c703e74f1"
};

// Identificator unic pentru familia voastră — nu mai trebuie schimbat;
// accesul real e protejat prin email + parolă (vezi firestore.rules.txt),
// nu prin acest ID.
export const FAMILY_ID = "bogdan-carmen-stefan-2026";
