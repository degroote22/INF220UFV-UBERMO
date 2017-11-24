export const validaSenha = (senha: String) => {
  if (typeof senha !== "string" || senha.length < 5 || senha.length > 15)
    throw Error("Senha inválida");
};
