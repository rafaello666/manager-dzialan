# AGENTS

These guidelines apply to the entire repository.

## Style
- Use 2 spaces for indentation in HTML, CSS and JavaScript files.
- Keep code simple and avoid adding new dependencies.

## Flow
- The file `flow.json` defines the sequence of questions.
- After the step `kontakt z rodziną, rodzicami` there must be a step asking
  whether Monika or któryś z Twoich znajomych ma ochotę się spotkać. Jeśli
  odpowiesz **tak**, wyświetl akcję "Idź na spotkanie z tym kimś" i po
  jej zatwierdzeniu przejdź do kolejnego kroku. Jeśli odpowiedź to **nie**,
  kontynuuj od razu następnym krokiem ("jezdzijbolcem").

## Testing
- There are no automated tests. After modifying the code, open `index.html` in a browser to verify that the question flow works as expected.
