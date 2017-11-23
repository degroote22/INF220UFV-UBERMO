export interface Endereco {
  uf: String;
  cidade: String;
  bairro: String;
  logradouro: String;
  numero: String;
  complemento: String;
  cep: String;
}

export const validateEndereco = (end: Endereco) => {
  for (const c in end)
    if (typeof end[c] !== "string") throw Error("Endereço inválido");
};
