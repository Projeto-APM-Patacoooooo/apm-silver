create database apm_silver;
use apm_silver;


drop database apm_silver;
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
    conteudo varchar(9999) not null,
    data_publicacao date,
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
("Vice-diretor financeiro:", "Diretoria Financeira", "José Antônio Labella"),
("")
;

insert into noticias(titulo_noticia, conteudo, data_publicacao, id_staff)
values("Alunos do CPS são premiados com o Intercâmbio Cultural.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean velit mi, laoreet eu velit a, placerat placerat neque. Ut turpis elit, vestibulum et mattis at, ullamcorper sit amet neque. Pellentesque magna dolor, molestie sed metus a, molestie porta nisi. Donec sit amet leo nulla. Mauris sit amet urna diam. Nulla fermentum id leo in accumsan. Aliquam a semper urna, non mollis quam. Sed id tristique leo. Donec mollis elementum egestas. Nullam euismod enim ut dolor scelerisque tempor. Donec vehicula sem molestie ex rutrum bibendum ac in justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur lobortis tellus leo, vitae pulvinar diam vehicula at. Ut varius ultrices semper.

Donec ut magna sit amet neque condimentum varius sodales in orci. Duis fringilla fringilla mauris, ac molestie ipsum mattis et. Pellentesque augue tortor, vulputate in dui eget, tempus rutrum ligula. Duis porta maximus neque. Aliquam convallis vel orci in feugiat. Ut porta leo eget viverra tempus. Cras facilisis nulla eget efficitur auctor. Fusce at dapibus justo. Pellentesque vitae aliquam velit. Donec laoreet justo ut pulvinar feugiat. Sed sed efficitur felis.

Aliquam efficitur massa vel sapien ultricies dignissim. Quisque arcu purus, congue in lobortis in, aliquet sit amet enim. Quisque posuere a mauris varius fermentum. Vivamus eu ultricies magna, eget sodales arcu. Duis in faucibus augue, eu sagittis odio. Nunc ac nunc rhoncus, tristique eros non, vulputate tellus. Integer dolor mauris, venenatis vitae turpis sit amet, porttitor commodo urna. Quisque dignissim elit tortor, sodales fermentum ligula blandit at. Proin non dolor mauris.

Proin bibendum, nibh sed finibus porta, metus sem porta eros, eu efficitur risus quam sed sem. Mauris vel luctus dolor. Duis ut iaculis nisi. Sed quis sapien odio. Etiam pharetra hendrerit enim vel venenatis. Fusce sagittis sapien mi, a auctor mauris tristique quis. Vestibulum luctus dapibus elementum. Maecenas placerat sem id magna sagittis mattis. Etiam pretium leo ante. Nulla placerat eros a leo fringilla tincidunt. Pellentesque venenatis mi ut feugiat pretium. Maecenas id tristique ligula. Morbi sed eros sed ante semper tristique.

Sed dui elit, ultricies at nunc sit amet, laoreet vestibulum nibh. Nullam id consectetur diam. Suspendisse euismod dapibus ligula quis luctus. Ut lacinia pretium mauris non malesuada. Nunc aliquet, purus non rhoncus aliquam, mi magna condimentum ex, eu sodales nulla risus vestibulum eros. Morbi venenatis ipsum ac aliquet auctor. Vivamus ac quam ac eros finibus dignissim ac sed lectus. Cras eget pellentesque sapien. Donec vitae mauris id nulla aliquam maximus quis mollis nulla. Etiam sed sagittis est. Quisque at mi cursus, scelerisque justo quis, dictum diam.", "2025-03-31", 1),
("Alunos organizam um Escape Room.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean velit mi, laoreet eu velit a, placerat placerat neque. Ut turpis elit, vestibulum et mattis at, ullamcorper sit amet neque. Pellentesque magna dolor, molestie sed metus a, molestie porta nisi. Donec sit amet leo nulla. Mauris sit amet urna diam. Nulla fermentum id leo in accumsan. Aliquam a semper urna, non mollis quam. Sed id tristique leo. Donec mollis elementum egestas. Nullam euismod enim ut dolor scelerisque tempor. Donec vehicula sem molestie ex rutrum bibendum ac in justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur lobortis tellus leo, vitae pulvinar diam vehicula at. Ut varius ultrices semper.

Donec ut magna sit amet neque condimentum varius sodales in orci. Duis fringilla fringilla mauris, ac molestie ipsum mattis et. Pellentesque augue tortor, vulputate in dui eget, tempus rutrum ligula. Duis porta maximus neque. Aliquam convallis vel orci in feugiat. Ut porta leo eget viverra tempus. Cras facilisis nulla eget efficitur auctor. Fusce at dapibus justo. Pellentesque vitae aliquam velit. Donec laoreet justo ut pulvinar feugiat. Sed sed efficitur felis.

Aliquam efficitur massa vel sapien ultricies dignissim. Quisque arcu purus, congue in lobortis in, aliquet sit amet enim. Quisque posuere a mauris varius fermentum. Vivamus eu ultricies magna, eget sodales arcu. Duis in faucibus augue, eu sagittis odio. Nunc ac nunc rhoncus, tristique eros non, vulputate tellus. Integer dolor mauris, venenatis vitae turpis sit amet, porttitor commodo urna. Quisque dignissim elit tortor, sodales fermentum ligula blandit at. Proin non dolor mauris.

Proin bibendum, nibh sed finibus porta, metus sem porta eros, eu efficitur risus quam sed sem. Mauris vel luctus dolor. Duis ut iaculis nisi. Sed quis sapien odio. Etiam pharetra hendrerit enim vel venenatis. Fusce sagittis sapien mi, a auctor mauris tristique quis. Vestibulum luctus dapibus elementum. Maecenas placerat sem id magna sagittis mattis. Etiam pretium leo ante. Nulla placerat eros a leo fringilla tincidunt. Pellentesque venenatis mi ut feugiat pretium. Maecenas id tristique ligula. Morbi sed eros sed ante semper tristique.

Sed dui elit, ultricies at nunc sit amet, laoreet vestibulum nibh. Nullam id consectetur diam. Suspendisse euismod dapibus ligula quis luctus. Ut lacinia pretium mauris non malesuada. Nunc aliquet, purus non rhoncus aliquam, mi magna condimentum ex, eu sodales nulla risus vestibulum eros. Morbi venenatis ipsum ac aliquet auctor. Vivamus ac quam ac eros finibus dignissim ac sed lectus. Cras eget pellentesque sapien. Donec vitae mauris id nulla aliquam maximus quis mollis nulla. Etiam sed sagittis est. Quisque at mi cursus, scelerisque justo quis, dictum diam.", "2025-03-31", 2),
("TCC será realizado em dezembro.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean velit mi, laoreet eu velit a, placerat placerat neque. Ut turpis elit, vestibulum et mattis at, ullamcorper sit amet neque. Pellentesque magna dolor, molestie sed metus a, molestie porta nisi. Donec sit amet leo nulla. Mauris sit amet urna diam. Nulla fermentum id leo in accumsan. Aliquam a semper urna, non mollis quam. Sed id tristique leo. Donec mollis elementum egestas. Nullam euismod enim ut dolor scelerisque tempor. Donec vehicula sem molestie ex rutrum bibendum ac in justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur lobortis tellus leo, vitae pulvinar diam vehicula at. Ut varius ultrices semper.

Donec ut magna sit amet neque condimentum varius sodales in orci. Duis fringilla fringilla mauris, ac molestie ipsum mattis et. Pellentesque augue tortor, vulputate in dui eget, tempus rutrum ligula. Duis porta maximus neque. Aliquam convallis vel orci in feugiat. Ut porta leo eget viverra tempus. Cras facilisis nulla eget efficitur auctor. Fusce at dapibus justo. Pellentesque vitae aliquam velit. Donec laoreet justo ut pulvinar feugiat. Sed sed efficitur felis.

Aliquam efficitur massa vel sapien ultricies dignissim. Quisque arcu purus, congue in lobortis in, aliquet sit amet enim. Quisque posuere a mauris varius fermentum. Vivamus eu ultricies magna, eget sodales arcu. Duis in faucibus augue, eu sagittis odio. Nunc ac nunc rhoncus, tristique eros non, vulputate tellus. Integer dolor mauris, venenatis vitae turpis sit amet, porttitor commodo urna. Quisque dignissim elit tortor, sodales fermentum ligula blandit at. Proin non dolor mauris.

Proin bibendum, nibh sed finibus porta, metus sem porta eros, eu efficitur risus quam sed sem. Mauris vel luctus dolor. Duis ut iaculis nisi. Sed quis sapien odio. Etiam pharetra hendrerit enim vel venenatis. Fusce sagittis sapien mi, a auctor mauris tristique quis. Vestibulum luctus dapibus elementum. Maecenas placerat sem id magna sagittis mattis. Etiam pretium leo ante. Nulla placerat eros a leo fringilla tincidunt. Pellentesque venenatis mi ut feugiat pretium. Maecenas id tristique ligula. Morbi sed eros sed ante semper tristique.

Sed dui elit, ultricies at nunc sit amet, laoreet vestibulum nibh. Nullam id consectetur diam. Suspendisse euismod dapibus ligula quis luctus. Ut lacinia pretium mauris non malesuada. Nunc aliquet, purus non rhoncus aliquam, mi magna condimentum ex, eu sodales nulla risus vestibulum eros. Morbi venenatis ipsum ac aliquet auctor. Vivamus ac quam ac eros finibus dignissim ac sed lectus. Cras eget pellentesque sapien. Donec vitae mauris id nulla aliquam maximus quis mollis nulla. Etiam sed sagittis est. Quisque at mi cursus, scelerisque justo quis, dictum diam.", "2025-03-31", 4);



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