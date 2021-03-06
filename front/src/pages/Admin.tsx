import * as React from "react";
import { ADMIN } from "../roles";
import { cadastraTipo, financaAdmin } from "../http";

const makeMoney = (valor: number) => (valor / 100 * 0.05).toFixed(2);

const FinancaBox = (props: { texto: string; valor: number }) => (
  <div className="column is-3">
    <div className="box">
      <p className="title">{props.texto}</p>
      <p className="subtitle">R$ {makeMoney(props.valor)}</p>
    </div>
  </div>
);

class Financa extends React.Component<
  {
    jwt: string;
    handleHttpError: (error: any) => void;
  },
  { hoje: number; semana: number; mes: number; ano: number }
> {
  state = {
    hoje: 0,
    semana: 0,
    mes: 0,
    ano: 0
  };
  componentDidMount() {
    financaAdmin(this.props.jwt)
      .then(response => this.setState(response))
      .catch(this.props.handleHttpError);
  }

  render() {
    return [
      <div className="container" key="a">
        <h3 className="title">Lucros do UBERmo</h3>
      </div>,
      <hr key="b" />,
      <div className="columns" key="c">
        <FinancaBox texto="Hoje" valor={this.state.hoje} />
        <FinancaBox texto="Semana" valor={this.state.semana} />
        <FinancaBox texto="Mês" valor={this.state.mes} />
        <FinancaBox texto="Ano" valor={this.state.ano} />
      </div>
    ];
  }
}

class Admin extends React.Component<
  {
    jwt: string;
    handleHttpError: (error: any) => void;
    loginLoading: boolean;
    role: string;
    onLoginClick: (email: string, senha: string, role: string) => void;
    onLogoutClick: () => void;
  },
  {
    email: string;
    senha: string;
    nometipo: string;
    tipocobranca: string;
    tipoloading: boolean;
    success: boolean;
    successTimer: number;
  }
> {
  state = {
    email: "admin@admin.com",
    senha: "admin",
    nometipo: "",
    tipocobranca: "0",
    tipoloading: false,
    success: false,
    successTimer: 0
  };

  renderHero = () => (
    <section className="hero is-warning" key="Hero">
      <div className="hero-body">
        <div className="container">
          <div className="columns">
            <div className="column">
              <h1 className="title">UBERmo</h1>
              <h2 className="subtitle">Painel de administração</h2>
            </div>
            <div className="column">
              {this.props.role === ADMIN && (
                <a
                  onClick={this.props.onLogoutClick}
                  className="button is-dark is-pulled-right has-text-warning is-large"
                >
                  SAIR
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  onEmailChange = (event: any) => this.setState({ email: event.target.value });
  onSenhaChange = (event: any) => this.setState({ senha: event.target.value });
  onLoginClick = () => {
    this.props.onLoginClick(this.state.email, this.state.senha, ADMIN);
  };

  renderLogin = () => (
    <section className="section" key="login">
      <div className="container">
        <div className="field" key="email">
          <label className="label">Email</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className="input is-warning"
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
        </div>
        <div className="field" key="senha">
          <label className="label">Senha</label>
          <div className="control has-icons-left has-icons-right">
            <input
              className="input is-warning"
              type="password"
              placeholder="Digite sua senha"
              value={this.state.senha}
              disabled={this.props.loginLoading}
              onChange={this.onSenhaChange}
            />
            <span className="icon is-small is-left">
              <i className="fa fa-lock" />
            </span>
          </div>
        </div>
        <div className="field" key="button">
          <button
            className={[
              "button",
              "is-fullwidth",
              "is-warning",
              this.props.loginLoading ? "is-loading" : ""
            ].join(" ")}
            onClick={this.onLoginClick}
            disabled={this.props.loginLoading}
          >
            Logar
          </button>
        </div>
      </div>
    </section>
  );

  onNomeChange = (event: any) =>
    this.setState({ nometipo: event.target.value });

  alertSuccess = () => {
    this.setState({ success: true });
    this.setState({ successTimer: new Date().getTime() });
    setTimeout(this.clearSuccess, 2000, this.state.successTimer);
  };

  clearSuccess = (n: number) => {
    if (n === this.state.successTimer) {
      this.setState({ success: false });
    }
  };

  onTipoClick = () => {
    const nome = this.state.nometipo;
    const tipocobranca = parseInt(this.state.tipocobranca, 10);
    this.setState({ tipoloading: true });
    cadastraTipo({ nome, tipocobranca }, this.props.jwt)
      .then(() => {
        this.setState({ tipoloading: false });
        this.alertSuccess();
      })
      .catch(err => {
        this.setState({ tipoloading: false });
        this.props.handleHttpError(err);
      });
  };

  onCobrancaChange = (event: any) =>
    this.setState({ tipocobranca: event.target.value });

  renderCadastraTipo = () => {
    return (
      <div className="container" key="tipo">
        <section className="section">
          <Financa
            jwt={this.props.jwt}
            handleHttpError={this.props.handleHttpError}
          />
        </section>
        <section className="section">
          <div className="container">
            <h3 className="title">Criar tipo de serviço</h3>
          </div>
          <hr />
          {this.state.success && (
            <div className="notification is-success">
              <p className="title">Tipo criado com successo!</p>
            </div>
          )}
          <div className="field" key="email">
            <label className="label">Nome</label>
            <div className="control has-icons-left has-icons-right">
              <input
                className="input is-warning"
                type="text"
                value={this.state.nometipo}
                disabled={this.state.tipoloading}
                onChange={this.onNomeChange}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-envelope" />
              </span>
            </div>
          </div>
          <div className="field" key="senha">
            <label className="label">Tipo de cobrança</label>
            <div className="select">
              <select
                value={this.state.tipocobranca}
                onChange={this.onCobrancaChange}
              >
                <option value="0">Cobrança por hora</option>
                <option value="1">Cobrança por diária</option>
                <option value="2">Cobrança única</option>
              </select>
            </div>
          </div>
          <div className="field" key="button">
            <button
              className={[
                "button",
                "is-fullwidth",
                "is-warning",
                this.state.tipoloading ? "is-loading" : ""
              ].join(" ")}
              onClick={this.onTipoClick}
              disabled={this.state.tipoloading}
            >
              Criar tipo
            </button>
          </div>
        </section>
      </div>
    );
  };

  render() {
    return [
      this.renderHero(),
      this.props.role === ADMIN ? this.renderCadastraTipo() : this.renderLogin()
    ];
  }
}

export default Admin;
