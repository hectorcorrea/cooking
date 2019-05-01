# Execute as mysql < createdb.sql
CREATE DATABASE cookingdb;

USE cookingdb;

CREATE TABLE recipes (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  ingredients TEXT NULL,
  directions TEXT NULL,
  notes TEXT NULL,
  slug VARCHAR(255) NULL,
  createdOn DATETIME NOT NULL,
  updatedOn DATETIME NULL,
  starred BOOLEAN NOT NULL,
  shopping BOOLEAN NOT NULL
);

CREATE INDEX recipes_index_name ON recipes(name);

CREATE TABLE users (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  login VARCHAR(255) NOT NULL,
  name VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE INDEX users_index_id ON users(id);


CREATE TABLE sessions (
  id char(64) NOT NULL PRIMARY KEY,
  userId INT NOT NULL,
  expiresOn DATETIME NOT NULL
);

CREATE INDEX sessions_index_id ON sessions(id);
