### Napraw event-listenery
In `script.js`, usuń duplikaty `addEventListener`, przenieś wszystkie do jednego bloku `DOMContentLoaded` i upewnij się, że nie ma błędów składni.

### Popraw ładowanie pliku JSON
Zmień ścieżkę w `fetch('flow.json')` na właściwą, jeśli `flow.json` znajduje się w podfolderze.