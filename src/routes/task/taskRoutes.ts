import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { taskController } from "../../controllers";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { fetchTaskResponseSchema } from "../../schema/taskSchemas";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: fetchTaskResponseSchema,
    preHandler: isAuthenticated,
    handler: taskController.fetch,
  });
}
