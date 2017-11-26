import endpoint from "./endpoint";
import { RequestBody as RequestBodyLogin } from "../../../back/server/handlers/post/login";
import { Response as ResponseMaisContratados } from "../../../back/server/handlers/get/servicosMaisContratados";
import { Response as ResponsePorCliente } from "../../../back/server/handlers/get/servicosPorCliente";
import { RequestBody as BodyCliente } from "../../../back/server/handlers/post/cadastraCliente";
import { RequestBody as BodyPrestador } from "../../../back/server/handlers/post/cadastraPrestador";
import {
  RequestBody as BodyRequisitaServico,
  Response as RequisitaResponse
} from "../../../back/server/handlers/post/requisitaServico";
import { LoginResponse } from "../../../back/server/handlers/shared/login";
import { Response as TiposReponse } from "../../../back/server/handlers/get/tipos";
import { Response as FincancaResponse } from "../../../back/server/handlers/get/financaCliente";
import { RequestBody as CadastraTipoRequest } from "../../../back/server/handlers/post/cadastraTipo";

export const loginAdmin = (email: string, senha: string) => {
  const body: RequestBodyLogin = {
    email,
    senha
  };
  return postInjected("loginadmin", body);
};

export const cadastraTipo = (body: CadastraTipoRequest, jwt: string) =>
  postInjected("cadastratipo", body, jwt);

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

export const contrato = (id: number, jwt: string) =>
  getInjected("contrato?id=" + String(id), jwt);

export const requisitaServico = (
  body: BodyRequisitaServico,
  jwt: string
): Promise<RequisitaResponse> => postInjected("requisitaservico", body, jwt);

export const financaCliente = (jwt: string): Promise<FincancaResponse> =>
  getInjected("financacliente", jwt);

export const tipos = (): Promise<TiposReponse> => getInjected("tipos");

export const servico = (id: number | string) =>
  getInjected("servico?id=" + String(id));

export const servicosPorTipo = (tipo: number | string) =>
  getInjected("servicosportipo?tipo=" + String(tipo));

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
