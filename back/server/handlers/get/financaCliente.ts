import * as express from "express";
import * as pgPromise from "pg-promise";

interface Query {
  cliente: string;
}

interface Response {
  hoje: number;
  semana: number;
  mes: number;
  ano: number;
}

const validateQuery = (query: Query) => {
  if (typeof query.cliente !== "string")
    throw Error("Email de cliente inválido");
};

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    validateQuery(req.query);
    const query: Query = req.query;

    const db: pgPromise.IDatabase<{}> = res.locals.db;

    const getByTime = (days: number) =>
      db
        .one(
          "SELECT SUM(ofertado.valor * contratado.quantidade) as s FROM ubermo.cliente, ubermo.ofertado, ubermo.contratado " +
            "WHERE cliente.email = $1 AND contratado.cliente = cliente.email AND contratado.servico = ofertado.id " +
            "AND contratado.datapedido >= NOW() - interval '" +
            String(days) +
            " day' ",
          [query.cliente]
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
