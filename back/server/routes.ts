import * as express from "express";
import handlers from "./handlers";
const router = express.Router();

// POST
router.post("/cadastracliente", handlers.cadastraCliente);
router.post("/cadastraprestador", handlers.cadastraPrestador);
router.post("/cadastraServico", handlers.cadastraServico);
router.post("/logincliente", handlers.loginCliente);
router.post("/loginprestador", handlers.loginPrestador);
router.post("/loginadmin", handlers.loginAdmin);

// ofereceServico
// requisitaServico

// GET
// GET
// GET

// /prestadores?tipo(ordenado decrescente)
router.get(
  "/prestadores",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.json({ message: "t" });
  }
);

// /servicosporcliente
router.get(
  "/servicosporcliente",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.json({ message: "t" });
  }
);

// /financacliente
router.get(
  "/financacliente",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.json({ message: "t" });
  }
);

// /financaprestador
router.get(
  "/financaprestador",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.json({ message: "t" });
  }
);

// /servicosmaisprocurados?numero
router.get(
  "/servicosmaisprocurados",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.json({ message: "t" });
  }
);

// /clientesporcontratacoes?tipo
router.get(
  "/clientesporcontratacoes",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.json({ message: "t" });
  }
);

// +1...

export = router;
