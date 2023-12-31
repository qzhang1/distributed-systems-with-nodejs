#!/usr/bin/env node

const server = require("fastify")();
const axios = require("axios");
const https = require("https");
const fs = require("fs");
const options = {
  agent: new https.Agent({
    ca: fs.readFileSync(__dirname + "/../shared/tls/basic-certificate.cert"),
    rejectUnauthorized: false,
  }),
};
server.get("/", async () => {
  const req = await axios.get("https://127.0.0.1:4000/recipes/42", {
    httpsAgent: options.agent,
  });
  return {
    consumer_pid: process.pid,
    producer_data: req.data,
  };
});

server.listen(
  {
    host: "127.0.0.1",
    port: 3000,
  },
  (err, addr) => {
    console.log(`Consumer running on ${addr}`);
  }
);
