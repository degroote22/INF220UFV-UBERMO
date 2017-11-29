import * as React from "react";
import {
  ofertadosPorPrestador,
  servicosPorPrestador,
  aceitaServico,
  finalizaServico,
  prestador
} from "../http";
import {
  Oferta,
  Response as OfertasResponse
} from "../../../back/server/handlers/get/ofertasPorPrestador";

import {
  Servico,
  Response as ServicosResponse
} from "../../../back/server/handlers/get/servicosPorPrestador";

import { Prestador } from "../../../back/server/handlers/get/prestador";
import statusMap from "./statusMap";
import * as Router from "react-router-dom";
import timeago from "../timeago";

interface State {
  ofertas: Oferta[];
  servicos: Servico[];
  modal: boolean;
  modalServico: Servico | null;
  modalLoading: boolean;
  modalTipo: string;
  notaFinalizar: string;
  comentarioFinalizar: string;
  nota: number;
}

const MODAL_ACEITAR = "MODAL_ACEITAR";
const MODAL_FINALIZAR = "MODAL_FINALIZAR";

const initialState: State = {
  ofertas: [],
  servicos: [],
  nota: 1,
  modal: false,
  modalServico: null,
  modalLoading: false,
  modalTipo: "",
  notaFinalizar: "1",
  comentarioFinalizar: ""
};

const cobrancaMap = ["por hora", "por dia", "cobrança única"];
const cobrancaMap2 = ["horas", "dias", "unidade"];

class Gerenciar extends React.Component<
  {
    jwt: string;
    email: string;
    handleHttpError: (error: any) => void;
  },
  State
