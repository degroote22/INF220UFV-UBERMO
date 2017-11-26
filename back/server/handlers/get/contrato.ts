import * as express from "express";
import * as pgPromise from "pg-promise";

interface QueryBody {
  id: number;
}

interface QueryRawBody {
  id: string;
}

export interface Contrato {
  id: number;
  valor: number;
  descricao: string;
  lat: number;
  lng: number;
  tipocobranca: number;
  nome: string;
  nomeprestador: string;
  notaglobalprestador: number;
  emailprestador: string;
  fotoprestador: string;
  //
  quantidade: number;
  datapedido: string;
  dataconclusao: string;
  status: number;
  notacliente: number;
  comentariocliente: string;
  notaprestador: number;
  comentarioprestador: string;
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
    const email = res.locals.email;

    await db
      .one(
        "SELECT contratado.id, ofertado.valor, ofertado.descricao, ofertado.lat, ofertado.lng, " +
          "tipo.tipocobranca, tipo.nome, prestador.nome as nomeprestador, prestador.nota as notaglobalprestador, " +
          "prestador.email as emailprestador, prestador.foto as fotoprestador, " +
          "contratado.quantidade as quantidade, contratado.datapedido as datapedido, " +
          "contratado.dataconclusao as dataconclusao, contratado.status as status, contratado.notacliente as notacliente, " +
          "contratado.comentariocliente as comentariocliente, contratado.notaprestador as notaprestador, " +
          "contratado.comentarioprestador as comentarioprestador " +
          "FROM ubermo.tipo, ubermo.ofertado, ubermo.prestador, ubermo.contratado " +
          "WHERE ofertado.id = contratado.servico AND ofertado.tipo = tipo.id AND ofertado.prestador = prestador.email " +
          "AND contratado.id = $1 AND contratado.cliente = $2",
        [q.id, email]
      )
      .then(response => {
        res.json(response);
      });
  } catch (err) {
    res.locals.handleError(err);
  }
};
