import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

export default function NavigationMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  return (
    <div>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        sx={{ color: '#32292F' }}
        onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu
        id='nav-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              width: '20ch',
              backgroundColor: '#5171A5',
              color: '#EDE6E3',
            },
          },
        }}>
        <MenuItem
          key='questions'
          onClick={() => {
            navigate(`/home`);
            handleClose();
          }}>
          Questions
        </MenuItem>
        <MenuItem
          key='tags'
          onClick={() => {
            navigate(`/tags`);
            handleClose();
          }}>
          Tags
        </MenuItem>
        <MenuItem
          key='messages'
          onClick={() => {
            navigate(`/conversations`);
            handleClose();
          }}>
          Messages
        </MenuItem>
      </Menu>
    </div>
  );
}
