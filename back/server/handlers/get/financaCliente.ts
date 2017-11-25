import * as express from "express";
import * as pgPromise from "pg-promise";

interface QueryBody {
  cliente: number;
}

interface QueryRawBody {
  cliente: string;
}

interface ServicoContratado {
  nome: string;
  dataConclusao: string;
  tipoCobranca: number;
  valorDiaria?: number;
  valorHora?: number;
  valorAtividade?: number;
  quantidadeHoras?: number;
  quantidadeDias?: number;
}

interface Response {
  servicos: ServicoContratado[];

  recebidoHoje: number;
  recebidoMes: number;
  recebidoAno: number;
}

const validateParseQuery = (query: QueryRawBody): QueryBody => {
  const { cliente } = query;
  const c = parseInt(cliente, 10);
  if (isNaN(c)) throw Error("Nao foi informado o cliente");
  return { cliente: c };
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // pra cada cliente
  // pegar os servicos q ele contratou
  // contar quantas contratacoes tem neles
  // somar as horas
  // somar as diarias

  const q = validateParseQuery(req.query);
  false && console.log(q);

  const servicos: ServicoContratado[] = [];
  const db: pgPromise.IDatabase<{}> = res.locals.db;

  db.any(
    "SELECT COUNT(*) as contratacoes, SUM(contratado.quantidade) as quantidade, " +
      "ofertado.id, tipo.nome, tipo.tipocobranca, ofertado.valor " +
      "FROM ubermo.contratado, ubermo.ofertado, ubermo.tipo " +
      "WHERE contratado.servico = ofertado.id AND ofertado.prestador = $1 AND ofertado.tipo = tipo.id " +
      "AND contratado.datapedido >= NOW() - interval '" +
      String(days) +
      " day' " +
      "GROUP BY ofertado.id, tipo.nome, tipo.tipocobranca ",
    [query.prestador]
  );

  const response: Response = {
    servicos,
    recebidoHoje: 10000,
    recebidoAno: 150000,
    recebidoMes: 10000
  };

  res.json(response);
};
