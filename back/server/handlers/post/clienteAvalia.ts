import * as express from "express";
import * as pgPromise from "pg-promise";

export interface Response {
  id: number;
}

export interface Request {
  id: number;
  notaprestador: number;
  comentarioprestador: string;
}

const validateBody = (body: Request) => {
  if (typeof body.id !== "number") throw Error("Tipo de atividade inválido");
  if (
    typeof body.notaprestador !== "number" ||
    body.notaprestador < 1 ||
    body.notaprestador > 5
  )
    throw Error("Nota inválida");
  if (typeof body.comentarioprestador !== "string")
    throw Error("Comentário inválida");
};

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    validateBody(req.body);
    const body: Request = req.body;
    const db: pgPromise.IDatabase<{}> = res.locals.db;
    const email = res.locals.email;

    const { dbemail, status, notaprestador } = await db.one(
      `SELECT contratado.status, contratado.cliente as dbemail, contratado.notaprestador
    FROM ubermo.contratado
    WHERE contratado.id = $1`,
      [body.id]
    );

    if (dbemail !== email || status !== 2 || notaprestador != undefined) {
      throw Error("Operação inválida");
    }

    await db
      .none(
        `UPDATE ubermo.contratado
      SET status = 2, notaprestador = $1, comentarioprestador = $2
      WHERE id = $3`,
        [body.notaprestador, body.comentarioprestador, body.id]
      )
      .then(() => {
        const response: Response = { id: body.id };
        res.json(response);
      });
  } catch (err) {
    res.locals.handleError(err);
  }
};
