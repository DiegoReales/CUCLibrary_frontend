import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  MenuItem,
  styled
} from '@mui/material'

import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import UseBgColor from 'src/@core/hooks/useBgColor'
import useBookService from 'src/services/BookServices'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

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

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} es requerido`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} debe tener mínimo ${min} caracters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  isbn: yup
    .string()
    .min(3, obj => showErrors('ISBN', obj.value.length, obj.min))
    .required(),
  title: yup
    .string()
    .min(3, obj => showErrors('Titulo', obj.value.length, obj.min))
    .required(),
  description: yup
    .string()
    .min(3, obj => showErrors('Descripción', obj.value.length, obj.min))
    .required()

  // authorId: yup.number().required('Autor es requerido')
})

const BookEdit = ({ book, handleRefresh }) => {
  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const bookService = useBookService()
  const bgColor = UseBgColor()

  const defaultValues = {
    isbn: book.isbn,
    title: book.title,
    description: book.description,
    authorId: book.authorId
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClick = () => {
    setShow(true)
  }

  const closeDialog = (_, reason) => {
    if (reason !== 'backdropClick') {
      setShow(false)
    }
  }

  const onSuccess = () => {
    return toast.success('Libro editado con éxito!', {
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
    return toast.error('Ha ocurrido un error al editar libro!', {
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

  const handleEdit = async (bookId, book) => {
    setIsLoading(true)

    try {
      await bookService.bookEdit(bookId, book)
      onSuccess()
      handleRefresh()
      setIsLoading(false)
      setShow(false)
    } catch (err) {
      console.log(err)
      onFail()
    }
  }

  const onSubmit = data => {
    handleEdit(book.id, {
      stock: book.stock,
      available: book.available,
      status: book.status,
      ...data
    })
  }

  return (
    <>
      <IconButton onClick={() => handleClick()}>
        <IconifyIcon color={bgColor.warningFilled.backgroundColor} icon='tabler:edit' />
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

          <Card>
            <CardHeader title={`Editar libro ${book.title}`} />
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <Controller
                      name='isbn'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='ISBN'
                          onChange={onChange}
                          placeholder='123-4647-747'
                          error={Boolean(errors.isbn)}
                          aria-describedby='validation-schema-isbn'
                          {...(errors.isbn && { helperText: errors.isbn.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name='title'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='Titulo'
                          onChange={onChange}
                          placeholder='Titulo del libro'
                          error={Boolean(errors.title)}
                          aria-describedby='validation-schema-title'
                          {...(errors.title && { helperText: errors.title.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name='description'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='Descripción'
                          onChange={onChange}
                          error={Boolean(errors.description)}
                          placeholder='Descripción del'
                          aria-describedby='validation-schema-description'
                          {...(errors.description && { helperText: errors.description.message })}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name='authorId'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          defaultValue=''
                          label='Autor'
                          SelectProps={{
                            value: value,
                            onChange: e => onChange(e)
                          }}
                          id='validation-basic-autor-id'
                          error={Boolean(errors.authorId)}
                          aria-describedby='validation-basic-author-id'
                          {...(errors.authorId && { helperText: 'Autor es requerido' })}
                        >
                          <MenuItem value='1'>Gabriel Garcia Marquez</MenuItem>
                          <MenuItem value='2'>Laura Restrepo</MenuItem>
                          <MenuItem value='3'>Hector Abad Faciolince</MenuItem>
                          <MenuItem value='4'>Alvaro Mutis</MenuItem>
                          <MenuItem value='5'>Fernando Vallejo</MenuItem>
                        </CustomTextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button fullWidth type='submit' variant='contained' disabled={isLoading}>
                      {isLoading ? <CircularProgress color='inherit' /> : <span>Guardar</span>}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}

BookEdit.propTypes = {
  book: PropTypes.object.isRequired,
  handleRefresh: PropTypes.func
}

export default BookEdit
