import * as express from "express";
import * as pgPromise from "pg-promise";

interface QueryBody {
  tipo: number;
}

interface QueryRawBody {
  tipo: string;
}

interface Cliente {
  email: number;
  nome: string;
  contratacoes: number;
}

interface Response {
  clientes: Cliente[];
}

const validateParseQuery = (query: QueryRawBody): QueryBody => {
  const { tipo } = query;
  const t = parseInt(tipo, 10);
  if (isNaN(t)) throw Error("Nao foi informado o tipo do serviço dos clientes");
  return { tipo: t };
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const db: pgPromise.IDatabase<{}> = res.locals.db;
  const q = validateParseQuery(req.query);

  db
    .any(
      "SELECT COUNT(*) as contratacoes, cliente.nome, cliente.email FROM ubermo.contratado, ubermo.ofertado, ubermo.cliente " +
        "WHERE contratado.servico = ofertado.id AND ofertado.tipo = $1 AND contratado.cliente = cliente.email " +
        "GROUP BY cliente.email",
      [q.tipo]
    )
    .then((clientes: Cliente[]) => {
      const response: Response = { clientes };
      res.json(response);
    })
    .catch(res.locals.handleError);
};
