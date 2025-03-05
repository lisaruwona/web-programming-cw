//const timerPage = document.querySelector('.timer-section');
//timerPage.addEventListener('click', async function(){
   //window.location.href = 'timer.html';
//})

const display = document.getElementById("display");
const startButton = document.getElementById("start-btn");
const stopButton = document.getElementById("stop-btn");

const lapButton = document.getElementById("lap-btn");
lapButton.disabled = true;

let timer = null;
let startTime = 0;
let elapsedTime = 0; 
let isRunning = false;
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
        lapButton.disabled = false;
    });
}

function prepareStopListener() {
    stopButton.addEventListener("click", () => {
        if (isRunning) {
            clearInterval(timer);
            elapsedTime = Date.now() - startTime;
            isRunning = false;
        }
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
    let count = 0;
    const lapData = document.getElementById("lap-data");
    lapButton.addEventListener("click", () => {
        count++;
        const newLapElement = document.createElement("li");
        newLapElement.innerHTML = `${count}   ${formatTime(elapsedTime)}`;
        lapData.appendChild(newLapElement);
    })
}

prepareStartListener();
prepareStopListener();
prepareLapListener();
