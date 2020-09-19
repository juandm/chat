const express = require('express');

const PORT = 8000;
const app = express();

app.get('/', (req, res) => res.send({ message: 'Server OK.' }));

app.listen(PORT, () => console.log(`Server is running at port: ${PORT}`));

module.exports = app;
