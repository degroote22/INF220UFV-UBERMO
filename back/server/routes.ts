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
router.post("/ofereceservico", handlers.ofereceServico);
router.post("/requisitaservico", handlers.requisitaServico);

// GET
router.get("/prestadores", handlers.prestadores);
router.get("/servicosporcliente", handlers.servicosPorCliente);
router.get("/clientesmaiscontratacoes", handlers.clientesMaisContratacoes);
router.get("/servicosmaiscontratados", handlers.servicosMaisContratados);
router.get("/financacliente", handlers.financaCliente);
router.get("/financaprestador", handlers.financaPrestador);

// handler de aceitar o servico
// handler de dar notas e falar que acabou

export = router;
