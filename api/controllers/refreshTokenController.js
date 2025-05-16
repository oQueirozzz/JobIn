// rota: /api/refresh-token
export const refreshTokenController = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token necessário' });
  
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const novoAccessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '15m' });
      return res.json({ accessToken: novoAccessToken });
    } catch (err) {
      return res.status(403).json({ message: 'Refresh token inválido ou expirado' });
    }
  };
  