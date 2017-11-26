import * as express from "express";
import * as pgPromise from "pg-promise";

export interface Servico {
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
  servicos: Servico[];
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
      "SELECT contratado.id as id, tipo.nome, ofertado.valor, contratado.quantidade, " +
        "tipo.tipocobranca, contratado.datapedido, contratado.dataconclusao, contratado.status, " +
        "contratado.notacliente, contratado.comentariocliente, " +
        "contratado.notaprestador, contratado.comentarioprestador " +
        "FROM ubermo.contratado, ubermo.ofertado, ubermo.tipo " +
        "WHERE contratado.servico = ofertado.id AND ofertado.prestador = $1 AND tipo.id = ofertado.tipo AND contratado.status <> 2",
      [email]
    )
    .then((servicos: Servico[]) => {
      const response: Response = { servicos };
      res.json(response);
    })
    .catch(res.locals.handleError);
};
