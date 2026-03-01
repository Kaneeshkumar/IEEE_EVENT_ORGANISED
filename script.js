const questions = [

{
question: "If V = 10V and R = 5Ω, what is the current?",
options: ["1 A", "2 A", "5 A", "0.5 A"],
answer: 1
},

{
question: "Power consumed by a 10Ω resistor connected to 10V source is:",
options: ["5 W", "10 W", "20 W", "100 W"],
answer: 1
},

{
question: "Equivalent resistance of two 4Ω resistors in parallel is:",
options: ["8 Ω", "4 Ω", "2 Ω", "1 Ω"],
answer: 2
},

{
question: "If frequency is 50Hz, time period is:",
options: ["0.02 s", "0.2 s", "0.5 s", "50 s"],
answer: 0
},

{
question: "Voltage gain (Av) is defined as:",
options: ["Vin / Vout", "Vout / Vin", "Iout / Iin", "Rout / Rin"],
answer: 1
},

{
question: "Current gain (Ai) is:",
options: ["Vin / Vout", "Iout / Iin", "Rout / Rin", "Power gain"],
answer: 1
},

{
question: "Time constant of RC circuit is:",
options: ["R / C", "RC", "1 / RC", "R + C"],
answer: 1
},

{
question: "A thermistor typically has:",
options: [
"Constant resistance",
"Resistance increases with temperature",
"Resistance decreases with temperature",
"No temperature relation"
],
answer: 2
},

{
question: "An LDR works on the principle of:",
options: [
"Photoelectric effect",
"Change in resistance with light",
"Magnetic induction",
"Piezoelectric effect"
],
answer: 1
},

{
question: "Which sensor is commonly used to detect motion in rooms?",
options: ["LDR", "Thermistor", "PIR sensor", "Strain gauge"],
answer: 2
},

{
question: "A strain gauge measures:",
options: ["Temperature", "Pressure", "Deformation", "Humidity"],
answer: 2
},

{
question: "A piezoelectric sensor converts:",
options: [
"Mechanical stress into electrical signal",
"Light into voltage",
"Heat into resistance",
"Current into sound"
],
answer: 0
},

{
question: "Which sensor is used to measure humidity?",
options: ["Thermistor", "Humidity sensor", "LDR", "Hall sensor"],
answer: 1
},

{
question: "Hall effect sensor is used to measure:",
options: ["Light", "Magnetic field", "Temperature", "Pressure"],
answer: 1
},

{
question: "Ultrasonic sensors are mainly used for:",
options: [
"Distance measurement",
"Temperature measurement",
"Voltage regulation",
"Resistance measurement"
],
answer: 0
},

{
question: "Kirchhoff’s Current Law states:",
options: [
"Sum of voltages in loop is zero",
"Sum of currents at a node is zero",
"V = IR",
"Power is conserved"
],
answer: 1
},

{
question: "For a purely resistive AC circuit, phase difference between V and I is:",
options: ["0°", "90°", "180°", "45°"],
answer: 0
},

{
question: "If R = 10Ω and I = 3A, voltage across resistor is:",
options: ["30 V", "13 V", "3.3 V", "10 V"],
answer: 0
},

{
question: "A transducer converts:",
options: [
"Electrical energy to heat",
"Physical quantity to electrical signal",
"AC to DC",
"Voltage to resistance"
],
answer: 1
},

{
question: "Which of the following is an active sensor?",
options: [
"Thermistor",
"Strain gauge",
"Piezoelectric sensor",
"LDR"
],
answer: 2
}

];

let currentQuestion = 0;
let score = 0;
let streak = 0;
let timeLeft = 45;
let timerInterval;

function loadQuestion() {

    let container = document.getElementById("questionContainer");
    let q = questions[currentQuestion];

    container.innerHTML = `
        <h3>Question ${currentQuestion + 1} / ${questions.length}</h3>
        <p>${q.question}</p>
        ${q.options.map((option, index) =>
            `<label>
                <input type="radio" name="option" value="${index}">
                ${option}
            </label><br>`
        ).join("")}
        <p id="timer">Time Left: 45</p>
<p class="streak">Current Streak: ${streak}</p>
    `;

    startTimer();
}

function startTimer() {
    timeLeft = 45;

    timerInterval = setInterval(function () {

        document.getElementById("timer").innerText =
            "Time Left: " + timeLeft;

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            nextQuestion();
        }

    }, 1000);
}

function nextQuestion() {

    // FIRST CLICK (before quiz starts)
    if (currentQuestion === 0 && document.querySelector(".participant").style.display !== "none") {

        let name = document.getElementById("name").value;
        let usn = document.getElementById("usn").value;

        if (name === "" || usn === "") {
            alert("Please enter Name and USN.");
            return;
        }

        document.querySelector(".participant").style.display = "none";
        loadQuestion();
        return;
    }

    // STOP TIMER
    clearInterval(timerInterval);

    // CHECK ANSWER
    let selected = document.querySelector('input[name="option"]:checked');
if (selected) {
    if (parseInt(selected.value) === questions[currentQuestion].answer) {
        score++;
        streak++;
    } else {
        streak = 0;
    }
}
    // MOVE TO NEXT QUESTION
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

async function showResult() {

    console.log("showResult function triggered");
    let name = document.getElementById("name").value;
    let usn = document.getElementById("usn").value;

    try {
        await window.addDoc(
            window.collection(window.db, "quizResults"),
            {
                name: name,
                usn: usn,
                score: score,
                total: questions.length,
                timestamp: new Date()
            }
        );

        console.log("Result saved successfully!");

    } catch (error) {
        console.error("Error saving result: ", error);
    }

    document.getElementById("quizForm").innerHTML =
`
<div style="text-align:center; padding:20px;">
    <img src="assets/trophy.png" width="120" style="margin-bottom:20px;">
    <h2>🎉 Congratulations ${name}! 🎉</h2>
    <h3>Your Final Score: ${score} / ${questions.length}</h3>
    <p style="font-weight:bold; color:green; font-size:18px;">
        🔥 Final Streak: ${streak}
    </p>
    <p>Thank you for participating in the IEEE Sensors Technical Quiz.</p>
</div>
`;
}