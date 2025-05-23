let flow;
let currentQuestion;
const FINAL_STEP_ID = 'Q006';

document.addEventListener('DOMContentLoaded', () => {
  // Wczytaj strukturę pytań z pliku JSON
  fetch('flow.json')
    .then(res => res.json())
    .then(json => {
      if (!validateFlow(json)) {
        throw new Error('Niepoprawny format danych');
      }
      flow = json;
      // Pobierz klucz pierwszego pytania z załadowanego obiektu
      currentQuestion = Object.keys(flow)[0];
      displayQuestion(currentQuestion);
    })
    .catch(err => {
      console.error('Błąd ładowania flow.json:', err);
      showError('Problem z wczytaniem danych. Spróbuj ponownie później.');
    });

  // Przypięcie event handlerów do przycisków odpowiedzi i akcji:
  document.getElementById('yes-btn')
    .addEventListener('click', () => handleAnswer('yes'));
  document.getElementById('no-btn')
    .addEventListener('click', () => handleAnswer('no'));
  document.getElementById('continue-btn')
    .addEventListener('click', continueAfterAction);

  const saveBtn = document.getElementById('save-note-btn');
  if (saveBtn) {
    // Obsługa przycisku "Zapisz notatkę"
    saveBtn.addEventListener('click', () => {
      const noteText = document.getElementById('note-input').value;
      const noteKey = `${currentQuestion}_note`;   // unikalny klucz dla notatki bieżącego pytania
      localStorage.setItem(noteKey, noteText);     // zapisanie notatki w localStorage
      // Tymczasowa zmiana etykiety przycisku na potwierdzenie zapisu
      saveBtn.innerText = 'Zapisano!';
      setTimeout(() => {
        saveBtn.innerText = 'Zapisz notatkę';
      }, 2000);
    });
  }
});

/** 
 * Wyświetla pytanie o podanym identyfikatorze z obiektu `flow`.
 * Ustawia tekst pytania i pokazuje/przycina odpowiednie elementy interfejsu.
 */
function displayQuestion(id) {
  const q = flow[id];
  // Ustaw treść pytania
  document.getElementById('question').innerText = q.text;
  // Jeśli krok jest oznaczony jako zakończony (done), ukryj przyciski TAK/NIE
  document.getElementById('buttons').style.display = q.done ? 'none' : 'flex';
  // Pokaż kontener z pytaniem, ukryj kontener akcji (notatki)
  document.getElementById('question-container').style.display = 'block';
  document.getElementById('action-container').style.display = 'none';
}

/**
 * Obsługuje odpowiedź użytkownika (tak/nie) dla bieżącego pytania.
 * Na podstawie struktury `flow` decyduje o następnym kroku lub akcji do wykonania.
 */
function handleAnswer(answer) {
  const step = flow[currentQuestion];
  if (step[answer]) {
    // Jeśli zdefiniowany jest kolejny krok dla odpowiedzi "yes" lub "no"
    currentQuestion = step[answer];
    displayQuestion(currentQuestion);
  } else if (step[answer + 'Action']) {
    // Jeśli zdefiniowana jest akcja do wykonania (yesAction lub noAction)
    displayAction(step[answer + 'Action']);
  } else if (step.done) {
    // Jeśli to krok końcowy (done=true), pozostajemy na nim (koniec scenariusza)
    displayQuestion(currentQuestion);
  }
}

/**
 * Wyświetla sekcję akcji (pole notatki i komunikat) z podanym tekstem.
 * Użytkownik może wpisać notatkę i kliknąć "Kontynuuj".
 */
function displayAction(actionText) {
  document.getElementById('action').innerText = actionText;
  // Wczytaj zapisaną wcześniej notatkę (jeśli istnieje) dla bieżącego pytania
  const noteKey = `${currentQuestion}_note`;
  const savedNote = localStorage.getItem(noteKey) || '';
  document.getElementById('note-input').value = savedNote;
  // Pokaż kontener akcji, ukryj kontener pytania
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('action-container').style.display = 'block';
}

/**
 * Obsługa kliknięcia "Kontynuuj" po wykonaniu akcji.
 * Określa następny krok po akcji na podstawie struktury `flow` (pole `next` lub alternatywnie yes/no).
 */
function continueAfterAction() {
  const step = flow[currentQuestion];
  // Po zakończeniu akcji przejdź do kroku wskazanego w `next`,
  // a jeśli go brak – spróbuj kontynuować ścieżką "yes"/"no", 
  // w ostateczności zakończ scenariusz.
  if (step.next) {
    currentQuestion = step.next;
  } else if (step.yes) {
    currentQuestion = step.yes;
  } else if (step.no) {
    currentQuestion = step.no;
  } else {
    currentQuestion = FINAL_STEP_ID;
  }
  displayQuestion(currentQuestion);
}

/**
 * Wyświetla komunikat błędu (np. problem z wczytaniem danych) zamiast pytania.
 */
function showError(message) {
  document.getElementById('question').innerText = message;
  document.getElementById('buttons').style.display = 'none';
  document.getElementById('question-container').style.display = 'block';
  document.getElementById('action-container').style.display = 'none';
}

/**
 * Prosta walidacja struktury danych `flow` (pytań i akcji).
 * Sprawdza, czy dane są obiektem i czy każdy krok ma pole "text" lub "done".
 */
function validateFlow(data) {
  if (typeof data !== 'object' || data === null) return false;
  for (const step of Object.values(data)) {
    if (typeof step !== 'object' || step === null) return false;
    if (!('text' in step || 'done' in step)) {
      // Każdy krok powinien mieć przynajmniej pole text lub done
      return false;
    }
  }
  return true;
}