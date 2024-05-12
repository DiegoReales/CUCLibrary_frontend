import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Icon } from '@iconify/react'
import useBgColor from 'src/@core/hooks/useBgColor'
import CustomChip from 'src/@core/components/mui/chip'

const CardBook = ({ id, isbn, title, description, stock, available, status, authorName, statusName, children }) => {
  const storageKey = 'books-favorites'
  const favorites = JSON.parse(localStorage.getItem(storageKey) || '[]')
  const initialState = favorites.some(e => e === isbn)

  const bgColor = useBgColor()
  const [isFavorite, setIsFavorite] = useState(initialState)

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem(storageKey) || '[]')
    if (isFavorite) {
      favorites.push(isbn)
      localStorage.setItem(storageKey, JSON.stringify(favorites))
    } else {
      const values = favorites.filter(e => e !== isbn)
      localStorage.setItem(storageKey, JSON.stringify(values))
    }
  }, [isFavorite, isbn])

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bgColor.primaryFilled.backgroundColor
        }}
      >
        <Icon fontSize='6.25rem' icon='tabler:books' />
      </Box>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h5'>{title}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size='small' sx={{ color: 'text.disabled' }} onClick={toggleFavorite}>
              {isFavorite ? (
                <Icon fontSize='1.25rem' color={bgColor.warningFilled.backgroundColor} icon='tabler:star-filled' />
              ) : (
                <Icon fontSize='1.25rem' icon='tabler:star' />
              )}
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>Autor:</Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <Typography>{authorName}</Typography>
          </Box>
        </Box>
        <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{description}</Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                textDecoration: 'none',
                '&:not(:last-of-type)': { mr: 2.5 }
              }}
            >
              <Typography>
                <CustomChip
                  rounded
                  size='small'
                  skin='light'
                  color={status == 1 ? 'success' : 'error'}
                  label={statusName}
                />
              </Typography>
            </Box>
          </Box>
        </Box>

        {children}
      </CardContent>
    </Card>
  )
}

CardBook.defaultProps = {
  id: PropTypes.number.isRequired,
  isbn: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
  available: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
  authorName: PropTypes.string.isRequired,
  statusName: PropTypes.string.isRequired
}

export default CardBook
