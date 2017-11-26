import * as React from "react";
import { servicosPorTipo } from "../http";
import {
  Response,
  Servico
} from "../../../back/server/handlers/get/servicosPorTipo";
import * as Router from "react-router-dom";

const tiposCobranca = ["por hora", "por dia", "pagamento único"];

class Oferta extends React.Component<{
  servico: Servico;
  tipocobranca: number;
}> {
  render() {
    const { servico } = this.props;
    return (
      <div className="column is-4">
        <div className="box">
          <p className="title">R${(servico.valor / 100).toFixed(2)}</p>
          <p className="subtitle">{tiposCobranca[this.props.tipocobranca]}</p>
          <p className="is-size-6">{servico.descricao}</p>
          <hr />
          <Router.Link to={`/cliente/servico/${servico.id}`} className="button">
            Veja mais
          </Router.Link>
        </div>
      </div>
    );
  }
}

interface State {
  nome: string;
  tipocobranca: number;
  servicos: Servico[];
}
const initialState: State = { nome: "", tipocobranca: 0, servicos: [] };
class ServicosPorTipo extends React.Component<
  {
    handleHttpError: (error: any) => void;
  },
  State
> {
  state = initialState;
  componentDidMount() {
    const tipo = parseInt((this.props as any).match.params.id, 10);
    servicosPorTipo(tipo)
      .then((response: Response) => {
        this.setState(response);
      })
      .catch(err => {
        this.props.handleHttpError(err);
      });
  }
  render() {
    return (
      <div className="container" key="dados">
        <section className="section">
          <div className="container">
            <h3 className="title">{this.state.nome}</h3>
            <h5 className="subtitle">{this.state.servicos.length} ofertas</h5>
            <div className="columns">
              {this.state.servicos.map(s => (
                <Oferta
                  servico={s}
                  key={s.id}
                  tipocobranca={this.state.tipocobranca}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default ServicosPorTipo;
