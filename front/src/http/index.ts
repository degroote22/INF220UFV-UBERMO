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
import { Response as TiposOfertadosReponse } from "../../../back/server/handlers/get/tiposOfertados";
import { Response as TiposResponse } from "../../../back/server/handlers/get/tipos";
import { Response as FincancaResponse } from "../../../back/server/handlers/get/financaCliente";
import { RequestBody as CadastraTipoRequest } from "../../../back/server/handlers/post/cadastraTipo";
import { Request as AceitaServicoBody } from "../../../back/server/handlers/post/aceitaServico";
import { Request as FinalizaServicoBody } from "../../../back/server/handlers/post/finalizaServico";
import { Request as ClienteAvaliaBody } from "../../../back/server/handlers/post/clienteAvalia";
import { RequestBody as PrestadorOfereceBody } from "../../../back/server/handlers/post/ofereceServico";
import { Request as criarEnderecoRequest } from "../../../back/server/handlers/post/criarEndereco";

export const loginAdmin = (email: string, senha: string) => {
  const body: RequestBodyLogin = {
    email,
    senha
  };
  return postInjected("loginadmin", body);
};

export const criarEndereco = (body: criarEnderecoRequest, jwt: string) =>
  postInjected("criarendereco", body, jwt);

export const enderecos = (jwt: string) => getInjected("enderecos", jwt);

export const prestador = (email: string, jwt: string) =>
  getInjected("prestador?email=" + email, jwt);

export const ofereceServico = (body: PrestadorOfereceBody, jwt: string) =>
  postInjected("ofereceservico", body, jwt);

export const clienteAvalia = (body: ClienteAvaliaBody, jwt: string) =>
  postInjected("clienteavalia", body, jwt);

export const financaPrestador = (jwt: string) =>
  getInjected("financaprestador", jwt);

export const financaAdmin = (jwt: string) => getInjected("financaadmin", jwt);

export const finalizaServico = (body: FinalizaServicoBody, jwt: string) =>
  postInjected("finalizaservico", body, jwt);

export const aceitaServico = (body: AceitaServicoBody, jwt: string) =>
  postInjected("aceitaservico", body, jwt);

export const servicosPorPrestador = (jwt: string) =>
  getInjected("servicosporprestador", jwt);

export const ofertadosPorPrestador = (jwt: string) =>
  getInjected("ofertadosporprestador", jwt);

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

export const tiposOfertados = (): Promise<TiposOfertadosReponse> =>
  getInjected("tiposofertados");

export const tipos = (): Promise<TiposResponse> => getInjected("tipos");

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
