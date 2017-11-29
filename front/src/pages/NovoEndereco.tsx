import * as React from "react";
import TextInput from "./TextInput";
import { Endereco } from "../../../back/server/handlers/shared/endereco";
import * as Router from "react-router-dom";
import { criarEndereco } from "../http";

const initialEndereco: Endereco = {
  uf: "MG",
  cidade: "Paula Cândido",
  bairro: "Esplanada",
  logradouro: "Rua dos Autos",
  numero: "12",
  complemento: "Apto. 500",
  cep: "32570-000"
};

class NovoEndereco extends React.Component<
  {
    jwt: string;
    handleHttpError: (error: any) => void;
  },
  {
    nome: string;
    endereco: Endereco;
    loading: boolean;
    idback: number;
    redirect: boolean;
  }
> {
  state = {
    nome: "Escritório",
    endereco: initialEndereco,
    loading: false,
    idback: 0,
    redirect: false
  };

  componentDidMount() {
    const id = parseInt((this.props as any).match.params.id, 10);
    this.setState(() => ({ idback: id }));
  }

  onClickCriar = () => {
    criarEndereco(
      { endereco: this.state.endereco, nomeendereco: this.state.nome },
      this.props.jwt
    )
      .then((response: { id: number }) => {
        this.setState({ redirect: true });
      })
      .catch(this.props.handleHttpError);
  };

  changeNome = (nome: string) => this.setState({ nome });

  changeEndereco = (field: string) => (value: string) =>
    this.setState(s => ({ endereco: { ...s.endereco, [field]: value } }));

  render() {
    if (this.state.redirect) {
      return <Router.Redirect to={"/cliente/servico/" + this.state.idback} />;
    }
    const disabled = this.state.loading;
    const data = this.state.endereco;

    return (
      <section className="section">
        <div className="container">
          <h1 className="title has-text-centered">Novo Endereço</h1>
          <div className="columns">
            <div className="column is-3" />
            <div className="column is-6">
              <div className="box">
                <TextInput
                  label="Nome do endereço"
                  value={this.state.nome}
                  onChange={this.changeNome}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Unidade Federativa"
                  value={data.uf}
                  onChange={this.changeEndereco("uf")}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Cidade"
                  value={data.cidade}
                  onChange={this.changeEndereco("cidade")}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Bairro"
                  value={data.bairro}
                  onChange={this.changeEndereco("bairro")}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Logradouro"
                  value={data.logradouro}
                  onChange={this.changeEndereco("logradouro")}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Numero"
                  value={data.numero}
                  onChange={this.changeEndereco("numero")}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Complemento"
                  value={data.complemento}
                  onChange={this.changeEndereco("complemento")}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="CEP"
                  value={data.cep}
                  onChange={this.changeEndereco("cep")}
                  type="text"
                  disabled={disabled}
                />
                <div className="level">
                  <div className="level-item">
                    <button
                      className="button is-large is-success"
                      onClick={this.onClickCriar}
                    >
                      CRIAR
                    </button>
                  </div>
                  <div className="level-item">
                    <Router.Link to={"/cliente/servico/" + this.state.idback}>
                      <button className="button is-large is-danger">
                        CANCELAR
                      </button>
                    </Router.Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default NovoEndereco;
