import * as express from "express";
import * as pgPromise from "pg-promise";

interface QueryBody {
  tipo: number;
}

interface QueryRawBody {
  tipo: string;
}

export interface Servico {
  id: number;
  valor: number;
  descricao: string;
  lat: number;
  lng: number;
}

export interface Response {
  servicos: Servico[];
  tipocobranca: number;
  nome: string;
}

const validateParseQuery = (query: QueryRawBody): QueryBody => {
  const { tipo } = query;
  const t = parseInt(tipo, 10);
  if (isNaN(t)) throw Error("Nao foi informado o tipo do serviço dos clientes");
  return { tipo: t };
};

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const db: pgPromise.IDatabase<{}> = res.locals.db;
    const q = validateParseQuery(req.query);
    const { tipocobranca, nome } = await db.one(
      "SELECT tipo.tipocobranca, tipo.nome from ubermo.tipo WHERE tipo.id = $1",
      [q.tipo]
    );

    await db
      .any(
        "SELECT ofertado.valor, ofertado.descricao, ofertado.lat, ofertado.lng, ofertado.id FROM ubermo.ofertado WHERE ofertado.tipo = $1",
        [q.tipo]
      )
      .then((servicos: Servico[]) => {
        const response: Response = {
          servicos,
          tipocobranca,
          nome
        };
        res.json(response);
      });
  } catch (err) {
    res.locals.handleError(err);
  }
};
