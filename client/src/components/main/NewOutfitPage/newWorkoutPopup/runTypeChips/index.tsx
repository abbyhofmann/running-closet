import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function RunTypeChips() {
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  /*
  { key: 0, label: 'tempo' },
    { key: 1, label: 'speed' },
    { key: 2, label: 'easy' },
    { key: 3, label: 'long' },
    { key: 4, label: 'recovery' },
    { key: 5, label: 'fartlek' },
    { key: 6, label: 'hill' }, 
  */

  return (
    <Stack direction='row' spacing={1}>
      <Chip label='Clickable' onClick={handleClick} />
      <Chip label='Clickable yeahhh' onClick={handleClick} />
    </Stack>
  );
}
