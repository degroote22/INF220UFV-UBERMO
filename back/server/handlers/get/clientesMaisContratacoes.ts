import * as express from "express";

interface QueryBody {
  tipo: number;
}

interface QueryRawBody {
  tipo: string;
}

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  notaAcumulada: number;
  email: string;
}

interface Response {
  clientes: Cliente[];
}

const validateParseQuery = (query: QueryRawBody): QueryBody => {
  const { tipo } = query;
  const t = parseInt(tipo, 10);
  if (isNaN(t)) throw Error("Nao foi informado o tipo do servico dos clientes");
  return { tipo: t };
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const q = validateParseQuery(req.query);
  false && console.log(q);

  const clientes: Cliente[] = [
    {
      id: 1,
      nome: "Daniel",
      telefone: "1234-5678",
      notaAcumulada: 4.5,
      email: "aaaaa@bbbb.ccc"
    }
  ];

  const response: Response = { clientes };

  res.json(response);
};
