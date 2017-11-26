import * as React from "react";
import {
  servicosMaisContratados,
  servicosPorCliente,
  tipos,
  financaCliente
} from "../http";
import { TipoServico } from "../../../back/server/handlers/get/servicosMaisContratados";
import { ServicoContratado } from "../../../back/server/handlers/get/servicosPorCliente";
import { TipoOfertas } from "../../../back/server/handlers/get/tipos";
import * as Router from "react-router-dom";
import ServicosPorTipo from "./ServicosPorTipo";
import Servico from "./Servico";
import Contrato from "./Contrato";
import { Response as FincancaResponse } from "../../../back/server/handlers/get/financaCliente";
import statusMap from "./statusMap";

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
    }
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

    tipos()
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
      className="button is-pulled-right is-outlined has-text-primary	 is-large"
    >
      MEUS DADOS
    </Router.Link>
  );

  renderContratarBotao = () => (
    <Router.Link
      to={"/cliente"}
      style={{ marginRight: 32 }}
      className="button is-pulled-right is-outlined has-text-primary	 is-large"
    >
      CONTRATAR SERVIÇOS
    </Router.Link>
  );
  renderVoltarBotao = () => (
    <Router.Link
      to={"/cliente"}
      style={{ marginRight: 32 }}
      className="button is-pulled-right is-outlined has-text-primary	 is-large"
    >
      VOLTAR
    </Router.Link>
  );

  renderHero = () => (
    <section className="hero is-primary" key="Hero">
      <div className="hero-body">
        <div className="container">
          <div className="columns">
            <div className="column">
              <h1 className="title">UBERmo</h1>
              <h2 className="subtitle">Logado como: {this.props.nome}</h2>
            </div>
            <div className="column">
              <a
                onClick={this.props.onLogoutClick}
                className="button is-pulled-right is-outlined has-text-primary	 is-large"
              >
                SAIR
              </a>
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

  formatDate = (date: string | null): string => {
    if (date) {
      return new Date(date).toLocaleString();
    }
    return "";
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
      <td>{this.formatDate(s.datapedido)}</td>
      <td>{this.formatDate(s.dataconclusao)}</td>
      <td>{s.notacliente}</td>
      <td>{s.comentariocliente}</td>
      <td>{s.notaprestador}</td>
      <td>{s.comentarioprestador}</td>
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
      {...props}
      handleHttpError={this.props.handleHttpError}
      jwt={this.props.jwt}
    />
  );

  renderContrato = (props: any) => (
    <Contrato
      {...props}
      handleHttpError={this.props.handleHttpError}
      jwt={this.props.jwt}
    />
  );

  render() {
    return [
      this.renderHero(),
      <Router.Route
        exact
        path="/cliente"
        render={this.renderPesquisar}
        key="comprar"
      />,
      <Router.Route
        path="/cliente/dados"
        render={this.renderDados}
        key="dados"
      />,
      <Router.Route
        path="/cliente/tipo/:id"
        render={this.renderServicosPorTipo}
        key="tipos"
      />,
      <Router.Route
        path="/cliente/servico/:id"
        render={this.renderServico}
        key="servico"
      />,
      <Router.Route
        path="/cliente/contrato/:id"
        render={this.renderContrato}
        key="contrato"
      />
    ];
  }
}

export default Cliente;
