import * as express from "express";
import * as pgPromise from "pg-promise";

export interface Oferta {
  id: number;
  nome: string;
  valor: number;
  tipocobranca: number;
  contratacoes: number;
}

export interface Response {
  ofertas: Oferta[];
}

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const db: pgPromise.IDatabase<{}> = res.locals.db;
    const email = res.locals.email;
    const todasOfertas = await db.any(
      `SELECT ofertado.id as id, tipo.nome, ofertado.valor, tipo.tipocobranca
    FROM ubermo.ofertado, ubermo.tipo
    WHERE ofertado.prestador = $1 AND tipo.id = ofertado.tipo
    GROUP BY ofertado.id, tipo.nome, tipo.tipocobranca`,
      [email]
    );

    await db
      .any(
        `SELECT ofertado.id as id, tipo.nome, ofertado.valor, tipo.tipocobranca, COUNT(*) as contratacoes
      FROM ubermo.ofertado, ubermo.tipo, ubermo.contratado
      WHERE ofertado.prestador = $1 AND tipo.id = ofertado.tipo AND contratado.servico = ofertado.id
      GROUP BY ofertado.id, tipo.nome, tipo.tipocobranca`,
        [email]
      )
      .then((contratados: Oferta[]) => {
        const response: Response = {
          ofertas: todasOfertas.map(oferta => {
            const contratado = contratados.find(x => x.id === oferta.id);
            const contratacoes = contratado ? contratado.contratacoes : 0;
            return {
              ...oferta,
              contratacoes
            };
          })
        };
        res.json(response);
      });
  } catch (err) {
    res.locals.handleError(err);
  }
};
