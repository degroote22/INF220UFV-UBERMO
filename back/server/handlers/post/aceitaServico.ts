import * as express from "express";
import * as pgPromise from "pg-promise";

export interface Response {
  status: number;
  id: number;
}

export interface Request {
  id: number;
}

const validateBody = (body: Request) => {
  if (typeof body.id !== "number") throw Error("Tipo de atividade inválido");
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

    const { dbemail, status } = await db.one(
      `SELECT ofertado.prestador as dbemail, contratado.status as status
    FROM ubermo.ofertado, ubermo.contratado
    WHERE ofertado.id = contratado.servico AND contratado.id = $1`,
      [body.id]
    );

    if (dbemail !== email || status !== 0) {
      throw Error("Operação inválida");
    }

    await db
      .none(
        `UPDATE ubermo.contratado
      SET status = 1
      WHERE id = $1`,
        [body.id]
      )
      .then(() => {
        const response: Response = { status: 1, id: body.id };
        res.json(response);
      });
  } catch (err) {
    res.locals.handleError(err);
  }
};
