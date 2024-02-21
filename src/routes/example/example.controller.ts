import { FastifyRequest } from "fastify";
import { FastifyReply } from "fastify";

export const example = (req: FastifyRequest, res: FastifyReply) => {
  res.send("ok");
};
