const display = document.getElementById('display');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const resetButton = document.getElementById('reset-btn');

const lapButton = document.getElementById('lap-btn');
const lapData = document.getElementById('lap-data');
lapButton.disabled = true;

const submitButton = document.getElementById('submit-btn');
submitButton.setAttribute('style', 'display:none');

// const uploadBtn = document.getElementById('upload-results');
// const cancelBtn = document.getElementById('cancel-btn');
// const uploadChecker = document.getElementById('upload-inner');

const runnerData = document.getElementById('runner-data');
const submitForm = document.getElementById('submit-form');

let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let count = 0;
const laps = [];
let runnerCount = 0;

const views = {
  timer: document.getElementById('timer-view'),
  registration: document.getElementById('registration-view'),
  settings: document.getElementById('settings-view'),
};

function prepareStartListener() {
  startButton.addEventListener('click', () => {
    if (!isRunning) {
      startTime = Date.now() - elapsedTime;
      timer = setInterval(update, 10);
      isRunning = true;
    }
    startButton.setAttribute('style', 'display:none');
    stopButton.setAttribute('style', 'display:block');
    lapButton.setAttribute('style', 'display:block');
    lapButton.disabled = false;
    resetButton.setAttribute('style', 'display:none');
    submitButton.setAttribute('style', 'display:none');
  });
}

function prepareStopListener() {
  stopButton.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(timer);
      elapsedTime = Date.now() - startTime;
      isRunning = false;
    }
    lapButton.setAttribute('style', 'display:none');
    resetButton.setAttribute('style', 'display:block');
    stopButton.setAttribute('style', 'display:none');
    startButton.setAttribute('style', 'display:block');
    submitButton.setAttribute('style', 'display:block');
  });
}

function prepareResetListener() {
  resetButton.addEventListener('click', () => {
    display.textContent = '00:00:00.00';
    elapsedTime = 0;
    count = 0;
    clearInterval(timer);
    for (let i = lapData.children.length - 1; i >= 0; i--) {
      lapData.removeChild(lapData.children[i]);
    }
    laps.length = 0;
    resetButton.setAttribute('style', 'display:none');
    startButton.setAttribute('style', 'display:block');
    lapButton.setAttribute('style', 'display:block');
    lapButton.disabled = true;
    submitButton.setAttribute('style', 'display:none');
  });
}

function update() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;

  let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
  let seconds = Math.floor(elapsedTime / 1000 % 60);
  let count = Math.floor(elapsedTime % 1000 / 10);

  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');
  count = String(count).padStart(2, '0');

  display.textContent = `${hours}:${minutes}:${seconds}.${count}`;
}

function formatTime(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor(ms / (1000 * 60) % 60);
  const seconds = Math.floor(ms / 1000 % 60);
  const count = Math.floor(ms % 1000 / 10);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(count).padStart(2, '0')}`;
}

function prepareLapListener() {
  lapButton.addEventListener('click', () => {
    count++;
    const newLapElement = document.createElement('li');
    newLapElement.className = 'lap-li';
    newLapElement.innerHTML = `<span class = "lap-position">${count}</span> <span class = "lap-time">${formatTime(elapsedTime)}</span>`;
    lapData.appendChild(newLapElement);
    const lap = { position: count, time: formatTime(elapsedTime) };
    laps.push(lap);
  });
}

function showView(viewName) {
  for (const view of Object.values(views)) {
    view.style.display = 'none';
  }
  views[viewName].style.display = 'block';
}

document.getElementById('timer-btn').addEventListener('click', () => showView('timer'));
document.getElementById('runner-btn').addEventListener('click', () => showView('registration'));
document.getElementById('settings-btn').addEventListener('click', () => showView('settings'));

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMONPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

let positionCounter = 0;
function nextPosition() {
  return ++positionCounter;
}

function addNewRunner() {
  submitForm.addEventListener('click', (event) => {
    event.preventDefault();
    runnerCount++;
    const newRunner = document.createElement('li');
    newRunner.className = 'runner-li';
    newRunner.innerHTML = `<span class = 'runnerID'> ${generateRandomString(5)} </span> <span class = 'runner-id'> ${nextPosition()} </span>`;
    runnerData.appendChild(newRunner);
  });
}

// uploadBtn.addEventListener('submit', () => {
//   uploadChecker.classList.add('open');
// });

// cancelBtn.addEventListener('click', () => {
//   uploadChecker.classList.remove('open');
// });


submitButton.addEventListener('click', async function (event) {
  event.preventDefault();
  // const lapPosition = document.getElementById('lap-position');
  // const lapTime = document.getElementById('lap-time');


  try {
    const response = await fetch('http://localhost:3000/results', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(laps),
    });

    const result = await response.json();
    if (response.status === 201) {
      alert(result.message);
    }
  } catch (error) {
    alert('An error occured: ' + error.message);
  }
});


prepareStartListener();
prepareStopListener();
prepareLapListener();
prepareResetListener();
addNewRunner();
