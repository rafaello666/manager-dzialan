/**
 * @jest-environment jsdom
 */
const {
    loadTasks,
    saveTasks,
    addTask,
    toggleTask,
    removeTask,
    renderTasks
  } = require('../script.js');
  
  beforeEach(() => {
    // czyścimy DOM i localStorage przed każdym testem
    document.body.innerHTML = `<ul id="task-list"></ul>`;
    localStorage.clear();
  });
  
  describe('Unit: core task functions', () => {
    test('addTask() – dodaje nowy <li> i zapisuje go w localStorage', () => {
      addTask('Testowe zadanie');
      const items = document.querySelectorAll('#task-list li');
      expect(items).toHaveLength(1);
      expect(items[0].textContent).toMatch(/Testowe zadanie/);
  
      const stored = JSON.parse(localStorage.getItem('tasks'));
      expect(stored).toHaveLength(1);
      expect(stored[0].text).toBe('Testowe zadanie');
      expect(stored[0].completed).toBe(false);
    });
  
    test('toggleTask() – zmienia klasę .completed i stan w localStorage', () => {
      addTask('Zadanie do toggle');
      const storedBefore = JSON.parse(localStorage.getItem('tasks'));
      const id = storedBefore[0].id;
  
      toggleTask(id);
      const li = document.querySelector(`#task-${id}`);
      expect(li.classList.contains('completed')).toBe(true);
  
      const storedAfter = JSON.parse(localStorage.getItem('tasks'));
      expect(storedAfter[0].completed).toBe(true);
  
      // przełączamy z powrotem
      toggleTask(id);
      expect(document.querySelector(`#task-${id}`).classList.contains('completed')).toBe(false);
    });
  
    test('removeTask() – usuwa <li> i czyści z localStorage', () => {
      addTask('Zadanie do usunięcia');
      const id = JSON.parse(localStorage.getItem('tasks'))[0].id;
  
      removeTask(id);
      expect(document.querySelector(`#task-${id}`)).toBeNull();
  
      const stored = JSON.parse(localStorage.getItem('tasks'));
      expect(stored).toHaveLength(0);
    });
  });
  