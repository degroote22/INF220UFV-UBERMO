import endpoint from "./endpoint";
import { RequestBody as RequestBodyLogin } from "../../../back/server/handlers/post/login";
import { Response as ResponseMaisContratados } from "../../../back/server/handlers/get/servicosMaisContratados";
import { Response as ResponsePorCliente } from "../../../back/server/handlers/get/servicosPorCliente";
import { RequestBody as BodyCliente } from "../../../back/server/handlers/post/cadastraCliente";
import { RequestBody as BodyPrestador } from "../../../back/server/handlers/post/cadastraPrestador";
import { LoginResponse } from "../../../back/server/handlers/shared/login";

export const loginPrestador = (email: string, senha: string) => {
  const body: RequestBodyLogin = {
    email,
    senha
  };
  return postInjected("loginprestador", body);
};

export const loginCliente = (email: string, senha: string) => {
  const body: RequestBodyLogin = {
    email,
    senha
  };
  return postInjected("logincliente", body);
};

export const servicosMaisContratados = (
  limit: number
): Promise<ResponseMaisContratados> =>
  getInjected("servicosmaiscontratados?limit=" + limit);

export const servicosPorCliente = (jwt: string): Promise<ResponsePorCliente> =>
  getInjected("servicosporcliente", jwt);

export const cadastraCliente = (payload: BodyCliente): Promise<LoginResponse> =>
  postInjected("cadastracliente", payload);

export const cadastraPrestador = (
  payload: BodyPrestador
): Promise<LoginResponse> => postInjected("cadastraprestador", payload);

const makePostHeaders = (jwt?: string) =>
  jwt
    ? [
        ["Accept", "application/json"],
        ["Content-Type", "application/json"],
        ["Authorization", jwt]
      ]
    : [["Accept", "application/json"], ["Content-Type", "application/json"]];

const postInjected = (path: string, body: object, jwt?: string): Promise<any> =>
  fetch(endpoint + path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: makePostHeaders(jwt)
  }).then(
    x =>
      x.ok
        ? x.json()
        : x.json().then((r: any) => Promise.reject({ message: r.message }))
  );

const makeGetConfig = (jwt?: string) =>
  jwt ? { headers: [["Authorization", jwt]] } : {};

const getInjected = (path: string, jwt?: string): Promise<any> =>
  fetch(endpoint + path, makeGetConfig(jwt)).then(
    x =>
      x.ok
        ? x.json()
        : x.json().then(r => Promise.reject({ message: r.message }))
  );
