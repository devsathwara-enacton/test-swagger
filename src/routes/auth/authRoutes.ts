import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  FastifyTypeProviderDefault,
} from "fastify";
import fastifyPassport from "@fastify/passport";
import { authController } from "../../controllers";

import { isAuthenticated } from "../../middleware/authMiddleware";
import { loginSchema, registerUserSchema } from "../../schema/authSchema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  // app.withTypeProvider<FastifyTypeProviderDefault>().route({
  //   method: "GET",
  //   url: "/google",
  //   preValidation: fastifyPassport.authenticate("google", {
  //     scope: ["profile", "email"],
  //   }),
  //   schema: { tags: ["Authentication"] },
  //   handler: async () => {
  //     console.log("GOOGLE API forward");
  //   },
  // });

  // app.get(
  //   "/facebook",
  //   {
  //     preValidation: fastifyPassport.authenticate("facebook", {
  //       scope: ["profile", "email"],
  //     }),
  //     schema: { tags: ["Authentication"] },
  //   },
  //   async () => {
  //     console.log("facebook API forward");
  //   }
  // );

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/register",
    handler: authController.register,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/login",
    handler: authController.login,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/logout",
    handler: (req: FastifyRequest, reply: FastifyReply) => {
      reply.clearCookie("accessToken");
      req.session.delete();
      req.logout();
      return reply.send({
        message: "Logout Successful",
      });
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/verify-email/",
    schema: {
      querystring: {
        token: { type: "string" },
      },
    },
    handler: authController.verifyEmail,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/forgot-password",
    schema: {
      body: {
        email: {
          type: "string",
          format: "email",
        },
      },
    },
    handler: authController.forgotPassword,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/reset-password/",
    schema: {
      body: {
        password: {
          type: "string",
          minLength: 6,
          // Regular expression pattern for at least 1 uppercase letter, 1 lowercase letter, and 1 digit
          pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$",
        },
      },
    },
    handler: authController.resetPassword,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/change-password",
    preHandler: isAuthenticated,
    schema: {
      body: {
        // currentpassword: {
        //   type: "string",
        //   minLength: 6,
        //   // Regular expression pattern for at least 1 uppercase letter, 1 lowercase letter, and 1 digit
        //   pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$",
        // },
        password: {
          type: "string",
          minLength: 6,
          // Regular expression pattern for at least 1 uppercase letter, 1 lowercase letter, and 1 digit
          pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$",
        },
      },
    },
    handler: authController.changePassword,
  });
}
