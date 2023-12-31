#!/usr/bin/env node

const util = require("util");
const grpc = require("@grpc/grpc-js");
const server = require("fastify")();
const loader = require("@grpc/proto-loader");
const pkg_def = loader.loadSync(__dirname + "/../shared/grpc-recipe.proto");
const recipe = grpc.loadPackageDefinition(pkg_def).recipe;
const TARGET = "127.0.0.1:4000";

const grpcClient = new recipe.RecipeService(
  TARGET,
  grpc.credentials.createInsecure()
);

const getMetadata = util.promisify(grpcClient.getMetaData.bind(grpcClient));
const getRecipe = util.promisify(grpcClient.getRecipe.bind(grpcClient));

server.get("/", async () => {
  const [meta, recipe] = await Promise.all([
    getMetadata({}),
    getRecipe({ id: 42 }),
  ]);
  return {
    consumer_pid: process.pid,
    producer_data: meta,
    recipe,
  };
});

server.listen(3000, "127.0.0.1", () => {
  console.log("consumer running at http://localhost:3000");
});
