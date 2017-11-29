import * as React from "react";
import {
  servicosMaisContratados,
  servicosPorCliente,
  tiposOfertados,
  financaCliente,
  clienteAvalia
} from "../http";
import { TipoServico } from "../../../back/server/handlers/get/servicosMaisContratados";
import { ServicoContratado } from "../../../back/server/handlers/get/servicosPorCliente";
import { TipoOfertas } from "../../../back/server/handlers/get/tiposOfertados";
import * as Router from "react-router-dom";
import ServicosPorTipo from "./ServicosPorTipo";
import Servico from "./Servico";
import NovoEndereco from "./NovoEndereco";
import Contrato from "./Contrato";
import { Response as FincancaResponse } from "../../../back/server/handlers/get/financaCliente";
import statusMap from "./statusMap";
import timeago from "../timeago";
const cobrancaMap2 = ["horas", "dias", "unidade"];

export interface ModalServico {
  id: number;
  valor: number;
  quantidade: number;
  tipocobranca: number;
}
const initialServico: ModalServico = {
  id: 0,
  valor: 0,
  quantidade: 0,
  tipocobranca: 0
};

class Cliente extends React.Component<
  {
    nome: string;
    onLogoutClick: () => void;
    jwt: string;
    handleHttpError: (error: any) => void;
  },
  {
    maisContratados: TipoServico[];
    porCliente: ServicoContratado[];
    todosTipos: TipoOfertas[];
    financa: FincancaResponse;
    modal: boolean;
    modalLoading: boolean;
    modalServico: ModalServico;
    notaFinalizar: string;
    comentarioFinalizar: string;
  }
