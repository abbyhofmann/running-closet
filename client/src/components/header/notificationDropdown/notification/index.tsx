import MailIcon from '@mui/icons-material/Mail';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { Notification } from '../../../../types';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * Represents the props for the Notification Component.
 */
interface NotificationComponentProps {
  notification: Notification;
  handleDeleteNotification: (nid: string | undefined) => void;
}

/**
 * Represents the Notification Component.
 */
const NotificationComponent = (props: NotificationComponentProps) => {
  const { notification, handleDeleteNotification } = props;
  const { user } = useUserContext();

  return (
    <MenuItem key={notification._id}>
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
      <Typography variant='inherit' noWrap sx={{ width: 100, color: blue[700] }}>
        {notification.message.sender.username}
      </Typography>
      <Typography variant='inherit' noWrap>
        {notification.message.messageContent}
      </Typography>
      <Button
        variant='text'
        sx={{ marginLeft: 'auto' }}
        onClick={() => {
          handleDeleteNotification(notification._id);
        }}>
        <DeleteIcon sx={{ color: grey[500] }}></DeleteIcon>
      </Button>
    </MenuItem>
  );
};
export default NotificationComponent;
