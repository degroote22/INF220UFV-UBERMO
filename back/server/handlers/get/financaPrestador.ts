import * as express from "express";

interface QueryBody {
  prestador: number;
}

interface QueryRawBody {
  prestador: string;
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
  const { prestador } = query;
  const p = parseInt(prestador, 10);
  if (isNaN(p)) throw Error("Nao foi informado o cliente");
  return { prestador: p };
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
