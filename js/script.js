let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 20;
let currentIndex1=1;
let selectedAnswers = [];


fetch('js/questions.json')
  .then(response => response.json())
  .then(data => {
    data.sort(() => Math.random() - 0.5); // shuffle
    questions = data.slice(0,5); // pick 10
    loadQuestion(); // start
  });


    function loadQuestion() {
      timeLeft = 20;
      document.getElementById("timer").innerText = `Time: ${timeLeft}s`;
      startTimer();
      const q = questions[currentIndex];
      document.getElementById("questionBox").innerText =`${currentIndex1}. ${q.question}`;
      currentIndex1++;
      const optionsBox = document.getElementById("optionsBox");
      optionsBox.innerHTML = "";
      q.options.forEach(option => {
        const div = document.createElement("div");
        div.classList.add("option");
        div.innerHTML = `
          <label>
            <input type="radio" name="option" value="${escapeHTML(option)}" />
           ${escapeHTML(option)}
          </label>`;
        optionsBox.appendChild(div);
      });
    }

  function nextQuestion() {
  // Get selected option
  const selected = document.querySelector('input[name="option"]:checked');
  if (!selected) {
    alert("Please select an answer!");
    return;
  }

  const answer = selected.value;
  selectedAnswers[currentIndex] = answer; // Store selected answer

  // Check if correct
  if (answer === questions[currentIndex].correct) {
    score++;
  }

  clearInterval(timer); // Stop current timer

  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showScore();
  }
}



    function startTimer() {
      clearInterval(timer); // clear old timers
      timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Time: ${timeLeft}s`;
      if (timeLeft <= 0) {
          clearInterval(timer);
         autoNext(); // go to next if time runs out
        }
      }, 1000);
    }


  function autoNext() {
  const selected = document.querySelector('input[name="option"]:checked');
  let answer = null;

  if (selected) {
    answer = selected.value;
    if (answer === questions[currentIndex].correct) {
      score++;
    }
  }

  selectedAnswers[currentIndex] = answer || "Not Answered"; // Track answer or blank

  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showScore();
  }
}


function showScore() {
  document.getElementById("questionBox").style.display = "none";
  document.getElementById("optionsBox").style.display = "none";
  document.getElementById("next-btn").style.display = "none";

  const scoreBox = document.getElementById("score-box");
  scoreBox.classList.add("score-container");

  scoreBox.innerHTML = `
    <h2 style="color:white;">✅ Your Score: ${score} / ${questions.length}</h2>
    <div class="answer-section">
      <h3 style="color:white;">📝 Review:</h3>
      <ul>
        ${questions.map((q, index) => {
          const userAnswer = selectedAnswers[index] || "No Answer";
          const isCorrect = userAnswer === q.correct;
          return `
            <li>
              <span class="q-num">${index + 1}.</span> ${escapeHTML(q.question)}<br>
              ✅ <b>Correct:</b> <span class="correct">${escapeHTML(q.correct)}</span><br>
              → <b>Your Answer:</b> <span class="${isCorrect ? 'correct' : 'wrong'}">${escapeHTML(userAnswer)}</span>
            </li>
          `;
        }).join("")}
      </ul>
    </div>
     <div style="text-align:center; margin-top: 30px;">
    <button id="restart-btn" onclick="restartQuiz()"> Restart Quiz</button>
  </div>
  `;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function restartQuiz() {
  location.reload(); // Refresh the page
}




    // Load first question
    loadQuestion();