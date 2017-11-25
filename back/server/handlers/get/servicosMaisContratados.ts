import * as express from "express";
import * as pgPromise from "pg-promise";

interface QueryBody {
  limit: number;
}

interface QueryRawBody {
  limit: string;
}

export interface TipoServico {
  id: number;
  nome: string;
  contratacoes: number;
}

export interface Response {
  tipos: TipoServico[];
}

const validateParseQuery = (query: QueryRawBody): QueryBody => {
  const { limit } = query;
  if (!limit) {
    return { limit: 10 };
  }
  const l = parseInt(limit, 10);
  if (isNaN(l))
    throw Error("Nao foi informado o tipo do servico dos prestadores");
  return { limit: l };
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const q = validateParseQuery(req.query);

  const db: pgPromise.IDatabase<{}> = res.locals.db;

  db
    .any(
      "SELECT COUNT(*) as contratacoes, tipo.id, tipo.nome " +
        "FROM ubermo.tipo, ubermo.contratado, ubermo.ofertado WHERE " +
        "tipo.id = ofertado.tipo AND contratado.servico = ofertado.id " +
        "GROUP BY tipo.id ORDER BY contratacoes DESC LIMIT $1",
      [q.limit]
    )
    .then((tipos: TipoServico[]) => {
      const response: Response = { tipos };
      res.json(response);
    })
    .catch(res.locals.handleError);
};
