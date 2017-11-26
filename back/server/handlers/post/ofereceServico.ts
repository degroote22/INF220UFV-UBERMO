import * as express from "express";
import * as pgPromise from "pg-promise";

export interface RequestBody {
  descricao: string;
  lat: number;
  lng: number;
  valor: number;
  tipo: number;
}

export interface Response {
  id: number;
}

const validateBody = (body: RequestBody) => {
  const { descricao, lat, lng, valor, tipo } = body;

  if (
    typeof descricao !== "string" ||
    typeof lat !== "number" ||
    typeof lng !== "number" ||
    typeof tipo !== "number"
  )
    throw Error("Serviço inválido");

  if (typeof valor !== "number") throw Error("Valor de cobrança inexistente");
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  validateBody(req.body);

  const handleError = res.locals.handleError;
  const body: RequestBody = req.body;
  const db: pgPromise.IDatabase<{}> = res.locals.db;
  const email = res.locals.email;

  const { tipo } = body;

  const handleRequest = async () => {
    try {
      const { nota } = await db.one(
        "SELECT nota FROM ubermo.prestador WHERE email = $1",
        [email]
      );

      await db.tx(t =>
        t
          .any("SELECT tipo from ubermo.ofertado WHERE prestador = $1", [email])
          .then(r => {
            validateArgs(r, tipo, nota);
            const sendAnswer = (dbResponse: { id: number }) => {
              const response: Response = { id: dbResponse.id };
              res.json(response);
            };
            return t
              .one(
                "INSERT INTO ubermo.ofertado(prestador, tipo, descricao, lat, lng, valor) " +
                  "values ($1, $2, $3, $4, $5, $6) RETURNING id",
                [email, tipo, body.descricao, body.lat, body.lng, body.valor]
              )
              .then(sendAnswer);
          })
      );
    } catch (err) {
      handleError(err);
    }
  };
  handleRequest();
};

function validateArgs(r: any[], tipo: number, nota: any) {
  const ct = r && r.length;
  if (ct !== 0) {
    const index = r.map(x => x.tipo).indexOf(tipo);
    if (index !== -1) {
      throw Error("Usuario já oferece serviço deste tipo");
    }
  }
  if (ct && nota < 4.5 && ct >= 3) {
    throw Error("Usuario limitado a 3 servicos");
  } else if (ct && nota >= 4.5 && ct >= 5) {
    throw Error("Usuario limitado a 5 servicos");
  }
}