> {
  state = {
    maisContratados: [],
    porCliente: [],
    todosTipos: [],
    financa: {
      hoje: 0,
      semana: 0,
      mes: 0,
      ano: 0
    },
    modal: false,
    modalLoading: false,
    modalServico: initialServico,
    notaFinalizar: "1",
    comentarioFinalizar: ""
  };

  refreshData = () => {
    financaCliente(this.props.jwt)
      .then(response => this.setState({ financa: response }))
      .catch(this.props.handleHttpError);

    servicosPorCliente(this.props.jwt)
      .then(response => this.setState({ porCliente: response.servicos }))
      .catch(this.props.handleHttpError);

    servicosMaisContratados(6)
      .then(response => this.setState({ maisContratados: response.tipos }))
      .catch(this.props.handleHttpError);

    tiposOfertados()
      .then(response => this.setState({ todosTipos: response.tipos }))
      .catch(this.props.handleHttpError);
  };

  componentDidMount() {
    this.refreshData();
  }

  renderDadosBotao = () => (
    <Router.Link
      onClick={this.refreshData}
      to={"/cliente/dados"}
      style={{ marginRight: 32 }}
      className="button is-outlined has-text-primary is-large"
    >
      MEUS DADOS
    </Router.Link>
  );

  renderContratarBotao = () => (
    <Router.Link
      to={"/cliente"}
      style={{ marginRight: 32 }}
      className="button is-outlined has-text-primary is-large"
    >
      CONTRATAR SERVIÇOS
    </Router.Link>
  );
  renderVoltarBotao = () => (
    <Router.Link
      to={"/cliente"}
      style={{ marginRight: 32 }}
      className="button is-outlined has-text-primary is-large"
    >
      VOLTAR
    </Router.Link>
  );

  renderHero = () => (
    <section className="hero is-primary" key="Hero">
      <div className="hero-body">
        <div className="container">
          <div className="columns">
            <div className="column has-text-centered-mobile">
              <h1 className="title">UBERmo</h1>
              <h2 className="subtitle">Logado como: {this.props.nome}</h2>
            </div>
            <div className="column has-text-right">
              <Router.Switch>
                <Router.Route
                  path="/cliente/dados"
                  component={this.renderContratarBotao}
                />
                <Router.Route
                  exact
                  path="/cliente"
                  component={this.renderDadosBotao}
                />
                <Router.Route
                  path="/cliente"
                  component={this.renderVoltarBotao}
                />
              </Router.Switch>
              <a
                onClick={this.props.onLogoutClick}
                className="button is-outlined has-text-primary is-large"
              >
                SAIR
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  renderMaisContratadoBox = (
    nome: string,
    contratacoes: number,
    id: number
  ) => (
    <div className="column is-4" key={id}>
      <div className="box" key={id}>
        <p className="is-size-4">{nome}</p>
        <p className="is-size-6">{contratacoes} contratações</p>
        <hr />
        <Router.Link to={`/cliente/tipo/${id}`} className="button">
          Veja mais
        </Router.Link>
      </div>
    </div>
  );

  renderTodosTiposBox = (nome: string, ofertados: number, id: number) => (
    <div className="column is-4" key={id}>
      <div className="box" key={id}>
        <p className="is-size-4">{nome}</p>
        <p className="is-size-6">{ofertados} ofertados</p>
        <hr />
        <Router.Link to={`/cliente/tipo/${id}`} className="button">
          Veja mais
        </Router.Link>
      </div>
    </div>
  );

  renderPesquisar = () => (
    <div className="container" key="maiscontratados">
      <section className="section">
        <div className="container">
          <h3 className="title">Os mais contratados</h3>
        </div>
      </section>
      <div className="columns is-multiline">
        {this.state.maisContratados.map((tipo: TipoServico) =>
          this.renderMaisContratadoBox(tipo.nome, tipo.contratacoes, tipo.id)
        )}
      </div>
      <section className="section">
        <div className="container">
          <h3 className="title">Todos os serviços</h3>
        </div>
      </section>
      <div className="columns is-multiline">
        {this.state.todosTipos.map((tipo: TipoOfertas) =>
          this.renderTodosTiposBox(tipo.nome, tipo.ofertados, tipo.id)
        )}
      </div>
    </div>
  );

  makeMoney = (valor: number) => (valor / 100).toFixed(2);

  financaBox = (texto: string, valor: number) => (
    <div className="column is-3">
      <div className="box">
        <p className="title">{texto}</p>
        <p className="subtitle">R$ {this.makeMoney(valor)}</p>
      </div>
    </div>
  );

  modalCallback: any;
  openModal = (s: ModalServico, cb?: any) => {
    if (cb) {
      this.modalCallback = cb;
    }
    this.setState({ modal: true, modalServico: s });
  };

  closeModal = () => {
    this.modalCallback = null;
    this.setState({
      modal: false,
      modalLoading: false,
      modalServico: initialServico
    });
  };

  onConfirmaModal = () => {
    if (!this.state.modal || !this.state.modalServico) {
      return;
    }
    this.setState({ modalLoading: true });
    clienteAvalia(
      {
        id: (this.state.modalServico as any).id,
        notaprestador: parseInt(this.state.notaFinalizar, 10),
        comentarioprestador: this.state.comentarioFinalizar
      },
      this.props.jwt
    )
      .then(({ id }) => {
        this.setState(state => ({
          ...state,
          modalLoading: false,
          modal: false,
          modalServico: null,
          notaFinalizar: 1,
          comentarioFinalizar: "",
          porCliente: state.porCliente.map(s => {
            if (s.id === id) {
              return {
                ...s,
                notaprestador: state.notaFinalizar,
                comentarioprestador: state.comentarioFinalizar
              };
            } else return s;
          })
        }));
        if (this.modalCallback) {
          this.modalCallback();
        }
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

  renderModal = () => {
    const s: any = this.state.modalServico;
    if (!s) return null;
    if (this.state.modal) {
      return (
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
              </div>
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
              <hr />
              <button
                disabled={this.state.modalLoading}
                onClick={this.onConfirmaModal}
                className="button is-success"
              >
                CONFIRMAR
              </button>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={this.closeModal}
          />
        </div>
      );
    }
    return null;
  };

  tableRow = (s: ServicoContratado) => (
    <tr key={s.id}>
      <th>
        <Router.Link to={`/cliente/contrato/${s.id}`}>{s.nome}</Router.Link>
      </th>
      <td>{statusMap[s.status]}</td>
      <td>R${(s.valor / 100).toFixed(2)}</td>
      <td>{s.quantidade}</td>
      <td>R${(s.valor * s.quantidade / 100).toFixed(2)}</td>
      <td>{timeago(s.datapedido)}</td>
      <td>{timeago(s.dataconclusao)}</td>
      <td>{s.notacliente}</td>
      <td>{s.notaprestador}</td>
      <td>
        {s.status === 2 &&
          !s.notaprestador && (
            <button
              className="button is-link"
              onClick={() => this.openModal(s)}
            >
              AVALIAR
            </button>
          )}
      </td>
    </tr>
  );

  renderDados = () => {
    return (
      <div className="container" key="dados">
        <section className="section">
          <div className="container">
            <h3 className="title">Meus gastos</h3>
          </div>
          <div className="columns">
            {this.financaBox("Hoje", this.state.financa.hoje)}
            {this.financaBox("Semana", this.state.financa.semana)}
            {this.financaBox("Mês", this.state.financa.mes)}
            {this.financaBox("Ano", this.state.financa.ano)}
          </div>
        </section>
        <section className="section">
          <div className="container">
            <h3 className="title">Últimos contratos</h3>
          </div>
          <table className="table is-fullwidth">
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
                  <abbr title="Nota recebida">NR</abbr>
                </th>
                <th>
                  <abbr title="Nota dada">ND</abbr>
                </th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>{this.state.porCliente.map(this.tableRow)}</tbody>
          </table>
        </section>
      </div>
    );
  };

  renderServicosPorTipo = (props: any) => (
    <ServicosPorTipo {...props} handleHttpError={this.props.handleHttpError} />
  );

  renderServico = (props: any) => (
    <Servico
      openModal={this.openModal}
      {...props}
      handleHttpError={this.props.handleHttpError}
      jwt={this.props.jwt}
    />
  );

  renderContrato = (props: any) => (
    <Contrato
      {...props}
      openModal={this.openModal}
      handleHttpError={this.props.handleHttpError}
      jwt={this.props.jwt}
    />
  );

  renderRedirect = () => <Router.Redirect to="/cliente" />;

  renderCriarEndereco = (props: any) => (
    <NovoEndereco
      {...props}
      handleHttpError={this.props.handleHttpError}
      jwt={this.props.jwt}
    />
  );

  render() {
    return [
      this.renderHero(),
      this.renderModal(),
      <Router.Switch key="sw">
        <Router.Route exact path="/cliente" render={this.renderPesquisar} />
        <Router.Route path="/cliente/dados" render={this.renderDados} />
        <Router.Route
          path="/cliente/criarendereco/:id"
          render={this.renderCriarEndereco}
        />
        <Router.Route
          path="/cliente/tipo/:id"
          render={this.renderServicosPorTipo}
        />
        <Router.Route path="/cliente/servico/:id" render={this.renderServico} />
        <Router.Route
          path="/cliente/contrato/:id"
          render={this.renderContrato}
        />
        <Router.Route render={this.renderRedirect} />
      </Router.Switch>
    ];
  }
}

export default Cliente;
