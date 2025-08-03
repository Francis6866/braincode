const startQuiz = document.querySelector('.start_quiz');
const logoutBtn = document.querySelector('#logoutBtn');
const questionContainer = document.querySelector('.question_container');
const resultContainer = document.querySelector('.result');
const questionCountEl = document.querySelector('.count');
const previousBtn = document.querySelector('.btn_previous');
const nextBtn = document.querySelector('.btn_next');
const submitBtn = document.querySelector('.btn_submit');

// Get and greet user
const user = JSON.parse(localStorage.getItem('braincodeUser'));
if (!user) {
  alert('No user found. Please login first.');
  window.location.href = 'index.html';
} else {
  document.querySelector('#welcomeText').textContent = `Hi, ${user.full_name.split(' ')[0]} 👋`;
}

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('braincodeUser');
  window.location.href = 'index.html';
});

// Sample quiz questions (you’ll replace with 50 later)
const questions = [
  {
    question: "What does `typeof null` return?",
    options: ["'object'", "'null'", "'undefined'", "'number'"],
    answer: "'object'"
  },
  {
    question: "Which method is used to parse a JSON string?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.toString()", "parse.JSON()"],
    answer: "JSON.parse()"
  },
  {
    question: "What keyword is used to declare variables in ES6?",
    options: ["var", "int", "let", "define"],
    answer: "let"
  }
  // Add more here or load from Supabase later
];

let currentQuestionIndex = 0;
let score = 0;

// Start quiz
startQuiz.addEventListener('click', () => {
  startQuiz.style.display = 'none';
  questionContainer.style.display = 'block';
  loadQuestion();
});


// Load current question
function loadQuestion() {
    const questionData = questions[currentQuestionIndex];
    const questionsDiv = document.querySelector(".questions");
    questionsDiv.innerHTML = `
      <div class="question_count">
        <p class="count">Question: ${currentQuestionIndex + 1}/${questions.length}</p>
        <button class="count_btn quit" onclick="location.reload()">Quit</button>
      </div>
      <h3>${questionData.question}</h3>
      <ul>
        ${questionData.options.map((option, index) => `
          <li>
            <input type="radio" name="option" id="option${index}" value="${option}">
            <label for="option${index}">${option}</label>
          </li>
        `).join('')}
      </ul>
    `;
  
    // Button visibility
    previousBtn.disabled = currentQuestionIndex === 0;
    nextBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'none' : 'inline-block';
    submitBtn.style.display = currentQuestionIndex === questions.length - 1 ? 'inline-block' : 'none';
  
    // Allow new selection
    document.querySelectorAll('input[name="option"]').forEach(input => {
      input.disabled = false;
      input.addEventListener('change', checkAnswer);

    });
  }


// Next
nextBtn.addEventListener('click', () => {
    checkAnswer();
    currentQuestionIndex++;
    loadQuestion();
  });
  
  // ⏮️ Previous
  previousBtn.addEventListener('click', () => {
    currentQuestionIndex--;
    loadQuestion();
  });
  
  // ✅ Submit
  submitBtn.addEventListener('click', () => {
    // checkAnswer();
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    resultContainer.innerHTML = `
      <h1>Your Score: ${score}/${questions.length}</h1>
      <button onclick="location.reload()">Restart Quiz</button>
    `;
  });
  


// Check selected answer
function checkAnswer() {
    const selected = document.querySelector('input[name="option"]:checked');
  
    if (!selected) return;
  
    const allLabels = document.querySelectorAll('.questions label');
    allLabels.forEach(label => {
      label.classList.remove('label-correct', 'label-incorrect');
    });
  
    const correctAnswer = questions[currentQuestionIndex].answer;
  
    // const selectedLabel = selected.nextElementSibling;
    const selectedLabel = document.querySelector(`label[for="${selected.id}"]`);
    const isCorrect = selected.value === correctAnswer;
  console.log(selectedLabel)
  console.log(selected)
    if (isCorrect) {
      score++;
      selectedLabel.classList.add('label-correct');
    } else {
      selectedLabel.classList.add('label-incorrect');
      // also highlight the correct one
    //   document.querySelectorAll('input[name="option"]').forEach(input => {
    //     if (input.value === correctAnswer) {
    //       input.nextElementSibling.classList.add('label-correct');
    //     document.querySelector(`label[for="${input.id}"]`).classList.add('label-correct');
    //     }
    //   });

        document.querySelectorAll('input[name="option"]').forEach(input => {
            if (input.value === correctAnswer) {
          const correctLabel = document.querySelector(`label[for="${input.id}"]`);
          correctLabel.classList.add('label-correct');
        }
      });
    }
  
    // disable further selection
    document.querySelectorAll('input[name="option"]').forEach(input => {
      input.disabled = true;
    });
  }