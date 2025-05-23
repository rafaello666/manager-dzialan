### Testy kliknięć w przyciski
Stwórz `__tests__/script.test.js`, który:
- mockuje `fetch('flow.json')` zwracając przykładowy obiekt,
- ładuje HTML z `index.html`,
- symuluje kliknięcia (`yes-btn`, `no-btn`, `save-note-btn`),
- sprawdza zmiany DOM i `localStorage`.