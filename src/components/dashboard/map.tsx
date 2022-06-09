/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Map, Polygon } from 'react-kakao-maps-sdk';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { DropResult } from 'react-beautiful-dnd';
import Deposits from './Deposits';
import Chart from './Chart';
import { Gate } from '../territorycard/Gate';
import { reorder } from '../helpers';
import { VisitStatus } from '../territorycard/types';
import { TerritoryMap } from '../territorycard/TerritoryMap';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

type Point = {
  lat: number;
  lng: number;
};

export default function MapPage() {
  const polygonPath: Array<Point> = JSON.parse(
    '[{"lat": 37.535582577099, "lng": 126.86622218405}, {"lat": 37.535568696403, "lng": 126.86589975064}, {"lat": 37.535052923074, "lng": 126.86594310261}, {"lat": 37.535046326047, "lng": 126.86608454247}, {"lat": 37.535062119175, "lng": 126.86610714273}, {"lat": 37.535431499599, "lng": 126.86608102515}, {"lat": 37.535440682694, "lng": 126.86623375183}, {"lat": 37.535582577099, "lng": 126.86622218405}]',
  );
  // console.log(polygonPath);

  const cardInfo = JSON.parse(
    '[["23-6", "고운아이 어린이집", "정문", [{"id": 0, "name": "어린이집", "status": 0, "isLock": true}, {"id": 1, "name": 102, "status": 0, "isLock": true}, {"id": 2, "name": 201, "status": 0, "isLock": true}, {"id": 3, "name": 202, "status": 0, "isLock": true}, {"id": 4, "name": 301, "status": 0, "isLock": true}, {"id": 5, "name": 302, "status": 0, "isLock": true}, {"id": 6, "name": 401, "status": 0, "isLock": true}]], ["72-9", "", "정문", [{"id": 0, "name": 101, "status": 0, "isLock": true}, {"id": 1, "name": 102, "status": 0, "isLock": true}, {"id": 2, "name": 201, "status": 0, "isLock": true}, {"id": 3, "name": 202, "status": 0, "isLock": true}, {"id": 4, "name": 301, "status": 0, "isLock": true}, {"id": 5, "name": 302, "status": 0, "isLock": true}]], ["72-7", "", "쪽문(우)", [{"id": 0, "name": "3F", "status": 0, "isLock": true}]], ["72-7", "", "대문", [{"id": 0, "name": "1F", "status": 0, "isLock": true}]], ["72-5", "", "대문", [{"id": 0, "name": 103, "status": 0, "isLock": true}, {"id": 1, "name": 201, "status": 0, "isLock": true}, {"id": 2, "name": 202, "status": 0, "isLock": true}]], ["72-5", "", "쪽문(좌)", [{"id": 0, "name": 101, "status": 0, "isLock": true}, {"id": 1, "name": 102, "status": 0, "isLock": true}]], ["74", "천동나우길", "정문", [{"id": 0, "name": "B01", "status": 0, "isLock": true}, {"id": 1, "name": "B02", "status": 0, "isLock": true}, {"id": 2, "name": 101, "status": 0, "isLock": true}, {"id": 3, "name": 102, "status": 0, "isLock": true}, {"id": 4, "name": 201, "status": 0, "isLock": true}, {"id": 5, "name": 202, "status": 0, "isLock": true}, {"id": 6, "name": 301, "status": 0, "isLock": true}, {"id": 7, "name": 302, "status": 0, "isLock": true}, {"id": 8, "name": 401, "status": 0, "isLock": true}, {"id": 9, "name": 402, "status": 0, "isLock": true}]]]',
  );

  let centroid = polygonPath.reduce(
    (prevPoint: Point, currPoint: Point) => {
      return {
        lat: prevPoint.lat + currPoint.lat,
        lng: prevPoint.lng + currPoint.lng,
      };
    },
    { lat: 0, lng: 0 },
  );

  centroid = {
    lat: centroid.lat / polygonPath.length,
    lng: centroid.lng / polygonPath.length,
  };
  // console.log(centroid);

  const [items, setItems] = React.useState([
    {
      id: 'Item 1',
      primary: 'Refined Frozen Pants',
      secondary: 'test1',
    },
    {
      id: 'Item 3',
      primary: 'Rustic Concrete Chicken',
      secondary: 'test2',
    },
  ]);

  const onDragEnd = ({ destination, source }: DropResult) => {
    // dropped outside the list
    if (!destination) return;

    const newItems = reorder(items, source.index, destination.index);

    setItems(newItems);
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: theme =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      {/* <Toolbar /> */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={1}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Chart />
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Deposits />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper
              sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
              style={{ padding: 25 }}
            >
              {/* <Orders /> */}
              <TerritoryMap centroid={centroid} path={polygonPath} />
            </Paper>
          </Grid>
          {/* 건물 */}
          {cardInfo.map((gateInfo: any, index: number) => (
            <Gate gateInfo={gateInfo} />
          ))}
        </Grid>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );
}
