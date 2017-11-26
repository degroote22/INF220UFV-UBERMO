import * as React from "react";
import {
  ofertadosPorPrestador,
  servicosPorPrestador,
  aceitaServico
} from "../http";
import {
  Oferta,
  Response as OfertasResponse
} from "../../../back/server/handlers/get/ofertasPorPrestador";

import {
  Servico,
  Response as ServicosResponse
} from "../../../back/server/handlers/get/servicosPorPrestador";
import statusMap from "./statusMap";
import * as Router from "react-router-dom";

interface State {
  ofertas: Oferta[];
  servicos: Servico[];
  aceitaModal: boolean;
  aceitaModalServico: Servico | null;
  aceitaLoading: boolean;
}

const initialState: State = {
  ofertas: [],
  servicos: [],
  aceitaModal: false,
  aceitaModalServico: null,
  aceitaLoading: false
};

const cobrancaMap = ["por hora", "por dia", "cobrança única"];
const cobrancaMap2 = ["horas", "dias", "unidade"];

const formatDate = (date: string | null): string => {
  if (date) {
    return new Date(date).toLocaleString();
  }
  return "";
};
class Gerenciar extends React.Component<
  {
    jwt: string;
    handleHttpError: (error: any) => void;
  },
  State
> {
  state = initialState;

  componentDidMount() {
    ofertadosPorPrestador(this.props.jwt)
      .then((response: OfertasResponse) => {
        this.setState({ ofertas: response.ofertas });
      })
      .catch(this.props.handleHttpError);

    servicosPorPrestador(this.props.jwt)
      .then((response: ServicosResponse) => {
        this.setState({ servicos: response.servicos });
      })
      .catch(this.props.handleHttpError);
  }

  renderOfertaCard = (oferta: Oferta) => (
    <div className="column is-4" key={oferta.id}>
      <div className="box">
        <h1 className="is-size-4">{oferta.nome}</h1>
        <h1 className="is-size-6">
          R${(oferta.valor / 100).toFixed(2)} {cobrancaMap[oferta.tipocobranca]}
        </h1>
        <h1 className="is-size-7">{oferta.contratacoes} contratações</h1>
      </div>
    </div>
  );

  renderTableHead = () => (
    <thead>
      <tr>
        <th>Nome</th>
        <th>Status</th>
        <th>Preço</th>
        <th>
          <abbr title="Quantidade">Qtd</abbr>
        </th>
        <th>Total</th>
        <th>
          <abbr title="Data do Pedido">DP</abbr>
        </th>
        <th>
          <abbr title="Data da Conclusão">DC</abbr>
        </th>
        <th>
          <abbr title="Nota dada">ND</abbr>
        </th>
        <th>
          <abbr title="Comentário dado">CD</abbr>
        </th>
        <th>
          <abbr title="Nota recebida">NR</abbr>
        </th>
        <th>
          <abbr title="Comentário recebido">CR</abbr>
        </th>
        <th>Gerenciar</th>
      </tr>
    </thead>
  );

  renderGerenciarButton = (s: Servico) => {
    if (s.status === 0) {
      const onClick = this.openAceitaModal(s);
      return (
        <div className="button is-link" onClick={onClick}>
          ACEITAR
        </div>
      );
    }
    if (s.status === 1) {
      return <div className="button is-success">FINALIZAR</div>;
    }
    return <div className="button">ERRO</div>;
  };

  renderTableRow = (s: Servico) => (
    <tr key={s.id}>
      <th>{s.nome}</th>
      <td>{statusMap[s.status]}</td>
      <td>R${(s.valor / 100).toFixed(2)}</td>
      <td>{s.quantidade}</td>
      <td>R${(s.valor * s.quantidade / 100).toFixed(2)}</td>
      <td>{formatDate(s.datapedido)}</td>
      <td>{formatDate(s.dataconclusao)}</td>
      <td>{s.notacliente}</td>
      <td>{s.comentariocliente}</td>
      <td>{s.notaprestador}</td>
      <td>{s.comentarioprestador}</td>
      <td>{this.renderGerenciarButton(s)}</td>
    </tr>
  );

  aceitaServico = () => {
    if (!this.state.aceitaModalServico) {
      return;
    }
    this.setState({ aceitaLoading: true });
    aceitaServico({ id: this.state.aceitaModalServico.id }, this.props.jwt)
      .then(({ id, status }) => {
        this.setState(state => ({
          ...state,
          aceitaLoading: false,
          aceitaModal: false,
          aceitaModalServico: null,
          servicos: state.servicos.map(s => {
            if (s.id === id) {
              return { ...s, status };
            } else return s;
          })
        }));
      })
      .catch(this.props.handleHttpError);
  };

  renderAceitaModal = () => {
    const s = this.state.aceitaModalServico;
    return s ? (
      <div
        className={["modal", this.state.aceitaModal ? "is-active" : ""].join(
          " "
        )}
        key="modal"
      >
        <div className="modal-background" onClick={this.closeAceitaModal} />
        <div className="modal-content">
          <div className="box">
            <p className="title">{s.nome}</p>
            <p className="subtitle">
              {s.quantidade} {cobrancaMap2[s.tipocobranca]} por R${(
                s.valor *
                s.quantidade /
                100
              ).toFixed(2)}
            </p>
            <hr />
            <nav className="level">
              <div className="level-left">
                <div className="level-item">
                  <button
                    disabled={this.state.aceitaLoading}
                    onClick={this.aceitaServico}
                    className="button is-success"
                  >
                    Aceitar
                  </button>
                </div>
                <div className="level-item">
                  <button disabled className="button is-danger">
                    Negar
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={this.closeAceitaModal}
        />
      </div>
    ) : null;
  };

  openAceitaModal = (s: Servico) => () =>
    this.setState({ aceitaModal: true, aceitaModalServico: s });
  closeAceitaModal = () =>
    this.setState({ aceitaModal: false, aceitaModalServico: null });

  render() {
    return [
      <section className="section" key="gerenciar">
        <div className="container">
          <nav className="level">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title">Suas ofertas</h1>
              </div>
              <div className="level-item">
                <Router.Link to="/prestador/criar" className="button is-link">
                  <span className="icon">
                    <i className="fa fa-plus" />
                  </span>
                  <span>OFERTAR OUTRO SERVIÇO</span>
                </Router.Link>
              </div>
            </div>
          </nav>
          <hr />
          <div className="columns is-multiline">
            {this.state.ofertas.map(this.renderOfertaCard)}
          </div>
        </div>
      </section>,
      !this.state.aceitaModal && (
        <section className="section" key="body">
          <div className="container">
            <h1 className="title">Gerenciar contratos</h1>
            <hr />
            <table className="table is-fullwidth">
              {this.renderTableHead()}
              <tbody>{this.state.servicos.map(this.renderTableRow)}</tbody>
            </table>
          </div>
        </section>
      ),
      this.renderAceitaModal()
    ];
  }
}

export default Gerenciar;
