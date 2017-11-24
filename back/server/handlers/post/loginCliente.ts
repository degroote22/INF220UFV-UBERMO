import * as express from "express";
import { validaEmail } from "../shared/email";
import { validaSenha } from "../shared/senha";
import { LoginResponse } from "../shared/login";
import secret from "../shared/secret";
import * as pgPromise from "pg-promise";
import * as jwt from "jsonwebtoken";
import { jwtResponse } from "../shared/jwt";

// {
// 	"senha": "abcbcbcbc",
// 	"email": "asdasdasdasdasdasd",
// }

// {
//   "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGFzZGFzZGFzZGFzZGFzZCIsImlhdCI6MTUxMTQ5NDcxMiwiZXhwIjoxNTExNDk4MzEyfQ.i3IkQCTgSGg7CbtC_AzB4subBzwOFvGuBU4qfZdBT1Y",
//   "nome": "aaaaaaaaaaa"
// }

interface RequestBody {
  email: string;
  senha: string;
}

const validateBody = (body: RequestBody) => {
  const { email, senha } = body;
  validaEmail(email);
  validaSenha(senha);
};

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  validateBody(req.body);
  const db: pgPromise.IDatabase<{}> = res.locals.db;
  const body: RequestBody = req.body;

  db
    .any("SELECT hash, nome FROM ubermo.cliente where email = $1", [body.email])
    .then((r: any) => {
      if (!r[0] || !r[0].hash) throw Error("E-mail não existe");

      db
        .one("SELECT * from crypt($1, $2) as hash", [body.senha, r[0].hash])
        .then(r2 => {
          if (r2.hash === r[0].hash) {
            const jwtr: jwtResponse = { email: body.email, role: "cliente" };

            const response: LoginResponse = {
              jwt: jwt.sign(jwtr, secret, { expiresIn: "1h" }),
              nome: r[0].nome
            };
            res.json(response);
          } else {
            res.status(500);
            res.json({ message: "Senha errada" });
          }
        })
        .catch(err => {
          res.status(500);
          res.json(err);
        });
    })
    .catch(err => {
      res.status(500);
      res.json({ message: err.message });
    });
};
