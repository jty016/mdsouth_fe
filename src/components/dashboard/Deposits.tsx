import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Deposits() {
  return (
    <>
      <Title>Recent Visitors</Title>
      <Typography component="p" variant="h6">
        조태영
      </Typography>
      <Typography component="p" variant="h6">
        김성희
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        14:22:56 2022-06-06 KST
      </Typography>

      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View history
        </Link>
      </div>
    </>
  );
}
