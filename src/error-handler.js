import { ZodError } from "zod";

export const errorHandler = (error, request, response) => {
  /* Catch Zod error */
  if (error instanceof ZodError) {
    return response.status(400).send({
      message: "Data Parse Error",
      errors: error.flatten().fieldErrors,
    });
  }

  /* Catch Rate-limit error */
  if (error.statusCode === 429)
    return response
      .status(429)
      .send({ message: "Rate Limit Exceeded, try again later" });

  /* Log error */
  response.log.error({
    code: error.code,
    statusCode: error.statusCode,
    message: error.message,
  });

  return response.status(500).send({ message: "Internal Server Error" });
};
