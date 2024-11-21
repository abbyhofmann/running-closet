import MailIcon from '@mui/icons-material/Mail';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../../../types';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * Represents the props for the Notification Component.
 */
interface NotificationComponentProps {
  notification: Notification;
  handleDeleteNotification: (nid: string | undefined) => void;
  handleClose: () => void;
}

/**
 * Represents the Notification Component.
 */
const NotificationComponent = (props: NotificationComponentProps) => {
  const { notification, handleDeleteNotification, handleClose } = props;
  const { user } = useUserContext();
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/conversations/${notification.message.cid}`);
    handleDeleteNotification(notification._id);
    handleClose();
  };

  return (
    <MenuItem key={notification._id} onClick={handleOnClick}>
      {/* Displaying an unread icon if unread, read icon if read */}
      {notification.message.readBy.map(n => n.username).includes(user.username) ? (
        <ListItemIcon sx={{ color: '#32292F' }}>
          <MailIcon fontSize='small' />
        </ListItemIcon>
      ) : (
        <ListItemIcon sx={{ color: '#E77963' }}>
          <MarkEmailUnreadIcon fontSize='small' />
        </ListItemIcon>
      )}
      <Typography variant='inherit' noWrap sx={{ width: 100, color: '#5171A5' }}>
        {notification.message.sender.username}
      </Typography>
      <Typography variant='inherit' noWrap sx={{ color: '#32292F' }}>
        {notification.message.messageContent}
      </Typography>
      <Button
        variant='text'
        sx={{ marginLeft: 'auto' }}
        onClick={() => {
          handleDeleteNotification(notification._id);
        }}>
        <DeleteIcon sx={{ color: '#32292F' }}></DeleteIcon>
      </Button>
    </MenuItem>
  );
};
export default NotificationComponent;
