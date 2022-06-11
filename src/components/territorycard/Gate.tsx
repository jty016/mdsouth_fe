/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Grid,
  Paper,
  TableContainer,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TextField from '@mui/material/TextField';
import ReorderIcon from '@mui/icons-material/Reorder';
import {
  HouseHoldButton,
  MultiOpsIconButton,
  ToggleEditButton,
} from './HouseHold';

import { VisitStatus, HouseholdProps, GateProps } from './types';

interface GateViewProps extends GateProps {
  handleGateEditToggle: () => void;
  isLock: boolean;
  handleHouseholdButtonClick: (x: number) => () => void;
}

export function GateView(props: GateViewProps) {
  const { address, buildingName, gateName, households, ...otherProps } = props;
  const { handleGateEditToggle, isLock, handleHouseholdButtonClick } =
    otherProps;

  return (
    <Table aria-label="simple table">
      <TableBody>
        <TableRow>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{address}</TableCell>
          <TableCell>{buildingName}</TableCell>
          <TableCell align="right" padding="none">
            <ToggleEditButton
              id={1}
              isLock={isLock}
              onClick={handleGateEditToggle}
            />
             <MultiOpsIconButton iconName="delete" onClick={()=>{}} />
          </TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell component="th" scope="row" padding="none" width="20%">
            {gateName}
          </TableCell>
          <TableCell align="left" padding="none" width="80%" colSpan={2}>
            {households.map((household: HouseholdProps) => {
              return (
                <HouseHoldButton
                  key={household.id}
                  id={household.id}
                  name={household.name}
                  status={household.status}
                  onClick={handleHouseholdButtonClick}
                />
              );
            })}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: 8,
  width: 250,
});

