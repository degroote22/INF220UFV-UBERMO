import * as express from "express";

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
  const q = validateParseQuery(req.query);
  false && console.log(q);

  const servicos: ServicoContratado[] = [];

  const response: Response = {
    servicos,
    recebidoHoje: 10000,
    recebidoAno: 150000,
    recebidoMes: 10000
  };

  res.json(response);
};
