-- Limpar o schema antes de começar a escrever de novo.
drop schema ubermo cascade;

create schema ubermo;
comment on schema ubermo is 'O schema da empresa Ubermo';

-- create extension if not exists "pgcrypto";

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
  valordiaria integer,
  valorhora integer,
  valoratividade integer
);

create table ubermo.prestador(
  email text primary key,
  nome text not null,
  telefone text not null,
  nota double precision not null,
  foto text not null
);

create table ubermo.enderecoprestador(
  prestador text primary key references ubermo.prestador(email),
  uf text not null,
  cidade text not null,
  bairro text not null,
  logradouro text not null,
  numero text not null,
  complemento text not null,
  cep text not null  
);

create table ubermo.conta(
  prestador text primary key references ubermo.prestador(email),
  nomebanco text not null,
  agencia text not null,
  conta text not null
);

create table ubermo.cliente(
  email text  primary key,
  nome text not null,
  telefone text not null,
  nota double precision not null,
  hash text not null
);

create table ubermo.enderecocliente(
  cliente text primary key references ubermo.cliente(email),
  uf text not null,
  cidade text not null,
  bairro text not null,
  logradouro text not null,
  numero text not null,
  complemento text not null,
  cep text not null  
);

create table ubermo.cartao(
  cliente text primary key references ubermo.cliente(email),
  nome text not null,
  numero text not null,
  anovencimento serial not null,
  mesvencimento serial not null
);

create table ubermo.contratado(
  id serial primary key,
  servico serial not null references ubermo.ofertado(id),
  cliente text not null references ubermo.cliente(email),
  datapedido timestamp not null,
  dataconclusao timestamp,
  quantidadehoras serial,
  quantidadedias serial,
  status integer not null,
  notacliente double precision,
  notaprestador double precision,
  comentariocliente text,
  comentarioprestador text
);

create table ubermo.admin(
  nome text not null,
  email text not null primary key,
  hash text not null
);

begin;
insert into ubermo.admin(nome, email, hash) values ('Admin', 'admin@admin.com', crypt('admin', gen_salt('bf')));
commit;

