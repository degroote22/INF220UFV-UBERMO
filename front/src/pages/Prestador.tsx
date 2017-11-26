import * as React from "react";
import * as Router from "react-router-dom";
import Gerenciar from "./Gerenciar";
import FinancaPrestador from "./FinancaPrestador";
import OfertarServico from "./OfertarServico";
import Servico from "./Servico";

class Prestador extends React.Component<
  {
    nome: string;
    onLogoutClick: () => void;
    jwt: string;
    handleHttpError: (error: any) => void;
  },
  {}
> {
  state = {};

  refreshData = () => {};

  componentDidMount() {
    this.refreshData();
  }

  renderDadosBotao = () => (
    <Router.Link
      onClick={this.refreshData}
      to={"/prestador/dados"}
      style={{ marginRight: 32 }}
      className="button is-pulled-right is-outlined has-text-link	 is-large"
    >
      MEUS DADOS
    </Router.Link>
  );

  renderContratarBotao = () => (
    <Router.Link
      to={"/prestador"}
      style={{ marginRight: 32 }}
      className="button is-pulled-right is-outlined has-text-link	 is-large"
    >
      GERENCIAR SERVIÇOS
    </Router.Link>
  );
  renderVoltarBotao = () => (
    <Router.Link
      to={"/prestador"}
      style={{ marginRight: 32 }}
      className="button is-pulled-right is-outlined has-text-link	 is-large"
    >
      VOLTAR
    </Router.Link>
  );

  renderHero = () => (
    <section className="hero is-link" key="Hero">
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
                className="button is-pulled-right is-outlined has-text-link	 is-large"
              >
                SAIR
              </a>
              <Router.Switch>
                <Router.Route
                  path="/prestador/dados"
                  component={this.renderContratarBotao}
                />
                <Router.Route
                  exact
                  path="/prestador"
                  component={this.renderDadosBotao}
                />
                <Router.Route
                  path="/prestador"
                  component={this.renderVoltarBotao}
                />
              </Router.Switch>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  renderGerenciar = () => (
    <Gerenciar
      jwt={this.props.jwt}
      handleHttpError={this.props.handleHttpError}
    />
  );
  renderDados = () => (
    <FinancaPrestador
      jwt={this.props.jwt}
      handleHttpError={this.props.handleHttpError}
    />
  );
  renderCriar = () => (
    <OfertarServico
      jwt={this.props.jwt}
      handleHttpError={this.props.handleHttpError}
    />
  );
  renderServico = (props: any) => (
    <Servico
      {...props}
      jwt={this.props.jwt}
      handleHttpError={this.props.handleHttpError}
    />
  );

  render() {
    return [
      this.renderHero(),
      <Router.Route
        exact
        path="/prestador"
        render={this.renderGerenciar}
        key="comprar"
      />,
      <Router.Route
        path="/prestador/dados"
        render={this.renderDados}
        key="dados"
      />,
      <Router.Route
        path="/prestador/criar"
        render={this.renderCriar}
        key="tipos"
      />,
      <Router.Route
        path="/prestador/servico/:id"
        render={this.renderServico}
        key="servico"
      />
    ];
  }
}

export default Prestador;