export const reorder = (
  list: HouseholdProps[],
  startIndex: number,
  endIndex: number,
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function GateEditable(props: any) {
  const {
    isLock,
    address,
    buildingName,
    gateName,
    households,
    handleAddressChanged,
    handleBuildingNameChanged,
    handleGateNameChanged,
    handleHouseholdEditToggle,
    handleHouseholdDelete,
    handleHouseholdAdd,
    onDragEnd,
    onNoVisitStatusChanged,
    handleHouseholdNameChanged,
  } = props;

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <TableContainer
      sx={{
        height: 400,
      }}
    >
      <Grid container>
        <Grid item xs={4}>
          <TextField
            variant="standard"
            label="건물번호"
            defaultValue={address}
            size="small"
            disabled={isLock}
            onChange={handleAddressChanged}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            variant="standard"
            label="건물이름"
            defaultValue={buildingName}
            size="small"
            disabled={isLock}
            onChange={handleBuildingNameChanged}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            variant="standard"
            label="입구"
            defaultValue={gateName}
            size="small"
            disabled={isLock}
            onChange={handleGateNameChanged}
          />
        </Grid>
      </Grid>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="vertical">
          {(provided, snapshot) => (
            <>
              <Table
                aria-label="simple table"
                ref={provided.innerRef}
                sx={{
                  height: 'max-content',
                }}
                stickyHeader
                // style={getListStyle(snapshot.isDraggingOver)}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>이동</TableCell>
                    <TableCell>세대이름</TableCell>
                    <TableCell>방문금지</TableCell>
                    <TableCell>작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {households.map((item: HouseholdProps, index: number) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          // style={getItemStyle(
                          //   snapshot.isDragging,
                          //   provided.draggableProps.style,
                          // )}
                        >
                          <TableCell align="left" padding="none">
                            <div {...provided.dragHandleProps}>
                              <ReorderIcon />
                            </div>
                          </TableCell>
                          <TableCell
                            sx={{ whiteSpace: 'nowrap' }}
                            padding="none"
                          >
                            <TextField
                              disabled={item.isLock}
                              // required
                              // id="standard-required"
                              // label="Required"
                              defaultValue={item.name}
                              variant="standard"
                              margin="dense"
                              onChange={handleHouseholdNameChanged(item.id)}
                            />
                          </TableCell>
                          <TableCell
                            sx={{ whiteSpace: 'nowrap' }}
                            padding="none"
                          >
                            <Checkbox
                              id={item.id.toString()}
                              disabled={item.isLock}
                              checked={item.status === VisitStatus.noVisit}
                              onChange={onNoVisitStatusChanged(item.id)}
                            />
                          </TableCell>
                          <TableCell padding="none">
                            <MultiOpsIconButton
                              iconName="delete"
                              onClick={handleHouseholdDelete(item.id)}
                            />
                            <ToggleEditButton
                              id={item.id}
                              isLock={item.isLock}
                              onClick={handleHouseholdEditToggle}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
              <MultiOpsIconButton
                align="left"
                iconName="add"
                onClick={handleHouseholdAdd}
              />
            </>
          )}
        </Droppable>
      </DragDropContext>
    </TableContainer>
  );
}

export function Gate(props: any) {
  const { gateInfo } = props;

  const [isLock, setIsLock] = React.useState(true);
  const [householdList, setHouseholdList] = React.useState(gateInfo[3]);
  const [address, setAddress] = React.useState(gateInfo[0]);
  const [buildingName, setBuildingName] = React.useState(gateInfo[1]);
  const [gateName, setGateName] = React.useState(gateInfo[2]);

  const handleGateEditToggle = () => () => {
    setIsLock(!isLock);
  };

  const handleHouseholdEditToggle = (id: number) => () => {
    setHouseholdList(
      householdList.map((household: HouseholdProps) => {
        const currHousehold = household;
        if (currHousehold.id === id) {
          currHousehold.isLock = !household.isLock;
        }
        return currHousehold;
      }),
    );
  };

  const handleHouseholdDelete = (key: number) => () => {
    setHouseholdList(
      householdList.filter((shop: HouseholdProps) => {
        return shop.id !== key;
      }),
    );
  };

  const handleHouseholdAdd = () => {
    setHouseholdList([
      ...householdList,
      {
        id: householdList.length,
        name: '',
        status: VisitStatus.intact,
        isLock: false,
      },
    ]);
  };

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    setHouseholdList(
      reorder(householdList, result.source.index, result.destination.index),
    );
  };

  const onNoVisitStatusChanged = (id: number) => () => {
    setHouseholdList(
      householdList.map((household: HouseholdProps) => {
        const currHousehold = household;
        if (currHousehold.id === id) {
          if (currHousehold.status === VisitStatus.noVisit) {
            currHousehold.status = VisitStatus.intact;
          } else {
            currHousehold.status = VisitStatus.noVisit;
          }
        }
        return currHousehold;
      }),
    );
  };

  const handleHouseholdButtonClick = (id: number) => () => {
    setHouseholdList(
      householdList.map((household: HouseholdProps, index: number) => {
        const currHousehold = household;
        if (currHousehold.id === id) {
          if (currHousehold.status === VisitStatus.noVisit) {
            return currHousehold;
          }
          if (currHousehold.status === VisitStatus.met) {
            currHousehold.status = VisitStatus.intact;
          } else {
            currHousehold.status = householdList[index].status + 1;
          }
        }

        return currHousehold;
      }),
    );
  };

  const handleHouseholdNameChanged =
    (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setHouseholdList(
        householdList.map((household: HouseholdProps) => {
          const currHousehold = household;
          if (currHousehold.id === id) {
            currHousehold.name = text;
          }
          return currHousehold;
        }),
      );
    };

  const handleAddressChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setAddress(text);
  };

  const handleBuildingNameChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const text = e.target.value;
    setBuildingName(text);
  };

  const handleGateNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setGateName(text);
  };

  return (
    <>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <GateView
            address={address}
            buildingName={buildingName}
            gateName={gateName}
            households={householdList}
            isLock={isLock}
            handleGateEditToggle={handleGateEditToggle}
            handleHouseholdButtonClick={handleHouseholdButtonClick}
          />
        </Paper>
      </Grid>
      {isLock ? (
        <> </>
      ) : (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <GateEditable
              isLock={isLock}
              address={address}
              buildingName={buildingName}
              gateName={gateName}
              households={householdList}
              handleAddressChanged={handleAddressChanged}
              handleBuildingNameChanged={handleBuildingNameChanged}
              handleGateNameChanged={handleGateNameChanged}
              handleHouseholdEditToggle={handleHouseholdEditToggle}
              handleHouseholdDelete={handleHouseholdDelete}
              handleHouseholdAdd={handleHouseholdAdd}
              onDragEnd={onDragEnd}
              onNoVisitStatusChanged={onNoVisitStatusChanged}
              handleHouseholdNameChanged={handleHouseholdNameChanged}
            />
          </Paper>
        </Grid>
      )}
    </>
  );
}
