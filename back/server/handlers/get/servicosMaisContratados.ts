import * as express from "express";

interface QueryBody {
  limit: number;
}

interface QueryRawBody {
  limit: string;
}

interface TipoServico {
  id: number;
  nome: string;
  contratacoes: number;
}

interface Response {
  tipos: TipoServico[];
}

const validateParseQuery = (query: QueryRawBody): QueryBody => {
  const { limit } = query;
  const l = parseInt(limit, 10);
  if (isNaN(l))
    throw Error("Nao foi informado o tipo do servico dos prestadores");
  return { limit: l };
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const q = validateParseQuery(req.query);
  false && console.log(q);

  const tipos: TipoServico[] = [
    { id: 1, nome: "Trocar lâmpada", contratacoes: 10 }
  ];

  const response: Response = { tipos };

  res.json(response);
};
