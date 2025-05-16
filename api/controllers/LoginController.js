const accessToken = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '30d' });

// Armazene refreshToken no banco se quiser controlar invalidação
res.json({ accessToken, refreshToken });
