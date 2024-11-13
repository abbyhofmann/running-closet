import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Notification } from '../types';

const useNotificationDropdown = () => {
  const [dropdown, setDropdown] = useState<null | HTMLElement>(null);
  const { user } = useUserContext();
  const [anyUnreadNotifications, setAnyUnreadNotifications] = useState<boolean>(false);
  const open = Boolean(dropdown);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = () => {
    const notificationList: Notification[] = [];
    return notificationList;
  };

  useEffect(() => {
    const notifList: Notification[] = fetchNotifications();
    setNotifications(notifList);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDropdown(event.currentTarget);
  };
  const handleClose = () => {
    setDropdown(null);
  };

  useEffect(() => {
    let unread: boolean = false;
    for (let i = 0; i < notifications.length; i++) {
      if (!notifications[i].message.readBy.map(n => n.username).includes(user.username)) {
        unread = true;
      }
    }
    setAnyUnreadNotifications(unread);
  }, [notifications, user.username]);

  return {
    dropdown,
    setDropdown,
    user,
    anyUnreadNotifications,
    setAnyUnreadNotifications,
    open,
    handleClick,
    handleClose,
    notifications,
  };
};

export default useNotificationDropdown;
