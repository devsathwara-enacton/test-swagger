import { FastifyInstance } from "fastify";
import { providersController } from "../../controllers";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    handler: providersController.fetch,
  });
}
