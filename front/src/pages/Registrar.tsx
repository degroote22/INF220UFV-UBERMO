import * as React from "react";
import * as rtr from "react-router-dom";
import * as roles from "../roles";
import {
  RequestBody as BodyCliente,
  CartaoCredito
} from "../../../back/server/handlers/post/cadastraCliente";
import { Endereco } from "../../../back/server/handlers/shared/endereco";
import {
  RequestBody as BodyPrestador,
  ContaBancaria
} from "../../../back/server/handlers/post/cadastraPrestador";
import TextInput from "./TextInput";
const { Link } = rtr;

const STEP0 = 0;
const STEP1 = 1;
const STEP2 = 2;
const STEP3 = 3;

interface State {
  step: number;
  role: string;
  payloadCliente: BodyCliente;
  payloadPrestador: BodyPrestador;
}
const initalEndereco: Endereco = {
  uf: "MG",
  cidade: "Paula Cândido",
  bairro: "Esplanada",
  logradouro: "Rua dos Autos",
  numero: "12",
  complemento: "Apto. 500",
  cep: "32570-000"
};

const initialCartao: CartaoCredito = {
  nome: "Cliente 2 Cliente",
  numero: "1234123412341234",
  mesvencimento: 6,
  anovencimento: 15
};

const initalCliente: BodyCliente = {
  nome: "Carlitos Tevez",
  email: "cliente2@cliente.com",
  telefone: "78944561",
  senha: "cliente",
  cartao: initialCartao,
  endereco: initalEndereco,
  nomeendereco: "Escritório"
};

const initialConta: ContaBancaria = {
  nomebanco: "Caixa",
  agencia: "04298",
  conta: "06525"
};

const initialPrestador: BodyPrestador = {
  nome: "Prestador2",
  email: "prestador2@prestador.com",
  telefone: "12341234",
  senha: "prestador",
  foto: "https://lorempixel.com/400/400",
  conta: initialConta,
  endereco: initalEndereco
};

const initialState = {
  step: STEP0,
  role: "",
  payloadCliente: initalCliente,
  payloadPrestador: initialPrestador
};

class Registrar extends React.Component<
  {
    loading: boolean;
    cadastraCliente: (payload: BodyCliente) => void;
    cadastraPrestador: (payload: BodyPrestador) => void;
  },
  State
