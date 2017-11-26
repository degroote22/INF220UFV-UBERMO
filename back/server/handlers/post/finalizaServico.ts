import * as express from "express";
import * as pgPromise from "pg-promise";

export interface Response {
  status: number;
  id: number;
}

export interface Request {
  id: number;
  notacliente: number;
  comentariocliente: string;
}

const validateBody = (body: Request) => {
  if (typeof body.id !== "number") throw Error("Tipo de atividade inválido");
  if (
    typeof body.notacliente !== "number" ||
    body.notacliente < 1 ||
    body.notacliente > 5
  )
    throw Error("Nota inválida");
  if (typeof body.comentariocliente !== "string")
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

    const { dbemail, status } = await db.one(
      `SELECT ofertado.prestador as dbemail, contratado.status as status
    FROM ubermo.ofertado, ubermo.contratado
    WHERE ofertado.id = contratado.servico AND contratado.id = $1`,
      [body.id]
    );

    if (dbemail !== email || status !== 1) {
      throw Error("Operação inválida");
    }

    await db
      .none(
        `UPDATE ubermo.contratado
      SET status = 2, notacliente = $1, comentariocliente = $2, dataconclusao = current_timestamp
      WHERE id = $3`,
        [body.notacliente, body.comentariocliente, body.id]
      )
      .then(() => {
        const response: Response = { status: 2, id: body.id };
        res.json(response);
      });
  } catch (err) {
    res.locals.handleError(err);
  }
};
