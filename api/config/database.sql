create database jobin;

use jobin;

CREATE TABLE `usuarios` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`nome` VARCHAR(100) NOT NULL,
	`email` VARCHAR(100) NOT NULL,
	`senha` VARCHAR(100) NOT NULL,
	`cpf` VARCHAR(11) NOT NULL UNIQUE,
	`data_nascimento` VARCHAR(100) NOT NULL,
	`habilidades` VARCHAR(50),
	`descricao` TEXT(200),
	`formacao` VARCHAR(50),
	`curriculo` longtext,
	`area_interesse` VARCHAR(50),
    `tipo` varchar(50),
	`foto` longtext,
	`certificados` longtext,
	PRIMARY KEY(`id`)
);

CREATE TABLE `empresas` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`nome` VARCHAR(50) NOT NULL,
	`email` VARCHAR(100) NOT NULL,
	`cnpj` VARCHAR(14) NOT NULL UNIQUE,
	`senha` VARCHAR(100) NOT NULL,
	`descricao` TEXT,
    `local` varchar(100),
    `tipo` varchar(50),
	`logo` longtext,
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
    `salario` VARCHAR(255),
	PRIMARY KEY(`id`)
);

CREATE TABLE `candidaturas` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`id_usuario` INTEGER NOT NULL,
	`id_vaga` INTEGER NOT NULL,
    `empresa_id` integer not null,
	`curriculo_usuario` longtext,
	`status` ENUM('PENDENTE', 'APROVADO', 'REJEITADO', 'EM_ESPERA') DEFAULT 'PENDENTE',
	`data_atualizacao` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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

CREATE TABLE `notificacao` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`candidaturas_id` INTEGER NOT NULL,
	`empresas_id` INTEGER NOT NULL,
    `usuarios_id` INTEGER NOT NULL,
	`mensagem_usuario` VARCHAR(100),
    `mensagem_empresa` VARCHAR(100),
	`status_candidatura` ENUM('PENDENTE', 'APROVADO', 'REJEITADO', 'EM_ESPERA'),
	`data_notificacao` DATETIME DEFAULT CURRENT_TIMESTAMP,
	`lida` BOOLEAN DEFAULT FALSE,
	PRIMARY KEY(`id`)
);

