import * as express from "express";
import * as pgPromise from "pg-promise";

export interface ITipo {
  id: number;
  nome: string;
  tipocobranca: number;
}

export interface Response {
  tipos: ITipo[];
}

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const db: pgPromise.IDatabase<{}> = res.locals.db;

  return db
    .any("SELECT tipo.id, tipo.nome, tipo.tipocobranca FROM ubermo.tipo")
    .then((tipos: ITipo[]) => {
      const response: Response = { tipos };
      res.json(response);
    })
    .catch(res.locals.handleError);
};
