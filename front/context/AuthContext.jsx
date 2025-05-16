
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import api, { setAuthToken } from '../services/api';

// // Criando o contexto de autenticação
// const AuthContext = createContext();

// // Hook personalizado para usar o contexto de autenticação
// export const useAuth = () => useContext(AuthContext);

// // Provedor do contexto de autenticação
// export const AuthProvider = ({ children }) => {
//   const [usuario, setUsuario] = useState(null);
//   const [carregando, setCarregando] = useState(true);
  
//   // Verificar se o usuário já está autenticado ao carregar a aplicação
//   useEffect(() => {
//     const verificarUsuario = async () => {
//       const token = localStorage.getItem('token');
      
//       if (token) {
//         try {
//           // O token será adicionado automaticamente pelo interceptor
//           const resposta = await api.get('/usuarios/perfil');
//           setUsuario(resposta.data);
//         } catch (erro) {
//           // Se houver erro, limpa o token (provavelmente expirado)
//           localStorage.removeItem('token');
//         }
//       }
      
//       setCarregando(false);
//     };
    
//     verificarUsuario();
//   }, []);
  
//   // Função de login
//   const login = async (email, senha) => {
//     try {
//       const resposta = await api.post('/usuarios/login', { email, senha });
//       const { token, ...dadosUsuario } = resposta.data;
      
//       // Salva o token (isso configurará automaticamente o token para todas as requisições futuras)
//       setAuthToken(token);
      
//       // Atualiza o estado do usuário
//       setUsuario(dadosUsuario);
      
//       return dadosUsuario;
//     } catch (erro) {
//       console.error('Erro ao fazer login:', erro);
//       throw erro;
//     }
//   };
  
//   // Função de registro
//   const register = async (dadosUsuario) => {
//     try {
//       const resposta = await api.post('/usuarios/register', dadosUsuario);
//       const { token, ...novoUsuario } = resposta.data;
      
//       // Salva o token (isso configurará automaticamente o token para todas as requisições futuras)
//       setAuthToken(token);
      
//       // Atualiza o estado do usuário
//       setUsuario(novoUsuario);
      
//       return novoUsuario;
//     } catch (erro) {
//       console.error('Erro ao registrar usuário:', erro);
//       throw erro;
//     }
//   };
  
//   // Função de logout
//   const logout = () => {
//     // Remove o token
//     setAuthToken(null);
    
//     // Limpa o estado do usuário
//     setUsuario(null);
//   };
  
//   // Valores e funções disponibilizados pelo contexto
//   const value = {
//     usuario,
//     carregando,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!usuario
//   };
  
//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// Compare this snippet from Login.jsx:
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Geist, Geist_Mono } from "geist/font";
// import {
//   Button,
//   Checkbox,
//   FormControl,
//   FormLabel,
//   Input,
//   Stack,
//   Text,
// } from "@geist-ui/react";

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await login(email, password, rememberMe);
//       navigate('/dashboard');
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   return (
//     <div>
//       <h1>Login</h1>
//       <form onSubmit={handleSubmit}>
//         <label>Email</label>
//         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//         <label>Password</label>
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         <label>Remember Me</label>
//         <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   )
// }

// export default Login;
// Compare this snippet from Register.jsx:
// import React, { useState } from'react';
// import { Link, useNavigate } from'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Geist, Geist_Mono } from "geist/font";
// import {
//   Button,
//   Checkbox,
//   FormControl,
//   FormLabel,
//   Input,
//   Stack,
//   Text,
// } from "@geist-ui/react";

// const Register = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await register(email, password, rememberMe);
//       navigate('/dashboard');
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   return (
//     <div>
//       <h1>Register</h1>
//       <form onSubmit={handleSubmit}>
//         <label>Email</label>
//         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//         <label>Password</label>
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         <label>Remember Me</label>
//         <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
//         <button type="submit">Register</button>
//       </form>
//     </div>   
//   )
// }

// export default Register;
// Compare this snippet from index.js:
// import React from'react';
// import ReactDOM from'react-dom/client';
// import './index.css';
// import App from'./App';
// import reportWebVitals from'./reportWebVitals';
// import { BrowserRouter } from'react-router-dom';
// import { AuthProvider } from'./context/AuthContext';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );

// reportWebVitals();

// Compare this snippet from App.js:
// import React from'react';
// import { BrowserRouter as Router, Route, Routes } from'react-router-dom';
// import Header from'./components/Header';
// import Footer from'./components/Footer';
// import Home from'./pages/Home';
// import Login from'./pages/Login';
// import Register from'./pages/Register';
// import About from'./pages/About';
// import Contact from'./pages/Contact';
// import Profile from'./pages/Profile';
// import Settings from'./pages/Settings';
// import Dashboard from'./pages/Dashboard';
// import ForgotPassword from'./pages/ForgotPassword';



