// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");

fastify.register(cors, {
  origin: "*",
  methods: ["GET"],
});
// Declare a route

fastify.get("/", async (request, reply) => {
  let result = {
    proxy_url: 'https://cors-proxy-fastify.vercel.app/proxy?url=your_url'
  }
  return result;
});

fastify.get("/proxy", async (request, reply) => {
  const { url } = request.query;
  // console.log(url)
  const req = await fetch(url);
  const res = await req.text();
  let split1 = url.split("index.m3u8");

  let proper = res.replaceAll(
    "https://",
    "https://cors-proxy-fastify.vercel.app/proxy?url=https://"
  );
  if (res.includes("seg")) {
    let seg_proper = res.replaceAll(
      "seg",
      `https://cors-proxy-fastify.vercel.app/proxy?url=${split1[0]}seg`
    );
    return seg_proper;
  }
  return proper;
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 8080, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
