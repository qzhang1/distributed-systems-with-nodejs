const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const pkg_def = protoLoader.loadSync(
  __dirname + "/../shared/grpc-recipe.proto"
);
const recipe = grpc.loadPackageDefinition(pkg_def).recipe;
const server = new grpc.Server();
server.addService(recipe.RecipeService.service, {
  getMetaData: (_, cb) => {
    cb(null, { pid: process.pid });
  },
  getRecipe: (call, cb) => {
    if (call.request.id !== 42) {
      return cb(new Error(`unknown recipe ${call.request.id}`));
    }
    cb(null, {
      id: 42,
      name: "Chicken Tikka Masala",
      steps: "Throw it in a pot...",
      ingredients: [
        { id: 1, name: "Chicken", quantity: "1 lb" },
        { id: 2, name: "Sauce", quantity: "2 cups" },
      ],
    });
  },
});

server.bindAsync(
  `127.0.0.1:4000`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) throw err;
    server.start();
    console.log("producer running at http://127.0.0.1:4000");
  }
);
