const timerPage = document.querySelector('.timer-section');
timerPage.addEventListener('click', function(){
    window.location.href = 'timer.html';
})

const display = document.getElementById('display');
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

function go() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update, 10);
        isRunning = true;
    }
}

function update() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    let seconds = Math.floor(elapsedTime / 1000 % 60);
    let count = Math.floor(elapsedTime % 1000 / 10);

    display.textContent = `${hours}:${minutes}:${seconds}:${count}`;
}

const runnerPage = document.querySelector('.runner-id-section');
runnerPage.addEventListener('click', function(){
    window.location.href = 'registerRunner.html';
})


