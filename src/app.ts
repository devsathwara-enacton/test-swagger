import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { join } from "path";
import autoload from "@fastify/autoload";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  createJsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/secure-session";
import fastifyPassport from "@fastify/passport";
import "./utils/passport";
import cors from "@fastify/cors";
import { config } from "./config/config";
import axios from "axios";
import { createJWTToken, decodeToken, validateJWTToken } from "./utils/jwt";

interface CustomFastifyInstance extends FastifyInstance {
  db: Kysely<DB>;
}

const createApp = (): CustomFastifyInstance => {
  const app = fastify({ logger: true }) as unknown as CustomFastifyInstance;
  const sessionSecret = config.env.app.sessionSecret?.toString();
  if (!sessionSecret) {
    throw new Error("Session secret is not defined in the config");
  }
  const sessionSalt = config.env.app.sessionSalt?.toString();
  if (!sessionSalt) {
    throw new Error("Session salt is not defined in the config");
  }
  app.register(fastifySecureSession, {
    secret: sessionSecret,
    salt: sessionSalt,
    sessionName: config.env.app.sessionName,
    cookieName: config.env.app.cookieName,
    cookie: {
      path: "/",
      httpOnly: false,
      expires: new Date(Date.now() + 3600000),
      sameSite: "none",
      secure: true,
      // domain: ".enactweb.com",
    },
  });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "SampleApi",
        description: "Sample backend service",
        version: "1.0.0",
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
    // You can also create transform with custom skiplist of endpoints that should not be included in the specification:
    //
    // transform: createJsonSchemaTransform({
    //   skipList: [ '/documentation/static/*' ]
    // })
  });
  app.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
  });

  // Register autoload for routes
  app.register(autoload, {
    dir: join(__dirname, "routes"),
    options: { prefix: "/api/v1" }, // Use a prefix for all routes
  });

  return app;
};
const app: CustomFastifyInstance = createApp();
export default app;
