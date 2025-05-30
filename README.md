Dopamine-Manager 🚀
Dopamine-Manager to nowoczesna, responsywna aplikacja internetowa pomagająca zarządzać codziennymi zadaniami i decyzjami w formie interaktywnego drzewa pytań i odpowiedzi.
Aplikacja działa offline, jest zgodna z PWA (możesz ją zainstalować na smartfonie lub desktopie), obsługuje notatki oraz pełną personalizację scenariusza.

✨ Funkcje
Konfigurowalne drzewo pytań i odpowiedzi (flow.json)

Notatki do każdego kroku – zapisywane lokalnie w przeglądarce

Nowoczesny ciemny motyw

Responsywny layout (działa na telefonie i desktopie)

PWA – instalacja jako aplikacja, pełne wsparcie offline

Szybkie uruchomienie bez backendu

Integracja z Google Analytics (śledzenie zdarzeń i ruchu, opcjonalnie)

🟢 Wypróbuj online
Najprościej – nie musisz nic instalować!
Wersja online: https://rafaello666.github.io/manager-dzialan/

📲 Instalacja jako aplikacja PWA
Wejdź na https://rafaello666.github.io/manager-dzialan/ z telefonu lub komputera.

Kliknij „Dodaj do ekranu głównego” (na telefonie: menu Chrome; na desktopie: ikona plusa w pasku adresu lub menu przeglądarki).

Po instalacji aplikacja działa offline, uruchamia się z ekranu głównego.

⚙️ Instalacja lokalna (deweloperska)
1. Sklonuj repozytorium
bash
Kopiuj
Edytuj
git clone https://github.com/rafaello666/manager-dzialan.git
cd manager-dzialan
2. Uruchom serwer lokalny
Niektóre przeglądarki nie obsługują fetch dla file://, dlatego uruchom serwer HTTP:

Python:

bash
Kopiuj
Edytuj
python3 -m http.server 8080
Otwórz: http://localhost:8080

Node.js (polecane, wymaga serve):

bash
Kopiuj
Edytuj
npm install -g serve
serve .
Otwórz: http://localhost:3000 lub http://localhost:5000

🛠️ Struktura projektu
index.html – główny plik aplikacji i layout strony

script.js – logika aplikacji, obsługa pytań, odpowiedzi, notatek, modal, obsługa offline/PWA

style.css – responsywny, ciemny styl interfejsu

manifest.json – manifest PWA (instalacja na urządzeniu, ikony)

service-worker.js – obsługa cache, tryb offline

flow.json – Twój własny scenariusz pytań i akcji (łatwy do edycji, patrz niżej)

icon-192.png, icon-512.png – ikony do PWA

(Opcjonalnie) favicon.ico

Wszystkie pliki znajdują się w katalogu głównym repozytorium.

📄 Edycja scenariusza (flow.json)
Plik flow.json steruje całą logiką: pytaniami, odpowiedziami, akcjami, kolejnością kroków.
Możesz go edytować, aby stworzyć własne drzewo decyzji.

Przykład fragmentu flow.json:

json
Kopiuj
Edytuj
{
  "Q001": {
    "text": "Czy chcesz zacząć dzień produktywnie?",
    "yes": "Q002",
    "no": "Q003"
  },
  "Q002": {
    "text": "Super! Zrób notatkę, co zrobisz jako pierwsze.",
    "yesAction": "Dodaj notatkę z planem.",
    "done": true
  }
}
Pola kroku:

text – treść pytania/kroku,

yes / no – ID następnego kroku po odpowiedzi TAK/NIE,

yesAction / noAction – akcja do wykonania (np. notatka),

done – czy to krok końcowy,

next – alternatywna ścieżka po zakończeniu akcji.

🗒️ Notatki
Możesz zapisywać notatki do każdego pytania/kroku.

Notatki są zapisywane tylko lokalnie w Twojej przeglądarce.

Są dostępne nawet po odświeżeniu strony lub w trybie offline.

📈 Integracja z Google Analytics (opcjonalnie)
Aby śledzić ruch i zdarzenia:

Załóż usługę GA4 na https://analytics.google.com/

Skopiuj Measurement ID, np. G-XXXXXX.

Wstaw do <head> w index.html:

html
Kopiuj
Edytuj
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXX');
</script>
(Opcjonalnie) Dodaj własne eventy w script.js, np.:

js
Kopiuj
Edytuj
document.getElementById('yes-btn')?.addEventListener('click', () => {
  gtag('event', 'click_yes', { 'event_category': 'question', 'event_label': window.location.pathname });
});
🧑‍💻 Współtworzenie / kontrybucje
Pull Requesty i Issues są mile widziane!

Propozycje nowych funkcji, poprawki, tłumaczenia? Śmiało – zapraszam!

❓ FAQ / najczęstsze pytania
Aplikacja nie wczytuje pytań!

Upewnij się, że otwierasz aplikację przez serwer HTTP, nie przez file://.

Sprawdź, czy plik flow.json jest poprawny i obecny w katalogu.

Jak wyczyścić notatki?

Otwórz narzędzia programistyczne przeglądarki (F12) → Application → LocalStorage → usuń wpisy kończące się na _note.

Jak zainstalować aplikację na telefonie?

Wejdź na stronę, kliknij menu Chrome → „Dodaj do ekranu głównego”.

📃 Licencja
MIT – możesz korzystać, modyfikować i udostępniać bez ograniczeń.

Dopamine-Manager – Twój codzienny turbo-budzik produktywności 🚀
Wersja online: rafaello666.github.io/manager-dzialan
Zgłoszenia/kontrybucje: Issues na GitHub

Miłego hakowania dopaminy!