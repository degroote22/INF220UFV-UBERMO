import * as express from "express";
import * as pgPromise from "pg-promise";

interface QueryBody {
  id: number;
}

interface QueryRawBody {
  id: string;
}

export interface Servico {
  id: number;
  valor: number;
  descricao: string;
  lat: number;
  lng: number;
  tipocobranca: number;
  nome: string;
  nomeprestador: string;
  notaprestador: number;
  emailprestador: string;
  fotoprestador: string;
}

const validateParseQuery = (query: QueryRawBody): QueryBody => {
  const { id } = query;
  const t = parseInt(id, 10);
  if (isNaN(t)) throw Error("Nao foi informado o id so servico");
  return { id: t };
};

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const db: pgPromise.IDatabase<{}> = res.locals.db;
    const q = validateParseQuery(req.query);
    await db
      .one(
        "SELECT ofertado.id, ofertado.valor, ofertado.descricao, ofertado.lat, ofertado.lng, " +
          "tipo.tipocobranca, tipo.nome, prestador.nome as nomeprestador, prestador.nota as notaprestador, " +
          "prestador.email as emailprestador, prestador.foto as fotoprestador " +
          "FROM ubermo.tipo, ubermo.ofertado, ubermo.prestador " +
          "WHERE ofertado.id = $1 AND ofertado.tipo = tipo.id AND ofertado.prestador = prestador.email ",
        [q.id]
      )
      .then(response => {
        res.json(response);
      });
  } catch (err) {
    res.locals.handleError(err);
  }
};
