#!/usr/bin/env node
"use strict";

const server = require("fastify")();
const mercurius = require("mercurius");
const fs = require("fs");
const schema = fs.readFileSync(__dirname + "/../shared/recipe.gql").toString();
const PORT = 4000;

const resolvers = {
  Query: {
    pid: () => process.pid,
    recipe: async (_obj, { id }) => {
      if (id != 42) throw new Error(`recipe ${id} not found`);
      return {
        id,
        name: "Chicken Tikka Masala",
        steps: "Throw it in a pot...",
      };
    },
  },
  Recipe: {
    ingredients: async (obj) => {
      return obj.id != 42
        ? []
        : [
            { id: 1, name: "Chicken", quantity: "1 lb" },
            { id: 2, name: "Sauce", quantity: "2 cups" },
          ];
    },
  },
};

server
  .register(mercurius, {
    schema,
    resolvers,
  })
  .listen(PORT, "127.0.0.1", () => {
    console.log(`Producer running on http://127.0.0.1:${PORT}/graphql`);
  });
