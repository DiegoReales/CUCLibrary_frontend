import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'

import IconifyIcon from 'src/@core/components/icon'
import { Button, CircularProgress, Dialog, DialogContent, Fade, IconButton, styled } from '@mui/material'
import CardBook from 'src/views/shared/CardBook'

import toast from 'react-hot-toast'
import useBookService from 'src/services/BookServices'
import UseBgColor from 'src/@core/hooks/useBgColor'

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

const BookDelete = ({ book, handleRefresh }) => {
  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const bookService = useBookService()
  const bgColor = UseBgColor()

  const handleClick = () => {
    setShow(true)
  }

  const closeDialog = (_, reason) => {
    if (reason !== 'backdropClick') {
      setShow(false)
    }
  }

  const onSuccess = () => {
    return toast.success('Libro eliminado con éxito!', {
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

  const onFail = () => {
    return toast.error('Ha ocurrido un error al eliminar libro!', {
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

  const handleDelete = async b => {
    setIsLoading(true)

    try {
      await bookService.bookDelete(b.id)
      onSuccess()
      handleRefresh()
      setIsLoading(false)
      setShow(false)
    } catch (err) {
      console.log(err)
      onFail()
    }
  }

  return (
    <>
      <IconButton onClick={() => handleClick(book)}>
        <IconifyIcon color={bgColor.errorFilled.backgroundColor} icon='tabler:trash-x' />
      </IconButton>
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

          {book && (
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
                variant='contained'
                color='error'
                sx={{ mt: 4 }}
                disabled={isLoading}
                onClick={() => handleDelete(book)}
              >
                {isLoading ? <CircularProgress color='inherit' /> : <span>Eliminar</span>}
              </Button>
            </CardBook>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

BookDelete.propTypes = {
  book: PropTypes.object.isRequired,
  handleRefresh: PropTypes.func
}

export default BookDelete
