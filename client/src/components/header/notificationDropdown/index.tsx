import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Paper from '@mui/material/Paper';
import { grey } from '@mui/material/colors';
import useNotificationDropdown from '../../../hooks/useNotificationDropdown';
import NotificationComponent from './notification';

/**
 * Represents the Notification Dropdown component that displays all notifications for the user.
 * @returns the NotificationDropdown component.
 */
export default function NotificationDropdown() {
  const {
    notifications,
    dropdown,
    anyUnreadNotifications,
    open,
    handleClick,
    handleClose,
    handleDeleteNotification,
  } = useNotificationDropdown();

  return (
    <div>
      <Button
        sx={{ justifyContent: 'center' }}
        id='notification-icon'
        aria-controls={open ? 'notification-display-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}>
        <ListItemIcon>
          <NotificationsIcon
            fontSize='large'
            sx={{ color: anyUnreadNotifications ? '#E77963' : '#32292F', marginX: 'auto' }}
          />
        </ListItemIcon>
      </Button>
      <Menu
        id='notification-display-menu'
        anchorEl={dropdown}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'notification-icon',
        }}
        slotProps={{
          paper: {
            style: {
              backgroundColor: '#f5f3f5',
              color: '#f5f3f5',
            },
          },
        }}>
        <Paper sx={{ width: 400, margin: 1, bgcolor: grey[300] }}>
          {notifications.length >= 1 &&
            notifications.map(notification => (
              <NotificationComponent
                key={notification._id}
                notification={notification}
                handleDeleteNotification={handleDeleteNotification}
                handleClose={handleClose}></NotificationComponent>
            ))}
          {notifications.length === 0 && (
            <MenuItem onClick={handleClose}>
              <Typography variant='inherit' noWrap>
                No notifications.
              </Typography>
            </MenuItem>
          )}
        </Paper>
      </Menu>
    </div>
  );
}
