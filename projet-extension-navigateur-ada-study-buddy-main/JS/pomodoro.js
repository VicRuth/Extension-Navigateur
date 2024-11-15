const circularProgressBar = document.querySelector("#circularProgressBar");
const circularProgressBarNumber = document.querySelector(
    "#circularProgressBar .progress-value"
);
const buttonTypePomodoro = document.querySelector("#buttonTypePomodoro");
const buttonTypeShortBreak = document.querySelector("#buttonTypeShortBreak");

const btnStart = document.querySelector("#start");
const btnStop = document.querySelector("#stop");
const btnReset = document.querySelector("#reset");

// Constantes de temps
const pomodoroTimerInSeconds = 1500;
const shortBreakTimerInSeconds = 300;
const TIMER_TYPE_POMODORO = "POMODORO";
const TIMER_TYPE_SHORT_BREAK = "SHORTBREAK";
let isRunning = false;

const audio1 = new Audio("../sound/wow.mp3");
const audio2 = new Audio("../sound/okay.mp3");
const audio3 = new Audio("../sound/sncf.mp3");

// Variables de timer
let progressInterval;
let pomodoroType = localStorage.getItem("pomodoroType") || TIMER_TYPE_POMODORO;
let timerValue =
    parseInt(localStorage.getItem("timerTime")) || pomodoroTimerInSeconds;
let multiplierFactor = 360 / timerValue;

// Fonction de formatage du temps
function formatNumberInStringMinute(number) {
    const minutes = Math.trunc(number / 60)
        .toString()
        .padStart(2, "0");
    const seconds = Math.trunc(number % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${seconds}`;
}

// Démarrer le timer
const startTimer = () => {
    if (isRunning) return;
    audio1.play();
    progressInterval = setInterval(() => {
        timerValue--;
        localStorage.setItem("timerTime", timerValue); // Sauvegarder le temps restant
        setInfoCircularProgressBar();
    }, 1000);
    isRunning = true;
};

// Arrêter le timer
const stopTimer = () => {
    audio2.play();
    clearInterval(progressInterval);
    isRunning = false;
};

// Réinitialiser le timer
const resetTimer = () => {
    clearInterval(progressInterval);
    timerValue =
        pomodoroType === TIMER_TYPE_POMODORO
            ? pomodoroTimerInSeconds
            : shortBreakTimerInSeconds;
    localStorage.setItem("timerTime", timerValue); // Sauvegarder le temps initial
    multiplierFactor = 360 / timerValue;
    setInfoCircularProgressBar();
    isRunning = false;
};

// Mettre à jour l'affichage du timer
function setInfoCircularProgressBar() {
    if (timerValue === 0) {
        stopTimer();
        //audio.play();
    }
    circularProgressBarNumber.textContent = `${formatNumberInStringMinute(
        timerValue
    )}`;
}

// Définir le type de timer (Pomodoro ou Break)
const setPomodoroType = (type) => {
    pomodoroType = type;
    localStorage.setItem("pomodoroType", pomodoroType); // Sauvegarder le type de timer

    if (type === TIMER_TYPE_POMODORO) {
        buttonTypeShortBreak.classList.remove("active");
        buttonTypePomodoro.classList.add("active");
        timerValue = pomodoroTimerInSeconds;
    } else {
        buttonTypePomodoro.classList.remove("active");
        buttonTypeShortBreak.classList.add("active");
        timerValue = shortBreakTimerInSeconds;
    }
    localStorage.setItem("timerTime", timerValue); // Sauvegarder le temps initial pour le type sélectionné
    resetTimer(); // Réinitialisation du timer lors du changement
};

// Vérifier si le timer doit démarrer automatiquement
const checkAutoStart = () => {
    const wasRunning = localStorage.getItem("isRunning") === "true";
    if (wasRunning) {
        startTimer(); // Redémarrer automatiquement le timer si c'était le cas
    }
};

// Événements des boutons
btnStart.addEventListener("click", () => {
    localStorage.setItem("isRunning", "true"); // Marquer que le timer est en cours
    startTimer();
});
btnStop.addEventListener("click", () => {
    localStorage.setItem("isRunning", "false"); // Marquer que le timer est arrêté
    stopTimer();
});
btnReset.addEventListener("click", resetTimer);
buttonTypePomodoro.addEventListener("click", () =>
    setPomodoroType(TIMER_TYPE_POMODORO)
);
buttonTypeShortBreak.addEventListener("click", () =>
    setPomodoroType(TIMER_TYPE_SHORT_BREAK)
);

// Initialiser l'affichage du timer à partir de localStorage
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("timerTime")) {
        timerValue = parseInt(localStorage.getItem("timerTime"));
    } else {
        timerValue = pomodoroTimerInSeconds;
        localStorage.setItem("timerTime", timerValue);
    }

    if (localStorage.getItem("pomodoroType") === TIMER_TYPE_SHORT_BREAK) {
        buttonTypeShortBreak.classList.add("active");
        buttonTypePomodoro.classList.remove("active");
    } else {
        buttonTypePomodoro.classList.add("active");
        buttonTypeShortBreak.classList.remove("active");
    }

    setInfoCircularProgressBar();
    checkAutoStart(); // Vérifier si on doit démarrer automatiquement
});
