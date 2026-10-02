// ======================================================
// QUESTIONS
// ======================================================

// Difficulty ramp: q1-q3 warm-up (easy-medium), q4-q7 medium, q8-q10 challenging (but fair)

const q1 = {
    question: "What is the output of the following code snippet?\n\nconsole.log(null == undefined, null === undefined);",
    choices: ["true, true", "true, false", "false, true", "false, false"],
    answer: 1,
    explanation: "Loose equality (==) treats null and undefined as equal, but strict equality (===) also compares types, and null and undefined are different types."
};

const q2 = {
    question: 'Which of the following is an incorrect way to retrieve the age property of this object?\n\nconst person = {firstName: "John", lastName: "Doe", age: 50};',
    choices: ['let age = person.age;', 'let age = person["age"];', 'let age = person."age";', 'let { age } = person;'],
    answer: 2,
    explanation: 'Dot notation requires an identifier (person.age), not a quoted string. person."age" is a syntax error. Use person.age, person["age"], or destructuring ({ age } = person) instead.'
};

const q3 = {
    question: "What is the output of the following code snippet?\n\nconsole.log(x);\nlet x = 5;",
    choices: ["undefined", "5", "ReferenceError", "null"],
    answer: 2,
    explanation: "let declarations are hoisted but not initialized. Accessing x before its declaration falls in the temporal dead zone and throws a ReferenceError (unlike var, which would give undefined)."
};

const q4 = {
    question: "What happens if you try to reassign a new array to a variable declared with const (e.g., const cars = [...]; cars = [...];)?",
    choices: ["It throws an error", "The array elements are updated successfully", "It creates undefined holes", "It clears the array contents"],
    answer: 0,
    explanation: "The keyword const defines a constant reference to an array, meaning elements can be modified, but constant arrays cannot be reassigned and will throw an error."
};

const q5 = {
    question: "In JavaScript conditional statements, how is an empty array ([]) evaluated?",
    choices: ["As falsy", "As truthy", "As undefined", "As null"],
    answer: 1,
    explanation: "An empty array [] is truthy because every object, including an empty array, is truthy."
};

const q6 = {
    question: "What is the output of the following code snippet?\n\nconsole.log(typeof NaN);",
    choices: ["number", "NaN", "undefined", "object"],
    answer: 0,
    explanation: "In JavaScript, NaN (Not-a-Number) is considered a number type, so typeof NaN returns 'number'."
};

const q7 = {
    question: "Which statement is true regarding arrow functions in JavaScript?",
    choices: ["They are automatically hoisted", "They have their own this keyword", "They cannot be used as object methods if you need to access object properties using this", "They must use the function keyword"],
    answer: 2,
    explanation: "Arrow functions are not hoisted and do not have their own this, meaning they should not be used for object methods or event listeners where this is required."
};

const q8 = {
    question: "What is the output of the following code snippet?\n\nconsole.log(0.1 + 0.2 === 0.3);",
    choices: ["true", "false", "undefined", "NaN"],
    answer: 1,
    explanation: "Due to floating-point precision issues in JavaScript, 0.1 + 0.2 does not exactly equal 0.3, so the expression evaluates to false."
};

const q9 = {
    question: "What is the output of the following code snippet?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}",
    choices: ["0 1 2", "3 3 3", "2 2 2", "undefined undefined undefined"],
    answer: 1,
    explanation: "var is function-scoped, so all three callbacks share the same i. The callbacks run after the loop finishes, when i is 3. Using let instead would print 0 1 2."
};

const q10 = {
    question: "What is the output of the following code snippet?\n\nconsole.log([] == false);",
    choices: ["true", "false", "undefined", "NaN"],
    answer: 0,
    explanation: "With ==, when one operand is a boolean it is converted to a number (false becomes 0). The array is then converted to a primitive (\"\"), which becomes 0. Since 0 == 0, the result is true, even though [] on its own is truthy."
};
const questions = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10]; 

// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = new Array(questions.length);

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
  if (currentQuestion < questions.length-1) {
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
  currentQuestion = questions.length-1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
function calculateScore() {
  //   Calculate the user's score based on their answers.
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].answer) {
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
  return Math.round((score / questions.length) * 100);
}

// ======================================================
// PERFORMANCE MESSAGE
// ======================================================
function getPerformanceMessage(percentage) {
  //   Return a performance message based on the percentage score.
  if (percentage >= 80) {
    return "Well done! You have a great understanding of javascript.";
  } else if (percentage >= 60) {
    return "Good job! You have a solid understanding of javascript.";
  } else {
    return "Not enough practice! Keep studying! You need to improve your understanding of javascript.";
  }
}

// ======================================================
// BUILD CORRECTION
// ======================================================
function buildCorrection() {
  let correction = "";

  //   Build a correction string that includes the question, the user's answer,
  //   the correct answer, and an explanation for each question.
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
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
function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();
  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const question = questions[currentQuestion];

  // --------------------------------------------------
  // QUESTION NUMBER
  // --------------------------------------------------
  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  // --------------------------------------------------
  // QUESTION
  // --------------------------------------------------
  document.getElementById("questionText").textContent = question.question;

  // --------------------------------------------------
  // CHOICES
  // --------------------------------------------------
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  for (let i = 0; i < question.choices.length; i++) {
    const label = document.createElement("label");
    label.className = "choice";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = i;
    // Restore an answer previously selected
    // by the user.
    if (userAnswers[currentQuestion] === i) {
      radio.checked = true;
    }
    // When the user selects this answer,
    // save its index.
    radio.onclick = function () {
      saveAnswer(i);
    };
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + question.choices[i]));
    choicesContainer.appendChild(label);
  }

  // --------------------------------------------------
  // NAVIGATION BUTTONS
  // --------------------------------------------------
  document.getElementById("firstBtn").disabled = currentQuestion === 0;
  document.getElementById("previousBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled =
    currentQuestion === questions.length - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === questions.length - 1;
}

// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").innerHTML = correction;
}



// ======================================================
// START APPLICATION
// ======================================================
renderQuestion();
