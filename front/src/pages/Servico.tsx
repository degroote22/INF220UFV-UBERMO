import * as React from "react";
import { servico, requisitaServico } from "../http";
import { Servico as Response } from "../../../back/server/handlers/get/servico";
import * as Router from "react-router-dom";

const initialData = {
  id: 0,
  valor: 0,
  descricao: "",
  lat: 0,
  lng: 0,
  tipocobranca: 0,
  nome: "",
  nomeprestador: "",
  notaprestador: "",
  emailprestador: "",
  fotoprestador: ""
};

const initialState = {
  data: initialData,
  loaded: false,
  contratar: false,
  quantidade: 1,
  loadingContrato: false,
  requisitado: 0
};

const key = "AIzaSyBU_yn5R5tbfGkaEW0NV_rADV23mFy5x0w";

const tiposCobranca = ["por hora", "por dia", "pelo serviço"];
const tempoCobranca = ["(horas)", "(dias)", ""];
class Servico extends React.Component<
  {
    handleHttpError: (error: any) => void;
    jwt: string;
  },
  {
    data: Response;
    loaded: boolean;
    contratar: boolean;
    quantidade: number;
    requisitado: number;
    loadingContrato: boolean;
  }
> {
  state = initialState;
  componentDidMount() {
    const id = parseInt((this.props as any).match.params.id, 10);
    servico(id)
      .then((response: Response) => {
        this.setState({ data: response, loaded: true });
      })
      .catch(err => {
        this.props.handleHttpError(err);
      });
  }

  ref: any;

  getMapSize = (): number => {
    if (this.ref) {
      return this.ref.clientWidth;
    }
    return 0;
  };

  changeQuantidade = (event: any) =>
    this.setState({ quantidade: Number(event.target.value) });
  openContratar = () => this.setState({ contratar: true });
  closeContratar = () => this.setState({ contratar: false });

  onConfirmaClick = () => {
    this.setState({ loadingContrato: true });
    requisitaServico(
      {
        quantidade: this.state.quantidade,
        idservico: this.state.data.id
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

  renderContratar = () => (
    <nav className="level">
      <div className="level-left">
        <div className="level-item">
          <p className="subtitle is-5">
            Quantidade: {tempoCobranca[this.state.data.tipocobranca]}
          </p>
        </div>
        <div className="level-item">
          <input
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
            R${(this.state.quantidade * this.state.data.valor / 100).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="level-right">
        <p className="level-item">
          <button
            disabled={this.state.loadingContrato}
            className="button is-large is-success"
            onClick={this.onConfirmaClick}
          >
            Confirmar
          </button>
        </p>
        <p className="level-item">
          <button
            disabled={this.state.loadingContrato}
            className="button is-large is-danger"
            onClick={this.closeContratar}
          >
            Cancelar
          </button>
        </p>
      </div>
    </nav>
  );

  render() {
    if (this.state.requisitado !== 0) {
      return (
        <Router.Redirect to={`/cliente/contrato/${this.state.requisitado}`} />
      );
    }
    const mapSize = this.getMapSize();
    const mapurl = this.state.loaded
      ? [
          "https://maps.googleapis.com/maps/api/staticmap?",
          `center=${this.state.data.lat},${this.state.data.lng}`,
          "&zoom=13",
          "&scale=2",
          `&size=${mapSize}x${150}`,
          "&maptype=roadmap",
          `&markers=color:blue|${this.state.data.lat},${this.state.data.lng}`,
          "&key=",
          key
        ].join("")
      : "";

    return (
      <div className="container" key="dados" ref={ref => (this.ref = ref)}>
        <section className="section">
          <div className="box is-shadowless">
            <img src={mapurl} />
          </div>
          <div className="level">
            <div className="level-left">
              <div className="box is-shadowless">
                <h3 className="title">{this.state.data.nome}</h3>
                <h5 className="subtitle">
                  R${(this.state.data.valor / 100).toFixed(2)}{" "}
                  {tiposCobranca[this.state.data.tipocobranca]}
                </h5>
                <p className="is-size-6	">{this.state.data.descricao}</p>
              </div>
            </div>

            <div className="level-right">
              <div className="media">
                <div className="media-left">
                  <p className="image is-128x128">
                    <img
                      width={128}
                      height={128}
                      src={"https://" + this.state.data.fotoprestador}
                    />
                  </p>
                </div>
                <div className="media-right">
                  <div className="box is-shadowless">
                    <h3 className="title">{this.state.data.nomeprestador}</h3>
                    <h5 className="subtitle">
                      {this.state.data.notaprestador} pontos
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="box is-shadowless">
            {this.state.contratar ? (
              this.renderContratar()
            ) : (
              <button
                className="button is-success is-large is-outlined is-fullwidth"
                onClick={this.openContratar}
              >
                CONTRATAR SERVIÇO
              </button>
            )}
          </div>
        </section>
      </div>
    );
  }
}

export default Servico;
