
"use strict";

// Select HTML elements
const clockElement = document.getElementById("clock");
const dateElement = document.getElementById("date");
const timezoneElement = document.getElementById("timezone");
const stopwatchElement = document.getElementById("stopwatch");
const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");
const resetButton = document.getElementById("reset-btn");
const statusElement = document.getElementById("stopwatch-status");
const yearElement = document.getElementById("year");

// -----------------------------
// DIGITAL CLOCK
// -----------------------------

function updateClock() {
    const now = new Date();

    clockElement.textContent = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    dateElement.textContent = now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    timezoneElement.textContent =
        `Local time · ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
}

// Display immediately, then update every second.
updateClock();
setInterval(updateClock, 1000);

yearElement.textContent = new Date().getFullYear();

// -----------------------------
// STOPWATCH
// -----------------------------

let startTime = 0;
let elapsedTime = 0;
let animationId = null;
let isRunning = false;

function formatStopwatch(milliseconds) {
    const totalCentiseconds = Math.floor(milliseconds / 10);

    const centiseconds = totalCentiseconds % 100;
    const totalSeconds = Math.floor(totalCentiseconds / 100);

    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);

    return [
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0")
    ].join(":") + "." + String(centiseconds).padStart(2, "0");
}

function renderStopwatch() {
    const currentElapsed = isRunning
        ? elapsedTime + (performance.now() - startTime)
        : elapsedTime;

    stopwatchElement.textContent = formatStopwatch(currentElapsed);

    if (isRunning) {
        animationId = requestAnimationFrame(renderStopwatch);
    }
}

function startStopwatch() {
    if (isRunning) return;

    isRunning = true;
    startTime = performance.now();

    startButton.disabled = true;
    pauseButton.disabled = false;
    statusElement.textContent = "Stopwatch is running.";

    renderStopwatch();
}

function pauseStopwatch() {
    if (!isRunning) return;

    elapsedTime += performance.now() - startTime;
    isRunning = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    stopwatchElement.textContent = formatStopwatch(elapsedTime);

    startButton.disabled = false;
    pauseButton.disabled = true;
    statusElement.textContent = "Stopwatch paused.";
}

function resetStopwatch() {
    isRunning = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    startTime = 0;
    elapsedTime = 0;

    stopwatchElement.textContent = formatStopwatch(0);

    startButton.disabled = false;
    pauseButton.disabled = true;
    statusElement.textContent = "Stopwatch reset. Ready to start.";
}

// Button event listeners
startButton.addEventListener("click", startStopwatch);
pauseButton.addEventListener("click", pauseStopwatch);
resetButton.addEventListener("click", resetStopwatch);
