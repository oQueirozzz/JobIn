CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    empresa_id INTEGER REFERENCES empresas(id),
    tipo_acao VARCHAR(50) NOT NULL,
    tipo_entidade VARCHAR(50) NOT NULL,
    descricao TEXT,
    dados_adicionais JSONB,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS notificacao CASCADE;

CREATE TABLE IF NOT EXISTS notificacao (
    id SERIAL PRIMARY KEY,
    candidaturas_id INTEGER REFERENCES candidaturas(id),
    empresas_id INTEGER REFERENCES empresas(id),
    usuarios_id INTEGER REFERENCES usuarios(id),
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