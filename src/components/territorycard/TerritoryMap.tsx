/* eslint-disable @typescript-eslint/no-unused-vars */
/* global kakao */
import * as React from 'react';
import { Button, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PolylineOutlinedIcon from '@mui/icons-material/PolylineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Map, Polygon, DrawingManager } from 'react-kakao-maps-sdk';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

export function IconLabelButtion(props: any) {
  const { disabled, visible, label, iconName, onClick } = props;
  let icon;
  switch (iconName) {
    case 'edit':
      icon = <EditIcon />;
      break;
    case 'delete':
      icon = <DeleteIcon />;
      break;
    case 'lock':
      icon = <LockIcon />;
      break;
    case 'add':
      icon = <AddBoxOutlinedIcon />;
      break;
    case 'drawing':
      icon = <PolylineOutlinedIcon />;
      break;
    case 'load':
      icon = <FileUploadOutlinedIcon />;
      break;
    default:
      icon = <LockIcon />;
  }
  if (visible) {
    return (
      <Button
        disabled={disabled}
        size="small"
        // variant="outlined"
        startIcon={icon}
        onClick={onClick}
      >
        {label}
      </Button>
    );
  }
  return null;
}

function EditToggleButton(props: any) {
  const { isLock, onClick } = props;

  if (isLock) {
    return (
      <IconLabelButtion
        visible
        label="Edit"
        iconName="edit"
        onClick={onClick}
      />
    );
  }
  return (
    <IconLabelButtion visible label="Lock" iconName="lock" onClick={onClick} />
  );
}

function InvisiblePolygonZoneBoundary(props: any) {
  const { visible, polygonPath } = props;

  if (visible) {
    return (
      <Polygon
        path={polygonPath}
        strokeWeight={3} // 선의 두께입니다
        strokeColor="#39DE2A" // 선의 색깔입니다
        strokeOpacity={0.8} // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
        strokeStyle="solid" // 선의 스타일입니다
        fillColor="#EFFFED" // 채우기 색깔입니다
        fillOpacity={0.5} // 채우기 불투명도입니다
      />
    );
  }
  return null;
}

export function TerritoryMap(props: any) {
  const { centroid, path } = props;

  const [isLock, setIsLock] = React.useState(true);
  const [loadable, setLoadable] = React.useState(false);
  const [drawable, setDrawable] = React.useState(false);
  const [isListenerAdded, setIsListenerAdded] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [polygonPath, setPolygonPath] = React.useState(path);

  const [currMap, setCurrMap] = React.useState({
    level: 1,
    center: centroid,
  });

  const managerRef =
    React.useRef<
      kakao.maps.drawing.DrawingManager<
        | kakao.maps.drawing.OverlayType.ARROW
        | kakao.maps.drawing.OverlayType.CIRCLE
        | kakao.maps.drawing.OverlayType.ELLIPSE
        | kakao.maps.drawing.OverlayType.MARKER
        | kakao.maps.drawing.OverlayType.POLYLINE
        | kakao.maps.drawing.OverlayType.RECTANGLE
        | kakao.maps.drawing.OverlayType.POLYGON
      >
    >(null);

  const selectOverlay = (type: kakao.maps.drawing.OverlayType) => () => {
    const manager = managerRef.current;
    manager?.cancel();
    manager?.select(type);
  };

  const putZoneBoundaryToManager = async () => {
    const manager = managerRef.current;
    manager?.cancel();
    if (manager) {
      await manager.put(
        kakao.maps.drawing.OverlayType.POLYGON,
        polygonPath.map((point: any) => {
          return new kakao.maps.LatLng(point.lat, point.lng);
        }),
      );
    }

    if (!isListenerAdded) {
      manager?.addListener('remove', (e: kakao.maps.drawing.MouseEvent) => {
        setLoadable(true);
        setDrawable(true);
      });
      setIsListenerAdded(true);
    }

    // disable zone boundary load button
    setLoadable(false);
    setDrawable(false);
  };

  const removeZoneBoundaryFromManager = (): boolean => {
    const manager = managerRef.current;
    const overlays = manager?.getOverlays([
      kakao.maps.drawing.OverlayType.POLYGON,
    ]);

    if (overlays?.polygon.length !== 1) {
      return false;
    }

    const data = manager?.getData([kakao.maps.drawing.OverlayType.POLYGON]);
    setPolygonPath(
      data?.polygon[0].points.map(point => {
        return {
          lat: point.y, // y is latitude
          lng: point.x, // x is longitude
        };
      }),
    );

    // remove is not working as expected
    overlays?.polygon.forEach(elem => {
      manager?.remove(elem);
    });

    setLoadable(true);
    return true;
  };

  const handleEditToggle = async () => {
    if (!isLock) {
      const success = removeZoneBoundaryFromManager();
      if (success) {
        setIsLock(!isLock);
        setErrorMessage('');
      } else {
        // report error message
        setErrorMessage('Please select one polygon and remove others');
      }
    } else {
      await putZoneBoundaryToManager();
      setIsLock(!isLock);
    }
  };

  const checkStatus = () => {
    const manager = managerRef.current;
    const overlays = manager?.getOverlays([
      kakao.maps.drawing.OverlayType.POLYGON,
    ]);
    const data = manager?.getData([kakao.maps.drawing.OverlayType.POLYGON]);
  };

  const onCenterChanged = (map: kakao.maps.Map) => {
    setCurrMap({
      level: map.getLevel(),
      center: {
        lat: map.getCenter().getLat(),
        lng: map.getCenter().getLng(),
      },
    });
  };

  const handleCenter = () => {
    setCurrMap({
      level: 1,
      center: centroid,
    });
  };

  return (
    <>
      <Map
        center={currMap.center}
        style={{
          // 지도의 크기
          width: '100%',
          height: '450px',
        }}
        level={1} // 지도의 확대 레벨
        onCenterChanged={onCenterChanged}
      >
        <InvisiblePolygonZoneBoundary
          visible={isLock}
          polygonPath={polygonPath}
        />
        <DrawingManager
          ref={managerRef}
          drawingMode={[
            kakao.maps.drawing.OverlayType.ARROW,
            kakao.maps.drawing.OverlayType.CIRCLE,
            kakao.maps.drawing.OverlayType.ELLIPSE,
            kakao.maps.drawing.OverlayType.MARKER,
            kakao.maps.drawing.OverlayType.POLYLINE,
            kakao.maps.drawing.OverlayType.RECTANGLE,
            kakao.maps.drawing.OverlayType.POLYGON,
          ]}
          guideTooltip={['draw', 'drag', 'edit']}
          markerOptions={{
            // 마커 옵션입니다
            draggable: true, // 마커를 그리고 나서 드래그 가능하게 합니다
            removable: true, // 마커를 삭제 할 수 있도록 x 버튼이 표시됩니다
          }}
          polylineOptions={{
            // 선 옵션입니다
            draggable: true, // 그린 후 드래그가 가능하도록 설정합니다
            removable: true, // 그린 후 삭제 할 수 있도록 x 버튼이 표시됩니다
            editable: true, // 그린 후 수정할 수 있도록 설정합니다
            strokeColor: '#39f', // 선 색
            hintStrokeStyle: 'dash', // 그리중 마우스를 따라다니는 보조선의 선 스타일
            hintStrokeOpacity: 0.5, // 그리중 마우스를 따라다니는 보조선의 투명도
          }}
          rectangleOptions={{
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: '#39f', // 외곽선 색
            fillColor: '#39f', // 채우기 색
            fillOpacity: 0.5, // 채우기색 투명도
          }}
          circleOptions={{
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: '#39f',
            fillColor: '#39f',
            fillOpacity: 0.5,
          }}
          polygonOptions={{
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: '#39f',
            fillColor: '#39f',
            fillOpacity: 0.5,
            hintStrokeStyle: 'dash',
            hintStrokeOpacity: 0.5,
          }}
          arrowOptions={{
            draggable: true, // 그린 후 드래그가 가능하도록 설정합니다
            removable: true, // 그린 후 삭제 할 수 있도록 x 버튼이 표시됩니다
            editable: true, // 그린 후 수정할 수 있도록 설정합니다
            strokeColor: '#39f', // 선 색
            hintStrokeStyle: 'dash', // 그리중 마우스를 따라다니는 보조선의 선 스타일
            hintStrokeOpacity: 0.5, // 그리중 마우스를 따라다니는 보조선의 투명도
          }}
          ellipseOptions={{
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: '#39f',
            fillColor: '#39f',
            fillOpacity: 0.5,
          }}
        />
      </Map>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '10px',
        }}
      >
        <IconButton onClick={handleCenter}>
          <CenterFocusStrongIcon />
        </IconButton>
        <EditToggleButton isLock={isLock} onClick={handleEditToggle} />
        <IconLabelButtion
          disabled={!drawable}
          visible={!isLock}
          iconName="drawing"
          label="다각형 경계 그리기"
          // onClick={selectOverlay(kakao.maps.drawing.OverlayType.POLYGON)}
          onClick={selectOverlay(kakao.maps.drawing.OverlayType.POLYGON)}
        />
        <IconLabelButtion
          disabled={!loadable}
          visible={!isLock}
          iconName="load"
          label="기존 경계 불러오기"
          onClick={putZoneBoundaryToManager}
        />
        {/* <Button onClick={checkStatus}>Status</Button> */}
      </div>
      <Grid container>
        <Grid item xs={12}>
          {errorMessage}
        </Grid>
        {/* <Grid item xs={12}>
          <p>{`지도 레벨은 ${currMap.level} 이고`}</p>
          <p>{`중심 좌표는 위도 ${currMap.center.lat}, 경도 ${currMap.center.lng} 입니다`}</p>
        </Grid> */}
      </Grid>
    </>
  );
}
