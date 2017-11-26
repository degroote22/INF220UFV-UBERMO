import * as express from "express";
import handlers from "./handlers";
import barrier from "./barrier";

const router = express.Router();

// POST
router.post("/cadastracliente", handlers.cadastraCliente);
router.post("/cadastraprestador", handlers.cadastraPrestador);
router.post("/cadastratipo", barrier("admin"), handlers.cadastraTipo);
router.post("/logincliente", handlers.loginCliente);
router.post("/loginprestador", handlers.loginPrestador);
router.post("/loginadmin", handlers.loginAdmin);
router.post("/ofereceservico", barrier("prestador"), handlers.ofereceServico);
router.post("/requisitaservico", barrier("cliente"), handlers.requisitaServico);
router.post("/aceitaservico", barrier("prestador"), handlers.aceitaServico);
router.post("/finalizaservico", barrier("prestador"), handlers.finalizaServico);
router.post("/clienteavalia", barrier("cliente"), handlers.clienteAvalia);

// GET
router.get("/prestadores", handlers.prestadores);
router.get(
  "/servicosporcliente",
  barrier("cliente"),
  handlers.servicosPorCliente
);
router.get("/clientesmaiscontratacoes", handlers.clientesMaisContratacoes);
router.get("/servicosmaiscontratados", handlers.servicosMaisContratados); //
router.get("/financacliente", barrier("cliente"), handlers.financaCliente);
router.get(
  "/financaprestador",
  barrier("prestador"),
  handlers.financaPrestador
);
router.get("/tipos", handlers.tipos);
router.get("/tiposofertados", handlers.tiposOfertados);
router.get("/servicosportipo", handlers.servicosPorTipo);
router.get("/servico", handlers.servico);
router.get("/contrato", barrier("cliente"), handlers.contrato);
router.get(
  "/servicosporprestador",
  barrier("prestador"),
  handlers.servicosPorPrestador
);
router.get(
  "/ofertadosporprestador",
  barrier("prestador"),
  handlers.ofertasPorPrestador
);
router.get(
  "/v",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.json({ message: res.locals.config, v: "v3" });
  }
);

export = router;
