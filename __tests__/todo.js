const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });
  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy Milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(302);
    // expect( response. header ["content-type"] ).toBe(
    // "application/json; charset=utf-8");
    // const parsedResponse = JSON. parse(response. text);
    // // console.log(parsedResponse);
    // expect (parsedResponse. id).toBeDefined();
  });
  // test("Marks a todo with the given ID as complete",async()=>{
  //     const response = await agent.post('/todos').send({
  //         title:"Buy milk",
  //         dueDate :new Date().toISOString,
  //         completed:false
  //     });
  //     const parsedResponse = JSON.parse(response.text);
  //     // console.log(parsedResponse);
  //     const todoID = parsedResponse.id;
  //     expect(parsedResponse.completed).toBe(false);
  //     const markAsCompleted = await agent.put(`/todos/${todoID}/markAsCompleted`).send();
  //     const parseUpdateResponse = JSON.parse(markAsCompleted.text);
  //     expect(parseUpdateResponse.completed).toBe(true);
  // });
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
});
