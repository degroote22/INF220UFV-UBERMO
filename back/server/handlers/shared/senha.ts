export const validaSenha = (senha: String) => {
  if (typeof senha !== "string" || senha.length < 6 || senha.length > 15)
    throw Error("Senha inválido");
};
