import * as express from "express";
// import { HORA, DIARIA, ATIVIDADE } from "../shared/tiposCobranca";
import * as pgPromise from "pg-promise";

// {
//   "nome": "aaaaaaaaaaa",
//   "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2F4eEBnbWFpbC5jb20iLCJyb2xlIjoicHJlc3RhZG9yIiwiaWF0IjoxNTExNTUzNjA3LCJleHAiOjE1MTE1NTcyMDd9.Rxyy60F3shL0tDT9IrAiYx3CynMK7S8fJqD7BJ51wAQ"
// }

interface RequestBody {
  descricao: String;
  lat: Number;
  lng: Number;
  valor: number;
  tipo: number;
}

interface Response {
  id: Number;
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

// const getTipovalor = (tipocobranca: number, body: RequestBody): string => {
//   if (tipocobranca === HORA) {
//     if (typeof body.valorhora !== "number")
//       throw Error("Valor do servico invalido");
//     return "valorhora";
//   } else if (tipocobranca === DIARIA) {
//     if (typeof body.valordiaria !== "number")
//       throw Error("Valor do servico invalido");
//     return "valordiaria";
//   } else if (tipocobranca === ATIVIDADE) {
//     if (typeof body.valoratividade !== "number")
//       throw Error("Valor do servico invalido");
//     return "valoratividade";
//   } else {
//     throw Error("Tipo de cobrança inválido");
//   }
// };

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  validateBody(req.body);
  const sendAnswer = (dbResponse: { id: number }) => {
    const response: Response = { id: dbResponse.id };
    res.json(response);
  };

  const handleError = res.locals.handleError;
  const body: RequestBody = req.body;
  const db: pgPromise.IDatabase<{}> = res.locals.db;
  const email = res.locals.email;

  const { tipo } = body;

  const handleRequest = async () => {
    try {
      // const { tipocobranca } = await db.one(
      //   "SELECT tipocobranca from ubermo.tipo where id = $1",
      //   [tipo]
      // );

      // const tipovalor = getTipovalor(tipocobranca, body);

      const { nota } = await db.one(
        "SELECT nota FROM ubermo.prestador WHERE email = $1",
        [email]
      );

      await db.tx(t =>
        t
          .any("SELECT tipo from ubermo.ofertado WHERE prestador = $1", [email])
          .then(r => {
            const ct = r && r.length;
            if (ct !== 0) {
              const index = r.map(x => x.tipo).indexOf(tipo);
              if (index !== -1) {
                throw Error("Usuario já oferece serviço deste tipo");
              }
            }
            if (ct && nota < 4.5 && ct >= 3) {
              throw Error("Usuario limitado a 3 servicos");
            } else if (ct && nota >= 4.5 && ct >= 10) {
              throw Error("Usuario limitado a 5 servicos");
            }
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
