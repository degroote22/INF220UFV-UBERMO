import * as express from "express";
import * as pgPromise from "pg-promise";
import * as status from "../shared/status";

export interface RequestBody {
  idservico: number;
  quantidade: number;
  endereco: number;
}

export interface Response {
  id: number;
}

const validateBody = (body: RequestBody) => {
  const { idservico, endereco } = body;
  if (typeof idservico !== "number") throw Error("Serviço inválido");
  if (typeof endereco !== "number") throw Error("Endereco inválido");
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

    // Verificar se o endereço eh do cliente q tá mandando o pedido
    const { clienteemail } = await db.one(
      `
    SELECT enderecocliente.cliente as clienteemail
    FROM ubermo.enderecocliente
    WHERE enderecocliente.id = $1`,
      [body.endereco]
    );

    console.log(clienteemail);

    if (clienteemail !== email) {
      throw Error("Endereço inválido inválido");
    }

    const { id } = await db.one(
      "INSERT INTO ubermo.contratado " +
        "(servico, cliente, quantidade, datapedido, status, endereco) " +
        "VALUES ($1, $2, $3, current_timestamp, $4, $5) RETURNING id",
      [idservico, email, body.quantidade, status.PEDIDO, body.endereco]
    );
    const response: Response = { id };
    res.json(response);
  } catch (err) {
    res.locals.handleError(err);
  }
};
