const express = require("express");
const fs = require("fs");
const uuid = require("uuid");

module.exports = (app) => {
  app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, jsonString) => {
      if (err) {
        // console.log("File read failed:", err);
        return;
      }
      console.log("File data:", JSON.parse(jsonString));
      res.json(JSON.parse(jsonString));
    });
  });

  app.post("/api/notes", (req, res) => {
    let incomingNote = req.body;
    console.log(JSON.stringify(incomingNote));
    incomingNote.id = uuid.v4();
    fs.readFile("./db/db.json", (err, data) => {
      if (err) throw err;
      let intermediateJson = JSON.parse(data);
      intermediateJson.push(incomingNote);
      fs.writeFile("./db/db.json", JSON.stringify(intermediateJson), (err) => {
        if (err) throw err;
      });
    });
    res.send();
  });

  app.delete("/api/notes/:id", (req, res) => {
    const incomingId = req.params.id;
    fs.readFile("./db/db.json", (err, data) => {
      let intermediateJson = JSON.parse(data);
      console.log("Deleted note", incomingId);
      if (err) throw err;
      intermediateJson.forEach((element) => {
        if (element.id === incomingId) {
          intermediateJson.splice(element, 1);
        }
      });

      fs.writeFile("./db/db.json", JSON.stringify(intermediateJson), (err) => {
        if (err) throw err;
      });
    });
    res.send();
  });
};
