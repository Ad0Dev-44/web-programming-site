let total = 0;  
const cache = {}; // cache[i] = a fetched question object


async function getQuestion(index) {
  // 1. If this question is already in cache, return the cached copy
// 2. Otherwise fetch it from `/api/question/${index}` (relative URL)
// 3. Check response.ok; if the request failed, throw an error
// 4. Read the JSON, store it in cache[index], and return it
  if (cache[index]) {
    return cache[index];
  }
  try {
    const response = await fetch(`/api/question/${index}`); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
      const data = await response.json();
      cache[index] = data;
      return data;
    }catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
}


// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = []; 

// ======================================================
// SAVE AN ANSWER
// ======================================================
function saveAnswer(choiceIndex) {
  //   Save the user's answer for the current question.
  userAnswers[currentQuestion] = choiceIndex;
  console.log(`Saved answer ${choiceIndex} for question ${currentQuestion+1}`);
}

// ======================================================
// NAVIGATION
// ======================================================
function goNext() {
  //   Move to the next question if not at the last question.
  if (currentQuestion < total-1) {
    currentQuestion++;
    renderQuestion();
  }
}

function goPrevious() {
  //   Move to the previous question if not at the first question.
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function goFirst() {
  //   Move to the first question.
  currentQuestion = 0;
  renderQuestion();
}
function goLast() {
  //   Move to the last question.
  currentQuestion = total-1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
async function calculateScore() {
  //   Calculate the user's score based on their answers.
  let score = 0;
  for (let i = 0; i < total; i++) {
    const question = await getQuestion(i);
    if (userAnswers[i] === question.answer) {
      score++;
    }
  }
  return score;
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================
function calculatePercentage(score) {
  //   Calculate the percentage score based on the total number of questions.
  return Math.round((score / total) * 100);
}

// ======================================================
// PERFORMANCE MESSAGE
// ======================================================
function getPerformanceMessage(percentage) {
  //   Return a performance message based on the percentage score.
  if (percentage >= 80) {
    return "Excellent";
  } else if (percentage >= 60 && percentage <= 79 ) {
    return "Good";
  } else if ( percentage >= 50 && percentage <= 59){
    return "Pass";
  }else {
    return "Needs improvement";
  }
}

// ======================================================
// BUILD CORRECTION
// ======================================================
async function buildCorrection() {
  let correction = "";

  //   Build a correction string that includes the question, the user's answer,
  //   the correct answer, and an explanation for each question.
  for (let i = 0; i < total; i++) {
    const question = await getQuestion(i);
    const userAnswer = userAnswers[i] !== undefined ? question.choices[userAnswers[i]] : "Not answered";
    correction += `<article class="review">`;
    correction += `<h4 class="review-number">Question ${i + 1}</h4>`;
    correction += `<p class="review-question">${question.question}</p>`;
    correction += `<p class="review-row your-answer"><span class="review-label">Your answer:</span> ${userAnswer}</p>`;
    correction += `<p class="review-row correct-answer"><span class="review-label">Correct answer:</span> ${question.choices[question.answer]}</p>`;
    correction += `<p class="review-explanation"><span class="review-label">Explanation:</span> ${question.explanation}</p>`;
    correction += `</article>`;
  }
  return correction;
}

// ======================================================
// PROVIDED INTERFACE CODE
//
// DOM manipulation and events will be studied later.
// ======================================================

// ======================================================
// SUBMIT QUIZ
// ======================================================
async function submitQuiz() {
  const score = await calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = await buildCorrection();
  showResults(score, percentage, message, correction);
}


async function renderQuestion() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  loading.hidden = false;
  error.hidden = true;
  try {
    const question = await getQuestion(currentQuestion);
    document.getElementById("progress").textContent = `Question ${currentQuestion + 1} of ${total}`;
    document.getElementById("questionText").textContent = question.question;
    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";
    for (let i = 0; i < question.choices.length; i++) {
      const label = document.createElement("label");
      label.className = "choice";
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "answer";
      radio.value = i;
      if (userAnswers[currentQuestion] === i) {
        radio.checked = true;
      }
      radio.onclick = function () {
        saveAnswer(i);
      };
      label.appendChild(radio);
      label.appendChild(document.createTextNode(" " + question.choices[i]));
      choicesContainer.appendChild(label);
    }
    document.getElementById("firstBtn").disabled = currentQuestion === 0;
    document.getElementById("previousBtn").disabled = currentQuestion === 0;
    document.getElementById("nextBtn").disabled =
      currentQuestion === total - 1;
    document.getElementById("lastBtn").disabled =
      currentQuestion === total - 1;
    } catch (err) {
      console.error(err);
      error.textContent =
        `Error fetching question ${currentQuestion + 1}. Please try again later.`;
      error.hidden = false;
    } finally {
      loading.hidden = true;
    }
}


// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${total}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").innerHTML = correction;
}



// ======================================================
// START APPLICATION
// ======================================================
async function init() { 
  // 1. Fetch the question count from "/api/questions/count" 
  // 2. Check response.ok; if the request failed, throw an error 
  // 3. Read the JSON and set total to the count 
  // 4. await renderQuestion() to show the first question 
  try{
      const response = await fetch("/api/questions/count");
      if (!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    total = data.count;
    await renderQuestion();
    }catch (err) {
      console.error('Error fetching count:', err);
      const error = document.getElementById("error");
      error.textContent = "Could not load the quiz. Please try again later.";
      error.hidden = false;
    }
  } init();
 