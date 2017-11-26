import * as React from "react";
import { Servico as Response } from "../../../back/server/handlers/get/servico";
// import { RequestBody } from "../../../back/server/handlers/post/requisitaServico";
import { servico } from "../http";

const initialServico = {
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

interface State {
  servico: Response;
}

const initialState: State = {
  servico: initialServico
};

class Contratar extends React.Component<{
  handleHttpError: (error: any) => void;
}> {
  state = initialState;
  componentDidMount() {
    const id = parseInt((this.props as any).match.params.id, 10);
    servico(id)
      .then((response: Response) => {
        this.setState({ servico: response });
      })
      .catch(err => {
        this.props.handleHttpError(err);
      });
  }

  render() {
    return <div />;
  }
}

export default Contratar;
