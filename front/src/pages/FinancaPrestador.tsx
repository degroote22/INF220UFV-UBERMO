import * as React from "react";
import { financaPrestador } from "../http";
import {
  Report,
  Response as FinancaResponse
} from "../../../back/server/handlers/get/financaPrestador";
// import timeago from "../timeago";

interface State {
  hoje: Report[];
  semana: Report[];
  mes: Report[];
  ano: Report[];
}

const initialState: State = {
  hoje: [],
  semana: [],
  mes: [],
  ano: []
};

const unidadesMap = ["horas", "dias", "unidades"];

const getSum = (arr: Report[]) =>
  (
    arr.reduce((prev, curr) => prev + curr.quantidade * curr.valor, 0) /
    100 *
    0.95
  ).toFixed(2);

class FinancaPrestador extends React.Component<
  {
    jwt: string;
    handleHttpError: (error: any) => void;
  },
  State
> {
  state = initialState;
  componentDidMount() {
    financaPrestador(this.props.jwt)
      .then((response: FinancaResponse) => {
        this.setState({
          hoje: response.hoje,
          semana: response.semana,
          mes: response.mes,
          ano: response.ano
        });
      })
      .catch(this.props.handleHttpError);
  }

  renderTableHead = () => (
    <thead>
      <tr>
        <th>Contratos</th>
        <th>Nome</th>
        <th>Preço</th>
        <th>Unidades</th>
        <th>Total (-5%)</th>
      </tr>
    </thead>
  );

  renderTableRow = (r: Report) => (
    <tr key={r.id}>
      <td>{r.contratacoes}</td>
      <td>{r.nome}</td>
      <td>R${(r.valor / 100).toFixed(2)}</td>
      <td>
        {r.quantidade} {unidadesMap[r.tipocobranca]}
      </td>
      <td>R${(r.valor * r.quantidade / 100 * 0.95).toFixed(2)}</td>
    </tr>
  );

  render() {
    return (
      <section className="section" key="gerenciar">
        <div className="container">
          <h1 className="title">Hoje</h1>
          <h1 className="subtitle">Total (-5%): R${getSum(this.state.hoje)}</h1>
          <table className="table is-fullwidth">
            {this.renderTableHead()}
            <tbody>{this.state.hoje.map(this.renderTableRow)}</tbody>
          </table>
          <hr />
          <h1 className="title">Semana</h1>
          <h1 className="subtitle">
            Total (-5%): R${getSum(this.state.semana)}
          </h1>
          <table className="table is-fullwidth">
            {this.renderTableHead()}
            <tbody>{this.state.semana.map(this.renderTableRow)}</tbody>
          </table>
          <hr />
          <h1 className="title">Mês</h1>
          <h1 className="subtitle">Total (-5%): R${getSum(this.state.mes)}</h1>
          <table className="table is-fullwidth">
            {this.renderTableHead()}
            <tbody>{this.state.mes.map(this.renderTableRow)}</tbody>
          </table>
          <hr />
          <h1 className="title">Ano</h1>
          <h1 className="subtitle">Total (-5%): R${getSum(this.state.ano)}</h1>
          <table className="table is-fullwidth">
            {this.renderTableHead()}
            <tbody>{this.state.ano.map(this.renderTableRow)}</tbody>
          </table>
          <hr />
        </div>
      </section>
    );
  }
}
export default FinancaPrestador;
