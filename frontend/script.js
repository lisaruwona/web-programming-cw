const raceHistory = JSON.parse(localStorage.getItem('raceHistory') || '[]');

// SPA views and Nav buttons
const views = {
  timer: document.getElementById('timer-view'),
  registration: document.getElementById('registration-view'),
  current: document.getElementById('current-results-view'),
  history: document.getElementById('results-history-view'),
};

function showView(viewName) {
  for (const view of Object.values(views)) {
    view.style.display = 'none';
  }
  views[viewName].style.display = 'block';
}

document.getElementById('timer-btn').addEventListener('click', () => showView('timer'));
document.getElementById('runner-btn').addEventListener('click', () => showView('registration'));
document.getElementById('results-history-btn').addEventListener('click', () => {
  renderRaceHistory();
  showView('history');
});

// Timer/Lap logic
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let count = 0;
let laps = [];
const display = document.getElementById('display');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const resetButton = document.getElementById('reset-btn');
const lapButton = document.getElementById('lap-btn');
const lapData = document.getElementById('lap-data');
stopButton.disabled = true;
const submitButton = document.getElementById('submit-btn');
submitButton.setAttribute('style', 'display:none');
const uploadBtn = document.getElementById('upload-results');
const cancelBtn = document.getElementById('cancel-btn');
const modal = document.getElementById('modal');
const regContinueBtn = document.getElementById('reg-continue');
const regResetBtn = document.getElementById('reg-reset');

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
    stopButton.disabled = false;
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
    display.textContent = '00:00:00';
    elapsedTime = 0;
    count = 0;
    clearInterval(timer);
    for (let i = lapData.children.length - 1; i >= 0; i--) {
      lapData.removeChild(lapData.children[i]);
    }
    laps = [];
    resetButton.setAttribute('style', 'display:none');
    startButton.setAttribute('style', 'display:block');
    stopButton.setAttribute('style', 'display:block');
    stopButton.disabled = true;
    submitButton.setAttribute('style', 'display:none');
    document.getElementById('results-container').style.display = 'none';
  });
}

function update() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;

  let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
  let seconds = Math.floor(elapsedTime / 1000 % 60);

  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  display.textContent = `${hours}:${minutes}:${seconds}`;
}

function formatTime(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor(ms / (1000 * 60) % 60);
  const seconds = Math.floor(ms / 1000 % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function prepareLapListener() {
  lapButton.addEventListener('click', () => {
    count++;
    const newLapElement = document.createElement('li');
    newLapElement.className = 'lap-li';
    newLapElement.innerHTML = `<span class="lap-position">${count}</span>
                               <select class = "lap-bib" required>
                                <option value="" disabled selected> Select bib</option>
                               </select>
                               <span class = "lap-error" style="color:red;display:none">Invalid bib</span>
                               <span class="lap-time">${formatTime(elapsedTime)}</span> 
                               <button class="flag-btn">Flag</button>
                               `;
    lapData.appendChild(newLapElement);

    // populate bib dropdown
    const bibSelect = newLapElement.querySelector('.lap-bib');
    bibSelect.innerHTML = `
    <option value="" disabled selected>Select bib</option>`;

    runners.forEach(runner => {
      const opt = document.createElement('option');
      opt.value = runner.bibNumber;
      opt.textContent = runner.bibNumber;
      bibSelect.appendChild(opt);
    });

    // handle flag toggle
    const flagBtn = newLapElement.querySelector('.flag-btn');
    flagBtn.addEventListener('click', () => {
      newLapElement.classList.toggle('flagged');
      const idx = Array.from(lapData.children).indexOf(newLapElement);
      laps[idx].flagged = !laps[idx].flagged;
      flagBtn.textContent = laps[idx].flagged ? 'Unflag' : 'Flag';
    });

    const lap = { position: count, time: formatTime(elapsedTime), flagged: false };
    laps.push(lap);
  });
}

// ---- Runner Registration ----
const runners = [];
let runnerCount = 0;
const dataList = document.getElementById('bib-list');

function updateBibList() {
  dataList.innerHTML = '';
  runners.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.bibNumber;
    dataList.appendChild(opt);
  });
}

