import * as express from "express";
import * as pgPromise from "pg-promise";

// interface Query {
//   email: string;
// }

export interface ServicoContratado {
  id: number;
  nome: string;
  valor: number;
  quantidade: number;
  tipocobranca: number;
  datapedido: string;
  dataconclusao: string;
  status: number;
  notacliente: number;
  comentariocliente: string;
  notaprestador: number;
  comentarioprestador: string;
}

export interface Response {
  servicos: ServicoContratado[];
}

// const validateQuery = (query: Query) => {
//   if (typeof query.email !== "string") throw Error("Email de cliente inválido");
// };

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // const q = validateParseQuery(req.query);
  // validateQuery(req.query);
  // const query: Query = req.query;
  const db: pgPromise.IDatabase<{}> = res.locals.db;
  const email = res.locals.email;
  db
    .any(
      "SELECT contratado.id as id, tipo.nome, ofertado.valor, contratado.quantidade, " +
        "tipo.tipocobranca, contratado.datapedido, contratado.dataconclusao, contratado.status, " +
        "contratado.notacliente, contratado.comentariocliente, " +
        "contratado.notaprestador, contratado.comentarioprestador " +
        "FROM ubermo.contratado, ubermo.ofertado, ubermo.tipo " +
        "WHERE contratado.servico = ofertado.id AND contratado.cliente = $1 AND tipo.id = ofertado.tipo",
      [email]
    )
    .then((servicos: ServicoContratado[]) => {
      const response: Response = { servicos };
      res.json(response);
    })
    .catch(res.locals.handleError);
};
