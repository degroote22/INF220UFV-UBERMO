-- Limpar o schema antes de começar a escrever de novo.
drop schema ubermo cascade;

create schema ubermo;
comment on schema ubermo is 'O schema da empresa Ubermo';

create table ubermo.tipo(
  id serial primary key,
  nome text not null,
  tipocobranca integer not null
);

create table ubermo.ofertado(
  id serial primary key,
  tipo serial not null references ubermo.tipo(id),
  descricao text not null,
  lat double precision not null,
  lng double precision not null,
  valordiaria integer not null,
  valorhora integer not null,
  valoratividade integer not null
);

create table enderecoprestador(
  prestador serial primary key references ubermo.prestador(id),
  uf text not null,
  cidade text not null,
  bairro text not null,
  logradouro text not null,
  numero text not null,
  complemento text not null,
  cep text not null  
);

create table ubermo.prestador(
  id serial primary key,

);

create table ubermo.conta(
  prestador serial primary key references ubermo.prestador(id),
  nomebanco text not null,
  agencia text not null,
  conta text not null
);