const express = require('express')
const app = express()
const {Todo } = require("./models")
const bodyParser =  require('body-parser')
app.use(bodyParser.json());


app.get("/todos",async (request,response)=>{
    // response.send("hello world")
    console.log("Processing List of all todos")
    try {
        const todo= await Todo.getTodosList();
        return response.json(todo);
    } catch (error) {
        console.log(error)
        return response.status(422).json(error)
    }
})

app.post("/todos",async (request,response)=>{
    console.log("Creating a todo",request.body)
    try {
	const todo = await Todo.addTodo({
        title:request.body.title,
        dueDate:request.body.dueDate,
        completed:false
    });
    // console.log(request.body.title);
	    return response.json(todo)
} catch (error) {
	console.log(error)
    return response.status(422).json(error)
}
})

app.put("/todos/:id/markAsCompleted",async (request,response)=>{
    console.log("We have to update a todo with id:",request.params.id)
    const todo =  await Todo.findByPk(request.params.id)
    try {
	const updatedTodo=await todo.markAsCompleted()
	    return response.json(updatedTodo)
} catch (error) {
	console.log(error)
    return response.status(422).json(error)
}
})

app.delete("/todos/:id",async (request,response)=>{
    console.log("Delete a todo by id:",request.params.id)
    try {
        const todo = await Todo.findByPk(request.params.id);
        if (todo) {
          await todo.delete();
          return response.json(true);
        } else {
          return response.json(false);
        }
      } catch (error) {
        console.log(error);
        return response.status(422).json(false);
      }
})
module.exports = app;