const express = require('express');
const routes = require('./routes/routes');
const path = require('path');
const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});