import * as express from "express";
import { Endereco, validateEndereco } from "../shared/endereco";
import { validaEmail } from "../shared/email";
import { validaSenha } from "../shared/senha";
import { LoginResponse } from "../shared/login";

interface CartaoCredito {
  nome: string;
  numero: string;
  mesVencimento: number;
  anoVencimento: number;
}

interface RequestBody {
  nome: string;
  telefone: string;
  senha: string;
  cartao: CartaoCredito;
  endereco: Endereco;
  email: String;
}

const validateBody = (body: RequestBody) => {
  const { nome, telefone, senha, email } = body;

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

  validateEndereco(body.endereco);
  validateCC(body.cartao);
};

const validateCC = (cc: CartaoCredito) => {
  const { nome, numero, mesVencimento, anoVencimento } = cc;
  if (
    typeof nome !== "string" ||
    typeof numero !== "string" ||
    typeof mesVencimento !== "number" ||
    typeof anoVencimento !== "number"
  )
    throw Error("Cartão de crédito inválido");
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  validateBody(req.body);

  const response: LoginResponse = {
    nome: "Cliente",
    sessionToken: "abc"
  };

  res.json(response);
};
