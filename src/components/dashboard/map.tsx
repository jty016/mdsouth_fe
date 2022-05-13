import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Map, Polygon } from 'react-kakao-maps-sdk';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Chart from './Chart';
import Deposits from './Deposits';

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
  console.log(polygonPath);

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
  console.log(centroid);

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
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
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
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              {/* <Orders /> */}
              <Map // 지도를 표시할 Container
                center={{
                  // 지도의 중심좌표
                  lat: centroid.lat,
                  lng: centroid.lng,
                }}
                style={{
                  // 지도의 크기
                  width: '100%',
                  height: '450px',
                }}
                level={1} // 지도의 확대 레벨
              >
                <Polygon
                  path={polygonPath}
                  strokeWeight={3} // 선의 두께입니다
                  strokeColor="#39DE2A" // 선의 색깔입니다
                  strokeOpacity={0.8} // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
                  strokeStyle="solid" // 선의 스타일입니다
                  fillColor="#EFFFED" // 채우기 색깔입니다
                  fillOpacity={0.8} // 채우기 불투명도입니다
                />
              </Map>
            </Paper>
          </Grid>
        </Grid>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );
}
