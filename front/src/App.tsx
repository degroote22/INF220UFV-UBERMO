import * as React from "react";
import pages from "./pages";
import {
  loginCliente,
  loginPrestador,
  loginAdmin,
  cadastraCliente,
  cadastraPrestador
} from "./http";
import { CLIENTE, DESLOGADO, PRESTADOR } from "./roles";
import * as rtr from "react-router-dom";
import {
  getLocalStorage,
  clearLocalStorage,
  setLocalStorage
} from "./localStorage";
const { BrowserRouter, Route, Redirect, Switch } = rtr;

interface State {
  loginLoading: boolean;
  notification: boolean;
  notificationText: string;
  nome: string;
  jwt: string;
  role: string;
  registerLoading: boolean;
}

const initialState: State = {
  loginLoading: false,
  registerLoading: false,
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

  handleHttpError = (error: any) => {
    if (error.message === "jwtexpired") {
      this.logout();
    } else {
      this.setNotification(error.message);
    }
  };

  logout = () => {
    this.setState(initialState);
    clearLocalStorage();
  };

  setNotification = (msg: string) =>
    typeof msg === "string"
      ? this.setState({
          notification: true,
          notificationText: msg
        })
      : this.setState({
          notification: true,
          notificationText: JSON.stringify(msg)
        });

  login = (jwt: string, nome: string, role: string) => {
    this.setState({ jwt, nome, role });
    setLocalStorage(jwt, nome, role);
  };

  onLogoutClick = () => {
    this.logout();
  };

  onLoginClick = (email: string, senha: string, role: string) => {
    this.setState({ loginLoading: true });
    let fn =
      role === CLIENTE
        ? () => loginCliente(email, senha)
        : role === PRESTADOR
          ? () => loginPrestador(email, senha)
          : () => loginAdmin(email, senha);
    fn()
      .then(r => {
        this.setState({ loginLoading: false });
        this.login(r.jwt, r.nome, role);
      })
      .catch(err => {
        this.setNotification("Erro no login. Confira e-mail e senha.");
        this.setState({
          loginLoading: false
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
      <pages.Welcome
        key="welcome"
        onLoginClick={this.onLoginClick}
        loginLoading={this.state.loginLoading}
      />
    );
  };

  renderCliente = (props: any) => {
    const { role } = this.state;
    if (role !== CLIENTE) return <Redirect to="/" />;
    return (
      <pages.Cliente
        {...props}
        key="cliente"
        nome={this.state.nome}
        onLogoutClick={this.onLogoutClick}
        jwt={this.state.jwt}
        handleHttpError={this.handleHttpError}
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

  cadastraCliente = (payload: any) => {
    this.setState({ registerLoading: true });
    cadastraCliente(payload)
      .then(r => {
        this.setState({ registerLoading: false });
        this.login(r.jwt, r.nome, CLIENTE);
      })
      .catch(err => {
        this.setNotification(err.message);
        this.setState({ registerLoading: false });
      });
  };

  cadastraPrestador = (payload: any) => {
    this.setState({ registerLoading: true });
    cadastraPrestador(payload)
      .then(r => {
        this.setState({ registerLoading: false });
        this.login(r.jwt, r.nome, PRESTADOR);
      })
      .catch(err => {
        this.setState({ registerLoading: false });
        this.setNotification(err);
      });
  };

  renderRegistrar = () => {
    const { role } = this.state;
    if (role !== DESLOGADO) {
      if (role === CLIENTE) return <Redirect to="/cliente" />;
      if (role === PRESTADOR) return <Redirect to="/prestador" />;
    }
    return (
      <pages.Registrar
        loading={this.state.registerLoading}
        cadastraCliente={this.cadastraCliente}
        cadastraPrestador={this.cadastraPrestador}
      />
    );
  };

  renderAdmin = (props: any) => {
    // const { role } = this.state;
    // if (role !== ADMIN) {
    //   return <Redirect to="/" />;
    // }
    return (
      <pages.Admin
        {...props}
        handleHttpError={this.handleHttpError}
        jwt={this.state.jwt}
        role={this.state.role}
        onLoginClick={this.onLoginClick}
        onLogoutClick={this.onLogoutClick}
      />
    );
  };

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
              <Route path="/registrar" component={this.renderRegistrar} />
              <Route path="/cliente" component={this.renderCliente} />
              <Route path="/admin" component={this.renderAdmin} />
              <Route component={pages.NoMatch} />
            </Switch>
          </div>
          {this.renderFooter()}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
