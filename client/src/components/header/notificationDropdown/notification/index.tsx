import MailIcon from '@mui/icons-material/Mail';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import { Notification } from '../../../../types';
import useUserContext from '../../../../hooks/useUserContext';

interface NotificationComponentProps {
  notification: Notification;
  handleClose: () => void;
}

const NotificationComponent = (props: NotificationComponentProps) => {
  const { notification, handleClose } = props;
  const { user } = useUserContext();
  return (
    <MenuItem key={notification._id} onClick={handleClose}>
      {/* Displaying an unread icon if unread, read icon if read */}
      {notification.message.readBy.map(n => n.username).includes(user.username) ? (
        <ListItemIcon sx={{ color: 'gray' }}>
          <MailIcon fontSize='small' />
        </ListItemIcon>
      ) : (
        <ListItemIcon sx={{ color: 'red' }}>
          <MarkEmailUnreadIcon fontSize='small' />
        </ListItemIcon>
      )}
      <Typography variant='inherit' noWrap sx={{ width: 100, color: 'blue' }}>
        {notification.message.sender.username}
      </Typography>
      <Typography variant='inherit' noWrap>
        {notification.message.messageContent}
      </Typography>
    </MenuItem>
  );
};
export default NotificationComponent;
