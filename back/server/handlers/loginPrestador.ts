import * as express from "express";
import { validaEmail } from "./shared/email";
import { validaSenha } from "./shared/senha";
import { LoginResponse } from "./shared/login";

interface RequestBody {
  email: String;
  senha: String;
}

const validateBody = (body: RequestBody) => {
  const { email, senha } = body;
  validaEmail(email);
  validaSenha(senha);
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  validateBody(req.body);

  const response: LoginResponse = { sessionToken: "abc", nome: "Prestador" };

  res.json(response);
};
