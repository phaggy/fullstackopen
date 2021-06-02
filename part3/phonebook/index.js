const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/persons");

app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("build"));

const errorHandler = (err, request, response, next) => {
  console.error(err.message);
  if (err.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(err);
};

morgan.token("maybe", (req, res) => {
  return JSON.stringify(req.body);
});

app.get("/api/persons", (req, resp) => {
  Person.find({}).then((persons) => {
    resp.json(persons);
  });
});

app.get("/api/info", (req, resp) => {
  Person.find({}).then((persons) => {
    resp.send(
      `phone book info has info about ${persons.length} people\n${new Date()}`
    );
  });
});

app.delete("/api/persons/:id", (req, resp) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((found) => {
      console.log(found);
      resp.sendStatus(204).end();
    })
    .catch(resp.sendStatus(204).end());
});

app.post("/api/persons", (req, resp) => {
  const newperson = new Person({
    name: req.body.name,
    number: req.body.number,
  });
  if (newperson.name && newperson.number) {
    newperson.save().then(resp.sendStatus(204).end());
  }
});
app.use(
  morgan(":method :url :status :res[content-length] :maybe - :response-time ms")
);

app.get("/api/persons/:id", (req, resp, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        resp.json(person);
      } else {
        resp.sendStatus(404).end();
      }
    })
    .catch((err) => next(err));
});
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
