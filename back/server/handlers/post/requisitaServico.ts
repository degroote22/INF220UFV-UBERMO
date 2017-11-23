import * as express from "express";

interface RequestBody {
  idServico: String;
  quantidadeHoras: Number;
  quantidadeDiarias: Number;
}

interface Response {
  idContrato: Number;
}

const validateBody = (body: RequestBody) => {
  const { idServico } = body;
  if (typeof idServico !== "string") throw Error("Serviço inválido");
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  validateBody(req.body);

  const response: Response = { idContrato: 1 };

  res.json(response);
};
