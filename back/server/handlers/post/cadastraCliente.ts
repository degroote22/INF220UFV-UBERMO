import * as express from "express";
import { Endereco, validateEndereco } from "../shared/endereco";
import { validaEmail } from "../shared/email";
import { validaSenha } from "../shared/senha";
import { LoginResponse } from "../shared/login";
import * as pgPromise from "pg-promise";
import { jwtResponse } from "../shared/jwt";
import * as jwt from "jsonwebtoken";
import secret from "../shared/secret";

export interface CartaoCredito {
  nome: string;
  numero: string;
  mesvencimento: number;
  anovencimento: number;
}

export interface RequestBody {
  nome: string;
  telefone: string;
  senha: string;
  cartao: CartaoCredito;
  endereco: Endereco;
  email: string;
  nomeendereco: string;
}

const validateBody = (body: RequestBody) => {
  const { nome, telefone, senha, email, nomeendereco } = body;

  validaEmail(email);
  validaSenha(senha);

  if (typeof nomeendereco !== "string") {
    throw Error("Nome do endereço inválido");
  }

  if (typeof nome !== "string" || nome.length < 3 || nome.length > 100)
    throw Error("Nome inválido");

  if (
    typeof telefone !== "string" ||
    telefone.length < 8 ||
    telefone.length > 15
  )
    throw Error("Telefone inválido");

  validateEndereco(body.endereco);
  validateCC(body.cartao);
};

const validateCC = (cc: CartaoCredito) => {
  if (!cc) throw Error("Cartao de crédito não informado");
  const { nome, numero, mesvencimento, anovencimento } = cc;
  if (
    typeof nome !== "string" ||
    typeof numero !== "string" ||
    typeof mesvencimento !== "number" ||
    typeof anovencimento !== "number"
  )
    throw Error("Cartão de crédito inválido");
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  validateBody(req.body);

  const db: pgPromise.IDatabase<{}> = res.locals.db;
  const body: RequestBody = req.body;

  const { endereco, cartao, nomeendereco } = body;
  db
    .tx(t =>
      t
        .none(
          "INSERT INTO UBERMO.CLIENTE(nome, telefone, nota, email, hash, avaliacoes) " +
            "VALUES ($1, $2, $3, $4, crypt($5, gen_salt('bf')), $6)",
          [body.nome, body.telefone, 0, body.email, body.senha, 0]
        )
        .then(() =>
          t.batch([
            t.none(
              "INSERT INTO UBERMO.ENDERECOCLIENTE " +
                "(nome, cliente, uf, cidade, bairro, logradouro, numero, complemento, cep) " +
                "values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
              [
                nomeendereco,
                body.email,
                endereco.uf,
                endereco.cidade,
                endereco.bairro,
                endereco.logradouro,
                endereco.numero,
                endereco.complemento,
                endereco.cep
              ]
            ),
            t.none(
              "INSERT INTO UBERMO.CARTAO " +
                "(cliente, nome, numero, anovencimento, mesvencimento) " +
                "values ($1, $2, $3, $4, $5)",
              [
                body.email,
                cartao.nome,
                cartao.numero,
                cartao.anovencimento,
                cartao.mesvencimento
              ]
            )
          ])
        )
    )
    .then(() => {
      const jwtr: jwtResponse = {
        email: body.email,
        role: "cliente"
      };
      const response: LoginResponse = {
        nome: body.nome,
        jwt: jwt.sign(jwtr, secret, { expiresIn: "1h" })
      };
      res.json(response);
    })
    .catch(err => {
      console.log(err);
      if (err.code === "23505" /* Unique violation */) {
        res.status(500);
        res.json({ message: "E-mail já cadastrado" });
      } else {
        res.status(500);
        res.json(err);
      }
    });
};
