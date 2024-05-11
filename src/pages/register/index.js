// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import LogoCUC from 'src/views/shared/LogoCUC'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { FormHelperText } from '@mui/material'


// ** Styled Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  dni: yup.number().required().positive().integer().min(6),
  name: yup.string().required(),
  lastname: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
  passwordConfirm: yup.string().min(5).required().oneOf([yup.ref('password'), null], 'Passwords must match'),
  termsOfService: yup.bool().oneOf([true], "You must accept the terms and conditions")
})

const defaultValues = {
  dni: '',
  name: '',
  lastname: '',
  password: '',
  passwordConfirm: '',
  email: '',
  termsOfService: false
}

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings
  const imageSource = skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const signUp = (data) => {

    setIsLoading(true);
    const { dni, name, lastname, email, password, passwordConfirm, termsOfService } = data
    if (termsOfService) {
      auth.signUp({ dni, name, lastname, email, password, passwordConfirm }, () => {
        setError('termsOfService', {
          type: 'manual',
          message: 'Sorry, an error ocurred. Try again or few minutes later.'
        })
        setIsLoading(false);
      })
    }

  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <RegisterIllustration
            alt='register-illustration'
            src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <LogoCUC fill={theme.palette.primary.main} />
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                Registro 🚀
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Completa el formulario para registrarte!</Typography>
            </Box>
            <form autoComplete='off' onSubmit={handleSubmit(signUp)}>
              <Controller name='dni' control={control} rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    autoFocus fullWidth sx={{ mb: 4 }} label='Identificación' placeholder='1234567' error={Boolean(errors.dni)}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    {...(errors.dni && { helperText: errors.dni.message })} />
                )}
              />
              <Controller name='name' control={control} rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField autoFocus control={control} fullWidth sx={{ mb: 4 }} label='Nombres' placeholder='john' error={Boolean(errors.name)}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    {...(errors.name && { helperText: errors.name.message })} />
                )}
              />
              <Controller name='lastname' control={control} rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField fullWidth control={control} sx={{ mb: 4 }} label='Apellidos' placeholder='doe' error={Boolean(errors.lastname)}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    {...(errors.lastname && { helperText: errors.lastname.message })} />
                )}
              />
              <Controller name='email' control={control} rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField fullWidth control={control} label='Correo Electrónico' sx={{ mb: 4 }} placeholder='johndoe@example.com' error={Boolean(errors.email)}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    {...(errors.email && { helperText: errors.email.message })} />
                )}
              />
              <Box sx={{ mb: 1.5 }}>
                <Controller name='password' control={control} rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      control={control}
                      label='Contraseña'
                      id='auth-login-v2-password'
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.password)}
                      {...(errors.password && { helperText: errors.password.message })}
                    />
                  )}
                />
              </Box>
              <Controller name='passwordConfirm' control={control} rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    control={control}
                    label='Confirme Contraseña'
                    id='auth-login-v2-password'
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.passwordConfirm)}
                    {...(errors.passwordConfirm && { helperText: errors.passwordConfirm.message })}
                  />
                )}
              />
              {/* error={Boolean(errors.termsOfService)}
                      {...(errors.termsOfService && { helperText: errors.termsOfService.message })} */}
              <Controller name='termsOfService' control={control} rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (

                  <FormControlLabel
                    control={<Checkbox value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.termsOfService)}
                      helperText={"asdasd"}
                    />}
                    sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: theme.typography.body2.fontSize } }}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Typography sx={{ color: 'text.secondary' }}>Acepto </Typography>
                        <Typography component={LinkStyled} href='/' onClick={e => e.preventDefault()} sx={{ ml: 1 }}>
                          politica de privacidad & terminos
                        </Typography>
                        {value ? '' : <FormHelperText>Check the termns</FormHelperText>}
                      </Box>
                    }

                  />
                )}
              />

              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }} disabled={isLoading}>
                {
                  isLoading ? 'Registrando Cuenta...' : 'Registrar me'
                }
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>¿Ya tienes una cuenta?</Typography>
                <Typography component={LinkStyled} href='/login'>
                  Inicia Sesión ahora!
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
Register.getLayout = page => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true

export default Register
