"use client"
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Email } from '@mui/icons-material';
import { GithubAuth, GoogleAuth, signInUser } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { Github, Google } from '@/components/assets';

export default function SignIn() {
  const navigate = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    try {
      // Send the email and password to firebase
      const userCredential = await signInUser(email, password);

      if (userCredential) {
        toast.success('SignIn Success');
        sessionStorage.setItem("user","true" )
        navigate.push('/todo');
      }
    } catch (error: any) {
      toast.error('SignIn failed' + error.message);
      console.log('User Sign In Failed', error.message);
    }
  };
  const handleGoogle=async()=>{
    try {
      // Send the email and password to firebase
      const userCredential = await GoogleAuth();

      if (userCredential) {
        sessionStorage.setItem("user","true" )
        toast.success('SignIn Success');
        navigate.push('/todo');
      }
    } catch (error: any) {
      toast.error('SignIn failed' + error.message);
      console.log('User Sign In Failed', error.message);
    }
  }

  const handleGithub=async()=>{
    try {
      // Send the email and password to firebase
      const userCredential = await GithubAuth();

      if (userCredential) {
        navigate.push('/todo');
        sessionStorage.setItem("user","true")
        toast.success('SignIn Success');
      }
    } catch (error: any) {
      toast.error('SignIn failed' + error.message);
      sessionStorage.setItem("user","true" )
      console.log('User Sign In Failed', error.message);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Box className='flex justify-between w-full mt-3 gap-2'>
            <Box className="w-1/2 border flex gap-2 p-3  rounded-md hover:bg-slate-100"
            onClick={handleGoogle}  >
              <Image src={Google} alt='he' height={30} width={30}/>
            <Typography component="h6" variant="h6">
              Google
            </Typography>
            </Box>
            <Box className="w-1/2 border  flex gap-2 p-3 rounded-md hover:bg-slate-100 "
            onClick={handleGithub}
            >
            <Image src={Github} alt='he' height={30} width={30}/>
            <Typography component="h6" variant="h6">
              Github
            </Typography>
            </Box>
          </Box>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="register  " variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
