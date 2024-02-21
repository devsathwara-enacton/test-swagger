import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { postbackSchema } from "../../schema/postSchema";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { example } from "./example.controller";
const LOGIN_SCHEMA = z.object({
  username: z.string().max(32).describe("Some description for username"),
  password: z.string().max(32),
});

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    handler: example,
  });
}
