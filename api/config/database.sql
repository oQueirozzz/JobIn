create database jobin;

use jobin;

CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(30) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `descricao` TEXT,
    `formacao` VARCHAR(50),
    `curriculo` VARCHAR(255),
    `area_interesse` VARCHAR(50),
    `foto` VARCHAR(255),
    PRIMARY KEY(`id`)
);

CREATE TABLE `empresas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    `nome` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `cnpj` VARCHAR(14) NOT NULL,
    `senha` VARCHAR(30) NOT NULL,
    `descricao` TEXT,
    `logo` VARCHAR(255),
    PRIMARY KEY(`id`)
);

CREATE TABLE `vagas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    `empresa_id` INTEGER,
    `nome_vaga` VARCHAR(50) NOT NULL,
    `nome_empresa` VARCHAR(50) NOT NULL,
    `descricao` TEXT,
    `tipo_vaga` VARCHAR(30),
    `local_vaga` VARCHAR(50),
    `categoria` VARCHAR(50),
    PRIMARY KEY(`id`)
);

CREATE TABLE `candidaturas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    `id_usuario` INTEGER NOT NULL,
    `id_vaga` INTEGER NOT NULL,
    `curriculo_usuario` VARCHAR(255),
    PRIMARY KEY(`id`)
);

CREATE TABLE `chat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    `usuario_id` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `vaga_id` INTEGER,
    `mensagem` TEXT,
    `data` DATE NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    `usuario_id` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `acao` VARCHAR(100) NOT NULL,
    `resourse` VARCHAR(100) NOT NULL,
    `descricao` TEXT,
    `detalhes` JSON,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`)
);

CREATE TABLE `rotas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    `name` VARCHAR(100),
    `start_point` VARCHAR(255),
    `end_point` VARCHAR(255),
    `distance` FLOAT NOT NULL,
    `estimated_time` INTEGER NOT NULL,
    `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`)
);

CREATE TABLE `pontos_rotas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    `route_id` INTEGER NOT NULL,
    `sequence` INTEGER NOT NULL,
    `latitude` DECIMAL NOT NULL,
    `longitude` DECIMAL NOT NULL,
    `description` VARCHAR(255),
    PRIMARY KEY(`id`)
);

-- Chaves estrangeiras

ALTER TABLE `candidaturas`
ADD FOREIGN KEY(`id_usuario`) REFERENCES `usuarios`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `candidaturas`
ADD FOREIGN KEY(`id_vaga`) REFERENCES `vagas`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `vagas`
ADD FOREIGN KEY(`empresa_id`) REFERENCES `empresas`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `chat`
ADD FOREIGN KEY(`vaga_id`) REFERENCES `vagas`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `chat`
ADD FOREIGN KEY(`usuario_id`) REFERENCES `usuarios`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `chat`
ADD FOREIGN KEY(`empresa_id`) REFERENCES `empresas`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `logs`
ADD FOREIGN KEY(`usuario_id`) REFERENCES `usuarios`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `logs`
ADD FOREIGN KEY(`empresa_id`) REFERENCES `empresas`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `rotas`
ADD FOREIGN KEY(`created_by`) REFERENCES `usuarios`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `pontos_rotas`
ADD FOREIGN KEY(`route_id`) REFERENCES `rotas`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
