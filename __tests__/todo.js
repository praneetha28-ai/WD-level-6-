const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
var cheerio = require("cheerio");
let server, agent;
function extractCsrfToken(res) {
  var $=cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });
  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy Milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf":csrfToken
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo with the given ID as complete",async()=>{
    var res = await agent.get("/");
    var csrfToken = extractCsrfToken(res);
      const response = await agent.post('/todos').send({
          title:"Buy milk",
          dueDate :new Date().toISOString,
          completed:false,
          "_csrf":csrfToken
      });
      const groupedTodosResponse = await agent.get("/").set("Accept","application/json");
      const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
      const dueTodayCount = parsedGroupedResponse.dueToday.length;
      const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount-1];

      res = await agent.get("/");
      csrfToken = extractCsrfToken(res);

      const markCompleteResponse = await agent.put(`/todos/${latestTodo.id}`).send({
        _csrf:csrfToken,
        completed:true
      });
      const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
      expect(parsedUpdateResponse.completed).toBe(true);
  });
  test("Delete a todo", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      _csrf: csrfToken,
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);

    expect(parsedGroupedResponse.dueToday).toBeDefined();

    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const deletedResponse = await agent.delete(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    });
    expect(deletedResponse.statusCode).toBe(200);
  });
});
  // test("Fetches all todos in the database using /todos endpoint",async()=>{
  //     await agent.post('/todos').send({
  //         title:"Buy xbox",
  //         dueDate :new Date().toISOString,
  //         completed:false
  //     });
  //     await agent.post('/todos').send({
  //         title:"Buy ps3",
  //         dueDate :new Date().toISOString,
  //         completed:false
  //     });
  //     const response =  await agent.get('/todos');
  //     const parsedResponse = JSON.parse(response.text);
  //     expect(parsedResponse.length).toBe(4);
  // });
  // test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
  //     const response = await agent.post("/todos").send({
  //       title: "Buy tesla",
  //       dueDate: new Date().toISOString(),
  //       completed: false,
  //     });
  //     const parsedResponse = JSON.parse(response.text);
  //     const todoID = parsedResponse.id;

  //     const deleteTodoResponse = await agent.delete(`/todos/${todoID}`).send();
  //     const parsedDeleteResponse = JSON.parse(deleteTodoResponse.text);
  //     expect(parsedDeleteResponse).toBe(true);

  //     const deleteNonExistentTodoResponse = await agent
  //       .delete(`/todos/9999`)
  //       .send();
  //     const parsedDeleteNonExistentTodoResponse = JSON.parse(
  //       deleteNonExistentTodoResponse.text
  //     );
  //     expect(parsedDeleteNonExistentTodoResponse).toBe(false);
  //   });

