import endpoint from "./endpoint";
import { RequestBody as RequestBodyLogin } from "../../../back/server/handlers/post/login";
import { Response as ResponseMaisContratados } from "../../../back/server/handlers/get/servicosMaisContratados";

export const loginPrestador = (email: string, senha: string) => {
  const body: RequestBodyLogin = {
    email,
    senha
  };
  return fetchLogin(body, "loginprestador");
};

export const loginCliente = (email: string, senha: string) => {
  const body: RequestBodyLogin = {
    email,
    senha
  };
  return fetchLogin(body, "logincliente");
};

export const servicosMaisContratados = (
  limit: number
): Promise<ResponseMaisContratados> =>
  getInjected("servicosmaiscontratados?limit=" + limit);

const makePostHeaders = (jwt?: string) =>
  jwt
    ? [
        ["Accept", "application/json"],
        ["Content-Type", "application/json"],
        ["Authorization", jwt]
      ]
    : [["Accept", "application/json"], ["Content-Type", "application/json"]];

const postInjected = (end: string, body: object, jwt?: string) =>
  fetch(end, {
    method: "POST",
    body: JSON.stringify(body),
    headers: makePostHeaders(jwt)
  });

const makeGetConfig = (jwt?: string) =>
  jwt ? { headers: [["Authorization", jwt]] } : {};

const getInjected = (
  path: string,
  jwt?: string
): Promise<ResponseMaisContratados> => {
  return fetch(endpoint + path, makeGetConfig(jwt)).then(
    x =>
      x.ok
        ? x.json()
        : x.json().then(r => Promise.reject({ message: r.message }))
  );
};

const fetchLogin = (body: RequestBodyLogin, path: string) => {
  return postInjected(endpoint + path, body).then(
    x =>
      x.ok
        ? x.json()
        : x.json().then(r => Promise.reject({ message: r.message }))
  );
};
