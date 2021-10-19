// server/index.js

// import express library
const { application } = require("express");
const express = require("express");

// set server port
const PORT = process.env.PORT || 3080;

// create express app
const app = express();

// handle endpoint /api
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// listen to clients with the port we just set
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
