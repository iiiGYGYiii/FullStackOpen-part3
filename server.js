// MODULES
let {persons} = require('./data.js');
const { updateArrayByField,
    validateRequest,
    getNextId,
    elementExists,
    invalidInput,
    deleteElementByField } = require('./logic');
const express = require('express');
const app = express();
const morgan = require('morgan');
morgan.token('body', (req, res) => JSON.stringify(req.body));

//MIDDLEWARES
app.use(express.json());
app.use(morgan( ':method :url :status :res[content-length] - :response-time ms :body' ));

// ROUTING
app.route("/")
.get((req,res)=>{
    res.send("<h1> Hello World!</h1>");
});

app.route("/api/persons")
.get((req,res)=>{
    res.json(persons);
})
.post((req,res)=>{
    const isInvalidRequest = validateRequest({
        array: persons,
        field: 'name',
        request: req.body,
        size: 2
    });
    if (isInvalidRequest){
        res.status(400).json(isInvalidRequest).end();
        return;
    }
    const newPerson = {
        ...req.body,
        id: getNextId(persons)
    };
    persons = [...persons, newPerson];
    res.json(newPerson);
});

app.get("/info", (req,res)=>{
    const date = new Date().toISOString();
    res.send(`<p>Phonebook has info for ${persons.length} people </p><p>${date}</p>`);
});

app.route("/api/persons/:id")
.get((req,res)=>{
    const person = elementExists(persons, 'id', req.params);
    person ? res.json(person) : res.status(404).end();
})
.put((req,res)=>{
    const person = elementExists(persons, 'id', req.params);
    if(!person){
        res.status(404).end();
        return;
    }
    if(invalidInput(req.body)){
        res.status(400).end();
        return;
    }
    const putUser = {
        ...req.body,
        id: Number(req.params.id)
    }
    persons = updateArrayByField(persons, putUser, 'id');
    res.json(putUser);
})
.patch((req,res)=>{
    let person = elementExists(persons, 'id', req.params);
    if (!person){
        res.status(404).end();
        return;
    }
    if (invalidInput(req.body, 1)){
        res.status(400).end();
        return;
    }
    person = {
        ...person,
        ...req.body
    };
    persons = updateArrayByField(persons, person, 'id');
    res.json(person);

})
.delete((req,res)=>{
    persons = deleteElementByField(persons, req.params, 'id');
    res.status(204).end();
});

const PORT = process.env.PORT ? process.env.PORT : 3001;
app.listen(PORT, () =>{console.log(`Running server on ${PORT}`);});
