import * as express from "express";
import * as pgPromise from "pg-promise";

export interface EnderecoId {
  nome: string;
  id: number;
}

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const db: pgPromise.IDatabase<{}> = res.locals.db;
    const email = res.locals.email;

    await db
      .any(
        `SELECT nome, id FROM ubermo.enderecocliente WHERE enderecocliente.cliente = $1`,
        [email]
      )
      .then(response => res.json(response));
  } catch (err) {
    res.locals.handleError(err);
  }
};
