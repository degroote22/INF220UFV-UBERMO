import * as React from "react";
import { Contrato as Response } from "../../../back/server/handlers/get/contrato";
// import { RequestBody } from "../../../back/server/handlers/post/requisitaServico";
import { contrato } from "../http";
import ServicoHeader from "./ServicoHeader";
import statusMap from "./statusMap";
const initialServico = {
  id: 0,
  valor: 0, //
  descricao: "", //
  lat: 0, //
  lng: 0, //
  tipocobranca: 0, //
  nome: "", //
  nomeprestador: "", //
  notaglobalprestador: 0, //
  emailprestador: "",
  fotoprestador: "", //
  //
  quantidade: 1, //
  datapedido: "", //
  dataconclusao: "", //
  status: 0,
  notacliente: 0, //
  comentariocliente: "", //
  notaprestador: 0, //
  comentarioprestador: "" //
};

interface State {
  servico: Response;
  loaded: boolean;
}

const initialState: State = {
  servico: initialServico,
  loaded: false
};
const tempoServico = [" horas", " dias", " unidade"];
const formatDate = (date: string | null): string => {
  if (date) {
    return new Date(date).toLocaleString();
  }
  return "";
};

class Contratar extends React.Component<
  {
    handleHttpError: (error: any) => void;
    jwt: string;
  },
  State
> {
  state = initialState;
  ref: any;
  componentDidMount() {
    const id = parseInt((this.props as any).match.params.id, 10);
    contrato(id, this.props.jwt)
      .then((response: Response) => {
        this.setState({ servico: response, loaded: true });
      })
      .catch(err => {
        this.props.handleHttpError(err);
      });
  }
  getWidth = (): number => {
    if (this.ref) {
      return this.ref.clientWidth;
    }
    return 0;
  };
  render() {
    return (
      <div className="container" key="dados" ref={ref => (this.ref = ref)}>
        <section className="section">
          <ServicoHeader
            width={this.getWidth()}
            loaded={this.state.loaded}
            nome={this.state.servico.nome}
            lat={this.state.servico.lat}
            lng={this.state.servico.lng}
            valor={this.state.servico.valor}
            tipocobranca={this.state.servico.tipocobranca}
            descricao={this.state.servico.descricao}
            fotoprestador={this.state.servico.fotoprestador}
            nomeprestador={this.state.servico.nomeprestador}
            notaprestador={this.state.servico.notaglobalprestador}
          />
          <div className="container">
            <div className="columns">
              <div className="column">
                <div className="box is-shadowless">
                  <h1 className="title">
                    R${(
                      this.state.servico.valor *
                      this.state.servico.quantidade /
                      100
                    ).toFixed(2)}
                  </h1>
                  <h2 className="subtitle">
                    {this.state.servico.quantidade}{" "}
                    {tempoServico[this.state.servico.tipocobranca]}
                  </h2>
                </div>
              </div>

              <div className="column">
                <div className="box is-shadowless">
                  <h1 className="title">Data do pedido</h1>
                  <h2 className="subtitle">
                    {formatDate(this.state.servico.datapedido)}
                  </h2>
                </div>
              </div>

              <div className="column">
                <div className="box is-shadowless">
                  <h1 className="title">Data da conclusão</h1>
                  <h2 className="subtitle">
                    {formatDate(this.state.servico.dataconclusao)}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <hr />
          <div className="box is-shadowless">
            <h1 className="title">{statusMap[this.state.servico.status]}</h1>
            <h1 className="subtitle">status da transação</h1>
          </div>

          {this.state.servico.notacliente && (
            <div className="box" key="c">
              <h2 className="is-size-4">
                "{this.state.servico.comentarioprestador}"
              </h2>
              <h1 className="title">
                {this.state.servico.notaprestador} pontos
              </h1>
              <h1 className="subtitle">você avaliou</h1>
            </div>
          )}
          {this.state.servico.notacliente && (
            <div className="box " key="b">
              <h2 className="is-size-4">
                "{this.state.servico.comentariocliente}"
              </h2>
              <h1 className="title">{this.state.servico.notacliente} pontos</h1>
              <h1 className="subtitle">você foi avaliado</h1>
            </div>
          )}
        </section>
      </div>
    );
  }
}

export default Contratar;
