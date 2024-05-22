

import React, {useState, useEffect} from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import './styles.css';

import api from '../../services/api'

import logo from '../../assets/logo.svg'

export default function NewBook() {

    const [ id, setId ] = useState(null)
    const [ author, setAuthor ] = useState('')
    const [ launchDate, setLaunchDate ] = useState('')
    const [ price, setPrice ] = useState('')
    const [ title, setTitle ] = useState('')

    const { bookId } = useParams()

    console.log(bookId);

    const history = useNavigate()

    const accessToken = localStorage.getItem('accessToken')

    const authorization = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }

    useEffect(() => {
        if(bookId === '0') return
        else loadBook()
    }, [bookId] )


    async function loadBook() {
        try {
            const response = await api.get(`api/book/v1/${bookId}`, authorization)

            console.log(response.data.title);
            
            let ajustedDate = response.data.launch_date.split("T", 10)[0]

            setId(response.data.id)
            setTitle(response.data.title)
            setAuthor(response.data.author)
            setPrice(response.data.price)
            setLaunchDate(ajustedDate)
        } catch (error) {
            alert("Error recovering book! Try again!")
            history("/books")
        }
    }


    async function saveOrUpdateBook(e) {
        e.preventDefault()
        const data = {
            author,
            launch_date: launchDate,
            price,
            title
        }

        try {

            if(bookId === '0') {
                await api.post('api/book/v1', data, authorization)
            } else {
                data.id = bookId
                await api.put('api/book/v1', data, authorization)
            }

            history("/books")
        } catch(e) {
            console.log(e);
            alert("Create failed! Try again!")
        }
    }

    return (
        <div className="new-book-container">
            <div className="content">
                <section className="form">
                    <img src={logo} alt="logo"/>
                    <h1>{bookId == 0 ? 'Add  New' : 'Update' } Book</h1>
                    <p>Enter the book information and click on {bookId == 0 ? `'Add'` : `'Update'` }!</p>
                    <Link className="back-link" to="/book/new">
                        <FiArrowLeft size={16} color="#251fc5"></FiArrowLeft>
                        Home
                    </Link>
                </section>
                <form onSubmit={saveOrUpdateBook}>
                    <input 
                        type="text" 
                        placeholder="title"
                        value={title}
                        onChange={e=>setTitle(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Author"
                        value={author}
                        onChange={e=>setAuthor(e.target.value)}
                    />
                    <input 
                        type="date" 
                        value={launchDate}
                        onChange={e=>setLaunchDate(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Price"
                        value={price}
                        onChange={e=>setPrice(e.target.value)}
                    />

                    <button className="button" type="submit">{bookId == 0 ? 'Add' : 'Update' } </button>
                </form>
            </div>
        </div>
    )
}