import * as express from "express";
import * as pgPromise from "pg-promise";
// import { HORA, tipoToValor, DIARIA, ATIVIDADE } from "../shared/tiposCobranca";

interface QueryBody {
  tipo: number;
}

interface QueryRawBody {
  tipo: string;
}

interface Prestador {
  nome: string;
  telefone: string;
  nota: number;
  email: string;
  foto: string;
}

interface ServicoOfertado {
  id: number;
  nome: string;
  tipocobranca: number;
  valor: number;
}

interface PrestadorServico {
  prestador: Prestador;
  servico: ServicoOfertado;
}

interface Response {
  prestadores: PrestadorServico[];
}

const validateParseQuery = (query: QueryRawBody): QueryBody => {
  const { tipo } = query;
  const t = parseInt(tipo, 10);
  if (isNaN(t))
    throw Error("Nao foi informado o tipo do servico dos prestadores");
  return { tipo: t };
};

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const q = validateParseQuery(req.query);

    const db: pgPromise.IDatabase<{}> = res.locals.db;

    const { tipocobranca, nome } = await db.one(
      "SELECT tipocobranca, nome FROM ubermo.tipo WHERE id = $1",
      [q.tipo]
    );

    await db
      .any(
        "SELECT ofertado.id, ofertado.valor, " +
          "prestador.nome, prestador.telefone, prestador.nota, prestador.email, prestador.foto " +
          "FROM ubermo.ofertado, ubermo.prestador WHERE tipo = $1 " +
          "and prestador.email = ofertado.prestador ORDER BY ofertado.valor",
        [q.tipo]
      )
      .then(result =>
        result.map(r => ({
          servico: {
            id: r.id,
            nome,
            tipocobranca,
            valor: r.valor
          },
          prestador: {
            nome: r.nome,
            telefone: r.telefone,
            nota: r.nota,
            email: r.email,
            foto: r.foto
          }
        }))
      )
      .then((prestadores: PrestadorServico[]) => {
        const response: Response = { prestadores };
        res.json(response);
      });
  } catch (err) {
    res.locals.handleError(err);
  }
};
