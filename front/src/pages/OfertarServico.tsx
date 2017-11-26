import * as React from "react";
import { ITipo } from "../../../back/server/handlers/get/tipos";
// import { Response } from "../../../back/server/handlers/post/ofereceServico";
import * as Router from "react-router-dom";
import { tipos, ofereceServico } from "../http";

interface State {
  descricao: string;
  lat: number;
  lng: number;
  valor: number;
  tipo: number;
  tipos: ITipo[];
  tipocobranca: number;
  loading: boolean;
  redirectService: number;
}

const initialState: State = {
  descricao: "",
  lat: 0,
  lng: 0,
  valor: 0,
  tipo: 1,
  tipos: [],
  loading: true,
  tipocobranca: 0,
  redirectService: 0
};

class OfertarServico extends React.Component<
  {
    jwt: string;
    handleHttpError: (error: any) => void;
  },
  State
> {
  state = initialState;

  componentDidMount() {
    tipos()
      .then(response =>
        this.setState({
          tipos: response.tipos,
          loading: false,
          tipo: response.tipos && response.tipos[0] ? response.tipos[0].id : 1
        })
      )
      .catch(this.props.handleHttpError);
  }

  onTipoChange = (event: any) => {
    const id = parseInt(event.target.value, 10);
    const tipocobranca = (this.state.tipos.find(t => t.id === id) as any)
      .tipocobranca;
    this.setState({ tipo: id, tipocobranca });
  };

  onOfertar = () => {
    this.setState({ loading: true });
    console.log(this.state);
    ofereceServico(
      {
        descricao: this.state.descricao,
        lat: this.state.lat,
        lng: this.state.lng,
        valor: Math.floor(this.state.valor * 100),
        tipo: this.state.tipo
      },
      this.props.jwt
    )
      .then(({ id }: any) => {
        this.setState({ loading: false, redirectService: id });
      })
      .catch(err => {
        this.setState({ loading: false });
        this.props.handleHttpError(err);
      });
  };

  onValorChange = (event: any) =>
    this.setState({ valor: parseFloat(event.target.value) });
  onLatChange = (event: any) =>
    this.setState({ lat: parseFloat(event.target.value) });
  onLngChange = (event: any) =>
    this.setState({ lng: parseFloat(event.target.value) });
  onDescricaoChange = (event: any) =>
    this.setState({ descricao: event.target.value });

  render() {
    if (this.state.redirectService !== 0) {
      return (
        <Router.Redirect
          to={"/prestador/servico/" + String(this.state.redirectService)}
        />
      );
    }
    return (
      <section className="section" key="ofertar">
        <div className="container">
          <p className="title">Ofertar um serviço</p>
          <hr />
          <div className="columns">
            <div className="column is-6">
              <div className="field" key="senha">
                <label className="label is-link">Nome</label>
                <div className="select">
                  <select
                    value={this.state.tipo}
                    onChange={this.onTipoChange}
                    disabled={this.state.loading}
                  >
                    {this.state.tipos.map(tipo => (
                      <option value={tipo.id} key={tipo.id}>
                        {tipo.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="label">Preço</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    value={this.state.valor}
                    onChange={this.onValorChange}
                    disabled={this.state.loading}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Latitude</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    value={this.state.lat}
                    onChange={this.onLatChange}
                    disabled={this.state.loading}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Longitude</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    value={this.state.lng}
                    onChange={this.onLngChange}
                    disabled={this.state.loading}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Descrição</label>
                <div className="control">
                  <textarea
                    className="textarea is-link"
                    value={this.state.descricao}
                    disabled={this.state.loading}
                    onChange={this.onDescricaoChange}
                  />
                </div>
              </div>
              <button
                className="button is-large is-success is-fullwidth"
                onClick={this.onOfertar}
              >
                OFERTAR
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default OfertarServico;
