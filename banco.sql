create database apm_silver;
use apm_silver;

create table if not exists staffs (
    id_staff int primary key auto_increment,
    nome varchar(250) not null,
    email varchar(250) not null,
    senha varchar(250) not null,
    cargo varchar(150) not null
);

insert into staffs(nome, email, senha, cargo)
values("Admin", "admin@apmsilver.com.br", "$2b$10$n7K4TsKlT3VCKtd66VKmHOoN./0u/gJy13kTGexGIw/JXOmWvnHti", "Conta Administrativa");

create table if not exists noticias (
    id_noticia int primary key auto_increment,
    titulo_noticia varchar(150) not null,
    conteudo varchar(250) not null,
    data_publicacao date not null,
    data_edicao date not null,
    id_staff int not null,
    foreign key (id_staff) references staffs(id_staff) on delete cascade
);

create table if not exists instituicao(
	id int auto_increment primary key unique,
	nome varchar(250) not null,
    cnpj varchar(20) not null,
    conta int not null,
    agencia int not null
);

create table if not exists metas (
    id_meta int primary key auto_increment,
    titulo_meta varchar(150) not null,
    data_meta datetime,
    batida boolean default false,
    id_staff int not null,
    foreign key (id_staff) references staffs(id_staff) on delete cascade
);

create table if not exists membros_etec(
	id int primary key auto_increment,
    cargo varchar(150) not null,
    setor varchar(200) not null,
    nome varchar(150) not null unique
);

insert into membros_etec(cargo, setor, nome)
values ("Diretor", "Diretoria Executiva", "Bruno Santos Nascimento"),
("Vice-diretora Executiva:", "Diretoria Executiva", "Maria Ângela Teodoro"),
("Diretora", "Diretoria Financeira", "Magali Aparecida Dias"),
("Vice-diretor financeiro:", "Diretoria Financeira", "José Antônio Labella");

insert into metas(titulo_meta, data_meta, batida, id_staff)
values("Comprar SSD´S para as máquinas dos laboratórios.", null, true, 2),
("Comprar novos ventiladores", null, true, 3),
("Passeio cultural para o Museu de História Natural de São Paulo", null, false, 1);

select * from staffs;
select * from noticias;
select * from metas;
select * from instituicao;