function addNewRunner() {
  const runnerData = document.getElementById('runner-data');
  const bibNumber = document.getElementById('bib-number');
  const enterNum = document.getElementById('enter-num');
  const bibError = document.getElementById('bib-error');

  enterNum.addEventListener('click', (event) => {
    event.preventDefault();
    const bib = bibNumber.value.trim();
    if (!/^\d{3}$/.test(bib)) {
      bibError.textContent = 'Please enter exactly 3 digits. (e.g., 027)';
      return;
    } else {
      bibError.textContent = '';
    }
    if (runners.some(runner => runner.bibNumber === bib)) {
      bibError.textContent = 'Bib number already exists. Please enter a unique number.';
      return;
    } else {
      bibError.textContent = '';
    }

    runnerCount++;
    const runner = {
      bibNumber: bib,
      position: runnerCount,
    };
    runners.push(runner);

    const newRunner = document.createElement('li');
    newRunner.className = 'runner-li';
    newRunner.innerHTML = `<span class = 'runnerID'> ${bib} </span> <span class = 'runner-id'> ${runnerCount} </span>`;
    runnerData.appendChild(newRunner);

    bibNumber.value = '';

    updateBibList();
  });
}

regContinueBtn.addEventListener('click', () => {
  if (runners.length === 0) {
    alert('Please register at least one runner before continuing.');
    return;
  }
  showView('timer');
});

regResetBtn.addEventListener('click', () => {
  runners.length = 0;
  runnerCount = 0;
  document.getElementById('runner-data').innerHTML = '';
  updateBibList();
  document.getElementById('bib-number').value = '';
  document.getElementById('bib-error').textContent = '';

  clearInterval(timer);
  elapsedTime = 0;
  count = 0;
  laps.length = 0;
  lapData.innerHTML = '';
  display.textContent = '00:00:00';
});

// Fetches timer results
async function fetchResults() {
  if (!navigator.onLine) return;
  try {
    const response = await fetch('http://localhost:3000/results');
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const results = await response.json();
    const resultsData = document.getElementById('results-data');

    resultsData.innerHTML = results.map(r => `
        <li class = "results-li">
            <span class = "result-position">${r.position}</span>
             <span class = "result-time">${r.finishTime}</span>
            <span class = "result-bib">${r.bibNumber}</span>
        </li>
    `).join('');
  } catch (error) {
    console.error('Error fetching results: ' + error.message);
    alert('Unable to load results right now. Please try again later.');
  }
}

// offline mode
function enqueueResult(result) {
  const queue = JSON.parse(localStorage.getItem('outbox') || '[]');
  queue.push(result);
  localStorage.setItem('outbox', JSON.stringify(queue));
}

