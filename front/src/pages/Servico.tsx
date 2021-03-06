import * as React from "react";
import { servico, requisitaServico, enderecos } from "../http";
import { Servico as Response } from "../../../back/server/handlers/get/servico";
import { EnderecoId } from "../../../back/server/handlers/get/enderecos";
import * as Router from "react-router-dom";
import ServicoHeader from "./ServicoHeader";

const initialData = {
  id: 0,
  valor: 0,
  descricao: "",
  lat: 0,
  lng: 0,
  tipocobranca: 0,
  nome: "",
  nomeprestador: "",
  notaprestador: 0,
  emailprestador: "",
  fotoprestador: ""
};

interface State {
  data: Response;
  loaded: boolean;
  contratar: boolean;
  quantidade: number;
  requisitado: number;
  loadingContrato: boolean;
  cliente: boolean;
  endereco: string;
  enderecos: EnderecoId[];
  id: number;
}

const initialState: State = {
  data: initialData,
  loaded: false,
  contratar: false,
  quantidade: 1,
  loadingContrato: false,
  requisitado: 0,
  cliente: false,
  endereco: "0",
  enderecos: [],
  id: 0
};

const tempoCobranca = ["(horas)", "(dias)", ""];
class Servico extends React.Component<
  {
    handleHttpError: (error: any) => void;
    jwt: string;
  },
  State
> {
  state = initialState;
  componentDidMount() {
    const id = parseInt((this.props as any).match.params.id, 10);
    this.setState(() => ({ id }));

    const cliente = (this.props as any).match.url.substring(1, 8) === "cliente";

    enderecos(this.props.jwt).then((response: EnderecoId[]) => {
      this.setState({ enderecos: response, endereco: String(response[0].id) });
    });

    servico(id)
      .then((response: Response) => {
        this.setState({ data: response, loaded: true, cliente });
      })
      .catch(err => {
        this.props.handleHttpError(err);
      });
  }

  changeQuantidade = (event: any) =>
    this.setState({ quantidade: Number(event.target.value) });
  openContratar = () => this.setState({ contratar: true });
  closeContratar = () => this.setState({ contratar: false });

  onConfirmaClick = () => {
    this.setState({ loadingContrato: true });
    requisitaServico(
      {
        quantidade: this.state.quantidade,
        idservico: this.state.data.id,
        endereco: parseInt(this.state.endereco, 10)
      },
      this.props.jwt
    )
      .then(response => {
        this.setState({ requisitado: response.id, loadingContrato: true });
      })
      .catch(err => {
        this.setState({ loadingContrato: false });
        this.props.handleHttpError(err);
      });
  };

  onChangeEndereco = (event: any) =>
    this.setState({ endereco: event.target.value });

  renderContratarFields = () => (
    <div className="columns">
      <div className="column is-6">
        <nav className="level is-mobile">
          <div className="level-item">
            <p className="subtitle is-5">
              Quantidade: {tempoCobranca[this.state.data.tipocobranca]}
            </p>
          </div>
          <div className="level-item">
            <input
              style={{ maxWidth: 128 }}
              className="input"
              type="number"
              placeholder="1"
              disabled={this.state.data.tipocobranca === 2 /*Atividade */}
              value={this.state.quantidade}
              onChange={this.changeQuantidade}
            />
          </div>
          <div className="level-item">
            <p className="subtitle is-5">
              R${(this.state.quantidade * this.state.data.valor / 100).toFixed(
                2
              )}
            </p>
          </div>
        </nav>
        <nav className="level is-mobile">
          <div className="level-item">
            <p className="subtitle is-5">Endereço:</p>
          </div>

          <div className="level-item">
            <div className="select is-fullwidth">
              <select
                value={this.state.endereco}
                onChange={this.onChangeEndereco}
              >
                {this.state.enderecos.map(endereco => (
                  <option value={endereco.id} key={endereco.id}>
                    {endereco.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="level-item">
            <Router.Link to={"/cliente/criarendereco/" + this.state.id}>
              <button className="button is-link">NOVO ENDEREÇO</button>
            </Router.Link>
          </div>
        </nav>
        <nav className="level is-mobile">
          <div className="level-item">
            <button
              disabled={this.state.loadingContrato}
              className="button is-large is-success"
              onClick={this.onConfirmaClick}
            >
              CONFIRMAR
            </button>
          </div>
          <div className="level-item">
            <button
              disabled={this.state.loadingContrato}
              className="button is-large is-danger"
              onClick={this.closeContratar}
            >
              CANCELAR
            </button>
          </div>
        </nav>
      </div>
    </div>
  );

  ref: any;

  getWidth = (): number => {
    if (this.ref) {
      return this.ref.clientWidth;
    }
    return 0;
  };

  render() {
    if (this.state.requisitado !== 0) {
      return (
        <Router.Redirect to={`/cliente/contrato/${this.state.requisitado}`} />
      );
    }

    return (
      <div className="container" key="dados" ref={ref => (this.ref = ref)}>
        <section className="section">
          <ServicoHeader
            loaded={this.state.loaded}
            width={this.getWidth()}
            lat={this.state.data.lat}
            lng={this.state.data.lng}
            nome={this.state.data.nome}
            valor={this.state.data.valor}
            tipocobranca={this.state.data.tipocobranca}
            descricao={this.state.data.descricao}
            fotoprestador={this.state.data.fotoprestador}
            nomeprestador={this.state.data.nomeprestador}
            notaprestador={this.state.data.notaprestador}
          />
          <hr />
          {this.state.cliente && (
            <div className="box is-shadowless">
              {this.state.contratar ? (
                this.renderContratarFields()
              ) : (
                <button
                  className="button is-success is-large is-outlined is-fullwidth"
                  onClick={this.openContratar}
                >
                  CONTRATAR SERVIÇO
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    );
  }
}

export default Servico;
