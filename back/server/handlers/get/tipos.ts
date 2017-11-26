import * as express from "express";
import * as pgPromise from "pg-promise";

export interface TipoOfertas {
  id: number;
  nome: string;
  ofertados: number;
}

export interface Response {
  tipos: TipoOfertas[];
}

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const db: pgPromise.IDatabase<{}> = res.locals.db;

  return db
    .any(
      "SELECT COUNT(*) as ofertados, tipo.id, tipo.nome FROM ubermo.tipo, ubermo.ofertado " +
        "WHERE ofertado.tipo = tipo.id GROUP BY tipo.id"
    )
    .then((tipos: TipoOfertas[]) => {
      const response: Response = { tipos };
      res.json(response);
    })
    .catch(res.locals.handleError);
};
