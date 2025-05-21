# Dopamine-Manager

"Dopamine-Manager" to niewielka aplikacja internetowa pomagająca zarządzać codziennymi zadaniami w formie prostego drzewa pytań i odpowiedzi.

## Uruchomienie

Aplikacja nie wymaga instalacji. Można ją otworzyć bezpośrednio z pliku,
jednak niektóre przeglądarki blokują zapytania `fetch` przy adresie
`file://`, przez co `flow.json` nie zostanie wczytany. Aby tego uniknąć,
uruchom prosty serwer lokalny, np.:

```bash
python3 -m http.server
# lub
npx serve
```

Po starcie serwera otwórz `http://localhost:8000` i aplikacja będzie działać
poprawnie.

## Struktura projektu

- `index.html` – główny plik strony zawierający layout oraz przyciski nawigacyjne.
- `script.js` – logika aplikacji, która wczytuje pytania z pliku JSON i obsługuje odpowiedzi użytkownika.
- `flow.json` – przykładowy zestaw pytań i odpowiedzi. Można go łatwo zmodyfikować, aby dopasować aplikację do własnych potrzeb.
  Każdy krok może opcjonalnie zawierać pole `next`, które określa identyfikator kolejnego pytania uruchamianego po wykonaniu akcji, gdy nie występuje odpowiedź `yes` ani `no`.
  
Pliki znajdują się bezpośrednio w katalogu głównym repozytorium.
## Licencja

Projekt jest udostępniany na warunkach licencji MIT. Szczegółowe informacje znajdują się w pliku [LICENSE](./LICENSE).