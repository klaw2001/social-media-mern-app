import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';

export default function ToolTipProfile() {
    const navigate = useNavigate()
    const onClickHandler = () =>{
        navigate('/edit-profile')
    }
  return (
    <Tooltip title="Edit Profile">
      <IconButton className='icon-button ms-2 mb-2' onClick={onClickHandler}>
        <EditIcon className='text-primary opacity-100'/>
      </IconButton>
    </Tooltip>
  );
}