CREATE TABLE `posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    `empresa_id` INTEGER NOT NULL,
    `titulo` VARCHAR(100) NOT NULL,
    `conteudo` TEXT NOT NULL,
    `imagem` longtext, -- opcional
    `data_publicacao` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE CASCADE
);

-- Chaves estrangeiras

ALTER TABLE `posts`
ADD FOREIGN KEY(`empresa_id`) REFERENCES `empresas`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;

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

# Triggers

DELIMITER $$
-- Quando um usuário for deletado, sua candidatura em uma vaga será excluida automaticamente

CREATE TRIGGER before_delete_usuarios
BEFORE DELETE ON usuarios
FOR EACH ROW
BEGIN
    DELETE FROM candidaturas
    WHERE id_usuario = OLD.id;
END$$

-- Deleta as candidaturas de uma vaga quando ela for excluida
CREATE TRIGGER before_delete_vagas
BEFORE DELETE ON vagas
FOR EACH ROW
BEGIN
    DELETE FROM candidaturas
    where id_vaga = old.id;
END$$

-- Trigger para deletar mensagens do chat quando um usuário for excluído
CREATE TRIGGER before_delete_usuario_chat
BEFORE DELETE ON usuarios
FOR EACH ROW
BEGIN
    DELETE FROM chat WHERE usuario_id = OLD.id;
END$$

-- Trigger para deletar mensagens do chat quando uma empresa for excluída
CREATE TRIGGER before_delete_empresa_chat
BEFORE DELETE ON empresas
FOR EACH ROW
BEGIN
    DELETE FROM chat WHERE empresa_id = OLD.id;
END$$

-- Trigger para deletar logs relacionados a um usuário excluído
CREATE TRIGGER before_delete_usuario_logs
BEFORE DELETE ON usuarios
FOR EACH ROW
BEGIN
    DELETE FROM logs WHERE usuario_id = OLD.id;
END$$

-- Trigger para deletar logs relacionados a uma empresa excluída
CREATE TRIGGER before_delete_empresa_logs
BEFORE DELETE ON empresas
FOR EACH ROW
BEGIN
    DELETE FROM logs WHERE empresa_id = OLD.id;
END$$

-- Trigger para deletar notificações relacionadas a uma candidatura excluída
CREATE TRIGGER before_delete_candidatura_notificacoes
BEFORE DELETE ON candidaturas
FOR EACH ROW
BEGIN
    DELETE FROM notificacao WHERE candidaturas_id = OLD.id;
END$$

-- Trigger para criar notificação quando o status da candidatura for alterado
CREATE TRIGGER after_update_candidatura_status
AFTER UPDATE ON candidaturas
FOR EACH ROW
BEGIN
    DECLARE empresa_id INT;

    IF OLD.status <> NEW.status THEN
        -- Obter o ID da empresa da vaga
        SELECT empresa_id INTO empresa_id FROM vagas WHERE id = NEW.id_vaga;

        -- Inserir notificação
        INSERT INTO notificacao (
            candidaturas_id, empresas_id, usuarios_id, 
            mensagem_usuario, mensagem_empresa, status_candidatura
        )
        VALUES (
            NEW.id,
            empresa_id,
            NEW.id_usuario,
            CASE 
                WHEN NEW.status = 'APROVADO' THEN 'Parabéns! Sua candidatura foi aprovada.'
                WHEN NEW.status = 'REJEITADO' THEN 'Sua candidatura não foi aprovada desta vez.'
                WHEN NEW.status = 'EM_ESPERA' THEN 'Sua candidatura está em análise.'
                ELSE 'O status da sua candidatura foi atualizado.'
            END,
            CASE 
                WHEN NEW.status = 'APROVADO' THEN 'Você aprovou uma candidatura.'
                WHEN NEW.status = 'REJEITADO' THEN 'Você rejeitou uma candidatura.'
                WHEN NEW.status = 'EM_ESPERA' THEN 'Você colocou uma candidatura em espera.'
                ELSE 'Você atualizou o status de uma candidatura.'
            END,
            NEW.status
        );
    END IF;
END$$

DELIMITER ;
-- Inserindo dados

INSERT INTO empresas (nome, email, cnpj, senha, descricao, logo) VALUES
('TechLight Soluções', 'contato@techlight.com', '12345678000100', 'senha123', 'Empresa especializada em soluções de tecnologia e automação.', 'logo_techlight.png'),
('Oficina Ideal', 'oficina@ideal.com', '23456789000111', 'senha456', 'Oficina mecânica moderna com foco em inovação e qualidade.', 'logo_oficina.png'),
('Gráfica PrintMais', 'contato@printmais.com', '34567890000122', 'senha789', 'Gráfica digital com serviços personalizados e impressão rápida.', 'logo_printmais.png');

INSERT INTO usuarios (
    nome, email, senha, cpf, data_nascimento, habilidades, descricao, formacao, curriculo, area_interesse, foto, certificados
) VALUES
(
    'João da Silva', 
    'joao.silva@email.com', 
    'joao123', 
    '12345678901', 
    '1998-05-10', 
    'HTML, CSS, JavaScript', 
    'Desenvolvedor web júnior em busca de oportunidades.', 
    'Técnico em Informática', 
    'curriculo_joao.pdf', 
    'Desenvolvimento Web', 
    'joao.png', 
    'certificado_frontend.pdf'
),
(
    'Maria Oliveira', 
    'maria.oliveira@email.com', 
    'maria456', 
    '23456789012', 
    '1995-08-22', 
    'Photoshop, Figma, Illustrator', 
    'Designer com experiência em identidade visual e UI/UX.', 
    'Design Gráfico', 
    'curriculo_maria.pdf', 
    'Design', 
    'maria.png', 
    'certificado_design.pdf'
),
(
    'Carlos Souza', 
    'carlos.souza@email.com', 
    'carlos789', 
    '34567890123', 
    '1992-11-15', 
    'Manutenção, Redes, Atendimento', 
    'Técnico em manutenção com foco em suporte técnico.', 
    'Redes de Computadores', 
    'curriculo_carlos.pdf', 
    'Suporte Técnico', 
    'carlos.png', 
    'certificado_redes.pdf'
);


INSERT INTO vagas (empresa_id, nome_vaga, nome_empresa, descricao, tipo_vaga, local_vaga, categoria) VALUES
(1, 'Desenvolvedor Frontend Júnior', 'TechLight Soluções', 'Atuar com desenvolvimento de interfaces web responsivas.', 'CLT', 'São Lucas do Oeste', 'TI'),
(2, 'Auxiliar de Mecânica', 'Oficina Ideal', 'Auxílio em reparos e manutenção de veículos.', 'Estágio', 'São Lucas do Oeste', 'Mecânica'),
(3, 'Designer Gráfico', 'Gráfica PrintMais', 'Criação de materiais gráficos para impressão e digital.', 'Freelancer', 'São Lucas do Oeste', 'Design');

INSERT INTO candidaturas (id_usuario, id_vaga, curriculo_usuario) VALUES
(1, 1, 'curriculo_joao.pdf'),  -- João se candidatou para Desenvolvedor Frontend
(2, 3, 'curriculo_maria.pdf'), -- Maria se candidatou para Designer Gráfico
(3, 2, 'curriculo_carlos.pdf'); -- Carlos se candidatou para Auxiliar de Mecânica

select * from usuarios;
select * from logs;
select * from candidaturas;
select * from empresas;

ALTER TABLE logs MODIFY COLUMN empresa_id INT NULL;