// ** MUI Imports
import { forwardRef, useEffect, useState } from 'react'
import { Button, CircularProgress, IconButton, styled } from '@mui/material'
import Grid from '@mui/material/Grid'
import useBookService from 'src/services/BookServices'
import CardBook from 'src/views/shared/CardBook'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade from '@mui/material/Fade'
import IconifyIcon from 'src/@core/components/icon'
import useBgColor from 'src/@core/hooks/useBgColor'

import toast from 'react-hot-toast'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const CheckOut = () => {
  const bookService = useBookService()
  const [books, setBooks] = useState([])

  const [selectedBook, setSelectedBook] = useState(null)
  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const bgColor = useBgColor()

  const getBooks = () => bookService.getBookBorrowedByMe().then(b => setBooks(b))

  useEffect(() => {
    getBooks()
  }, [])

  const handleDialog = b => () => {
    setShow(true)
    setSelectedBook(b)
    console.log(b)
  }

  const checkOutSuccess = () => {
    return toast.success('Libro devuelto con éxito!', {
      style: {
        padding: '16px',
        color: bgColor.successFilled.backgroundColor,
        border: `1px solid ${bgColor.successFilled.backgroundColor}`
      },
      iconTheme: {
        primary: bgColor.successFilled.backgroundColor,
        secondary: bgColor.successFilled.color
      }
    })
  }

  const checkOutFail = () => {
    return toast.error('Ha ocurrido un error al devolver libro!', {
      style: {
        padding: '16px',
        color: bgColor.errorFilled.backgroundColor,
        border: `1px solid ${bgColor.errorFilled.backgroundColor}`
      },
      iconTheme: {
        primary: bgColor.errorFilled.backgroundColor,
        secondary: bgColor.errorFilled.color
      }
    })
  }

  const handleCheckIn = b => async () => {
    setIsLoading(true)

    try {
      await bookService.bookCheckIn(b.borrowedId)
      getBooks()
      checkOutSuccess()
      setIsLoading(false)
      setShow(false)
    } catch (err) {
      console.log(err)
      checkOutFail()
    }
  }

  const closeDialog = (_, reason) => {
    if (reason !== 'backdropClick') {
      setShow(false)
    }
  }

  return (
    <>
      <Grid container spacing={6}>
        {books
          .map(e => ({ ...e.book, borrowedId: e.id }))
          .map(book => (
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
              >
                <Button
                  fullWidth
                  type='submit'
                  variant='outlined'
                  color='error'
                  sx={{ mt: 4 }}
                  onClick={handleDialog(book)}
                >
                  Devolver
                </Button>
              </CardBook>
            </Grid>
          ))}
      </Grid>

      <Dialog
        fullWidth
        disableEscapeKeyDown
        open={show}
        maxWidth='xs'
        scroll='body'
        onClose={closeDialog}
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(0)} !important`,
            px: theme => [`${theme.spacing(0)} !important`, `${theme.spacing(0)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(0)} !important`]
          }}
        >
          <CustomCloseButton onClick={closeDialog}>
            <IconifyIcon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>

          {selectedBook && (
            <CardBook
              id={selectedBook.id}
              isbn={selectedBook.isbn}
              title={selectedBook.title}
              description={selectedBook.description}
              stock={selectedBook.stock}
              available={selectedBook.available}
              status={selectedBook.status}
              authorName={`${selectedBook.author.name} ${selectedBook.author.lastname}`}
              statusName={selectedBook.bookStatus.description}
            >
              <Button
                fullWidth
                type='submit'
                variant='contained'
                color='error'
                sx={{ mt: 4 }}
                disabled={isLoading}
                onClick={handleCheckIn(selectedBook)}
              >
                {isLoading ? <CircularProgress color='inherit' /> : <span>Confirmar Devolución</span>}
              </Button>
            </CardBook>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CheckOut
