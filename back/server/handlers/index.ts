import cadastraCliente from "./post/cadastraCliente";
import cadastraPrestador from "./post/cadastraPrestador";
import cadastraTipo from "./post/cadastraTipo";
import loginCliente from "./post/loginCliente";
import loginAdmin from "./post/loginAdmin";
import loginPrestador from "./post/loginPrestador";
import ofereceServico from "./post/ofereceServico";
import requisitaServico from "./post/requisitaServico";
import prestadores from "./get/prestadores";
import servicosPorCliente from "./get/servicosPorCliente";
import clientesMaisContratacoes from "./get/clientesMaisContratacoes";
import servicosMaisContratados from "./get/servicosMaisContratados";
import financaCliente from "./get/financaCliente";
import financaPrestador from "./get/financaPrestador";

export default {
  cadastraCliente,
  cadastraPrestador,
  cadastraTipo,
  loginCliente,
  loginAdmin,
  loginPrestador,
  ofereceServico,
  requisitaServico,
  prestadores,
  servicosPorCliente,
  clientesMaisContratacoes,
  servicosMaisContratados,
  financaCliente,
  financaPrestador
};
