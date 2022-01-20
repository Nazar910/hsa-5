drop table if exists events;

create table events(
  id int not null AUTO_INCREMENT,
  name CHAR(30) not null,
  PRIMARY KEY(id)
) ENGINE=InnoDB;
