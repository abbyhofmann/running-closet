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
    // add in call to backend when implemented.
    // example notifications
    // *** ONCE NOTIFICATION SERVICE IS IN PLACE, REPLACE WITH THE NOTIFICATIONS FOR THE CURRENT USER ***
    // const user1: User = { username: 'user1' };
    // const user2: User = { username: 'user2' };
    // const user3: User = { username: 'user3' };
    // const conversation1: Conversation = { users: [user1, user2] };
    // const conversation2: Conversation = { users: [user1, user3] };
    // const conversation3: Conversation = { users: [user1, user2, user3] };
    // const message1: Message = {
    //   messageContent: 'example message 1',
    //   conversation: conversation1,
    //   sender: user2,
    //   sentAt: new Date(),
    //   readBy: [user1],
    // };
    // const message2: Message = {
    //   messageContent: 'example message 2',
    //   conversation: conversation2,
    //   sender: user3,
    //   sentAt: new Date(),
    //   readBy: [user1],
    // };
    // const message3: Message = {
    //   messageContent: 'example message 3',
    //   conversation: conversation3,
    //   sender: user3,
    //   sentAt: new Date(),
    //   readBy: [user1, user2],
    // };
    // const notificationList: Notification[] = [
    //   { user: 'user1', message: message1 },
    //   { user: 'user1', message: message2 },
    //   { user: 'user1', message: message3 },
    // ];
    const notificationList: Notification[] = [];
    return notificationList;
  };

  useEffect(() => {
    const notifList: Notification[] = fetchNotifications();
    setNotifications(notifList);
  }, [notifications]);

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
