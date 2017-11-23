import * as express from "express";
import { Endereco, validateEndereco } from "../shared/endereco";
import { validaEmail } from "../shared/email";
import { validaSenha } from "../shared/senha";
import { LoginResponse } from "../shared/login";

interface ContaBancaria {
  nomeBanco: String;
  agencia: String;
  conta: String;
}

interface RequestBody {
  nome: String;
  telefone: String;
  foto: String;
  endereco: Endereco;
  senha: String;
  email: String;
  conta: ContaBancaria;
}

const validaConta = (conta: ContaBancaria) => {
  for (const c in conta)
    if (typeof conta[c] !== "string") throw Error("Conta bancária inválida.");
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

  const response: LoginResponse = {
    nome: "Prestador",
    sessionToken: "def"
  };

  res.json(response);
};
