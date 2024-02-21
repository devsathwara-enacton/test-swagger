import { FastifyInstance } from "fastify";
import { postbackController } from "../../controllers";
import { postbackSchema } from "../../schema/postSchema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: postbackSchema,
    handler: postbackController.validate,
  });
}
