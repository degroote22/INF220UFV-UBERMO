import * as express from "express";

interface QueryBody {
  tipo: number;
}

interface QueryRawBody {
  tipo: string;
}

interface Prestador {
  id: number;
  nome: string;
  telefone: string;
  notaAcumulada: number;
  email: string;
  fotoUrl: string;
}

interface ServicoOfertado {
  id: number;
  nome: string;
  valorDiaria?: number;
  valorHora?: number;
  valorAtividade?: number;
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

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const q = validateParseQuery(req.query);
  false && console.log(q);

  const prestadores: PrestadorServico[] = [
    {
      prestador: {
        id: 1,
        nome: "Joao",
        telefone: "1234-5678",
        notaAcumulada: 4.5,
        email: "aaaaa@bbbb.ccc",
        fotoUrl: "http://lorempixel.com/400/400"
      },
      servico: { id: 1, nome: "Limpeza de sofá", valorHora: 5000 }
    }
  ];

  const response: Response = { prestadores };
  res.json(response);
};
