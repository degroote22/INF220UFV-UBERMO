import * as express from "express";
import { Endereco, validateEndereco } from "../shared/endereco";
import * as pgPromise from "pg-promise";
// import { validaEmail } from "../shared/email";
// import { validaSenha } from "../shared/senha";
// import { LoginResponse } from "../shared/login";
// import { jwtResponse } from "../shared/jwt";
// import * as jwt from "jsonwebtoken";
// import secret from "../shared/secret";

export interface Request {
  endereco: Endereco;
  nomeendereco: string;
}

export interface Response {
  id: number;
}

const validateBody = (body: Request) => {
  const { nomeendereco } = body;

  if (typeof nomeendereco !== "string") {
    throw Error("Nome do endereço inválido");
  }

  validateEndereco(body.endereco);
};

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    validateBody(req.body);

    const db: pgPromise.IDatabase<{}> = res.locals.db;
    const body: Request = req.body;
    const email = res.locals.email;

    const { endereco, nomeendereco } = body;

    const { id } = await db.one(
      `INSERT INTO ubermo.enderecocliente
        (nome, cliente, uf, cidade, bairro, logradouro,
          numero, complemento, cep)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        nomeendereco,
        email,
        endereco.uf,
        endereco.cidade,
        endereco.bairro,
        endereco.logradouro,
        endereco.numero,
        endereco.complemento,
        endereco.cep
      ]
    );

    res.json({ id });
  } catch (err) {
    res.locals.handleError(err);
  }
};
