export const isAuthenticated = (request, reply, done) => {
  try {
    /* Get request header */
    const authorization = request.headers["authorization"];
    if (!authorization)
      return reply.status(401).send({ message: "Not Authorized" });

    /* Parse header secret */
    const authorizationValuesArr = authorization.split(" ");
    const requestSecret = authorizationValuesArr[1];
    if (authorizationValuesArr[0] !== "Bearer" || !requestSecret)
      return reply.status(401).send({ message: "Not Authorized" });

    const UPIXEL_FILESERVER_SECRET = process.env.UPIXEL_FILESERVER_SECRET;

    /* Compare the secret with .env */
    if (requestSecret !== UPIXEL_FILESERVER_SECRET)
      return reply.status(401).send({ message: "Not Authorized" });

    done();
  } catch (err) {
    return reply.status(401).send({ message: "Not Authorized" });
  }
};
