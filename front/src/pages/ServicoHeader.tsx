import * as React from "react";
const key = "AIzaSyBU_yn5R5tbfGkaEW0NV_rADV23mFy5x0w";

const tiposCobranca = ["por hora", "por dia", "pelo serviço"];
class ServicoHeader extends React.Component<{
  loaded: boolean;
  width: number;
  lat: number;
  lng: number;
  nome: string;
  valor: number;
  tipocobranca: number;
  descricao: string;
  fotoprestador: string;
  nomeprestador: string;
  notaprestador: number;
}> {
  render() {
    const mapurl = this.props.loaded
      ? [
          "https://maps.googleapis.com/maps/api/staticmap?",
          `center=${this.props.lat},${this.props.lng}`,
          "&zoom=13",
          "&scale=2",
          `&size=${this.props.width}x${150}`,
          "&maptype=roadmap",
          `&markers=color:blue|${this.props.lat},${this.props.lng}`,
          "&key=",
          key
        ].join("")
      : "";
    return [
      <div className="box is-shadowless" key="a">
        <img src={mapurl} />
      </div>,
      <div className="level" key="d">
        <div className="level-left">
          <div className="box is-shadowless">
            <h3 className="title">{this.props.nome}</h3>
            <h5 className="subtitle">
              R${(this.props.valor / 100).toFixed(2)}{" "}
              {tiposCobranca[this.props.tipocobranca]}
            </h5>
            <p className="is-size-6	">{this.props.descricao}</p>
          </div>
        </div>,
        <div className="level-right" key="b">
          <div className="media">
            <div className="media-left">
              <p className="image is-128x128">
                <img
                  width={128}
                  height={128}
                  src={"https://" + this.props.fotoprestador}
                />
              </p>
            </div>
            <div className="media-right" key="c">
              <div className="box is-shadowless">
                <h3 className="title">{this.props.nomeprestador}</h3>
                <h5 className="subtitle">{this.props.notaprestador} pontos</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    ];
  }
}

export default ServicoHeader;
