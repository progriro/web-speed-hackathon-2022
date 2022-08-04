import { join } from "path";

/**
 * @type {import('fastify').FastifyPluginCallback}
 */
export const spaRoute = async (fastify) => {
  fastify.register(import("@fastify/static"), {
    preCompressed: true,
    root: join(__dirname, "public"),
    wildcard: false,
  });

  fastify.get("/favicon.ico", () => {
    throw fastify.httpErrors.notFound();
  });

  fastify.get("*", (_req, reply) => {
    reply.header("CDN-Cache-Control", "max-age=60");
    reply.header("Cache-Control", "public, max-age=0");

    return reply.sendFile("index.html", join(__dirname, "public"));
  });
};
