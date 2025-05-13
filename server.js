const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

const cors = require('cors');
app.use(cors());

const raceResults = [];

app.get('/results', (req, res) => {
  res.json(raceResults);
});

app.post('/results', (req, res) => {
  const clientResults = req.body;
  raceResults.push(clientResults);

  console.log('Race results:');
  console.table(clientResults);

  res.status(201).json({ message: 'Race results have been submitted successfully!' });
});

app.get('/results/csv', (req, res) => {
  if (raceResults.length === 0) {
    return res.status(400).json({ message: 'No results to export' });
  }
  const header = 'bibNumber, position, finishTime\n';
  const rows = raceResults.map(r =>
    `${r.bibNumber}, ${r.position}, ${r.finishTime}`,
  ).join('\n');
  const csv = header + rows;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="results.csv"');
  res.send(csv);
});


app.listen(port, () => console.log(`app listening on port ${port}`));
