import * as express from "express";

interface RequestBody {
  nome: String;
  tipo: Number;
}

interface Response {
  id: Number;
}

const validateBody = (body: RequestBody) => {
  const { nome, tipo } = body;

  if (typeof nome !== "string" || nome.length < 3 || nome.length > 100)
    throw Error("Nome inválido");

  if (typeof tipo !== "number") throw Error("Tipo de atividade inválido");
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  validateBody(req.body);

  const response: Response = { id: 1 };

  res.json(response);
};
