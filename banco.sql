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
values ("Bernadino", "bernardino@etec.sp.gov.br", "palmeiras", "Desenvolvedor"),
("Eduardo Linhares", "eduardo@etec.sp.gov.br", "agronejo", "Desenvolvedor"),
("Eduardo Bezerra", "eduardo@etec.sp.gov.br", "churrasco", "Desenvolvedor"),
("Gabriel", "gabriel@gmail.com", "garrafa", "Desenvolvedor");

create table if not exists noticias (
    id_noticia int primary key auto_increment,
    titulo_noticia varchar(150) not null,
    conteudo varchar(250) not null,
    data_publicacao datetime,
    id_staff int not null,
    foreign key (id_staff) references staffs(id_staff) on delete cascade
);

create table if not exists noticias_destaque(
	id_destaque int primary key not null,
	id_noticia int not null,
    foreign key (id_noticia) references noticias(id_noticia) on delete cascade
);

create table if not exists metas (
    id_meta int primary key auto_increment,
    titulo_meta varchar(150) not null,
    data_meta datetime,
    batida boolean default false,
    id_staff int not null,
    foreign key (id_staff) references staffs(id_staff) on delete cascade
);

create table if not exists metas_destaque(
	id_metades int primary key auto_increment,
    id_meta int not null,
    foreign key (id_meta) references metas(id_meta) on delete cascade
);

insert into noticias(titulo_noticia, conteudo, data_publicacao, id_staff)
values("Alunos do CPS são premiados com o Intercâmbio Cultural.", "blablabla cultura blablabl...", null, 1),
("Alunos organizam um Escape Room.", "blablabla Escape Room blablabla...", null, 2),
("TCC será realizado em dezembro.", "blablabla Trabalho de Conclusão de Curso blablabla...", null, 4);

insert into noticias_destaque(id_destaque, id_noticia)
values("1", "1"), ("2", "2"), ("3", "3");

insert into metas(titulo_meta, data_meta, batida, id_staff)
values("Comprar SSD´S para as máquinas dos laboratórios.", null, true, 2),
("Comprar novos ventiladores", null, true, 3),
("Passeio cultural para o Museu de História Natural de São Paulo", null, false, 1);

insert into metas_destaque(id_metades, id_meta)
values("1", "1"), ("2", "2"), ("3", "3");

select * from staffs;
select * from noticias;
select * from metas;