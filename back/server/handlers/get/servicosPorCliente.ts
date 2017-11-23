import * as express from "express";

interface QueryBody {
  cliente: number;
}

interface QueryRawBody {
  cliente: string;
}

interface ServicoContratado {
  id: number;
  nome: string;
  valorDiaria?: number;
  valorHora?: number;
  valorAtividade?: number;
  quantidadeHoras?: number;
  quantidadeDias?: number;
  tipoCobranca: number;
  dataPedido: string;
  dataConclusao: string;
  status: number;
  notaCliente: number;
  comentarioCliente: string;
  notaPrestador: number;
  comentarioPrestador: string;
}

interface Response {
  servicos: ServicoContratado[];
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

  const response: Response = { servicos };

  res.json(response);
};
