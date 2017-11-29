import * as express from "express";
import * as pgPromise from "pg-promise";

interface Query {
  email: string;
}

export interface Prestador {
  email: string;
  nome: string;
  telefone: string;
  foto: string;
  nota: number;
}

const validateParseQuery = (query: Query): Query => {
  const { email } = query;
  if (typeof email !== "string") throw Error("E-mail do prestador inválido.");
  return { email };
};

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const db: pgPromise.IDatabase<{}> = res.locals.db;
    const q = validateParseQuery(req.query);
    await db
      .one(
        `SELECT prestador.nome, prestador.email, prestador.telefone, prestador.foto, prestador.nota
        FROM ubermo.prestador WHERE prestador.email = $1`,
        [q.email]
      )
      .then((response: Prestador) => {
        res.json(response);
      });
  } catch (err) {
    res.locals.handleError(err);
  }
};
