'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import appApi from '@/axios-client/appApi';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import Link from 'next/link';

const columns = [
  { field: 'id', headerName: 'ID', width: 250 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 300 },
  { field: 'phone', headerName: 'Phone', width: 150 },
];

export default function View() {
  const router = useRouter();
  const [data, setData] = useState<any>();

  const rows = data;

  useEffect(() => {
    const getData = async () => {
      const response: any = await appApi.get('/view', {
        params: {
          limit: 100,
          offset: 10,
        },
      });
      const userData = response.data;
      setData(userData);
    };
    getData();
  }, []);

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

  return (
    <div style={{ height: 400, width: '100%' }}>
      {data?.length > 0 ? (
        <>
          <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[5]} />
          <Button variant="outlined" sx={{ mt: 3, mb: 2 }}>
            <Link href="/create" style={{ textDecoration: 'none', color: '#1976d2' }}>
              to create new user
            </Link>
          </Button>
        </>
      ) : (
        <div>...Loading</div>
      )}
    </div>
  );
}
