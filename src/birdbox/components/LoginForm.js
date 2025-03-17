import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// material
import { Link, Stack, TextField, IconButton, InputAdornment, Button } from '@mui/material';
import { APP_CONSTANTS, BIRD_BOX_API_ENDPOINTS, URL_CONSTANT } from '../../URLConstants';
import BirdBoxApiCallerInstance from '../../utils/BirdBoxApiCallerInstance';
import { useAuth } from '../../customContextProvider/AuthProvider';
import { encryptStorage } from 'src/CustomStorage';

export default function LoginForm({ setAlertMetas, alertMetas }) {
  const navigate = useNavigate();

  const { authenticateSession, connectToIOT } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      login(formik.values.email, formik.values.password);
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const login = async (email, password) => {
    try {
      const res = await BirdBoxApiCallerInstance({
        method: 'POST',
        url: BIRD_BOX_API_ENDPOINTS.LOGIN,
        data: { email, password }
      });

      if (!res?.data?.data) {
        throw new Error('Invalid response data from API');
      }

      const userData = res?.data?.data;
      encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_LOGGEDIN_STATUS, true);
      encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_DATA, userData);
      encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_IOT_CLIENT_ID, userData?.iot?.clientId);
      encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN, userData?.admin?.ssoToken);

      if (typeof connectToIOT !== 'function') {
        throw new Error('connectToIOT is not a function or is not imported correctly.');
      }

      // connectToIOT(userData, (isConnected) => {
      //   console.log('Connected to IoT:', isConnected);
      //   if (isConnected) {
      //     authenticateSession(userData);
      //     formik.setSubmitting(false);
      //     navigate('/dashboard/birdbox', { replace: true });
      //   } else {
      //     console.error('Failed to connect to IoT.');
      //   }
      // });

      authenticateSession(userData);
      formik.setSubmitting(false);
    } catch (err) {
      console.error('Login Error:', err);
      formik.setSubmitting(false);
      setAlertMetas({
        ...alertMetas,
        severity: 'error',
        snackBarOpened: true,
        msg: err?.message || 'Please check your email or password'
      });

      setTimeout(() => {
        setAlertMetas({ ...alertMetas, snackBarOpened: false, msg: '' });
      }, 4000);
    }
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            type="email"
            autoComplete="username"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-start" mt={2}>
          {/* <FormControlLabel
              control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
              label="Remember me"
            /> */}

          <Link
            component={RouterLink}
            variant="subtitle2"
            to={URL_CONSTANT.FORGET_PASSWORD}
            sx={{
              fontSize: ' 12px',
              fontWeight: '600',
              lineHeight: '16px',
              textAlign: 'left',
              opacity: '0.5',
              color: '#000000'
            }}
          >
            Forgot password?
          </Link>
        </Stack>

        <Button
          size="medium"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{
            display: 'flex',
            margin: '24px auto 0'
          }}
        >
          Login
        </Button>
      </Form>
    </FormikProvider>
  );
}
