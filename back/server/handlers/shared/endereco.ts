export interface Endereco {
  uf: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cep: string;
}

export const validateEndereco = (end: Endereco) => {
  if (!end) throw Error("Endereco nao informado");
  const { uf, cidade, bairro, logradouro, numero, complemento, cep } = end;

  if (typeof uf !== "string") throw Error("UF do endereco inválido");
  if (typeof cidade !== "string") throw Error("Cidade do endereco inválido");
  if (typeof bairro !== "string") throw Error("Bairro do endereco inválido");
  if (typeof logradouro !== "string")
    throw Error("Logradouro do endereco inválido");
  if (typeof numero !== "string") throw Error("Numero do endereco inválido");
  if (typeof complemento !== "string")
    throw Error("Complemento do endereco inválido");
  if (typeof cep !== "string") throw Error("Cep do endereco inválido");
};
