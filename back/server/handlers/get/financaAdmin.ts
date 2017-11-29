import * as express from "express";
import * as pgPromise from "pg-promise";

export interface Response {
  hoje: number;
  semana: number;
  mes: number;
  ano: number;
}

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const db: pgPromise.IDatabase<{}> = res.locals.db;

    const getByTime = (days: number) =>
      db
        .one(
          `SELECT SUM(ofertado.valor * contratado.quantidade) as s
            FROM ubermo.ofertado, ubermo.contratado
            WHERE contratado.servico = ofertado.id
            AND contratado.datapedido >= NOW() - interval '${days} day'`
        )
        .then(x => x.s);

    const hoje = await getByTime(1);
    const semana = await getByTime(7);
    const mes = await getByTime(30);
    const ano = await getByTime(365);

    const response: Response = {
      hoje,
      semana,
      mes,
      ano
    };
    res.json(response);
  } catch (err) {
    res.locals.handleError(err);
  }
};