> {
  state = initialState;

  chooseClienteRole = () => {
    this.setState({ role: roles.CLIENTE });
    this.forward();
  };
  choosePrestadorRole = () => {
    this.setState({ role: roles.PRESTADOR });
    this.forward();
  };

  renderStep0 = () => (
    <section className="section has-text-centered">
      <div className="container">
        <h1 className="title">Escolha o tipo de registro</h1>
        <h2 className="subtitle">
          Você pode se registrar como um prestador de serviços ou um cliente de
          serviços.
        </h2>
        <div className="columns">
          <div className="column is-3" />
          <div className="column is-3">
            <button
              className={`button is-large is-fullwidth ${
                this.state.role === roles.CLIENTE && this.state.step !== STEP0
                  ? "is-active is-black"
                  : "is-outlined"
              }`}
              onClick={this.chooseClienteRole}
              disabled={this.state.step !== STEP0}
            >
              Cliente
            </button>
          </div>
          <div className="column is-3">
            <button
              className={`button is-large is-fullwidth ${
                this.state.role === roles.PRESTADOR && this.state.step !== STEP0
                  ? "is-active is-black"
                  : "is-outlined"
              }`}
              onClick={this.choosePrestadorRole}
              disabled={this.state.step !== STEP0}
            >
              Prestador
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  changePayloadRoot = (field: string, value: any) =>
    this.setState((state: State) => ({
      payloadCliente: {
        ...state.payloadCliente,
        [field]: value
      },
      payloadPrestador: {
        ...state.payloadPrestador,
        [field]: value
      }
    }));

  onChangeNome = (nome: string) => this.changePayloadRoot("nome", nome);
  onChangeEmail = (email: string) => this.changePayloadRoot("email", email);
  onChangeSenha = (senha: string) => this.changePayloadRoot("senha", senha);
  onChangeFoto = (foto: string) => this.changePayloadRoot("foto", foto);
  onChangeTelefone = (telefone: string) =>
    this.changePayloadRoot("telefone", String(telefone));

  renderDadosPessoais = (disabled: boolean) => {
    const data: BodyCliente | BodyPrestador =
      this.state.role === roles.CLIENTE
        ? this.state.payloadCliente
        : this.state.payloadPrestador;
    return (
      <section className="section">
        <div className="container">
          <h1 className="title has-text-centered">Dados pessoais</h1>

          <div className="columns">
            <div className="column is-3" />
            <div className="column is-6">
              <div className="box">
                <TextInput
                  label="Nome"
                  value={data.nome}
                  onChange={this.onChangeNome}
                  type="text"
                  disabled={disabled}
                />

                <TextInput
                  label="E-mail"
                  value={data.email}
                  onChange={this.onChangeEmail}
                  disabled={disabled}
                  type="email"
                />

                <TextInput
                  label="Telefone"
                  value={data.telefone}
                  onChange={this.onChangeTelefone}
                  disabled={disabled}
                  type="tel"
                />

                <TextInput
                  label="Senha"
                  value={data.senha}
                  onChange={this.onChangeSenha}
                  type="password"
                  disabled={disabled}
                />

                {this.state.role === roles.PRESTADOR && (
                  <TextInput
                    label="URL da foto"
                    value={(data as any).foto}
                    onChange={this.onChangeFoto}
                    type="text"
                    disabled={disabled}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  changeCard = (field: string, value: any) =>
    this.setState((state: State) => ({
      payloadCliente: {
        ...state.payloadCliente,
        cartao: {
          ...state.payloadCliente.cartao,
          [field]: value
        }
      }
    }));

  changeCardNome = (nome: string) => this.changeCard("nome", nome);
  changeCardNumero = (numero: number) => this.changeCard("numero", numero);
  changeCardAno = (anovencimento: number) =>
    this.changeCard("anovencimento", anovencimento);
  changeCardMes = (mesvencimento: number) =>
    this.changeCard("mesvencimento", mesvencimento);

  renderCartao = (disabled: boolean) => {
    const data = this.state.payloadCliente.cartao;
    return (
      <section className="section">
        <div className="container">
          <h1 className="title has-text-centered">Cartão de crédito</h1>

          <div className="columns">
            <div className="column is-3" />
            <div className="column is-6">
              <div className="box">
                <TextInput
                  label="Nome do titular"
                  value={data.nome}
                  onChange={this.changeCardNome}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Numero"
                  value={data.numero}
                  onChange={this.changeCardNumero}
                  type="number"
                  disabled={disabled}
                />
                <TextInput
                  label="Mês do vencimento"
                  value={data.mesvencimento}
                  onChange={this.changeCardMes}
                  type="number"
                  disabled={disabled}
                />
                <TextInput
                  label="Ano do vencimento"
                  value={data.anovencimento}
                  onChange={this.changeCardAno}
                  type="number"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  changeConta = (field: string, value: any) =>
    this.setState((state: State) => ({
      payloadPrestador: {
        ...state.payloadPrestador,
        conta: {
          ...state.payloadPrestador.conta,
          [field]: value
        }
      }
    }));
  changeContaNome = (nomebanco: string) =>
    this.changeConta("nomebanco", nomebanco);
  changeContaAgencia = (agencia: string) =>
    this.changeConta("agencia", agencia);
  changeContaConta = (conta: string) => this.changeConta("conta", conta);

  renderConta = (disabled: boolean) => {
    const data = this.state.payloadPrestador.conta;
    return (
      <section className="section">
        <div className="container">
          <h1 className="title has-text-centered">Cartão de crédito</h1>

          <div className="columns">
            <div className="column is-3" />
            <div className="column is-6">
              <div className="box">
                <TextInput
                  label="Nome do banco"
                  value={data.nomebanco}
                  onChange={this.changeContaNome}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Numero"
                  value={data.agencia}
                  onChange={this.changeContaAgencia}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Mês do vencimento"
                  value={data.conta}
                  onChange={this.changeContaConta}
                  type="text"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  changePayloadEndereco = (field: string, value: any) =>
    this.setState((state: State) => ({
      payloadCliente: {
        ...state.payloadCliente,
        endereco: {
          ...state.payloadCliente.endereco,
          [field]: value
        }
      },
      payloadPrestador: {
        ...state.payloadPrestador,
        endereco: {
          ...state.payloadCliente.endereco,
          [field]: value
        }
      }
    }));
  // bairro: String;
  // logradouro: String;
  // numero: String;
  // complemento: String;
  // cep: String;
  changeUF = (value: string) => this.changePayloadEndereco("uf", value);
  changeCidade = (value: string) => this.changePayloadEndereco("cidade", value);
  changeBairro = (value: string) => this.changePayloadEndereco("bairro", value);
  changeLogradouro = (value: string) =>
    this.changePayloadEndereco("logradouro", value);
  changeNumero = (value: string) => this.changePayloadEndereco("numero", value);
  changeComplemento = (value: string) =>
    this.changePayloadEndereco("complemento", value);
  changeCep = (value: string) => this.changePayloadEndereco("cep", value);

  changeNomeEndereco = (value: string) =>
    this.setState(state => ({
      payloadCliente: {
        ...state.payloadCliente,
        nomeendereco: value
      }
    }));

  renderEndereco = (disabled: boolean) => {
    const data: Endereco =
      this.state.role === roles.CLIENTE
        ? this.state.payloadCliente.endereco
        : this.state.payloadPrestador.endereco;
    return (
      <section className="section">
        <div className="container">
          <h1 className="title has-text-centered">Endereço</h1>
          <div className="columns">
            <div className="column is-3" />
            <div className="column is-6">
              <div className="box">
                {this.state.role === roles.CLIENTE && (
                  <TextInput
                    label="Nome do endereço"
                    value={this.state.payloadCliente.nomeendereco}
                    onChange={this.changeNomeEndereco}
                    type="text"
                    disabled={disabled}
                  />
                )}
                <TextInput
                  label="Unidade Federativa"
                  value={data.uf}
                  onChange={this.changeUF}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Cidade"
                  value={data.cidade}
                  onChange={this.changeCidade}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Bairro"
                  value={data.bairro}
                  onChange={this.changeBairro}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Logradouro"
                  value={data.logradouro}
                  onChange={this.changeLogradouro}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Numero"
                  value={data.numero}
                  onChange={this.changeNumero}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="Complemento"
                  value={data.complemento}
                  onChange={this.changeComplemento}
                  type="text"
                  disabled={disabled}
                />
                <TextInput
                  label="CEP"
                  value={data.cep}
                  onChange={this.changeCep}
                  type="text"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  renderHero = () => (
    <section className="hero is-success" key="Hero">
      <div className="hero-body">
        <div className="container">
          <div className="columns">
            <div className="column">
              <h1 className="title">UBERmo</h1>
              <h2 className="subtitle">Registro de novo usuário</h2>
            </div>
            <div className="column">
              <Link
                to="/"
                className="button is-pulled-right is-outlined has-text-success is-large"
              >
                VOLTAR À TELA INICIAL
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  navButtons = () => (
    <section className="section has-text-centered">
      <div className="container">
        <div className="columns">
          <div className="column is-3" />
          <div className="column is-3">
            <button
              className="button is-large is-success is-outlined is-fullwidth"
              onClick={this.forward}
            >
              {this.state.step === STEP3 ? "Finalizar" : "Continuar"}
            </button>
          </div>
          <div className="column is-3">
            <button
              className="button is-large is-danger is-outlined is-fullwidth"
              onClick={this.back}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  sanitizeStep = (step: number): number => Math.max(0, Math.min(3, step));
  forward = () => {
    if (this.state.step === STEP3) {
      //finalizar o trem
      if (this.state.role === roles.CLIENTE) {
        this.props.cadastraCliente(this.state.payloadCliente);
      } else {
        this.props.cadastraPrestador(this.state.payloadPrestador);
      }
      return;
    }
    this.setState(state => ({ step: this.sanitizeStep(state.step + 1) }));
  };
  back = () =>
    this.setState(state => ({ step: this.sanitizeStep(state.step - 1) }));

  render() {
    return (
      <div>
        {this.renderHero()}
        {this.renderStep0()}
        {this.state.step > STEP0 &&
          this.renderDadosPessoais(this.state.step !== STEP1)}
        {this.state.step > STEP1 &&
          (this.state.role === roles.CLIENTE
            ? this.renderCartao(this.state.step !== STEP2)
            : this.renderConta(this.state.step !== STEP2))}
        {this.state.step > STEP2 && this.renderEndereco(this.props.loading)}

        {this.state.step > STEP0 && this.navButtons()}
      </div>
    );
  }
}

export default Registrar;