> {
  state = initialState;

  componentDidMount() {
    prestador(this.props.email, this.props.jwt)
      .then((response: Prestador) => this.setState({ nota: response.nota }))
      .catch(this.props.handleHttpError);

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

  podeCriarMais = () => {
    return this.state.nota > 3
      ? this.state.ofertas.length < 5
      : this.state.ofertas.length < 3;
  };

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
          <abbr title="Nota recebida">NR</abbr>
        </th>
        <th>Gerenciar</th>
      </tr>
    </thead>
  );

  renderGerenciarButton = (s: Servico) => {
    if (s.status === 0) {
      const onClick = this.openAceitaModal(s);
      return (
        <button className="button is-link" onClick={onClick}>
          ACEITAR
        </button>
      );
    }
    if (s.status === 1) {
      const onClick = this.openFinalizaModal(s);
      return (
        <button onClick={onClick} className="button is-success">
          FINALIZAR
        </button>
      );
    }
    return null;
  };

  renderTableRow = (s: Servico) => (
    <tr key={s.id}>
      <th>{s.nome}</th>
      <td>{statusMap[s.status]}</td>
      <td>R${(s.valor / 100).toFixed(2)}</td>
      <td>{s.quantidade}</td>
      <td>R${(s.valor * s.quantidade / 100).toFixed(2)}</td>
      <td>{timeago(s.datapedido)}</td>
      <td>{timeago(s.dataconclusao)}</td>
      <td>{s.notacliente}</td>
      <td>{s.notaprestador}</td>
      <td>{this.renderGerenciarButton(s)}</td>
    </tr>
  );

  aceitaServico = () => {
    if (!this.state.modalServico || this.state.modalTipo === "") {
      return;
    }

    this.setState({ modalLoading: true });
    aceitaServico({ id: this.state.modalServico.id }, this.props.jwt)
      .then(({ id, status }) => {
        this.setState(state => ({
          ...state,
          modalLoading: false,
          modal: false,
          modalServico: null,
          servicos: state.servicos.map(s => {
            if (s.id === id) {
              return { ...s, status };
            } else return s;
          })
        }));
      })
      .catch(err => {
        this.setState({ modalLoading: false });
        this.props.handleHttpError(err);
      });
  };

  finalizaServico = () => {
    if (!this.state.modalServico || this.state.modalTipo === "") {
      return;
    }

    this.setState({ modalLoading: true });
    finalizaServico(
      {
        id: this.state.modalServico.id,
        notacliente: parseInt(this.state.notaFinalizar, 10),
        comentariocliente: this.state.comentarioFinalizar
      },
      this.props.jwt
    )
      .then(({ id, status }) => {
        this.setState(state => ({
          ...state,
          modalLoading: false,
          modal: false,
          modalServico: null,
          notaFinalizar: 1,
          comentarioFinalizar: "",
          servicos: state.servicos.map(s => {
            if (s.id === id) {
              return {
                ...s,
                status,
                notacliente: state.notaFinalizar,
                comentariocliente: state.comentarioFinalizar,
                dataconclusao: new Date().toString()
              };
            } else return s;
          })
        }));
      })
      .catch(err => {
        this.setState({ modalLoading: false });
        this.props.handleHttpError(err);
      });
  };

  onComentarioChange = (event: any) =>
    this.setState({ comentarioFinalizar: event.target.value });
  onNotaChange = (event: any) =>
    this.setState({ notaFinalizar: event.target.value });

  renderAvaliacaoInput = () =>
    this.state.modalTipo === MODAL_FINALIZAR
      ? [
          <div className="field" key="senha">
            <label className="label is-link">Nota</label>
            <div className="select">
              <select
                value={this.state.notaFinalizar}
                onChange={this.onNotaChange}
                disabled={this.state.modalLoading}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>,
          <div className="field" key="email">
            <label className="label">Comentário</label>
            <div className="control">
              <textarea
                className="textarea is-link"
                value={this.state.comentarioFinalizar}
                disabled={this.state.modalLoading}
                onChange={this.onComentarioChange}
              />
            </div>
          </div>
        ]
      : null;

  renderAceitaModal = () => {
    const s = this.state.modalServico;
    return s ? (
      <div
        className={["modal", this.state.modal ? "is-active" : ""].join(" ")}
        key="modal"
      >
        <div className="modal-background" onClick={this.closeModal} />
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
            {this.renderAvaliacaoInput()}
            <nav className="level">
              <div className="level-left">
                <div className="level-item">
                  <button
                    disabled={this.state.modalLoading}
                    onClick={
                      this.state.modalTipo === MODAL_ACEITAR
                        ? this.aceitaServico
                        : this.finalizaServico
                    }
                    className="button is-success"
                  >
                    {this.state.modalTipo === MODAL_ACEITAR
                      ? "ACEITAR"
                      : "FINALIZAR"}
                  </button>
                </div>
                <div className="level-item">
                  <button disabled className="button is-danger">
                    {this.state.modalTipo === MODAL_ACEITAR
                      ? "NEGAR"
                      : "INFORMAR PROBLEMA"}
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={this.closeModal}
        />
      </div>
    ) : null;
  };

  openAceitaModal = (s: Servico) => () =>
    this.setState({ modalTipo: MODAL_ACEITAR, modal: true, modalServico: s });

  openFinalizaModal = (s: Servico) => () =>
    this.setState({ modalTipo: MODAL_FINALIZAR, modal: true, modalServico: s });

  closeModal = () =>
    this.setState({ modalTipo: "", modal: false, modalServico: null });

  render() {
    const Wrapper = this.podeCriarMais() ? Router.Link : "div";
    return [
      <section className="section" key="gerenciar">
        <div className="container">
          <nav className="level">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title">Suas ofertas</h1>
              </div>
              <div className="level-item">
                <Wrapper to="/prestador/criar">
                  <button
                    disabled={!this.podeCriarMais()}
                    className="button is-link"
                  >
                    <span className="icon">
                      <i className="fa fa-plus" />
                    </span>
                    <span>OFERTAR OUTRO SERVIÇO</span>
                  </button>
                </Wrapper>
              </div>
            </div>
          </nav>
          <hr />
          <div className="columns is-multiline">
            {this.state.ofertas.map(this.renderOfertaCard)}
          </div>
        </div>
      </section>,
      !this.state.modal && (
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
