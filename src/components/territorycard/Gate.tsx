/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
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
} from './HouseHold';

interface GateProps {
  address: string;
  buildingName: string;
  gateName: string;
  households: Array<HouseholdProps>;
}

export function GateView(props: GateProps) {
  const { address, buildingName, gateName, households } = props;

  const houseHoldItems = households.map(household => {
    return (
      <HouseHoldButton
        key={household.id}
        id={household.id}
        name={household.name}
        status="intact"
      />
    );
  });

  return (
    <Table aria-label="simple table">
      <TableBody>
        <TableRow>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{address}</TableCell>
          <TableCell>{buildingName}</TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell component="th" scope="row">
            {gateName}
          </TableCell>
          <TableCell align="left" size="small" padding="none">
            {houseHoldItems}
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

export function GateEditable(props: GateProps) {
  const { address, buildingName, gateName, households } = props;
  const [householdList, setHouseholdList] = React.useState(households);
  const handleEditToggle = (id: number) => () => {
    setHouseholdList(
      householdList.map((household: HouseholdProps) => {
        if (household.id === id) {
          householdList[id].isLock = !household.isLock;
        }
        return household;
      }),
    );
  };

  const handleHouseholdDelete = (key: number) => () => {
    setHouseholdList(
      householdList.filter(shop => {
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
        status: 'intact',
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

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="vertical">
        {(provided, snapshot) => (
          <>
            <HouseholdOpsButton
              align="left"
              iconName="add"
              onClick={handleHouseholdAdd}
            />
            <Table
              aria-label="simple table"
              ref={provided.innerRef}
              // style={getListStyle(snapshot.isDraggingOver)}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Test</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {householdList.map((item: HouseholdProps, index) => (
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
                        <TableCell sx={{ whiteSpace: 'nowrap' }} padding="none">
                          <TextField
                            disabled={item.isLock}
                            // required
                            // id="standard-required"
                            // label="Required"
                            defaultValue={item.name}
                            variant="standard"
                            margin="dense"
                          />
                        </TableCell>
                        <TableCell />
                        <TableCell padding="none">
                          <HouseholdOpsButton
                            iconName="delete"
                            onClick={handleHouseholdDelete(item.id)}
                          />
                          <ToggleEditButton
                            id={item.id}
                            isLock={item.isLock}
                            onClick={handleEditToggle}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          </>
        )}
      </Droppable>
    </DragDropContext>
  );
}
