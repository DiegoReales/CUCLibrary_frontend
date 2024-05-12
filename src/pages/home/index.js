// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import useBookService from 'src/services/BookServices'
import CardBook from 'src/views/shared/CardBook'

const Home = () => {
  const bookService = useBookService()
  const [books, setBooks] = useState([])

  const getBooks = () => bookService.getBooks().then(b => setBooks(b))

  useEffect(() => {
    getBooks()
  }, [])

  return (
    <Grid container spacing={6}>
      {books.map(book => (
        <Grid key={book.id} item xs={12} sm={6} md={3}>
          <CardBook
            id={book.id}
            isbn={book.isbn}
            title={book.title}
            description={book.description}
            stock={book.stock}
            available={book.available}
            status={book.status}
            authorName={`${book.author.name} ${book.author.lastname}`}
            statusName={book.bookStatus.description}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default Home
