import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";


interface NewOutfitItemPopupProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
  }
  
  const NewOutfitItemPopup = (props: NewOutfitItemPopupProps) => {
    const { onClose, selectedValue, open } = props;
    const [brand, setBrand] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [s3url, setS3url] = useState<string>('');

  
    const handleClose = () => {
      onClose(selectedValue);
    };
  
    const handleListItemClick = (value: string) => {
      onClose(value);
    };
  
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Specify Outfit Item Elements</DialogTitle>
        <List sx={{ pt: 0 }}>
            <ListItem disablePadding key={'brand'}>
              <ListItemButton onClick={() => handleListItemClick(email)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={email} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding key={'submit'}>
              <ListItemButton onClick={() => handleListItemClick(brand, model, s3url)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={email} />
              </ListItemButton>
            </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              autoFocus
              onClick={() => handleListItemClick('addAccount')}
            >
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Add account" />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    );
  };
  export default NewOutfitItemPopup;