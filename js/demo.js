function loadQuestion(index) {
    const questionObj = questions[index];
    const container = document.querySelector('.questions');
    container.innerHTML = `
        <div class="question_count">
            <p class="count">Question: ${index + 1}/${questions.length}</p>
            <button class="count_btn quit" onclick="logout()">Quit</button>
        </div>
        <div class="question_text">
            <p>${questionObj.question}</p>
        </div>
        <form class="options_form">
            ${questionObj.options.map((opt, i) => `
                <label class="option_label">
                    <input 
                        type="radio" 
                        name="option" 
                        value="${opt}" 
                        onclick="checkAnswer(this, '${questionObj.answer}')"
                    >
                    ${opt}
                </label>
            `).join('')}
        </form>
    `;
}
