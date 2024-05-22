import React, { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import './styles.css';

import { FiPower, FiEdit, FiTrash2 } from "react-icons/fi";

import api from '../../services/api'

import logo from '../../assets/logo.svg'

export default function Books() {

    const [ books, setBooks ] = useState([])

    const accessToken = localStorage.getItem('accessToken')
    const userName = localStorage.getItem('userName')

    const history = useNavigate()

    const authorization = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }

    useEffect(() => {
        api.get('api/book/v1', authorization)
        .then(response => {
            setBooks(response.data)
        })
    }, [accessToken])

    async function editBook(id) {
        try {
            history(`/book/new/${id}`)
        } catch (error) {
            alert('Edit book failed! Try again!')
        }
    }

    async function deleteBook(id) {
        try {
            await api.delete(`api/book/v1/${id}`, authorization)
            setBooks(books.filter(book => book.id !== id))
        } catch (error) {
            alert('Delete failed! Try again!')
        }
    }

    async function logout() {
        localStorage.clear()
        history('/')
    }
   

    return (
        <div className="book-container">
            <header>
                <img src={logo} alt="logo" />
                <span> Welcome, <strong> {userName.toUpperCase()} </strong></span>
                <Link className="button" to="/book/new/0"> Add new Book </Link>
                <button type="button" onClick={() => logout()}>
                    <FiPower  size={18} color="#251FC5"></FiPower>
                </button>
            </header>

            <h1>Registered Books</h1>

            <ul>
                {books.map(book => (
                    <li>
                    <strong>Title:</strong>
                    <p>{book.title}</p>

                    <strong>Author:</strong>
                    <p>{book.author}</p>

                    <strong>Price:</strong>
                    <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(book.price)}</p>

                    <strong>Release Date:</strong>
                    <p>{Intl.DateTimeFormat('pt-BR').format(new Date(book.launch_date))}</p>

                    <button type="button"  onClick={() => editBook(book.id)}> 
                        <FiEdit size={20} color="#251FC5"></FiEdit>
                    </button>
                    <button type="button" onClick={ () => deleteBook(book.id)}> 
                        <FiTrash2 size={20} color="#BB0000"></FiTrash2>
                    </button>
                </li>
                
                ))}
                
            </ul>
        </div>
    )
}