/* ---------- ZMIENNE GLOBALNE ---------- */
let flow = {};
let currentQuestion;
const FINAL_STEP_ID = 'Q006';

/* ---------- HELPER ---------- */
const qs = (id) => document.getElementById(id);

/* ---------- INICJALIZACJA ---------- */
document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const res  = await fetch('flow.json');
    const json = await res.json();

    if (!validateFlow(json)) {
      throw new Error('Niepoprawny format danych');
    }

    flow            = json;
    currentQuestion = Object.keys(flow)[0];      // pierwszy klucz w pliku
    displayQuestion(currentQuestion);
  } catch (err) {
    console.error('Błąd ładowania flow.json:', err);
    showError('Problem z wczytaniem danych. Spróbuj ponownie później.');
  }

  qs('yes-btn')?.addEventListener('click', () => handleAnswer('yes'));
  qs('no-btn')?.addEventListener('click', () => handleAnswer('no'));
  qs('continue-btn')?.addEventListener('click', continueAfterAction);
  qs('save-note-btn')?.addEventListener('click', saveNote);
}

/* ---------- OBSŁUGA NOTATEK ---------- */
function saveNote() {
  const note = qs('note-input').value;
  localStorage.setItem(`${currentQuestion}_note`, note);

  const btn = qs('save-note-btn');
  if (btn) {
    btn.innerText = 'Zapisano!';
    setTimeout(() => (btn.innerText = 'Zapisz notatkę'), 2000);
  }
}

/* ---------- WYSWIETLANIE PYTAŃ ---------- */
function displayQuestion(id) {
  const step = flow[id];
  if (!step) {
    showError('Nie znaleziono kroku.');
    return;
  }

  qs('question').innerText                  = step.text || '';
  qs('buttons').style.display               = step.done ? 'none' : 'flex';
  qs('question-container').style.display    = 'block';
  qs('action-container').style.display      = 'none';
}

/* ---------- OBSŁUGA ODPOWIEDZI ---------- */
function handleAnswer(answer) {
  const step = flow[currentQuestion];
  if (!step) return;

  // 1) przejście do kolejnego kroku
  if (step[answer]) {
    currentQuestion = step[answer];
    displayQuestion(currentQuestion);
    return;
  }

  // 2) wyświetlenie akcji (yesAction / noAction)
  const actionKey = `${answer}Action`;
  if (step[actionKey]) {
    displayAction(step[actionKey]);
    return;
  }

  // 3) jeżeli krok jest oznaczony jako done
  if (step.done) {
    displayQuestion(currentQuestion);
  }
}

/* ---------- WYSWIETLANIE AKCJI ---------- */
function displayAction(text) {
  qs('action').innerText                    = text;
  qs('note-input').value                    = localStorage.getItem(`${currentQuestion}_note`) || '';
  qs('question-container').style.display    = 'none';
  qs('action-container').style.display      = 'block';
}

/* ---------- KONTYNUACJA PO AKCJI ---------- */
function continueAfterAction() {
  const step = flow[currentQuestion];
  if (!step) return;

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

/* ---------- OBSŁUGA BŁĘDÓW ---------- */
function showError(message) {
  qs('question').innerText                  = message;
  qs('buttons').style.display               = 'none';
  qs('question-container').style.display    = 'block';
  qs('action-container').style.display      = 'none';
}

/* ---------- WALIDACJA STRUKTURY FLOW ---------- */
function validateFlow(data) {
  if (typeof data !== 'object' || data === null) return false;

  return Object.values(data).every((step) => {
    if (typeof step !== 'object' || step === null) return false;
    return 'text' in step || step.done === true;
  });
}

/* ---------- EXPORTY DLA TESTÓW (Jest) ---------- */
if (typeof module !== 'undefined') {
  module.exports = {
    // główne funkcje, które warto testować
    validateFlow,
    displayQuestion,
    handleAnswer,
    displayAction,
    continueAfterAction,
    showError,
    init
  };
}