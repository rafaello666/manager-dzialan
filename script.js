let flow;
let currentQuestion;
const FINAL_STEP_ID = 'Q006';

document.addEventListener('DOMContentLoaded', init);

/** Inicjuje aplikację po załadowaniu DOM. */
function init() {
  cacheElements();
  bindEvents();
  loadFlow();
}

const el = {};

/** Skrócony dostęp do elementów DOM. */
function $(id) {
  return document.getElementById(id);
}

/** Zapamiętuje często używane elementy DOM. */
function cacheElements() {
  el.question = $('question');
  el.buttons = $('buttons');
  el.questionContainer = $('question-container');
  el.actionContainer = $('action-container');
  el.action = $('action');
  el.noteInput = $('note-input');
  el.saveNoteBtn = $('save-note-btn');
  el.continueBtn = $('continue-btn');
  el.yesBtn = $('yes-btn');
  el.noBtn = $('no-btn');
}

/** Podpina obsługę kliknięć przycisków. */
function bindEvents() {
  el.yesBtn.addEventListener('click', () => handleAnswer('yes'));
  el.noBtn.addEventListener('click', () => handleAnswer('no'));
  el.continueBtn.addEventListener('click', continueAfterAction);
  if (el.saveNoteBtn) {
    el.saveNoteBtn.addEventListener('click', saveNote);
  }
}

/** Wczytuje plik flow.json i uruchamia pierwszy krok. */
function loadFlow() {
  fetch('flow.json')
    .then(res => res.json())
    .then(json => {
      if (!validateFlow(json)) {
        throw new Error('Niepoprawny format danych');
      }
      flow = json;
      currentQuestion = Object.keys(flow)[0];
      displayQuestion(currentQuestion);
    })
    .catch(err => {
      console.error('Błąd ładowania flow.json:', err);
      showError('Problem z wczytaniem danych. Spróbuj ponownie później.');
    });
}

/** Ustawia widoczność elementu. */
function setDisplay(element, visible) {
  element.style.display = visible ? 'block' : 'none';
}

function showQuestionContainer() {
  setDisplay(el.questionContainer, true);
  setDisplay(el.actionContainer, false);
}

function showActionContainer() {
  setDisplay(el.questionContainer, false);
  setDisplay(el.actionContainer, true);
}

/** Wyświetla pytanie o podanym identyfikatorze. */
function displayQuestion(id) {
  const step = flow[id];
  el.question.innerText = step.text;
  el.buttons.style.display = step.done ? 'none' : 'flex';
  showQuestionContainer();
}

/** Obsługuje odpowiedź TAK/NIE. */
function handleAnswer(answer) {
  const step = flow[currentQuestion];
  if (step[answer]) {
    currentQuestion = step[answer];
    displayQuestion(currentQuestion);
  } else if (step[`${answer}Action`]) {
    displayAction(step[`${answer}Action`]);
  } else if (step.done) {
    displayQuestion(currentQuestion);
  }
}

/** Wyświetla sekcję akcji wraz z polem notatki. */
function displayAction(text) {
  el.action.innerText = text;
  const noteKey = `${currentQuestion}_note`;
  el.noteInput.value = localStorage.getItem(noteKey) || '';
  showActionContainer();
}

/** Zapisuje notatkę w localStorage. */
function saveNote() {
  const noteKey = `${currentQuestion}_note`;
  localStorage.setItem(noteKey, el.noteInput.value);
  el.saveNoteBtn.innerText = 'Zapisano!';
  setTimeout(() => {
    el.saveNoteBtn.innerText = 'Zapisz notatkę';
  }, 2000);
}

/** Zwraca klucz następnego kroku. */
function getNextStep(step) {
  return step.next || step.yes || step.no || FINAL_STEP_ID;
}

/** Kontynuuje scenariusz po wykonaniu akcji. */
function continueAfterAction() {
  currentQuestion = getNextStep(flow[currentQuestion]);
  displayQuestion(currentQuestion);
}

/** Wyświetla komunikat błędu. */
function showError(message) {
  el.question.innerText = message;
  el.buttons.style.display = 'none';
  showQuestionContainer();
}

/** Prosta walidacja struktury danych flow.json. */
function validateFlow(data) {
  if (typeof data !== 'object' || data === null) return false;
  for (const step of Object.values(data)) {
    if (typeof step !== 'object' || step === null) return false;
    if (!('text' in step || 'done' in step)) {
      return false;
    }
  }
  return true;
}
