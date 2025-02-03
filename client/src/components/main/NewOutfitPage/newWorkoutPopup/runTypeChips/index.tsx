import { useState } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

interface RunTypeChipProps {
  handleSelectRunType: (value: string) => void;
}

export default function RunTypeChips(props: RunTypeChipProps) {
  const { handleSelectRunType } = props;

  const [selectedRunType, setSelectedRunType] = useState<string | null>(null);

  const runTypes = ['tempo', 'speed', 'easy', 'long', 'recovery', 'fartlek', 'hill'];

  const handleChipClick = (type: string) => {
    const newSelected = selectedRunType === type ? null : type; // Toggle selection
    setSelectedRunType(newSelected);
    handleSelectRunType(newSelected || ''); // Pass empty string if deselected
  };

  return (
    <Stack direction='row' spacing={1}>
      {runTypes.map(type => (
        <Chip
          key={type}
          label={type}
          onClick={() => handleChipClick(type)}
          color={selectedRunType === type ? 'primary' : 'default'} // Change color if selected
          variant={selectedRunType === type ? 'filled' : 'outlined'} // Optional: Change variant
        />
      ))}
    </Stack>
  );
}
