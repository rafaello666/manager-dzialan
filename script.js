let flow;
let currentQuestion;

document.addEventListener('DOMContentLoaded', () => {
  fetch('flow.json')
    .then(res => res.json())
    .then(json => {
      flow = json;
      // Pobierz KLUCZ pierwszego pytania z flow.json
      currentQuestion = Object.keys(flow)[0];
      displayQuestion(currentQuestion);
    })
    .catch(err => console.error('Błąd ładowania flow.json:', err));

  document.getElementById('yes-btn')
    .addEventListener('click', () => handleAnswer('yes'));
  document.getElementById('no-btn')
    .addEventListener('click', () => handleAnswer('no'));
  document.getElementById('continue-btn')
    .addEventListener('click', continueAfterAction);
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
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('action-container').style.display = 'block';
}

function continueAfterAction() {
  const step = flow[currentQuestion];
  // po akcji idziemy do yes albo no albo domyślnie kończymy
  if (step.yes) {
    currentQuestion = step.yes;
  } else if (step.no) {
    currentQuestion = step.no;
  } else {
    currentQuestion = Object.keys(flow).reverse()[0]; // ostatni klucz, zakładając że to Q006
  }
  displayQuestion(currentQuestion);
}