async function flushOutbox() {
  if (navigator.onLine) return;
  const queue = JSON.parse(localStorage.getItem('outbox') || '[]');
  if (!queue.length) return;
  for (const result of queue) {
    try {
      await fetch('http://localhost:3000/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
    } catch (err) {
      console.error('Sync failed, will retry', err);
      return;
    }
  }
  localStorage.removeItem('outbox');
}

window.addEventListener('online', flushOutbox);

// Upload Results and History
uploadBtn.addEventListener('click', async function (event) {
  event.preventDefault();

  const lapRows = Array.from(document.querySelectorAll('#lap-data .lap-li'));
  for (const li of lapRows) {
    const isFlagged = li.classList.contains('flagged');
    if (isFlagged) {
      continue;
    }

    const select = li.querySelector('.lap-bib');
    const errSpan = li.querySelector('.lap-error');
    if (!select.value) {
      errSpan.style.display = 'inline';
      return;
    } else {
      errSpan.style.display = 'none';
    }
  }

  const resultsToUpload = lapRows.map(li => ({
    bibNumber: li.querySelector('.lap-bib').value,
    position: li.querySelector('.lap-position').textContent,
    finishTime: li.querySelector('.lap-time').textContent,
  }));

  if (!navigator.onLine) {
    resultsToUpload.forEach(enqueueResult);
    alert('You are Offline - results have been stored and will auto - sync when you are back online.');
    showView('current');
    await fetchResults();
    return;
  }

  try {
    const uploadPromises = resultsToUpload.map(async (result) => {
      const response = await fetch('http://localhost:3000/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(result),
      });
      const json = await response.json();
      return {
        status: response.status,
        message: json.message,
        bibNumber: result.bibNumber,
      };
    });

    const uploadResults = await Promise.all(uploadPromises);

    const allSuccessful = uploadResults.every(res => res.status === 201);
    if (!allSuccessful) {
      uploadResults.forEach(res => {
        if (res.status !== 201) {
          alert(`Failed to upload result for bib ${res.bibNumber}: ${res.message}`);
        }
      });
      return;
    }

    if (allSuccessful) {
      alert('All results uploaded successfully!');
      showView('current');
      await fetchResults();

      const now = new Date().toISOString();
      raceHistory.push({
        recordedAt: now,
        entries: resultsToUpload,
      });

      localStorage.setItem('raceHistory', JSON.stringify(raceHistory));

      document.getElementById('export-csv').addEventListener('click', exportToCSV);
      document.getElementById('export-csv').style.display = 'block';

      modal.classList.remove('open');
      modal.style.display = 'none';

      const allValidLaps = laps.filter(lap => !lap.flagged);
      lapData.innerHTML = allValidLaps.map((lap, index) => `
        <li class="lap-li ${lap.flagged ? 'flagged' : ''}">
          <span class="lap-position">${lap.position}</span>
          <span class="lap-time">${lap.time}</span>
          <button class="flag-btn"> ${lap.flagged ? 'Unflag' : 'Flag'}</button>
        </li>
      `).join('');

      allValidLaps.forEach((lap, lapIndex) => {
        const lapElement = lapData.children[lapIndex];
        const flagBtn = lapElement.querySelector('.flag-btn');
        flagBtn.addEventListener('click', () => {
          lap.flagged = !lap.flagged;
          lapElement.classList.toggle('flagged');
          flagBtn.textContent = lap.flagged ? 'Unflag' : 'Flag';
        });
      });
      await fetchResults();
    }
  } catch (error) {
    alert('An error occurred: ' + error.message);
  }
});

submitButton.addEventListener('click', () => {
  modal.classList.add('open');
  modal.setAttribute('style', 'display: block');
});

cancelBtn.addEventListener('click', () => {
  modal.classList.remove('open');
  modal.setAttribute('style', 'display: none');
});

function renderRaceHistory() {
  const container = document.getElementById('race-history');
  const noResults = document.getElementById('no-results-text');
  container.innerHTML = '';
  if (raceHistory.length === 0) {
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';
  raceHistory.forEach(rec => {
    const card = document.createElement('div');
    card.className = 'race-card';
    const when = new Date(rec.recordedAt).toLocaleString();
    card.innerHTML = `<header>${when}</header> <ul>${rec.entries.map(e =>
      `<li><span>${e.position}</span><span>${e.bibNumber}</span><span>${e.finishTime}</span></li>`,
    ).join('')}</ul>`;
    container.append(card);
  });
}


// CSV Export
async function exportToCSV() {
  try {
    const response = await fetch('http://localhost:3000/results/csv');
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'results.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      const error = await response.text();
      alert('Failed to export CSV: ' + error);
    }
  } catch (error) {
    alert('An error occured while exporting CSV: ' + error.message);
  }
}


prepareStartListener();
prepareStopListener();
prepareLapListener();
prepareResetListener();
addNewRunner();
showView('registration');
