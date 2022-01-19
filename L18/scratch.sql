drop table if exists events;

create table events(
  id int not null AUTO_INCREMENT,
  name CHAR(30) not null,
  PRIMARY KEY(id)
) ENGINE=InnoDB;

insert into events(name) values ('some-event'),('some-another-event');

select * from events;

GRANT REPLICATION SLAVE ON *.* TO 'slave'@'%' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;

USE mydb;
FLUSH TABLES WITH READ LOCK;

SHOW MASTER STATUS;
