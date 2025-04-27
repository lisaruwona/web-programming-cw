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
  for (const result of raceResults) {
    console.table(result);
  }

  res.status(201).json({ message: 'Race results have been submitted successfully!' });
});


app.listen(port, () => console.log(`app listening on port ${port}`));
