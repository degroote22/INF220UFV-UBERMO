import * as express from "express";
import * as pgPromise from "pg-promise";

interface RequestBody {
  nome: String;
  tipocobranca: Number;
}

interface Response {
  id: Number;
}

const validateBody = (body: RequestBody) => {
  const { nome, tipocobranca } = body;

  if (typeof nome !== "string" || nome.length < 3 || nome.length > 100)
    throw Error("Nome inválido");

  if (typeof tipocobranca !== "number")
    throw Error("Tipo de atividade inválido");
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  validateBody(req.body);

  const db: pgPromise.IDatabase<{}> = res.locals.db;

  const body: RequestBody = req.body;

  db
    .one(
      "INSERT INTO UBERMO.TIPO(nome, tipocobranca) VALUES ($1, $2) RETURNING id",
      [body.nome, body.tipocobranca]
    )
    .then(data => {
      const response: Response = { id: data.id };
      res.json(response);
    })
    .catch(err => {
      res.status(500);
      res.json(err);
    });
};
