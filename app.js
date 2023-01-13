const express = require("express");
const app = express();
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser"); 
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long",["POST","PUT","DELETE"]));

app.get("/", async (request, response) => {
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  const completedTodos = await Todo.completed();
  if (request.accepts("html")) {
    response.render("index",{
      title:"Todo Application",
      overdue,
      dueToday,
      dueLater,
      completedTodos,
      csrfToken:request.csrfToken(),
      })
}else{
  response.json({
    overdue,
    dueToday,
    dueLater,
    completedTodos
  })
}
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/todos", async (request, response) => {
  // response.send("hello world")
  console.log("Processing List of all todos");
  try {
    const todo = await Todo.getTodosList();
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.post("/todos", async (request, response) => {
  console.log("Creating a todo", request.body);
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    // console.log(request.body.title);
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async  (request, response)=> {
    const todo = await Todo.findByPk(request.params.id);
    const completed = request.body.completed;
    try {
      const updatedTodo = await todo.setCompletionStatus(
        completed === true,
      );
      return response.json(updatedTodo);
    } catch (error) {
      return response.status(404).json(error);
    }
  }
);

app.delete("/todos/:id", async (request, response) => {
  console.log("Delete a todo by id:", request.params.id);
  try {
    await Todo.remove(request.params.id);
    return response.json({success:true});
  } catch (error) {
    console.log(error);
    return response.status(422).json(false);
  }
});
module.exports = app;
