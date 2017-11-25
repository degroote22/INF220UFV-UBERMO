import * as React from "react";
import { servicosMaisContratados } from "../http";
import { TipoServico } from "../../../back/server/handlers/get/servicosMaisContratados";

class Cliente extends React.Component<
  {
    nome: string;
    onLogoutClick: () => void;
  },
  { tipos: TipoServico[] }
> {
  state = { tipos: [] };
  componentDidMount() {
    servicosMaisContratados(10)
      .then(response => this.setState({ tipos: response.tipos }))
      .catch(console.error);
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
                className="button is-pulled-right is-primary is-large"
              >
                Sair
              </a>
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
        {this.state.tipos.map((tipo: TipoServico) =>
          this.renderInfoBox(tipo.nome, tipo.contratacoes, tipo.id)
        )}
      </div>
    </div>
  );

  render() {
    return [this.renderHero(), this.renderMaisContratados()];
  }
}

export default Cliente;
