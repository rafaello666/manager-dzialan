/* ---------- ZMIENNE GLOBALNE ---------- */
let flow = {};
let currentQuestion;
const FINAL_STEP_ID = 'Q006';

/* ---------- HELPERY DOM ---------- */
const qs = id => document.getElementById(id);

/* ---------- INICJALIZACJA ---------- */
document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const res  = await fetch('flow.json');
    const json = await res.json();
    if (!validateFlow(json)) throw new Error('Niepoprawny format danych');

    flow            = json;
    currentQuestion = Object.keys(flow)[0];
    displayQuestion(currentQuestion);
  } catch (err) {
    console.error('Błąd ładowania flow.json:', err);
    showError('Problem z wczytaniem danych. Spróbuj ponownie później.');
  }

  qs('yes-btn')      ?.addEventListener('click', () => handleAnswer('yes'));
  qs('no-btn')       ?.addEventListener('click', () => handleAnswer('no'));
  qs('continue-btn') ?.addEventListener('click', continueAfterAction);
  qs('save-note-btn')?.addEventListener('click', saveNote);
  qs('show-note-btn')?.addEventListener('click', () => showNoteModal(currentQuestion));
  qs('closeNoteModal')?.addEventListener('click', hideNoteModal);

  // klik na tło modala = zamknięcie
  qs('noteModal')?.addEventListener('click', (e) => {
    if (e.target === qs('noteModal')) hideNoteModal();
  });

  // PWA: rejestracja Service Workera
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker zarejestrowany:', reg))
        .catch(err => console.error('Błąd Service Workera:', err));
    });
  }

  // Banner offline/online
  window.addEventListener('online',  () => qs('offline-banner').style.display = 'none');
  window.addEventListener('offline', () => qs('offline-banner').style.display = 'block');
}

/* ---------- NOTATKI ---------- */
function saveNote() {
  const note = qs('note-input').value;
  localStorage.setItem(`${currentQuestion}_note`, note);

  const btn = qs('save-note-btn');
  if (btn) {
    btn.innerText = 'Zapisano!';
    setTimeout(() => (btn.innerText = 'Zapisz notatkę'), 2000);
  }
  // po zapisie od razu pokaż przycisk
  toggleShowNoteBtn(true);
}
function showNoteModal(questionId) {
  const note = localStorage.getItem(`${questionId}_note`) || 'Brak notatki';
  qs('noteContent').innerText = note;
  qs('noteModal').style.display = 'flex';
}
function hideNoteModal() {
  qs('noteModal').style.display = 'none';
}
function toggleShowNoteBtn(visible) {
  qs('show-note-btn').style.display = visible ? 'inline-block' : 'none';
}

/* ---------- WYŚWIETLANIE PYTANIA ---------- */
function displayQuestion(id) {
  const step = flow[id];
  if (!step) { showError('Nie znaleziono kroku.'); return; }

  qs('question').innerText                = step.text || '';
  qs('buttons').style.display             = step.done ? 'none' : 'flex';
  qs('question-container').style.display  = 'block';
  qs('action-container').style.display    = 'none';

  // sprawdź, czy istnieje notatka dla tego pytania
  const hasNote = !!localStorage.getItem(`${id}_note`);
  toggleShowNoteBtn(hasNote);
}

/* ---------- OBSŁUGA ODPOWIEDZI ---------- */
function handleAnswer(answer) {
  const step = flow[currentQuestion];
  if (!step) return;

  // 1) przejście dalej
  if (step[answer]) {
    currentQuestion = step[answer];
    displayQuestion(currentQuestion);
    return;
  }
  // 2) akcja (yesAction / noAction)
  const actionKey = `${answer}Action`;
  if (step[actionKey]) { displayAction(step[actionKey]); return; }

  // 3) jeśli krok done
  if (step.done) displayQuestion(currentQuestion);
}

/* ---------- WYŚWIETLANIE AKCJI ---------- */
function displayAction(text) {
  qs('action').innerText                 = text;
  qs('note-input').value                 = localStorage.getItem(`${currentQuestion}_note`) || '';
  qs('question-container').style.display = 'none';
  qs('action-container').style.display   = 'block';
}

/* ---------- KONTYNUACJA PO AKCJI ---------- */
function continueAfterAction() {
  const step = flow[currentQuestion];
  if (!step) return;

  if      (step.next) currentQuestion = step.next;
  else if (step.yes)  currentQuestion = step.yes;
  else if (step.no)   currentQuestion = step.no;
  else                currentQuestion = FINAL_STEP_ID;

  displayQuestion(currentQuestion);
}

/* ---------- BŁĘDY ---------- */
function showError(msg) {
  qs('question').innerText                = msg;
  qs('buttons').style.display             = 'none';
  qs('question-container').style.display  = 'block';
  qs('action-container').style.display    = 'none';
}

/* ---------- WALIDACJA ---------- */
function validateFlow(data) {
  if (typeof data !== 'object' || !data) return false;
  return Object.values(data).every(step =>
    step && typeof step === 'object' && ('text' in step || step.done === true)
  );
}

/* ---------- EXPORTY DLA TESTÓW ---------- */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
    validateFlow, displayQuestion, handleAnswer,
    displayAction, continueAfterAction, showError, init,
    saveNote, showNoteModal, hideNoteModal
  };
}
// ======= GLOBALNY TIMER / STOPER =======
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;

const display = document.getElementById('timer-display');
const startBtn = document.getElementById('timer-start');
const pauseBtn = document.getElementById('timer-pause');
const stopBtn  = document.getElementById('timer-stop');

// Formatowanie czasu hh:mm:ss
function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function updateTimerDisplay() {
  display.innerText = formatTime(timerSeconds);
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerSeconds = 0;
  updateTimerDisplay();
}

startBtn.onclick = startTimer;
pauseBtn.onclick = pauseTimer;
stopBtn.onclick  = stopTimer;

// Po załadowaniu strony wyzeruj licznik
updateTimerDisplay();
