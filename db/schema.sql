-- Limpar o schema antes de começar a escrever de novo.
drop schema ubermo cascade;
create extension if not exists "pgcrypto";

create schema ubermo;
comment on schema ubermo is 'O schema da empresa Ubermo';

-- create extension if not exists "pgcrypto";

create table ubermo.tipo(
  id serial primary key,
  nome text not null,
  tipocobranca integer not null
);

create table ubermo.prestador(
  nome text not null,
  email text primary key,
  telefone text not null,
  nota double precision not null,
  foto text not null,
  hash text not null
);

create table ubermo.ofertado(
  id serial primary key,
  tipo serial not null references ubermo.tipo(id),
  prestador text not null references ubermo.prestador(email),
  descricao text not null,
  lat double precision not null,
  lng double precision not null,
  valor integer
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
  anovencimento integer not null,
  mesvencimento integer not null
);

create table ubermo.contratado(
  id serial primary key,
  servico serial not null references ubermo.ofertado(id),
  cliente text not null references ubermo.cliente(email),
  datapedido timestamp not null,
  dataconclusao timestamp,
  quantidade integer,
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

insert into ubermo.cliente(nome, email, hash, telefone, nota) values
  ('Cliente', 'cliente@cliente.com', crypt('cliente', gen_salt('bf')), '31 98655-2148', 4);
insert into ubermo.cartao(cliente, nome, numero, anovencimento, mesvencimento) values
  ('cliente@cliente.com', 'Cliente C. Cliente', '7894-2548-6245-3501', 22, 05);
insert into ubermo.enderecocliente(cliente, uf, cidade, bairro, logradouro, numero, complemento, cep) values
  ('cliente@cliente.com', 'Minas Gerais', 'Viçosa', 'Centro', 'Av. PH Rolfs', '183', 'Apto 302', '36570-000');

insert into ubermo.prestador(nome, email, hash, telefone, nota, foto) values
  ('Prestador', 'prestador@prestador.com', crypt('prestador', gen_salt('bf')), '31 3847-3822',5, 'lorempixel.com/400/400');
insert into ubermo.enderecoprestador(prestador, uf, cidade, bairro, logradouro, numero, complemento, cep) values
  ('prestador@prestador.com', 'Minas Gerais', 'Viçosa', 'Centro', 'Av. PH Rolfs', '183', 'Apto 302', '36570-000');
insert into ubermo.conta(prestador, nomebanco, agencia, conta) VALUES
  ('prestador@prestador.com', 'Banco do Brasil', '0428-6', '05254');

insert into ubermo.tipo(nome, tipocobranca) values
  ('Lavagem de carro',  2),
  ('Pintura de casas',  1),
  ('Aula de violão',    0);

insert into ubermo.ofertado(tipo, prestador, descricao, lat, lng, valor) values
  (
    1,
    'prestador@prestador.com',
    'Sou muito bom lavador. Anos de experiência.',
    -20.774866,
    -42.871579,
    5000
  );

insert into ubermo.ofertado(tipo, prestador, descricao, lat, lng, valor) values
  (
    2,
    'prestador@prestador.com',
    'Sou muito bom pintor. Anos de experiência.',
    -20.759866,
    -42.871579,
    15000
  );

insert into ubermo.ofertado(tipo, prestador, descricao, lat, lng, valor) values
  (
    3,
    'prestador@prestador.com',
    'Sou muito bom professor. Anos de experiência.',
    -20.764866,
    -42.888579,
    4000
  );

insert into ubermo.contratado(
  servico,
  cliente,
  datapedido,
  dataconclusao,
  quantidade,
  status,
  notacliente,
  notaprestador,
  comentariocliente,
  comentarioprestador
) values
  (
    1,
    'cliente@cliente.com',
    NOW() - interval '3 day',
    NOW() - interval '2 day',
    1,
    2,
    4.0,
    5.0,
    'Meio arrogante',
    'Não suja o carro'
  ),
  (
    2,
    'cliente@cliente.com',
    NOW() - interval '25 day',
    NOW() - interval '24 day',
    2,
    2,
    4.2,
    5.0,
    'Meio arrogante',
    'Não suja o chão'
  ),
  (
    3,
    'cliente@cliente.com',
    NOW() - interval '5 day',
    NULL,
    10,
    1,
    4.0,
    4.8,
    'Meio arrogante',
    'Não suja o violão'
  );

commit;

