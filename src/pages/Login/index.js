import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import './styles.css';

import api from '../../services/api'

import logo from '../../assets/logo.svg'
import padlock from '../../assets/padlock.png'

export default function Login() {

    const [ userName, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')

    const history = useNavigate()

    async function login(e) {
        e.preventDefault()
        const data = {
            userName,
            password
        }

        try {
            console.log(userName)
            console.log(password)
            const response = await api.post('auth/signin', data)
            localStorage.setItem('userName', userName)
            localStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)

            history("/books")
        } catch(e) {
            console.log(e);
            alert("Login failed! Try again!")
        }

    }

    return (         
        <div className="login-container">
            <section className="form">

                <img src={logo} alt="logo" />

                <form onSubmit={login}>

                    <input 
                        placeholder="UserName"
                        value={userName} 
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Password"
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                
                    />

                    <button className="button" type="submit">Login</button>
                </form>

            </section>

            <img src={padlock} alt="Login" />
        </div>
    )
}