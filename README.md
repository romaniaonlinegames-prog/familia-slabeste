# Familia Slăbește — instrucțiuni

O aplicație web (PWA) pentru voi trei: meniuri, hidratare, bife zilnice,
listă de cumpărături generată automat, progres de greutate și mișcare
pentru Bogdan și Carmen, sincronizate live între telefoane. Ștefan apare
doar la mesele de familie, fără tracking de greutate.

## 1. Cum o instalezi pe telefon (5 minute, gratuit)

Aplicația trebuie găzduită undeva cu HTTPS ca să poată fi instalată și
să trimită notificări. Cea mai simplă variantă, fără cont de dezvoltator:

### Varianta A — GitHub Pages (recomandat, gratuit, al tău pentru totdeauna)
1. Creează un cont gratuit pe github.com, dacă nu ai deja.
2. Creează un repository nou, ex. `familia-slabeste` (poate fi privat).
3. Încarcă **tot conținutul folderului `app/`** (nu folderul în sine, ci fișierele din el — `index.html`, `manifest.json`, `sw.js`, `css/`, `js/`, `icons/`) direct în acel repository.
4. Settings → Pages → Source: alege branch-ul `main`, folder `/ (root)` → Save.
5. În 1-2 minute primești un link de genul `https://numele-tau.github.io/familia-slabeste/`.
6. Deschide linkul ăsta pe telefoanele voastre — **același link, pe ambele telefoane**, ca să acceseze aceleași date.

### Varianta B — Netlify Drop (și mai rapid, fără cont)
1. Mergi pe `app.netlify.com/drop` din calculator.
2. Trage folderul `app/` peste pagină.
3. Primești un link HTTPS instant. Poți reveni oricând să-l reîncarci cu fișiere noi.

## 2. Cum o adaugi pe ecranul principal (ca o aplicație reală)

- **Android (Chrome):** deschide linkul → meniul ⋮ din dreapta sus → „Adaugă pe ecranul de pornire" / „Instalează aplicația".
- **iPhone (Safari):** deschide linkul → butonul de Share (pătratul cu săgeată) → „Add to Home Screen".

După asta apare o iconiță proprie, se deschide pe tot ecranul, fără bara de Safari/Chrome.

## 3. Sincronizare între telefoane (Bogdan ↔ Carmen, în timp real)

Fără acest pas, aplicația merge perfect, dar **fiecare telefon își ține
datele doar pentru el** (vedeți badge-ul „📴 doar local" din header).
Cu pasul ăsta, badge-ul devine „☁️ sincronizat" și orice bifați pe un
telefon apare automat și pe celălalt, în câteva secunde. E gratuit, nu
cere card bancar.

**Important:** aplicația cere acum email + parolă la deschidere, nu se
mai conectează automat și anonim ca înainte. Asta protejează datele
voastre — repository-ul de pe GitHub e public, deci oricine poate vedea
codul, dar nimeni nu poate intra în baza de date fără parola unuia
dintre voi doi.

1. Mergi pe **console.firebase.google.com**, autentifică-te cu un cont
   Google și apasă „Create a project" (sau „Add project"). Dă-i un nume,
   ex. `familia-slabeste`. Poți dezactiva Google Analytics la pasul ăla,
   nu e necesar.
2. În meniul din stânga: **Build → Firestore Database → Create database**.
   Alege o regiune apropiată (ex. `eur3 (europe-west)`) și pornește în
   modul „test" (o să punem reguli proprii imediat).
3. În meniul din stânga: **Build → Authentication → Get started → Sign-in
   method → Email/Password → Enable → Save**.
4. Tot în Authentication, du-te la tab-ul **„Users"** → **„Add user"** →
   creează un cont pentru Bogdan (email + o parolă aleasă de tine) →
   repetă pentru Carmen, cu email-ul ei. Nu există formular de
   înregistrare în aplicație — conturile se creează doar de aici, manual,
   o singură dată.
5. Du-te la **Firestore Database → tab „Rules"** și înlocuiește
   conținutul cu ce găsești în `firestore.rules.txt` din acest pachet —
   **dar întâi** editează cele două adrese de email din fișier și
   pune-le pe cele reale, exact cum le-ai scris la pasul 4 → **Publish**.
6. Click pe rotița ⚙ (Project settings) din stânga sus → coboară la
   „Your apps" → apasă iconița **`</>`** (Web) → dă-i un nume → „Register
   app". O să-ți apară un bloc de cod cu `const firebaseConfig = {...}`.
