
let total = 0;
const cache = {}; // cache[i] = a fetched question object

const TIMEOUT = 8000; //in milliseconds. 1000 ms is too short: a normal slow request would be cut off after one second.

async function fetchJSON(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function getQuestion(index) {
  // 1. If this question is already in cache, return the cached copy
  // 2. Otherwise fetch it from `/api/question/${index}` (relative URL)
  // 3. Check response.ok; if the request failed, throw an error
  // 4. Read the JSON, store it in cache[index], and return it
  if (cache[index]) {
    return cache[index];
  }
  try {
    const data = await fetchJSON(`/api/question/${index}`);
    cache[index] = data;
    return data;
  } catch (error) {
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
  // Save the user's answer for the current question.
  userAnswers[currentQuestion] = choiceIndex;
  console.log(`Saved answer ${choiceIndex} for question ${currentQuestion + 1}`);
}

// ======================================================
// NAVIGATION
// ======================================================
function goNext() {
  // Move to the next question if not at the last question.
  if (currentQuestion < total - 1) {
    currentQuestion++;
    renderQuestion();
  }
}

function goPrevious() {
  // Move to the previous question if not at the first question.
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function goFirst() {
  // Move to the first question.
  currentQuestion = 0;
  renderQuestion();
}

function goLast() {
  // Move to the last question.
  currentQuestion = total - 1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
async function calculateScore() {
  // Calculate the user's score based on their answers.
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
  // Calculate the percentage score based on the total number of questions.
  return Math.round((score / total) * 100);
}

// ======================================================
// PERFORMANCE MESSAGE
// ======================================================
function getPerformanceMessage(percentage) {
  // Return a performance message based on the percentage score.
  if (percentage >= 80) {
    return "Excellent";
  } else if (percentage >= 60 && percentage <= 79) {
    return "Good";
  } else if (percentage >= 50 && percentage <= 59) {
    return "Pass";
  } else {
    return "Needs improvement";
  }
}

// ======================================================
// BUILD CORRECTION
// ======================================================
async function buildCorrection() {
  let correction = "";

  // Build a correction string that includes the question, the user's answer,
  // the correct answer, and an explanation for each question.
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
  const btn = document.querySelector(".submit");
  const error = document.getElementById("error");
  const retry = document.getElementById("retryBtn");
  const label = btn.textContent;

  try {
    btn.disabled = true;
    btn.textContent = "Submitting…";
    error.hidden = true;
    retry.hidden = true;

    const score = await calculateScore();
    const percentage = calculatePercentage(score);
    const message = getPerformanceMessage(percentage);
    const correction = await buildCorrection();
    showResults(score, percentage, message, correction);
  } catch (err) {
    console.error(err);
    error.textContent = "Could not submit your quiz. Please try again.";
    error.hidden = false;
    retry.hidden = false;
    retry.onclick = submitQuiz;

    // Move focus to the retry button after a submission failure.
    retry.focus();
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
}

async function renderQuestion() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  loading.hidden = false;
  error.hidden = true;
  const retry = document.getElementById("retryBtn");
  retry.hidden = true;

  // The navigation buttons are updated, so they are right even if loading fails.
  document.getElementById("firstBtn").disabled = currentQuestion === 0;
  document.getElementById("previousBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled = currentQuestion === total - 1;
  document.getElementById("lastBtn").disabled = currentQuestion === total - 1;

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
  } catch (err) {
    console.error(err);
    error.textContent =
      `Error fetching question ${currentQuestion + 1}. Please try again later.`;
    error.hidden = false;
    document.getElementById("questionText").textContent = "";
    document.getElementById("choices").innerHTML = "";
    retry.hidden = false;
    retry.onclick = renderQuestion;
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
  document.getElementById("resultsHeading").focus();
}

// ======================================================
// START APPLICATION
// ======================================================
async function init() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const retry = document.getElementById("retryBtn");

  document.getElementById("quizPanel").hidden = false;
  loading.hidden = false;
  error.hidden = true;
  retry.hidden = true;

  try {
    const data = await fetchJSON("/api/questions/count");
    total = data.count;

    if (!Number.isInteger(total) || total < 1) {
      throw new Error("No questions available");
    }

    await renderQuestion();
  } catch (err) {
    console.error('Error fetching count:', err);
    document.getElementById("quizPanel").hidden = true;
    loading.hidden = true;
    error.textContent = "Could not load the quiz. Please try again later.";
    error.hidden = false;
    retry.hidden = false;
    retry.onclick = init;
  }
}

init();
