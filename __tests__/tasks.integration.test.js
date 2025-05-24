
/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');

// wczytujemy index.html i nasz skrypt jako moduł
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Integration: pełna aplikacja w jsdom', () => {
  let addBtn, input, list;

  beforeEach(() => {
    // renderujemy HTML
    document.documentElement.innerHTML = html;
    // dołączamy script.js
    require('../script.js');
    // czekamy na DOMContentLoaded
    // (nasz script.js wiąże eventy właśnie na tym evencie)
    const evt = new Event('DOMContentLoaded');
    document.dispatchEvent(evt);

    addBtn = document.getElementById('add-btn');
    input  = document.getElementById('task-input');
    list   = document.getElementById('task-list');
    localStorage.clear();
  });

  test('Dodawanie nowego zadania przez UI', () => {
    input.value = 'Zadanie z UI';
    addBtn.click();

    // w liście pojawił się element
    expect(list.querySelectorAll('li')).toHaveLength(1);
    expect(list.textContent).toContain('Zadanie z UI');

    // i jest zapis w localStorage
    const stored = JSON.parse(localStorage.getItem('tasks'));
    expect(stored).toHaveLength(1);
    expect(stored[0].text).toBe('Zadanie z UI');
  });

  test('Oznaczanie zadania jako ukończone przez kliknięcie', () => {
    // najpierw dodajemy
    input.value = 'Do toggle';
    addBtn.click();

    // przycisk toggle to pierwszy button w <li>
    const toggleBtn = list.querySelector('li .btn-toggle');
    toggleBtn.click();

    const li = list.querySelector('li');
    expect(li.classList.contains('completed')).toBe(true);

    // stan w localStorage też
    const stored = JSON.parse(localStorage.getItem('tasks'));
    expect(stored[0].completed).toBe(true);
  });

  test('Usuwanie zadania przez UI', () => {
    input.value = 'Zadanie do usunięcia UI';
    addBtn.click();

    // przycisk delete to drugi button w <li>
    const deleteBtn = list.querySelector('li .btn-delete');
    deleteBtn.click();

    expect(list.querySelectorAll('li')).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem('tasks'))).toHaveLength(0);
  });
});
