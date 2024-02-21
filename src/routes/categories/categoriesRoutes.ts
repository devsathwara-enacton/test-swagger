import { FastifyInstance } from "fastify";
import { categoriesController } from "../../controllers";
import { fetchCategoryResponseSchema } from "../../schema/categoriesSchema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: fetchCategoryResponseSchema,
    handler: categoriesController.fetch,
  });
}
