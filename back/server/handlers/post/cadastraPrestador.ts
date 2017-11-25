import * as express from "express";
import { Endereco, validateEndereco } from "../shared/endereco";
import { validaEmail } from "../shared/email";
import { validaSenha } from "../shared/senha";
import { LoginResponse } from "../shared/login";
import * as pgPromise from "pg-promise";
import { jwtResponse } from "../shared/jwt";
import * as jwt from "jsonwebtoken";
import secret from "../shared/secret";

// {
// 	"nome": "aaaaaaaaaaa",
// 	"telefone": "1234-56777",
// 	"senha": "lucaslucas",
// 	"email": "lucaxx@gmail.com",
// 	"foto": "http://lorempixel.com/400/400/",
// 	"conta": {
// 		"nomebanco": "aaaaaaaaaaa",
// 		"agencia": "55519",
// 		"conta": "10001"
// 	},
// 	"endereco": {
// 		"uf": "MG",
// 		"cidade": "Viçosa",
// 		"bairro": "abc",
// 		"logradouro": "ahahahha",
// 		"numero": "222",
// 		"complemento": "",
// 		"cep": "35180-240"
// 	}
// }

export interface ContaBancaria {
  nomebanco: string;
  agencia: string;
  conta: string;
}

export interface RequestBody {
  nome: string;
  telefone: string;
  senha: string;
  email: string;
  endereco: Endereco;
  conta: ContaBancaria;
  foto: string;
}

const validaConta = (cb: ContaBancaria) => {
  if (!cb) throw Error("Conta nao informada");
  const { nomebanco, agencia, conta } = cb;
  if (typeof nomebanco !== "string") throw Error("Nome do banco inválido");
  if (typeof agencia !== "string") throw Error("Agencia do banco inválido");
  if (typeof conta !== "string") throw Error("Conta do banco inválido");
};

const validateBody = (body: RequestBody) => {
  const { nome, telefone, foto, senha, email } = body;

  validaEmail(email);
  validaSenha(senha);

  if (typeof nome !== "string" || nome.length < 3 || nome.length > 100)
    throw Error("Nome inválido");

  if (
    typeof telefone !== "string" ||
    telefone.length < 8 ||
    telefone.length > 15
  )
    throw Error("Telefone inválido");

  if (typeof foto !== "string") throw Error("URL da foto inválida");

  validaConta(body.conta);
  validateEndereco(body.endereco);
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  validateBody(req.body);

  const db: pgPromise.IDatabase<{}> = res.locals.db;
  const body: RequestBody = req.body;
  const { endereco, conta } = body;

  const handleError = res.locals.handleError;

  db
    .tx(t =>
      t
        .none(
          "INSERT INTO UBERMO.PRESTADOR (nome, telefone, nota, foto, email, hash) " +
            "VALUES ($1, $2, $3, $4, $5, crypt($6, gen_salt('bf')))",
          [body.nome, body.telefone, 0, body.foto, body.email, body.senha]
        )
        .then(() =>
          t.batch([
            t.none(
              "INSERT INTO UBERMO.CONTA(prestador, nomebanco, agencia, conta) " +
                "VALUES ($1, $2, $3, $4)",
              [body.email, conta.nomebanco, conta.agencia, conta.conta]
            ),
            t.none(
              "INSERT INTO UBERMO.ENDERECOPRESTADOR " +
                "(prestador, uf, cidade, bairro, logradouro, numero, complemento, cep) " +
                "values ($1, $2, $3, $4, $5, $6, $7, $8)",
              [
                body.email,
                endereco.uf,
                endereco.cidade,
                endereco.bairro,
                endereco.logradouro,
                endereco.numero,
                endereco.complemento,
                endereco.cep
              ]
            )
          ])
        )
    )
    .then(() => {
      const jwtr: jwtResponse = {
        email: body.email,
        role: "prestador"
      };
      const response: LoginResponse = {
        nome: body.nome,
        jwt: jwt.sign(jwtr, secret, { expiresIn: "1h" })
      };
      res.json(response);
    })
    .catch(err => {
      if (err.code === "23505" /* Unique violation */) {
        res.status(500);
        res.json({ message: "E-mail já cadastrado" });
      } else {
        handleError(err);
      }
    });
};
