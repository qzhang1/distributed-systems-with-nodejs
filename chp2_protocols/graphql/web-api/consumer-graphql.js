const server = require("fastify")();
const axios = require("axios");
const PORT = 3000;
const producerAddr = "127.0.0.1:4000";
const recipeQuery = `query kitchenSink ($id:ID) {
    recipe(id: $id) {
        id name
        ingredients {
            name 
            quantity
        }
    }
    pid
}`;

server.get("/", async () => {
  const res = await axios.post(
    `http://${producerAddr}/graphql`,
    { query: recipeQuery, variables: { id: "42" } },
    { headers: { "Content-Type": "application/json" } }
  );
  return {
    consumer_pid: process.pid,
    producer_data: res.data,
  };
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Consumer running on http://127.0.0.1:${PORT}/`);
});
