const express = require('express');
const app = express();
const port = 3000;

app.use(express.json())
const path = require('path');

app.get("/*", (req, res) => {
    res.sendFile(path.resolve("frontend", "index.html"));
});


app.listen(port, () => console.log(`app listening on port ${port}`));