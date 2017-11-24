import * as express from "express";

interface RequestBody {
  descricao: String;
  lat: Number;
  lng: Number;
  valorDiaria: Number;
  valorHora: Number;
  valorAtividade: Number;
  tipoCobranca: Number;
}

interface Response {
  id: Number;
}

const validateBody = (body: RequestBody) => {
  const {
    descricao,
    lat,
    lng,
    tipoCobranca,
    valorAtividade,
    valorDiaria,
    valorHora
  } = body;
  if (
    typeof descricao !== "string" ||
    typeof lat !== "number" ||
    typeof lng !== "number"
  )
    throw Error("Serviço inválido");

  if (tipoCobranca === 0) {
    //hora
    if (typeof valorHora !== "number") throw Error("Valor do servico invalido");
  } else if (tipoCobranca === 1) {
    //diaria
    if (typeof valorDiaria !== "number")
      throw Error("Valor do servico invalido");
  } else if (tipoCobranca === 2) {
    //atividade
    if (typeof valorAtividade !== "number")
      throw Error("Valor do servico invalido");
  } else {
    throw Error("Tipo de cobranca inválido");
  }
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  validateBody(req.body);

  const body: RequestBody = req.body;
  const { tipoCobranca } = body;
  if (tipoCobranca === 0) {
    //hora
  }

  const response: Response = { id: 1 };

  res.json(response);
};
