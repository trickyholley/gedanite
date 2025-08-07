import './style.css';

const API_URL = 'http://127.0.0.1:5000';

enum GEDSubject {
  MATH = "Math",
  SCIENCE = "Science",
  SOCIAL_STUDIES = "Social Studies",
  LANGUAGE_ARTS_READING = "Reading",
  LANGUAGE_ARTS_WRITING = "Writing"
}

interface QuestionData {
  question: string;
  options: string[];
  answer: number;
}

let questionData: QuestionData | null = null;

function setInnerHTML(selector: string, html: string) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = html;
}

async function fetchQuestion(subject: GEDSubject) {
  questionData = null;
  setInnerHTML('#question', '<span class="loader"></span>');
  setInnerHTML('#evaluation', '');

  try {
    const response = await fetch(`${API_URL}/question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject })
    });

    if (!response.ok) throw new Error(await response.text());
    questionData = await response.json();
    renderQuestion();
  } catch (error) {
    console.error('Error fetching question:', error);
    setInnerHTML('#question', 'Failed to fetch question.');
  }
}

async function evaluateAnswer(answerIdx: number, explanation: string) {
  if (!questionData) return;

  setInnerHTML('#evaluation', '<span class="loader-two"></span>');

  try {
    const response = await fetch(`${API_URL}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: questionData.question,
        correct_answer: questionData.answer,
        student_answer: questionData.options[answerIdx],
        student_explanation: explanation
      })
    });

    if (!response.ok) throw new Error(await response.text());
    const {result} = await response.json();
    setInnerHTML('#evaluation', `
      <h3>Evaluation Result</h3>
      <pre>${result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</pre>
    `);
  } catch (error) {
    setInnerHTML('#evaluation', 'Failed to evaluate answer.');
  }
}

function renderQuestion() {
  if (!questionData) return;

  const optionsHtml = questionData.options.map((option, idx) => `
    <li>
      <input type="radio" name="answer" id="option-${idx}" value="${idx}">
      <label for="option-${idx}">${option}</label>
    </li>
  `).join('');

  setInnerHTML('#question', `
<div>
    <p>${questionData.question}</p>
    <ol>${optionsHtml}</ol>
    </div>
    <label id="explanation-prompt" for="explanation">Explain your answer:</label>
    <textarea id="explanation" rows="4" cols="50" placeholder="Type your explanation here..."></textarea>
    <button id="submit-answer">Submit Answer</button>
  `);

  const submitButton = document.querySelector<HTMLButtonElement>('#submit-answer');
  submitButton?.addEventListener('click', () => {
    const selectedOption = document.querySelector<HTMLInputElement>('input[name="answer"]:checked');
    const explanation = (document.querySelector<HTMLTextAreaElement>('#explanation')?.value ?? '').trim();

    if (selectedOption && explanation) {
      evaluateAnswer(parseInt(selectedOption.value, 10), explanation);
    } else {
      alert('Please select an answer and provide an explanation.');
    }
  });
}

function renderContent() {
  setInnerHTML('#app', `
    <div id="content">
        <img alt="amber logo for the Gedanite service" src="/gedanite.png" height="160"/>
      <h2>Get ready for the GED!</h2>
      <p>Select the category of question you'd like to receive</p>
      <div id="subject-buttons">
        ${Object.entries(GEDSubject).map(([key, value]) => `
          <button data-subject="${key}">${value}</button>
        `).join('')}
      </div>
      <div id="question"></div>
      <div id="evaluation"></div>
    </div>
  `);

  document.querySelectorAll<HTMLButtonElement>('#subject-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      fetchQuestion(btn.getAttribute('data-subject') as GEDSubject);
    });
  });

  renderQuestion();
}

renderContent();
