"use client"
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Geist, Geist_Mono } from "geist/font";
import { GeistSans, GeistMono } from "geist/font";


const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header>
        <nav>
            <Link to="/">Home</Link>
            {user ? (
                <><Link to="/dashboard">Dashboard</Link><button onClick={logout}>Logout</button></>
            ) : (
                <><Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/forgot-password">Forgot Password</Link></>

            )}
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/help">Help</Link>
        </nav>
    </header>
    );
};
export default Header;