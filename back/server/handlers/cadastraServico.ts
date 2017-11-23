import * as express from "express";

interface RequestBody {
  nome: String;
  tipo: Number;
  valorDiaria: Number;
  valorHora: Number;
  valorAtividade: Number;
}

interface Response {
  id: Number;
}

const validateBody = (body: RequestBody) => {
  const { nome, tipo, valorAtividade, valorDiaria, valorHora } = body;

  if (typeof nome !== "string" || nome.length < 3 || nome.length > 100)
    throw Error("Nome inválido");

  if (typeof tipo !== "number") throw Error("Tipo de atividade inválido");

  if (tipo === 0) {
    //hora
    if (typeof valorHora !== "number") throw Error("Valor do servico invalido");
  } else if (tipo === 1) {
    //diaria
    if (typeof valorDiaria !== "number")
      throw Error("Valor do servico invalido");
  } else if (tipo === 2) {
    //atividade
    if (typeof valorAtividade !== "number")
      throw Error("Valor do servico invalido");
  } else {
    throw Error("Tipo de atividade inválido");
  }
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
