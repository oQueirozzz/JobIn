-- Conecte-se ao banco
\c jobin;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento VARCHAR(100) NOT NULL,
    habilidades VARCHAR(50),
    descricao TEXT,
    formacao VARCHAR(50),
    curriculo TEXT,
    area_interesse VARCHAR(50),
    tipo VARCHAR(50),
    foto TEXT,
    certificados TEXT
);

CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    descricao TEXT,
    local VARCHAR(100),
    tipo VARCHAR(50),
    logo TEXT
);

CREATE TABLE vagas (
    id SERIAL PRIMARY KEY,
    empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
    nome_vaga VARCHAR(50) NOT NULL,
    nome_empresa VARCHAR(50) NOT NULL,
    descricao TEXT,
    tipo_vaga VARCHAR(30),
    local_vaga VARCHAR(50),
    categoria VARCHAR(50),
    requisitos TEXT,
    salario VARCHAR(255),
    status VARCHAR(20) DEFAULT 'aberta',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidaturas (
    id SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id) ON DELETE CASCADE,
    id_vaga INT REFERENCES vagas(id) ON DELETE CASCADE,
    empresa_id INT NOT NULL,
    curriculo_usuario TEXT,
    status VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'APROVADO', 'REJEITADO', 'EM_ESPERA')),
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
    vaga_id INT REFERENCES vagas(id) ON DELETE CASCADE,
    mensagem TEXT,
    data DATE NOT NULL
);

CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    empresa_id INT REFERENCES empresas(id),
    acao VARCHAR(100) NOT NULL,
    resourse VARCHAR(100) NOT NULL,
    descricao TEXT,
    detalhes JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);


CREATE TABLE notificacao (
    id SERIAL PRIMARY KEY,
    candidaturas_id INT REFERENCES candidaturas(id) ON DELETE CASCADE,
    empresa_id INT REFERENCES empresas(id),
    usuario_id INT REFERENCES usuarios(id),
    mensagem_usuario VARCHAR(255),
    mensagem_empresa VARCHAR(255),
    tipo VARCHAR(50) NOT NULL CHECK (
        tipo IN (
            'LOGIN', 'CANDIDATURA_CRIADA', 'CANDIDATURA_REMOVIDA', 'CANDIDATURA_APROVADA',
            'CANDIDATURA_REJEITADA', 'CANDIDATURA_EM_ESPERA', 'PERFIL_ATUALIZADO',
            'SENHA_ALTERADA', 'VAGA_CRIADA', 'VAGA_ATUALIZADA', 'VAGA_EXCLUIDA', 'PERFIL_VISITADO',
            'CONTA_CRIADA'
        )
    ),
    status_candidatura VARCHAR(20) CHECK (status_candidatura IN ('PENDENTE', 'APROVADO', 'REJEITADO', 'EM_ESPERA')),
    data_notificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT FALSE
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
    titulo VARCHAR(100) NOT NULL,
    conteudo TEXT NOT NULL,
    imagem TEXT,
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidaturas_removidas (
    id SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id),
    id_vaga INT REFERENCES vagas(id),
    data_remocao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Funções

CREATE OR REPLACE FUNCTION delete_usuario_dependencias() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM candidaturas WHERE id_usuario = OLD.id;
    DELETE FROM chat WHERE usuario_id = OLD.id;
    DELETE FROM logs WHERE usuario_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_empresa_dependencias() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM chat WHERE empresa_id = OLD.id;
    DELETE FROM logs WHERE empresa_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_vaga_dependencias() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM candidaturas WHERE id_vaga = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_candidatura_dependencias() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM notificacao WHERE candidaturas_id = OLD.id;
    INSERT INTO candidaturas_removidas (id_usuario, id_vaga)
    VALUES (OLD.id_usuario, OLD.id_vaga);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notificar_status_candidatura() RETURNS TRIGGER AS $$
DECLARE
    empresa INT;
BEGIN
    IF OLD.status <> NEW.status THEN
        SELECT empresa_id INTO empresa FROM vagas WHERE id = NEW.id_vaga;

        INSERT INTO notificacao (
            candidaturas_id, empresas_id, usuarios_id,
            mensagem_usuario, mensagem_empresa, status_candidatura
        )
        VALUES (
            NEW.id,
            empresa,
            NEW.id_usuario,
            CASE NEW.status
                WHEN 'APROVADO' THEN 'Parabéns! Sua candidatura foi aprovada.'
                WHEN 'REJEITADO' THEN 'Sua candidatura não foi aprovada desta vez.'
                WHEN 'EM_ESPERA' THEN 'Sua candidatura está em análise.'
                ELSE 'O status da sua candidatura foi atualizado.'
            END,
            CASE NEW.status
                WHEN 'APROVADO' THEN 'Você aprovou uma candidatura.'
                WHEN 'REJEITADO' THEN 'Você rejeitou uma candidatura.'
                WHEN 'EM_ESPERA' THEN 'Você colocou uma candidatura em espera.'
                ELSE 'Você atualizou o status de uma candidatura.'
            END,
            NEW.status
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers

CREATE TRIGGER trg_delete_usuario_dependencias
BEFORE DELETE ON usuarios
FOR EACH ROW EXECUTE FUNCTION delete_usuario_dependencias();

CREATE TRIGGER trg_delete_empresa_dependencias
BEFORE DELETE ON empresas
FOR EACH ROW EXECUTE FUNCTION delete_empresa_dependencias();

CREATE TRIGGER trg_delete_vaga_dependencias
BEFORE DELETE ON vagas
FOR EACH ROW EXECUTE FUNCTION delete_vaga_dependencias();

CREATE TRIGGER trg_delete_candidatura_dependencias
BEFORE DELETE ON candidaturas
FOR EACH ROW EXECUTE FUNCTION delete_candidatura_dependencias();

CREATE TRIGGER trg_notificar_status_candidatura
AFTER UPDATE ON candidaturas
FOR EACH ROW EXECUTE FUNCTION notificar_status_candidatura();



select table_name from information_schema.tables where table_schema = 'public';