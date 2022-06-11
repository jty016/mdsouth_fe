/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import Button from '@mui/material/Button';
import { VisitStatus } from './types';

enum ButtonVariants { // placeholder name
  contained = 'contained',
  outlined = 'outlined',
  text = 'text',
}

enum ButtonColors {
  inherit = 'inherit',
  primary = 'primary',
  secondary = 'secondary',
  success = 'success',
  error = 'error',
  info = 'info',
  warning = 'warning',
}

export function HouseHoldButton(props: any) {
  const { id, name, status, onClick } = props;
  let variant = ButtonVariants.text;
  let color = ButtonColors.primary;
  switch (status) {
    case VisitStatus.intact:
      variant = ButtonVariants.text;
      color = ButtonColors.primary;
      break;
    case VisitStatus.visited:
      variant = ButtonVariants.outlined;
      color = ButtonColors.primary;
      break;
    case VisitStatus.met:
      variant = ButtonVariants.contained;
      color = ButtonColors.primary;
      break;
    case VisitStatus.noVisit:
      variant = ButtonVariants.outlined;
      color = ButtonColors.error;
      break;
    default:
  }
  return (
    <Button
      variant={variant}
      color={color}
      size="small"
      style={{ width: 80 }}
      onClick={onClick(id)}
    >
      {name}
    </Button>
  );
}

export function HouseholdOpsButton(props: any) {
  const { iconName, onClick } = props;
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
    default:
      icon = <LockIcon />;
  }
  return (
    <IconButton size="small" onClick={onClick}>
      {icon}
    </IconButton>
  );
}

export function ToggleEditButton(props: any) {
  const { id, isLock, onClick } = props;

  if (isLock) {
    return <HouseholdOpsButton iconName="edit" onClick={onClick(id)} />;
  }
  return <HouseholdOpsButton iconName="lock" onClick={onClick(id)} />;
}
