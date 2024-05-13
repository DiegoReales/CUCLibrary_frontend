// ** MUI Imports
import { useEffect, useState } from 'react'
import { Card, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import useBookService from 'src/services/BookServices'
import useBgColor from 'src/@core/hooks/useBgColor'

import PageHeader from 'src/@core/components/page-header'
import BookDelete from 'src/views/admin/books/BookDelete'
import BookEdit from 'src/views/admin/books/BookEdit'
import { Box } from '@mui/system'
import BookCreate from 'src/views/admin/books/BookCreate'

const CRUDBook = () => {
  const bookService = useBookService()
  const [books, setBooks] = useState([])

  const bgColor = useBgColor()

  const getBooks = () => bookService.getBooks().then(b => setBooks(b))

  useEffect(() => {
    getBooks()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Typography variant='h4' color='primary'>
                CRUD de Libros
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Administración de libros</Typography>
            </div>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <BookCreate handleRefresh={getBooks} />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
              <TableHead sx={{ backgroundColor: bgColor.primaryFilled.backgroundColor }}>
                <TableRow>
                  <TableCell>ISBN</TableCell>
                  <TableCell>Titulo y Descripción</TableCell>
                  <TableCell>Autor</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map(i => (
                  <TableRow key={i.id} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
                    <TableCell component='th' scope='row'>
                      {i.isbn}
                    </TableCell>
                    <TableCell>
                      <Typography>{i.title}</Typography>
                      <Typography variant='body2'>{i.description}</Typography>
                    </TableCell>
                    <TableCell>{`${i.author.name} ${i.author.lastname}`}</TableCell>
                    <TableCell>{i.bookStatus.description}</TableCell>
                    <TableCell>
                      <BookEdit book={i} handleRefresh={getBooks} />
                      <BookDelete book={i} handleRefresh={getBooks} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  )
}

CRUDBook.acl = {
  action: 'admin',
  subject: 'auth'
}

export default CRUDBook
