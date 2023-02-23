'use client';

import { Box, Button, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import appApi from '@/axios-client/appApi';
import Link from 'next/link';

interface UserInfo {
  name: string;
  password: string;
  email: string;
  phone: string;
}

const defaultValues: UserInfo = {
  name: '',
  password: '',
  email: '',
  phone: '',
};

const schema = yup
  .object({
    name: yup.string().required().min(2, 'name must at least 2 characters!').max(1000),
    password: yup
      .string()
      .required()
      .min(8, 'Password must at least 8 characters!')
      .matches(/[0-9]/, 'Password must contains one numeric!')
      .matches(/[!@#$%^&*(){}[\]<>?/|.:;_-]/, 'Password must contains one special character!'),
    phone: yup
      .string()
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Please input valid phone number!')
      .required(),
    email: yup
      .string()
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please input valid email!')
      .email('Please input valid email!')
      .required(),
  })
  .required();

const Profile = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  // Fetch the user client-side
  const onSubmit = async (values: UserInfo) => {
    try {
      const response: any = await appApi.post('/create', values);
      if (response.success === true) {
        reset();
        alert('You have create User successful!');
      }
    } catch (error) {
      alert('Something wrong happen!');
    }
  };

  // check if isAuthenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Perform localStorage action
      const isAuthenticated = localStorage && localStorage.getItem('isAuthenticated');
      if (!isAuthenticated) {
        router.push('/login');
      }
    }
  }, [router]);

  // Once the user request finishes, show the user
  return (
    <div>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                margin="normal"
                fullWidth
                id="name"
                label="Name"
                autoComplete="name"
              />
              <span style={{ color: 'red' }}>{errors.name?.message}</span>
            </>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                margin="normal"
                fullWidth
                id="password"
                label="Password"
                autoComplete="password"
                type="password"
              />
              <span style={{ color: 'red' }}>{errors.password?.message}</span>
            </>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                margin="normal"
                fullWidth
                id="email"
                label="Email"
                autoComplete="email"
              />
              <span style={{ color: 'red' }}>{errors.email?.message}</span>
            </>
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                margin="normal"
                fullWidth
                id="phone"
                label="Phone"
                autoComplete="phone"
              />
              <span style={{ color: 'red' }}>{errors.phone?.message}</span>
            </>
          )}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Submit
        </Button>
      </Box>
      <Button variant="outlined" sx={{ mt: 3, mb: 2 }}>
        <Link href="/view" style={{ textDecoration: 'none', color: '#1976d2' }}>
          to view users
        </Link>
      </Button>
    </div>
  );
};

export default Profile;
