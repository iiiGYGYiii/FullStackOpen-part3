// MODULES
const { createPhone,
  find,
  findById,
  sizeOfCollection,
  updatePhone,
  deleteElement
} = require("./mongodb");
const express = require("express");
const morgan = require("morgan");

morgan.token("body", (req) => JSON.stringify(req.body));

const app = express();
//MIDDLEWARES
app.use(express.json());
app.use(morgan( ":method :url :status :res[content-length] - :response-time ms :body" ));
// app.use(cors());
app.use(express.static("./build"));

// ROUTING
app.route("/api/persons")
  .get((req,res)=>{
    find().then(data=> res.json(data));
  })
  .post((req,res)=>{
    createPhone(req.body).then(data => {
      typeof data === "number"?
        res.status(data).end():
        data.error ?
          res.status(400).json(data).end():
          res.json(data);
    });
  });

app.get("/info", (req,res)=>{
  sizeOfCollection().then(response => {
    const date = new Date().toISOString();
    res.send(`<p>Phonebook has info for ${response} people </p><p>${date}</p>`);
  });
});

app.route("/api/persons/:id")
  .get((req,res)=>{
    findById(req.params.id).then(data=>{
      data ? res.json(data) : res.status(404).end();
    });
  })
  .put((req,res)=>{
    updatePhone(req.params.id, req.body).then(data=>{
      typeof data === "number"?
        res.status(data).end():
        res.json(data);
    });
  })
  .patch((req,res)=>{
    updatePhone(req.params.id,req.body, 1).then(data=>{
      typeof data === "number"?
        res.status(data).end():
        data.error ?
          res.status(400).json(data).end():
          res.json(data);
    });
  })
  .delete((req,res)=>{
    deleteElement(req.params.id).then(() =>{
      res.status(204).end();
    });
  });

app.use((req,res,next)=>{
  res.status(404).send("<p>404 not found</p>").end();
  next();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>{console.log(`Running server on ${PORT}`);});
