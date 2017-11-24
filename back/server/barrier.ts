import * as express from "express";
import secret from "./handlers/shared/secret";
import * as jwt from "jsonwebtoken";
import { jwtResponse } from "./handlers/shared/jwt";

const barrier = (kind: string) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.get("authorization");

  if (!token) {
    let err: any = new Error("Autenticação inválida");
    err.status = 401;
    next(err);
    return;
  }
  let decoded;
  try {
    decoded = jwt.verify(token, secret) as jwtResponse;
  } catch (err) {
    throw Error("jwtexpired");
  }

  if (decoded.role === kind) {
    res.locals.role = kind;
    res.locals.email = decoded.email;
    next();
  } else {
    let err: any = new Error("Autenticação inválida");
    err.status = 401;
    next(err);
  }
};

export default barrier;
