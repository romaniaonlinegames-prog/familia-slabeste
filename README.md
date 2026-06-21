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

## 3. Sincronizare între telefoane, în timp real

Fără acest pas, aplicația merge perfect, dar **fiecare telefon își ține
datele doar pentru el** (vedeți badge-ul „📴 doar local" din header).
Cu pasul ăsta, badge-ul devine „☁️ sincronizat" și orice bifați pe un
telefon apare automat și pe celălalt, în câteva secunde. E gratuit, nu
cere card bancar.

**Cum funcționează:** fiecare persoană își creează propriul cont (email +
parolă, nu cont Google) direct din aplicație — nu mai e nevoie să creezi
tu manual conturile din consola Firebase. La primul cont creat dintr-o
familie, aplicația generează un **cod scurt** (ex. `7K2M9P`) — partenerul
îl introduce la „Am deja un cod" ca să ajungă în aceeași familie. Doar cei
cu cont autentificat și familyId-ul corect pot vedea datele unei familii.

1. Mergi pe **console.firebase.google.com**, autentifică-te cu un cont
   Google și apasă „Create a project" (sau „Add project"). Dă-i un nume,
   ex. `familia-slabeste`. Poți dezactiva Google Analytics la pasul ăla,
   nu e necesar.
2. În meniul din stânga: **Build → Firestore Database → Create database**.
   Alege o regiune apropiată (ex. `eur3 (europe-west)`) și pornește în
   modul „test" (o să punem reguli proprii imediat).
3. În meniul din stânga: **Build → Authentication → Get started → Sign-in
   method → Email/Password → Enable → Save**. (Nu mai trebuie create
   conturi manual la tab-ul „Users" — fiecare își face singur cont, din
   aplicație.)
4. Du-te la **Firestore Database → tab „Rules"** și înlocuiește
   conținutul cu ce găsești în `firestore.rules.txt` din acest pachet →
   **Publish**. De data asta nu mai trebuie editat nimic în fișier —
   regulile funcționează pentru orice familie nouă, automat.
5. Click pe rotița ⚙ (Project settings) din stânga sus → coboară la
   „Your apps" → apasă iconița **`</>`** (Web) → dă-i un nume → „Register
   app". O să-ți apară un bloc de cod cu `const firebaseConfig = {...}`.
6. Deschide `js/firebase-config.js` din pachetul aplicației și
   înlocuiește valorile `INLOCUIESTE_AICI` cu ce ai copiat la pasul 5.
7. Încarcă fișierele actualizate pe GitHub Pages / Netlify (la fel ca
   la pasul 1) și deschide din nou linkul.

La prima deschidere, fiecare apasă „Creează unul nou" și-și face cont cu
email + parolă (emailul nu trebuie să fie unul real/verificat — nu trimitem
nimic pe el, e doar identificator). Primul din familie apasă „Familie nouă"
și primește un cod; partenerul apasă „Am deja un cod" și-l introduce. Codul
e vizibil oricând în tab-ul „Familia", dacă vreți să-l recuperați.

**Dacă sunteți Bogdan sau Carmen** (familia originală, cu date deja
existente dinainte de acest sistem): la prima logare după actualizare, o
să vi se ceară un cod de familie — alegeți „Am deja un cod" și introduceți
exact: `bogdan-carmen-stefan-2026` (fără spații, orice literă mare/mică).
Datele voastre vechi (meniu, greutate, bife) reapar automat, neatinse.

*Despre securitate:* valorile din `firebase-config.js` (apiKey,
projectId etc.) NU sunt parole — sunt publice prin design la orice
aplicație Firebase, vizibile oricui din codul site-ului, indiferent cine
l-a făcut. Protecția reală vine din regulile din `firestore.rules.txt`,
care permit acces doar contului care are familyId-ul corect, verificat
prin documentul lui de cont — nu prin email-uri scrise în cod.

## 4. Despre notificări — onestitate completă

- **Android:** merg bine, mai ales dacă lași aplicația instalată și o deschizi din când în când (nu trebuie ținută activă tot timpul, dar dacă telefonul o "omoară" din fundal de foarte mult timp, se pot rata notificările — deschide-o dimineața și e suficient).
- **iPhone:** Apple limitează drastic notificările pentru aplicații web, indiferent cine le construiește. E o restricție de sistem, nu o limitare a aplicației.
- Aplicația recalculează notificările zilei de fiecare dată când o deschizi, deci chiar dacă rata vreuna, urmează corect cu următoarea.
- Dacă vrei notificări 100% garantate inclusiv pe iPhone, varianta reală e o aplicație nativă din App Store, ceea ce înseamnă cont de dezvoltator Apple (99$/an) — spune-mi dacă ajungeți acolo și discutăm.

## 5. Despre mișcare și contorul de pași — onestitate completă

