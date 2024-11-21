import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Notification, NotificationUpdatePayload } from '../types';
import { deleteNotification, getNotifications } from '../services/notificationService';

/**
 * Custom hook for managing the state and logic of the notification dropdown.
 *
 * @returns dropdown - the html dropdown that holds the notifications.
 * @returns setDropdown - a function that sets the html dropdown.
 * @returns user - the current user logged in.
 * @returns anyUnreadNotifications - a boolean representing if there are any unread notifications.
 * @returns setAnyUnreadNotifications - a function that sets the boolean anyUnreadNotifications.
 * @returns open - a boolean representing if the dropdown is open.
 * @returns handleClick - a function that handles a click event.
 * @returns handleClose - a function that handles a close event.
 * @returns notifications - represents the displayed notification.
 * @returns handleDeleteNotification - a function that sets teh displayed notifications.
 */
const useNotificationDropdown = () => {
  const [dropdown, setDropdown] = useState<null | HTMLElement>(null);
  const { user, socket } = useUserContext();
  const [anyUnreadNotifications, setAnyUnreadNotifications] = useState<boolean>(false);
  const open = Boolean(dropdown);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Determines whether the first notification is newer than the second one.
   * @param notification1 the first notification.
   * @param notification2 the second notification.
   * @returns -1 if the first is newer than the second, 0 if they were updated at the same time,
   * and 1 if the second one is newer.
   */
  const sortBySentAt = (notification1: Notification, notification2: Notification): number => {
    if (notification1.message.sentAt > notification2.message.sentAt) {
      return -1;
    }
    if (notification1.message.sentAt < notification2.message.sentAt) {
      return 1;
    }
    return 0;
  };

  /**
   * Handles deleting the notification with the given id. Updates the displayed notifications upon success.
   * @param nid the id for the notification to be deleted.
   */
  const handleDeleteNotification = async (nid: string | undefined): Promise<void> => {
    if (nid) {
      const success = await deleteNotification(nid);
      if (success) {
        setNotifications(prevNlist => prevNlist.filter(n => n._id !== nid));
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const notifs = (await getNotifications(user.username)).sort(sortBySentAt);
        if (notifs) {
          setNotifications(notifs);
          return;
        }
        setNotifications([]);
      } catch (err) {
        setNotifications([]);
      }
    }
    fetchData();

    /**
     * Adds the new notification to the list of notifications when it is recieved.
     * @param notification the notification to add.
     */
    const handleNotificationUpdate = (updatePayload: NotificationUpdatePayload) => {
      const { notification, type } = updatePayload;
      if (user.username === notification.user) {
        setNotifications(prevNotifications => {
          if (type === 'add' && !prevNotifications.find(n => n._id === notification._id)) {
            return [...prevNotifications, notification];
          }
          if (type === 'remove') {
            return prevNotifications.filter(n => n.message._id !== notification.message._id);
          }
          return prevNotifications;
        });
      }
    };

    socket.on('notificationsUpdate', handleNotificationUpdate);

    return () => {
      socket.off('notificationsUpdate', handleNotificationUpdate);
    };
  }, [user.username, socket]);

  /**
   * Handles click. From MUI.
   * @param event click event.
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDropdown(event.currentTarget);
  };

  /**
   * Handles close. From MUI.
   */
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
    handleDeleteNotification,
  };
};

export default useNotificationDropdown;
