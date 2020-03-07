drop database if exists employee_tracker;
create database employee_tracker;

use employee_tracker;

create table employee(
	id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id integer not null,
    manager_id integer null
);

create table role(
	id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    title varchar(30) not null,
    salary decimal null,
    department_id integer
);

create table department(
	id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    name varchar(30)
);


insert into department (name)
values ('Front of House'),('Back of House'),('Human Resources'),('Management');

insert into role(title, salary, department_id)
values ('Server', 25000, 1),('Busser', 12000, 1),('Host', 15000, 1),('Cook', 30000, 2),('Dishwasher', 18000, 2),('Payroll', 40000, 3),('Publisher', 40000, 3),('Floor Manager', 50000, 4),('Kitchen Manager', 50000, 4),('General Manager', 60000, 4);

insert into employee(first_name, last_name, role_id, manager_id)
values ('James', 'Dobbe', 8, 2),('Liz', 'Calouri', 10, null),('John', 'Haltom', 10, null),('Celina', 'Merger', 3, 1),('Roberto', 'Villegas', 4, 3),('Austin', 'Springob', 2, 1),('Carole', 'Haltom', 6, 2),('Florentino', 'Rodriguez', 4, 3),('Margarita', 'Sanchez', 4, 8),('Juan', 'Carlos', 2, 3),('Payten', 'Yarbrough', 1, 1),('Jessica', 'Ettinger', 7, 2);