7. Deschide `js/firebase-config.js` din pachetul aplicației și
   înlocuiește valorile `INLOCUIESTE_AICI` cu ce ai copiat la pasul 6.
8. Încarcă fișierele actualizate pe GitHub Pages / Netlify (la fel ca
   la pasul 1) și deschide din nou linkul pe ambele telefoane.

La prima deschidere, fiecare introduce email-ul și parola lui — telefonul
ține minte logarea de-atunci încolo, nu trebuie reintrodusă de fiecare
dată. Te poți deconecta oricând din tab-ul „Familia".

*Despre securitate:* valorile din `firebase-config.js` (apiKey,
projectId etc.) NU sunt parole — sunt publice prin design la orice
aplicație Firebase, vizibile oricui din codul site-ului, indiferent cine
l-a făcut. Protecția reală vine din regulile din `firestore.rules.txt`,
care permit acces doar celor două email-uri pe care le-ai pus acolo.

## 4. Despre notificări — onestitate completă

- **Android:** merg bine, mai ales dacă lași aplicația instalată și o deschizi din când în când (nu trebuie ținută activă tot timpul, dar dacă telefonul o "omoară" din fundal de foarte mult timp, se pot rata notificările — deschide-o dimineața și e suficient).
- **iPhone:** Apple limitează drastic notificările pentru aplicații web, indiferent cine le construiește. E o restricție de sistem, nu o limitare a aplicației.
- Aplicația recalculează notificările zilei de fiecare dată când o deschizi, deci chiar dacă rata vreuna, urmează corect cu următoarea.
- Dacă vrei notificări 100% garantate inclusiv pe iPhone, varianta reală e o aplicație nativă din App Store, ceea ce înseamnă cont de dezvoltator Apple (99$/an) — spune-mi dacă ajungeți acolo și discutăm.

## 5. Despre mișcare și contorul de pași — onestitate completă

- **Jurnal de activitate** (mers, alergare, treabă prin casă, joacă cu Ștefan, sport, etc.): funcționează 100% sigur, oricând, pe orice telefon — apeși un buton, alegi durata, calculează caloriile arse din greutatea ta.
- **Contorul de pași experimental** (📍 din tab-ul Azi): folosește senzorul de mișcare al telefonului, dar **doar cât ții aplicația deschisă pe ecran, cu telefonul în mână**. Nu numără pași în fundal, cu ecranul stins sau cu telefonul în buzunar — browserele nu au voie să acceseze pedometrul nativ al telefonului (acces rezervat aplicațiilor din App Store/Play Store, ca Apple Health sau Google Fit).
- Telefoanele voastre probabil *deja* numără pașii din toată ziua, automat, prin aplicația Apple Health (iPhone) sau Google Fit (Android), preinstalată — pentru că acelea sunt aplicații native, cu acces la senzor. Nu pot trage automat datele alea în Familia Slăbește fără să construiesc o aplicație nativă separată (discutăm dacă ajungeți acolo).
- Cu un smartwatch (Apple Watch, Wear OS, Fitbit etc.), pașii s-ar sincroniza automat și precis prin Apple Health / Google Fit — atunci chiar are sens o integrare reală. Spune-mi când ajungeți acolo.

## 6. Prima utilizare

La prima deschidere, completați greutatea, înălțimea și nivelul de
activitate pentru Bogdan și Carmen — din astea aplicația calculează
necesarul caloric (formula Mifflin-St Jeor) și ținta de hidratare.

Apăsați clopoțelul 🔔 din header ca să activați notificările.

## 7. Despre rețete

Meniul Săptămânii 1 e construit pe baza rețetelor din cărțile voastre
personale "BT FIT" (Bogdan Tîrziu). Sunt aici doar pentru uzul vostru
de familie, în acest fișier privat — nu le distribuiți mai departe, ca
să respectăm munca autorului așa cum cere și el explicit în carte.

## 8. Ce poți schimba ușor

- **Orele meselor și ale hidratării:** tab „Familia", secțiunea „Ore mese" / „Hidratare".
- **Greutate / înălțime / nivel activitate:** tot în tab „Familia".
- **Meniul propriu-zis:** e în `js/data.js` — dacă vrei meniul Săptămâna 2,
  spune-mi și ți-l generez din restul rețetelor din cărți (sunt încă ~115
  rețete nefolosite).

## 9. Limitări de știut

- E un singur meniu (Săptămâna 1) deocamdată, gândit ca să se repete sau
  să fie extins ușor.
- Fără pasul de Firebase de la secțiunea 3, datele rămân locale pe
  fiecare telefon (nu e o eroare, e doar starea „neconfigurat încă").
