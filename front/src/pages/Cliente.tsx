import * as React from "react";
import { servicosMaisContratados, servicosPorCliente } from "../http";
import { TipoServico } from "../../../back/server/handlers/get/servicosMaisContratados";
import { ServicoContratado } from "../../../back/server/handlers/get/servicosPorCliente";
import * as Router from "react-router-dom";

class Cliente extends React.Component<
  {
    nome: string;
    onLogoutClick: () => void;
    jwt: string;
    handleHttpError: (error: any) => void;
    pathname: string;
  },
  { maisContratados: TipoServico[]; porCliente: ServicoContratado[] }
> {
  state = { maisContratados: [], porCliente: [] };

  componentDidMount() {
    servicosPorCliente(this.props.jwt)
      .then(response => this.setState({ porCliente: response.servicos }))
      .catch(this.props.handleHttpError);

    servicosMaisContratados(10)
      .then(response => this.setState({ maisContratados: response.tipos }))
      .catch(this.props.handleHttpError);
  }

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
              <Router.Link
                to={
                  this.props.pathname === "/cliente/dados"
                    ? "/cliente"
                    : "/cliente/dados"
                }
                style={{ marginRight: 32 }}
                className="button is-pulled-right is-outlined has-text-primary	 is-large"
              >
                {this.props.pathname === "/cliente/dados"
                  ? "CONTRATAR SERVIÇOS"
                  : "MEUS DADOS"}
              </Router.Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  renderInfoBox = (nome: string, contratacoes: number, id: number) => (
    <div className="column is-4" key={id}>
      <div className="box" key={id}>
        <p className="is-size-4">{nome}</p>
        <p className="is-size-6">{contratacoes} contratações</p>
        <hr />
        <a className="button">Saiba mais</a>
      </div>
    </div>
  );

  renderMaisContratados = () => (
    <div className="container" key="maiscontratados">
      <section className="section">
        <div className="container">
          <h3 className="title">Os mais contratados</h3>
        </div>
      </section>
      <div className="columns is-multiline">
        {this.state.maisContratados.map((tipo: TipoServico) =>
          this.renderInfoBox(tipo.nome, tipo.contratacoes, tipo.id)
        )}
      </div>
    </div>
  );

  renderDados = () => (
    <div className="container" key="maiscontratados">
      <section className="section">
        <div className="container">
          <h3 className="title">Seus últimos contratos</h3>
        </div>
      </section>
    </div>
  );

  render() {
    return [
      this.renderHero(),
      this.props.pathname === "/cliente/dados"
        ? this.renderDados()
        : this.renderMaisContratados()
    ];
  }
}

export default Cliente;
