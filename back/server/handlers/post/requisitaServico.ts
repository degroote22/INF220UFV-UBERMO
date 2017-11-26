import * as express from "express";
import * as pgPromise from "pg-promise";
import { PEDIDO } from "../shared/status";

export interface RequestBody {
  idservico: number;
  quantidade: number;
}

export interface Response {
  id: number;
}

const validateBody = (body: RequestBody) => {
  const { idservico } = body;
  if (typeof idservico !== "number") throw Error("Serviço inválido");
};

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    validateBody(req.body);

    const body: RequestBody = req.body;
    const db: pgPromise.IDatabase<{}> = res.locals.db;
    const email = res.locals.email;

    const { idservico } = body;
    const handleResponse = (id: number) => {
      const response: Response = { id };
      res.json(response);
    };

    const { id } = await db.one(
      "INSERT INTO ubermo.contratado " +
        "(servico, cliente, quantidade, datapedido, status) " +
        "VALUES ($1, $2, $3, current_timestamp, $4) RETURNING id",
      [idservico, email, body.quantidade, PEDIDO]
    );

    handleResponse(id);
  } catch (err) {
    res.locals.handleError(err);
  }
};
