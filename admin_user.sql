 create table platform_admin_user(
 id int(5) not null primary key auto_increment,
 realname char(20) not null,
 email char(20) not null,
 type char(20) not null,
 password varchar(256) not null,
 extension varchar(256)
);

insert into platform_admin_user (realname,email,type,password) values ('renyuan','renyuan','0','123456');