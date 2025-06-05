-- Drop existing chat table if it exists
DROP TABLE IF EXISTS chat CASCADE;

-- Create new chat table with updated structure
CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'company')),
    receiver_type VARCHAR(10) NOT NULL CHECK (receiver_type IN ('user', 'company')),
    message TEXT NOT NULL,
    vaga_id INTEGER REFERENCES vagas(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_chat_sender ON chat(sender_id, sender_type);
CREATE INDEX idx_chat_receiver ON chat(receiver_id, receiver_type);
CREATE INDEX idx_chat_created_at ON chat(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_chat_updated_at
    BEFORE UPDATE ON chat
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 