CREATE DATABASE jobin;

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
    empresa_id INTEGER REFERENCES empresas(id),
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
    id_usuario INTEGER REFERENCES usuarios(id),
    id_vaga INTEGER REFERENCES vagas(id),
    empresa_id INTEGER NOT NULL,
    curriculo_usuario TEXT,
    status VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'APROVADO', 'REJEITADO', 'EM_ESPERA')),
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    empresa_id INTEGER REFERENCES empresas(id),
    vaga_id INTEGER REFERENCES vagas(id),
    mensagem TEXT,
    data DATE NOT NULL
);

CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    empresa_id INTEGER REFERENCES empresas(id),
    acao VARCHAR(100) NOT NULL,
    resourse VARCHAR(100) NOT NULL,
    descricao TEXT,
    detalhes JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE notificacao (
    id SERIAL PRIMARY KEY,
    candidaturas_id INTEGER NOT NULL,
    empresas_id INTEGER REFERENCES empresas(id),
    usuarios_id INTEGER REFERENCES usuarios(id),
    mensagem_usuario VARCHAR(255),
    mensagem_empresa VARCHAR(255),
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('LOGIN', 'CANDIDATURA_CRIADA', 'CANDIDATURA_REMOVIDA', 'CANDIDATURA_APROVADA', 'CANDIDATURA_REJEITADA', 'CANDIDATURA_EM_ESPERA', 'PERFIL_ATUALIZADO', 'SENHA_ALTERADA', 'VAGA_CRIADA', 'VAGA_ATUALIZADA', 'VAGA_EXCLUIDA', 'PERFIL_VISITADO')),
    status_candidatura VARCHAR(20) CHECK (status_candidatura IN ('PENDENTE', 'APROVADO', 'REJEITADO', 'EM_ESPERA')),
    data_notificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT FALSE
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
    titulo VARCHAR(100) NOT NULL,
    conteudo TEXT NOT NULL,
    imagem TEXT,
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidaturas_removidas (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id),
    id_vaga INTEGER REFERENCES vagas(id),
    data_remocao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_vagas_updated_at
    BEFORE UPDATE ON vagas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for cascading deletes
CREATE OR REPLACE FUNCTION delete_candidaturas_on_usuario_delete()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM candidaturas WHERE id_usuario = OLD.id;
    RETURN OLD;
END;
$$ language 'plpgsql';

CREATE TRIGGER before_delete_usuarios
    BEFORE DELETE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION delete_candidaturas_on_usuario_delete();

CREATE OR REPLACE FUNCTION delete_candidaturas_on_vaga_delete()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM candidaturas WHERE id_vaga = OLD.id;
    RETURN OLD;
END;
$$ language 'plpgsql';

CREATE TRIGGER before_delete_vagas
    BEFORE DELETE ON vagas
    FOR EACH ROW
    EXECUTE FUNCTION delete_candidaturas_on_vaga_delete();

CREATE OR REPLACE FUNCTION delete_chat_on_usuario_delete()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM chat WHERE usuario_id = OLD.id;
    RETURN OLD;
END;
$$ language 'plpgsql';

CREATE TRIGGER before_delete_usuario_chat
    BEFORE DELETE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION delete_chat_on_usuario_delete();

CREATE OR REPLACE FUNCTION delete_chat_on_empresa_delete()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM chat WHERE empresa_id = OLD.id;
    RETURN OLD;
END;
$$ language 'plpgsql';

CREATE TRIGGER before_delete_empresa_chat
    BEFORE DELETE ON empresas
    FOR EACH ROW
    EXECUTE FUNCTION delete_chat_on_empresa_delete();

-- Inserindo dados

select * from usuarios;
select * from logs;
select * from candidaturas;
select * from empresas;


