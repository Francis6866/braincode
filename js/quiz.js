const startQuiz = document.querySelector('.start_quiz')
const logoutBtn = document.querySelector('#logoutBtn')


// get user from localStorage and update greetings
const user = JSON.parse(localStorage.getItem('braincodeUser'));

if (!user) {
  alert('No user found. Please login first.');
  window.location.href = 'index.html'; // redirect to login
} else {
  document.querySelector('#welcomeText').textContent = `Hi, ${user.full_name.split(' ')[0]} 👋`;
}

// logout fxn
function logout() {
    localStorage.removeItem('braincodeUser');
    window.location.href = 'index.html';
  }

logoutBtn.addEventListener('click', logout)

// start quiz
startQuiz.addEventListener('click', () => {
    startQuiz.style.display = 'none'
    document.querySelector('.question_container').style.display = 'block'
})