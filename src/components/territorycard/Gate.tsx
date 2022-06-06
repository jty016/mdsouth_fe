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
  Button,
  Grid,
  Paper,
  TableContainer,
} from '@mui/material';
// import TableHead from '@mui/material/TableHead';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TextField from '@mui/material/TextField';
import ReorderIcon from '@mui/icons-material/Reorder';
import {
  HouseholdProps,
  // HouseholdRow,
  HouseHoldButton,
  HouseholdOpsButton,
  ToggleEditButton,
  HouseholdVisitStatus,
} from './HouseHold';

interface GateProps {
  address: string;
  buildingName: string;
  gateName: string;
  households: Array<HouseholdProps>;
}

export function GateView(props: any) {
  const { address, buildingName, gateName, households, ...otherProps } = props;
  const { handleGateEditToggle, isLock, handleHouseholdButtonClick } =
    otherProps;

  return (
    <Table aria-label="simple table">
      <TableBody>
        <TableRow>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{address}</TableCell>
          <TableCell>{buildingName}</TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell component="th" scope="row" padding="none">
            {gateName}
          </TableCell>
          <TableCell component="th" scope="row" padding="none">
            <ToggleEditButton
              id={1}
              isLock={isLock}
              onClick={handleGateEditToggle}
            />
          </TableCell>
          <TableCell align="left" size="small" padding="none">
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

interface GateEditableProps extends GateProps {
  setHouseholdList(list: HouseholdProps[]): HouseholdProps[];
}

export function GateEditable(props: any) {
  const {
    households,
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
                    <TableCell>Title</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>NoVisit</TableCell>
                    <TableCell>Ops</TableCell>
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
                              checked={
                                item.status === HouseholdVisitStatus.noVisit
                              }
                              onChange={onNoVisitStatusChanged(item.id)}
                            />
                          </TableCell>
                          <TableCell padding="none">
                            <HouseholdOpsButton
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
              <HouseholdOpsButton
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
  const { visitTableInfo, households } = props;

  const [isLock, setIsLock] = React.useState(true);
  const [householdList, setHouseholdList] = React.useState(households);

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
        status: HouseholdVisitStatus.intact,
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
          if (currHousehold.status === HouseholdVisitStatus.noVisit) {
            currHousehold.status = HouseholdVisitStatus.intact;
          } else {
            currHousehold.status = HouseholdVisitStatus.noVisit;
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
          if (currHousehold.status === HouseholdVisitStatus.noVisit) {
            return currHousehold;
          }
          if (currHousehold.status === HouseholdVisitStatus.met) {
            currHousehold.status = HouseholdVisitStatus.intact;
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

  return (
    <>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <GateView
            address={visitTableInfo[0]}
            buildingName={visitTableInfo[1]}
            gateName={visitTableInfo[2]}
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
              households={householdList}
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
