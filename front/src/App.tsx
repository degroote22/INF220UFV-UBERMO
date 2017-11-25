import * as React from "react";
import Welcome from "./dumb/Welcome";
import { loginCliente, loginPrestador } from "./http";
import { CLIENTE, DESLOGADO, PRESTADOR } from "./roles";
import * as rtr from "react-router-dom";
import {
  getLocalStorage,
  clearLocalStorage,
  setLocalStorage
} from "./localStorage";
import Cliente from "./dumb/Cliente";
const { BrowserRouter, Route, Redirect, Switch } = rtr;

class NoMatch extends React.Component<{}, { redirect: boolean }> {
  state = { redirect: false };
  redirect = () => this.setState({ redirect: true });
  componentDidMount() {
    if (!this.state.redirect) setTimeout(this.redirect, 1000);
  }
  render() {
    if (this.state.redirect) return <Redirect to="/" />;
    return <div>Página não encontrada, voltando à home...</div>;
  }
}
interface State {
  loginLoading: boolean;
  notification: boolean;
  notificationText: string;
  nome: string;
  jwt: string;
  role: string;
}
const initialState: State = {
  loginLoading: false,
  notification: false,
  notificationText: "",
  nome: "",
  jwt: "",
  role: DESLOGADO
};
class App extends React.Component<{}, State> {
  state = initialState;

  componentDidMount() {
    try {
      const { jwt, nome, role } = getLocalStorage();
      this.setState({ jwt, nome, role });
    } catch (errr) {
      clearLocalStorage();
    }
  }

  onLogoutClick = () => {
    this.setState(initialState);
    clearLocalStorage();
  };

  onLoginClick = (email: string, senha: string, role: string) => {
    this.setState({ loginLoading: true });
    let fn =
      role === CLIENTE
        ? () => loginCliente(email, senha)
        : () => loginPrestador(email, senha);
    fn()
      .then(r => {
        this.setState({ loginLoading: false });
        this.setState({ jwt: r.jwt, nome: r.nome, role });
        setLocalStorage(r.jwt, r.nome, role);
      })
      .catch(err => {
        this.setState({
          loginLoading: false,
          notification: true,
          notificationText: "Erro no login. Confira e-mail e senha."
        });
      });
  };

  closeNotification = () => {
    this.setState({ notification: false });
  };

  renderWelcome = () => {
    const { role } = this.state;
    if (role !== DESLOGADO) {
      if (role === CLIENTE) return <Redirect to="/cliente" />;
      if (role === PRESTADOR) return <Redirect to="/prestador" />;
    }
    return (
      <Welcome
        key="welcome"
        onLoginClick={this.onLoginClick}
        loginLoading={this.state.loginLoading}
      />
    );
  };

  renderCliente = () => {
    const { role } = this.state;
    if (role === DESLOGADO) return <Redirect to="/" />;

    return (
      <Cliente
        key="cliente"
        nome={this.state.nome}
        onLogoutClick={this.onLogoutClick}
      />
    );
  };

  renderFooter = () => (
    <footer className="footer is-paddingless fix-footer" key="footer">
      <section className="section has-text-centered">
        <p className="title">INF220</p>
        <p className="subtitle">UFV - 2017</p>
      </section>
    </footer>
  );

  render() {
    const modalCN = ["modal", this.state.notification ? "is-active" : ""].join(
      " "
    );
    return (
      <BrowserRouter>
        <div className="footerFixWrapper">
          <div className={modalCN} key="modal">
            <div
              className="modal-background"
              onClick={this.closeNotification}
            />
            <div className="modal-content">
              <div className="notification is-danger">
                <button className="delete" onClick={this.closeNotification} />
                <p className="title is-2">Vish...</p>
                <h4 className="subtitle is-4">{this.state.notificationText}</h4>
              </div>
            </div>
          </div>
          <div className="footerFix" key="site">
            <Switch>
              <Route exact path="/" component={this.renderWelcome} />
              <Route exact path="/cliente" component={this.renderCliente} />
              <Route component={NoMatch} />
            </Switch>
          </div>
          {this.renderFooter()}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
