import cadastraCliente from "./post/cadastraCliente";
import cadastraPrestador from "./post/cadastraPrestador";
import cadastraTipo from "./post/cadastraTipo";
import login from "./post/login";
import ofereceServico from "./post/ofereceServico";
import requisitaServico from "./post/requisitaServico";
import prestadores from "./get/prestadores";
import servicosPorCliente from "./get/servicosPorCliente";
import clientesMaisContratacoes from "./get/clientesMaisContratacoes";
import servicosMaisContratados from "./get/servicosMaisContratados";
import financaCliente from "./get/financaCliente";
import financaPrestador from "./get/financaPrestador";
import tipos from "./get/tipos";
import servicosPorTipo from "./get/servicosPorTipo";
import servico from "./get/servico";

export default {
  cadastraCliente,
  cadastraPrestador,
  cadastraTipo,
  loginCliente: login("cliente"),
  loginAdmin: login("admin"),
  loginPrestador: login("prestador"),
  ofereceServico,
  requisitaServico,
  prestadores,
  servicosPorCliente,
  clientesMaisContratacoes,
  servicosMaisContratados,
  financaCliente,
  financaPrestador,
  tipos,
  servicosPorTipo,
  servico
};
