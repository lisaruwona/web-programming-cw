//const timerPage = document.querySelector('.timer-section');
//timerPage.addEventListener('click', async function(){
   //window.location.href = 'timer.html';
//})

const display = document.getElementById("display");
const startButton = document.getElementById("start-btn");
const stopButton = document.getElementById("stop-btn");
const resetButton = document.getElementById("reset-btn");

const lapButton = document.getElementById("lap-btn");
const lapData = document.getElementById("lap-data");
lapButton.disabled = true;

const submitButton = document.getElementById("submit-btn");
submitButton.setAttribute("style", "display:none");

let timer = null;
let startTime = 0;
let elapsedTime = 0; 
let isRunning = false;
let count = 0;
let lapNow = null;


function prepareStartListener() {
    startButton.addEventListener("click", () => {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            timer = setInterval(update, 10);
            isRunning = true;
        }
        startButton.setAttribute("style", "display:none");
        stopButton.setAttribute("style", "display:block");
        lapButton.setAttribute("style", "display:block");
        lapButton.disabled = false;
        resetButton.setAttribute("style", "display:none");
        submitButton.setAttribute("style", "display:none");
    });
}

function prepareStopListener() {
    stopButton.addEventListener("click", () => {
        if (isRunning) {
            clearInterval(timer);
            elapsedTime = Date.now() - startTime;
            isRunning = false;
        }
        lapButton.setAttribute("style", "display:none");
        resetButton.setAttribute("style", "display : block");
        stopButton.setAttribute("style", "display:none");
        startButton.setAttribute("style", "display:block");
        submitButton.setAttribute("style", "display:block");
    });
}

function prepareResetListener() {
    resetButton.addEventListener("click", () => {
        display.textContent = `00:00:00.00`;
        elapsedTime = 0;
        count = 0;
        clearInterval(timer);
        for (let i = lapData.children.length - 1; i >= 0; i--){
            lapData.removeChild(lapData.children[i]);
            }
        resetButton.setAttribute("style", "display:none");
        startButton.setAttribute("style", "dislpay: block");
        lapButton.setAttribute("style", "display : block");
        lapButton.disabled = true;
        submitButton.setAttribute("style", "display:none");
    });
}

function update() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    let seconds = Math.floor(elapsedTime / 1000 % 60);
    let count = Math.floor(elapsedTime % 1000 / 10);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    count = String(count).padStart(2, "0");

    display.textContent = `${hours}:${minutes}:${seconds}.${count}`;

}

function formatTime(ms) {
    let hours = Math.floor(ms / (1000 * 60 * 60));
    let minutes = Math.floor(ms / (1000 * 60) % 60);
    let seconds = Math.floor(ms / 1000 % 60);
    let count = Math.floor(ms % 1000 / 10);
    
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(count).padStart(2, "0")}`;
}

function prepareLapListener() {
    lapButton.addEventListener("click", () => {
        count++;
        const newLapElement = document.createElement("li");
        newLapElement.className = "lap-li";
        newLapElement.innerHTML = `<span class="lap-position">${count}</span> <span class = "lap-time">${formatTime(elapsedTime)}</span>`;
        lapData.appendChild(newLapElement);
    })
}

prepareStartListener();
prepareStopListener();
prepareLapListener();
prepareResetListener();