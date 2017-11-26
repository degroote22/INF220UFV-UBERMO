import * as express from "express";
import * as pgPromise from "pg-promise";
// import { HORA, DIARIA, ATIVIDADE } from "../shared/tiposCobranca";

// interface Query {
//   prestador: string;
// }

export interface Report {
  contratacoes: number;
  id: number;
  nome: string;
  tipocobranca: number;
  valor: number;
  quantidade: number;
}

export interface Response {
  // servicos: ServicoContratado[];
  hoje: Report[];
  semana: Report[];
  mes: Report[];
  ano: Report[];
}

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const email = res.locals.email;

    const db: pgPromise.IDatabase<{}> = res.locals.db;

    const getByTime = (days: number) =>
      db
        .any(
          `SELECT COUNT(*) as contratacoes, SUM(contratado.quantidade) as quantidade, 
          ofertado.id, tipo.nome, tipo.tipocobranca, ofertado.valor 
          FROM ubermo.contratado, ubermo.ofertado, ubermo.tipo
          WHERE contratado.servico = ofertado.id AND ofertado.prestador = $1 AND ofertado.tipo = tipo.id 
          AND contratado.datapedido >= NOW() - interval '${String(days)} day' 
          GROUP BY ofertado.id, tipo.nome, tipo.tipocobranca 
          `,
          [email]
        )
        .then((r: any[]): Report[] =>
          r.map((response: any): Report => ({
            contratacoes: response.contratacoes,
            quantidade: response.quantidade,
            valor: response.valor,
            id: response.id,
            nome: response.nome,
            tipocobranca: response.tipocobranca
          }))
        );

    const hoje = await getByTime(1);
    const semana = await getByTime(7);
    const mes = await getByTime(30);
    const ano = await getByTime(365);

    const response: Response = {
      hoje,
      semana,
      mes,
      ano
    };
    res.json(response);
  } catch (err) {
    res.locals.handleError(err);
  }
};
