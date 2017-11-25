import * as React from "react";
import { CLIENTE, PRESTADOR } from "../roles";
import * as rtr from "react-router-dom";
const { Link } = rtr;
const cn = (ns: string[]) => ns.join(" ");

class Layout extends React.Component<
  {
    onLoginClick: (email: string, senha: string, role: string) => void;
    loginLoading: boolean;
  },
  { tabClient: boolean; email: string; senha: string }
> {
  state = { tabClient: true, email: "cliente@cliente.com", senha: "cliente" };

  clienteClick = () => {
    if (this.props.loginLoading) {
      return;
    }
    this.setState({ tabClient: true });
  };

  prestadorClick = () => {
    if (this.props.loginLoading) {
      return;
    }
    this.setState({ tabClient: false });
  };

  onPasswordChange = (event: any) => {
    if (this.props.loginLoading) {
      return;
    }
    this.setState({ senha: event.target.value });
  };

  onEmailChange = (event: any) => {
    if (this.props.loginLoading) {
      return;
    }
    this.setState({ email: event.target.value });
  };

  onLoginClick = () =>
    this.props.onLoginClick(
      this.state.email,
      this.state.senha,
      this.state.tabClient ? CLIENTE : PRESTADOR
    );

  onRegisterClick = () => {
    if (this.props.loginLoading) {
      return;
    }
  };

  renderTabs = () => (
    <div className="tabs is-fullwidth is-boxed is-marginless">
      <ul>
        <li
          className={this.state.tabClient ? "is-active" : ""}
          onClick={this.clienteClick}
        >
          <a>
            <span className="icon">
              <i className="fa fa-shopping-cart" />
            </span>
            <span>Cliente</span>
          </a>
        </li>
        <li
          className={this.state.tabClient ? "" : "is-active"}
          onClick={this.prestadorClick}
        >
          <a>
            <span className="icon">
              <i className="fa fa-usd" />
            </span>
            <span>Prestador</span>
          </a>
        </li>
      </ul>
    </div>
  );

  renderHero = () => (
    <section className="hero is-link" key="Hero">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">UBERmo</h1>
          <h2 className="subtitle">Contrate mão de obra sem sair de casa</h2>
        </div>
      </div>
    </section>
  );

  renderLogin = () => [
    <div className="field" key="email">
      <label className="label">Email</label>
      <div className="control has-icons-left has-icons-right">
        <input
          className="input is-link"
          type="email"
          placeholder="Digite seu e-mail"
          value={this.state.email}
          disabled={this.props.loginLoading}
          onChange={this.onEmailChange}
        />
        <span className="icon is-small is-left">
          <i className="fa fa-envelope" />
        </span>
      </div>
    </div>,
    <div className="field" key="senha">
      <label className="label">Senha</label>
      <div className="control has-icons-left has-icons-right">
        <input
          className="input is-link"
          type="password"
          placeholder="Digite sua senha"
          value={this.state.senha}
          disabled={this.props.loginLoading}
          onChange={this.onPasswordChange}
        />
        <span className="icon is-small is-left">
          <i className="fa fa-lock" />
        </span>
      </div>
    </div>,
    <div className="field" key="button">
      <button
        className={cn([
          "button",
          "is-fullwidth",
          "is-link",
          this.props.loginLoading ? "is-loading" : ""
        ])}
        onClick={this.onLoginClick}
        disabled={this.props.loginLoading}
      >
        Logar como {this.state.tabClient ? "cliente" : "prestador"}
      </button>
    </div>
  ];

  renderRegisterButton = () => (
    <div className="field">
      <Link to="/registrar">
        <button
          className="button is-fullwidth is-success"
          disabled={this.props.loginLoading}
          onClick={this.onRegisterClick}
        >
          Registrar
        </button>
      </Link>
    </div>
  );

  renderInputBox = () => (
    <div className="box is-shadowless" key="LoginWrapper">
      <nav className="level">
        <div className="level-left" />
        <div className="level-right">
          <div>
            {this.renderTabs()}
            <div className="box is-marginless is-radiusless	">
              {this.renderLogin()}
              {this.renderRegisterButton()}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );

  render() {
    return [this.renderHero(), this.renderInputBox()];
  }
}

export default Layout;
