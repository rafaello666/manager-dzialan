/**
 * Testy integracyjne dla Dopamine-Manager (Jest + jsdom)
 */
const fs = require('fs');
const path = require('path');

// Helper to load HTML into jsdom
function loadHtml() {
  const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
  document.documentElement.innerHTML = html;
}

// Przykładowy minimalny flow.json (musisz mieć ten plik na ścieżce ../flow.json)
const flowJson = {
  "q1": {
    "text": "Czy lubisz programować?",
    "yes": "q2",
    "noAction": "Idź na spacer"
  },
  "q2": {
    "text": "Czy chcesz napisać testy?",
    "yesAction": "Napisz testy w Jest!",
    "no": "koniec"
  },
  "koniec": {
    "text": "Dziękuję! Koniec.",
    "done": true
  }
};

jest.spyOn(global, 'fetch').mockImplementation((input) => {
  // Podmień fetch('flow.json') na dane testowe
  if (input.includes('flow.json')) {
    return Promise.resolve({
      json: () => Promise.resolve(flowJson),
      ok: true,
      status: 200,
    });
  }
  return Promise.reject(new Error('Not found'));
});

describe('Dopamine-Manager integration', () => {
  beforeEach(() => {
    jest.resetModules();
    // Wczytaj HTML przed każdym testem
    loadHtml();
    // Wyzeruj localStorage
    localStorage.clear();
    // Przeładuj skrypt (wymaga eksportu lub globalnego scope!)
    require('../script.js');
  });

  test('Ładuje pierwsze pytanie', async () => {
    // Poczekaj aż DOM zostanie zainicjalizowany (fake async)
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(document.getElementById('question').textContent)
      .toContain('Czy lubisz programować?');
    expect(document.getElementById('buttons').style.display)
      .toBe('flex');
  });

  test('Kliknięcie TAK przechodzi do q2', async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
    const yesBtn = document.getElementById('yes-btn');
    yesBtn.click();
    expect(document.getElementById('question').textContent)
      .toContain('Czy chcesz napisać testy?');
  });

  test('Kliknięcie NIE otwiera akcję (noAction)', async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
    document.getElementById('no-btn').click();
    expect(document.getElementById('action-container').style.display)
      .toBe('block');
    expect(document.getElementById('action').textContent)
      .toContain('Idź na spacer');
  });

  test('Zapisuje notatkę do localStorage', async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
    // Kliknij NIE by otworzyć akcję
    document.getElementById('no-btn').click();
    // Dodaj notatkę
    const noteInput = document.getElementById('note-input');
    noteInput.value = 'Moja testowa notatka';
    // Kliknij Zapisz notatkę
    document.getElementById('save-note-btn').click();
    // Sprawdź, czy notatka zapisana w localStorage (dla q1)
    expect(localStorage.getItem('q1_note')).toBe('Moja testowa notatka');
  });

  test('Kliknięcie Kontynuuj idzie do kolejnego kroku', async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
    document.getElementById('no-btn').click();
    document.getElementById('continue-btn').click();
    // Akcja domyślna: przejdź do q2 (tak jakby yes)
    expect(document.getElementById('question').textContent)
      .toContain('Czy chcesz napisać testy?');
  });

  test('Obsługa kroku końcowego (done)', async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
    // TAK -> q2
    document.getElementById('yes-btn').click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    // NIE -> koniec
    document.getElementById('no-btn').click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(document.getElementById('question').textContent)
      .toContain('Dziękuję! Koniec.');
    expect(document.getElementById('buttons').style.display)
      .toBe('none');
  });
});