- **Jurnal de activitate** (mers, alergare, treabă prin casă, joacă cu copiii, sport, etc.): funcționează 100% sigur, oricând, pe orice telefon — apeși un buton, alegi durata, calculează caloriile arse din greutatea ta.
- **Contorul de pași experimental** (📍 din tab-ul Azi): folosește senzorul de mișcare al telefonului, dar **doar cât ții aplicația deschisă pe ecran, cu telefonul în mână**. Nu numără pași în fundal, cu ecranul stins sau cu telefonul în buzunar — browserele nu au voie să acceseze pedometrul nativ al telefonului (acces rezervat aplicațiilor din App Store/Play Store, ca Apple Health sau Google Fit).
- Telefoanele voastre probabil *deja* numără pașii din toată ziua, automat, prin aplicația Apple Health (iPhone) sau Google Fit (Android), preinstalată — pentru că acelea sunt aplicații native, cu acces la senzor. Nu pot trage automat datele alea în Familia Slăbește fără să construiesc o aplicație nativă separată (discutăm dacă ajungeți acolo).
- Cu un smartwatch (Apple Watch, Wear OS, Fitbit etc.), pașii s-ar sincroniza automat și precis prin Apple Health / Google Fit — atunci chiar are sens o integrare reală. Spune-mi când ajungeți acolo.

## 6. Prima utilizare

La prima deschidere, fiecare adult completează numele, greutatea,
înălțimea și nivelul de activitate — din astea aplicația calculează
necesarul caloric (formula Mifflin-St Jeor) și ținta de hidratare.
Copilul e opțional — lăsați numele necompletat dacă nu aveți copil mic
în plan.

Apăsați clopoțelul 🔔 din header ca să activați notificările.

## 7. Generator de meniu — pe baza datelor voastre

Aplicația nu mai are un singur meniu fix. La prima configurare a
profilurilor (greutate, înălțime, nivel de activitate, **obiectiv**),
se generează automat un meniu de o săptămână, calculat să se apropie
de necesarul vostru caloric — formula Mifflin-St Jeor, ajustată după
obiectiv:

- **Slăbit** — 82% din necesarul de menținere (cu prag minim de
  siguranță 1300 kcal, recomandarea cărții).
- **Menținere** — 100% din necesar.
- **Îngrășare** — 115% din necesar.

Dacă voi doi aveți obiective diferite, meniul comun e calculat pentru
cel cu necesarul mai mic — celălalt adaugă o porție în plus de proteină
la prânz și cină (notă vizibilă în tab-ul Meniu).

**Pentru săptămâna următoare:** din tab-ul „Meniu", apasă **„🔄
Generează meniu nou"**. Meniul vechi se mută automat în istoric (vizibil
din același tab), iar cel nou încearcă să folosească alte rețete decât
săptămâna anterioară, pentru variație reală — nu doar reordonare.

Generatorul alege din ~28 de rețete (mic dejun, prânz, cină, gustare
fără gătit), grupate în blocuri de 2-3 zile ca să nu fie nevoie să
gătiți zilnic — exact aceeași logică pe care am stabilit-o pentru
Săptămâna 1, doar că acum se aplică automat, de fiecare dată.

**Listă de cumpărături automată** — acum chiar funcționează corect cu
orice meniu generat: ouăle (albușuri/gălbenușuri/ouă întregi din toate
rețetele) se adună într-un singur total de cumpărat, restul
ingredientelor identice se combină automat (ex. ceapa din 3 rețete
diferite devine o singură linie). Nu mai e o listă fixă, scrisă de
mine — se recalculează la fiecare meniu nou.

*Notă onestă:* cu doar ~28 de rețete în bază, după 3-4 săptămâni
generate, unele combinații încep să semene. Dacă vrei mai multă
varietate, spune-mi și mai extind baza din restul cărții.

## 8. Despre rețete — atenție dacă invitați alte familii

Meniul Săptămânii 1 e construit pe baza rețetelor din cărțile personale
"BT FIT" (Bogdan Tîrziu), licențiate strict pentru uz personal — cartea
interzice explicit distribuirea mai departe.

**Important acum că alte familii se pot loga singure:** dacă invitați
testeri să-și facă cont și să folosească aplicația, ei văd și ei aceleași
rețete — practic distribuiți conținutul cărții mai departe, chiar dacă
neintenționat. Pentru testare cu câțiva prieteni apropiați, riscul e mic,
dar pentru orice plan de lansare publică/comercială, meniul trebuie
înlocuit cu rețete proprii sau licențiate corect, înainte să devină
public. Nu uita de asta când treci la etapa următoare.

## 9. Ce poți schimba ușor

- **Orele meselor și ale hidratării:** tab „Familia", secțiunea „Ore mese" / „Hidratare".
- **Greutate / înălțime / nivel activitate / obiectiv:** tot în tab „Familia".
- **Meniul săptămânii:** se generează din aplicație, tab „Meniu" → „Generează meniu nou" — nu mai trebuie să-mi ceri mie. Baza de rețete e în `js/data.js`, dacă vrei să adaugi mai multe (sunt încă ~85 rețete nefolosite din cărți) — valabil doar pentru uz personal/testare restrânsă, vezi avertismentul de mai sus.

## 10. Limitări de știut

- Fiecare familie are propriul meniu generat, pe baza propriilor date —
  nu mai e un meniu fix comun, dar baza de ~28 de rețete e încă aceeași
  pentru toate familiile (vezi avertismentul de la secțiunea 8).
- Fără pasul de Firebase de la secțiunea 3, datele rămân locale pe
  fiecare telefon (nu e o eroare, e doar starea „neconfigurat încă").
- Momentan suportă exact 2 adulți + cel mult 1 copil per familie — pentru
  mai mulți copii sau structuri diferite de familie, mai e nevoie de lucru.
