const fs = require("fs");
const server = require("fastify")({
  https: {
    key: fs.readFileSync(__dirname + "/tls/basic-private-key.key"),
    cert: fs.readFileSync(__dirname + "/../shared/tls/basic-certificate.cert"),
  },
});

server.get("/recipes/:id", async (req, reply) => {
  const id = Number(req.params.id);
  if (id !== 42) {
    reply.statusCode = 404;
    return { error: "not_found" };
  }
  return {
    producer_pid: process.pid,
    recipe: {
      id,
      name: "Chicken Tikka Masala",
      steps: "Throw it in a pot...",
      ingredients: [
        { id: 1, name: "Chicken", quantity: "1 lb" },
        { id: 2, name: "Sauce", quantity: "2 cups" },
      ],
    },
  };
});

server.listen({ port: 4000, host: "127.0.0.1" }, (err, addr) => {
  console.log(`Producer running on ${addr}`);
});
