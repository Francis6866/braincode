const startQuiz = document.querySelector('.start_quiz');
const logoutBtn = document.querySelector('#logoutBtn');
const questionContainer = document.querySelector('.question_container');
const resultContainer = document.querySelector('.result');
const questionCountEl = document.querySelector('.count');
const previousBtn = document.querySelector('.btn_previous');
const nextBtn = document.querySelector('.btn_next');
const submitBtn = document.querySelector('.btn_submit');
import { ques } from "./questions.js";

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

// quiz questions sorted everytime it loads
const questions = ques.sort(() => Math.random() - 0.5).slice(0, 50);

// console.log(questions)

let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;
let timePerQuestion = 24; // seconds
let timer;
let timeLeft = timePerQuestion;
const badges = ['bronze1.jpeg', 'silver1.jpeg', 'gold1.jpeg']

// Start quiz
startQuiz.addEventListener('click', () => {
  startQuiz.style.display = 'none';
  questionContainer.style.display = 'block';
  loadQuestion();
});


// Load current question
function loadQuestion() {
    hasAnswered = false; // Reset per new question

    const questionData = questions[currentQuestionIndex];
    const questionsDiv = document.querySelector(".questions");
    questionsDiv.innerHTML = `
      <div class="question_count">
        <p class="count">Question: ${currentQuestionIndex + 1}/${questions.length}</p>
        <p class="timer">Time Left: <span id="time">${timePerQuestion}</span>s</p>
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

    startTimer()
  }

function startTimer() {
    clearInterval(timer); // stop any existing timer
    timeLeft = timePerQuestion;
    document.getElementById("time").textContent = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            goToNextQuestion(); // auto-skip
        }
    }, 1000);
}


// Next
function goToNextQuestion(){
    checkAnswer();
    currentQuestionIndex++;
    loadQuestion();
    startTimer()
}

nextBtn.addEventListener('click', goToNextQuestion);
  
  // ⏮️ Previous
  previousBtn.addEventListener('click', () => {
    currentQuestionIndex--;
    loadQuestion();
    startTimer()
  });
  
  // ✅ Submit
  submitBtn.addEventListener('click', () => {
    checkAnswer();
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'flex';
  
    const total = questions.length;
    const percent = (score / total) * 100;
  
    let message = '';
    let badgeImage = '';
    let badgeClass = '';
  
    if (percent < 25) {
      message = `
        <p>You scored within the 4th percentile and there'll be no badge for you.</p>
        <p>Try harder next time.</p>
      `;
    } else if (percent < 40) {
      message = `
        <p>You scored within the 3rd percentile and earned yourself a <strong>JavaScript Newbie</strong> badge.</p>
      `;
      badgeImage = badges[0]; // bronze
      badgeClass = 'newbie';
    } else if (percent < 65) {
      message = `
        <p>You scored within the 2nd percentile and earned yourself a <strong>JavaScript Intermediate</strong> badge.</p>
      `;
      badgeImage = badges[1]; // silver
      badgeClass = 'inter';
    } else {
      message = `
        <p>You scored within the 1st percentile and earned yourself a <strong>JavaScript Master</strong> badge.</p>
      `;
      badgeImage = badges[2]; // gold
      badgeClass = 'master';
    }
  
    resultContainer.innerHTML = `
      <h1>Your Score: ${score}/${total}</h1>
      ${message}
      ${badgeImage ? `<img src="../images/${badgeImage}" class="${badgeClass}" alt="Badge">` : ''}
      <button onclick="location.reload()" class='restart_btn' >Restart Quiz</button>
    `;
  });
  
  


// Check selected answer
function checkAnswer() {
    if (hasAnswered) return; // Don't allow re-checking

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

    // Lock future changes to score for this question
    hasAnswered = true;
  
    // disable further selection
    document.querySelectorAll('input[name="option"]').forEach(input => {
      input.disabled = true;
    });
  }