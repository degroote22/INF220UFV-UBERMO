export const validaEmail = (email: String) => {
  if (typeof email !== "string" || email.length < 8 || email.length > 50)
    throw Error("E-mail inválido");
};
