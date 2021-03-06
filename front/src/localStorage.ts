export const setLocalStorage = (
  jwt: string,
  nome: string,
  role: string,
  email: string
) => {
  window.localStorage.setItem("jwt", jwt);
  window.localStorage.setItem("nome", nome);
  window.localStorage.setItem("role", role);
  window.localStorage.setItem("email", email);
  window.localStorage.setItem("date", String(new Date()));
};

export const clearLocalStorage = () => {
  window.localStorage.removeItem("jwt");
  window.localStorage.removeItem("nome");
  window.localStorage.removeItem("role");
  window.localStorage.removeItem("date");
  window.localStorage.removeItem("email");
};

export const getLocalStorage = (): {
  jwt: string;
  nome: string;
  role: string;
  email: string;
} => {
  const d = window.localStorage.getItem("date");
  if (typeof d !== "string") throw Error("JWT inválido");

  const date = new Date(d);
  if (new Date().getTime() - date.getTime() > 1000 * 60 * 60)
    throw Error("JWT expirado");

  const jwt = window.localStorage.getItem("jwt");
  const nome = window.localStorage.getItem("nome");
  const email = window.localStorage.getItem("email");
  const role = window.localStorage.getItem("role");
  if (
    typeof jwt !== "string" ||
    typeof nome !== "string" ||
    typeof email !== "string" ||
    typeof role !== "string"
  )
    throw Error("JWT inválido");
  return { jwt, nome, role, email };
};
