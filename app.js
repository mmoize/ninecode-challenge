const Joi = require('joi');
const express = require('express');

const app = express()

app.use(express.json());

const courses = [
    {id:1, name:"cours1"},
    {id:2, name:"cours2"},
    {id:3, name:"cours3"}
]


app.get('/', (req, res) => {
    res.send("hello world");
});



app.get('/api/courses', (req, res) => {
    res.send(courses)
});


// app.get('/api/courses/:id', (req, res) => {
//     res.send(req.params.id);
// });

app.get('/api/post/courses/:id', (req, res) => {
     courses.find(c => c.id === parseInt(req.params.id));
   if (!courses) res.status(404).send("the give id was not found")
   res.send(courses)
});

app.post('/api/courses', (req, res) => {
    const {error} = validateCourse(req.body);

    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course);
    res.send(course);
})


app.put('api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course){
        res.status(404).send("the give id was not found");
    }

    //const result = validateCourse(req.body);
    const {error} = validateCourse(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };


    course.name = req.body.name;
    res.send(course);
});

//PORT
//const port = process.env.PORT || 3000;
app.listen(process.env.PORT || 3000, () => console.log('listing on port 3000'));



function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    //const result = Joi.valid(req.body, schema);
    return schema.validate(course);
}