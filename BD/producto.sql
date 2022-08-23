-- auto-generated definition
create table producto
(
    idProducto  int auto_increment
        primary key,
    nombre      varchar(100) null,
    descripcion varchar(200) null,
    URLimage    varchar(700) null,
    precio      float        null,
    cantidad    int          null
);

