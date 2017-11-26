import * as express from "express";
import * as pgPromise from "pg-promise";

export interface Oferta {
  id: number;
  nome: string;
  valor: number;
  tipocobranca: number;
  contratacoes: number;
}

export interface Response {
  ofertas: Oferta[];
}

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const db: pgPromise.IDatabase<{}> = res.locals.db;
  const email = res.locals.email;
  db
    .any(
      `SELECT ofertado.id as id, tipo.nome, ofertado.valor, tipo.tipocobranca, COUNT(*) as contratacoes
       FROM ubermo.ofertado, ubermo.tipo, ubermo.contratado
       WHERE ofertado.prestador = $1 AND tipo.id = ofertado.tipo AND contratado.servico = ofertado.id
       GROUP BY ofertado.id, tipo.nome, tipo.tipocobranca`,
      [email]
    )
    .then((ofertas: Oferta[]) => {
      const response: Response = { ofertas };
      res.json(response);
    })
    .catch(res.locals.handleError);
};
