let flow;
let currentQuestion;
const FINAL_STEP_ID = 'Q006';

document.addEventListener('DOMContentLoaded', () => {
  fetch('flow.json')
    .then(res => res.json())
    .then(json => {
      if (!validateFlow(json)) {
        throw new Error('Niepoprawny format danych');
      }
       flow = json;
      // Pobierz KLUCZ pierwszego pytania z flow.json
      currentQuestion = Object.keys(flow)[0];
      displayQuestion(currentQuestion);
    })
    .catch(err => {
      console.error('Błąd ładowania flow.json:', err);
      showError('Problem z wczytaniem danych. Spróbuj ponownie później.');
    });
  document.getElementById('yes-btn')
    .addEventListener('click', () => handleAnswer('yes'));
  document.getElementById('no-btn')
    .addEventListener('click', () => handleAnswer('no'));
  document.getElementById('continue-btn')
    .addEventListener('click', continueAfterAction);
    
  const saveBtn = document.getElementById('save-note-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const note = document.getElementById('note-input').value;
      localStorage.setItem('note', note);
      saveBtn.innerText = 'Zapisano!';
      setTimeout(() => {
        saveBtn.innerText = 'Zapisz notatkę';
      }, 2000);
    });
  }
  });

function displayQuestion(id) {
  const q = flow[id];
  document.getElementById('question').innerText = q.text;
  document.getElementById('buttons').style.display = q.done ? 'none' : 'flex';
  document.getElementById('question-container').style.display = 'block';
  document.getElementById('action-container').style.display = 'none';
}

function handleAnswer(answer) {
  const step = flow[currentQuestion];
  // jeśli mamy next-step
  if (step[answer]) {
    currentQuestion = step[answer];
    displayQuestion(currentQuestion);
  }
  // jeśli mamy action zamiast next
  else if (step[answer + 'Action']) {
    displayAction(step[answer + 'Action']);
  }
  // jeśli krok DONE
  else if (step.done) {
    displayQuestion(currentQuestion);
  }
}

function displayAction(text) {
  document.getElementById('action').innerText = text;
  const noteKey = `${currentQuestion}_note`;
  const saved = localStorage.getItem(noteKey) || '';
  document.getElementById('note-input').value = saved;
   document.getElementById('question-container').style.display = 'none';
  document.getElementById('action-container').style.display = 'block';
}

function continueAfterAction() {
  let step = flow[currentQuestion];
  // po akcji idziemy do wskazanego kroku lub do yes/no, a na końcu do FINAL_STEP_ID
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


function showError(message) {
  const qElem = document.getElementById('question');
  qElem.innerText = message;
  document.getElementById('buttons').style.display = 'none';
  document.getElementById('question-container').style.display = 'block';
  document.getElementById('action-container').style.display = 'none';
}

function validateFlow(data) {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  for (const step of Object.values(data)) {
    if (typeof step !== 'object' || step === null) {
      return false;
    }
    if (!('text' in step || 'done' in step)) {
      return false;
    }
  }
  return true;
}