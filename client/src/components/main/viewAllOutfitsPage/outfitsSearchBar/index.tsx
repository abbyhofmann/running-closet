import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import useOutfitsSearchBar from '../../../../hooks/useOutfitsSearchBar';

const OutfitsSearchBar = () => {
  const { val, handleInputChange, handleKeyDown } = useOutfitsSearchBar();
  return (
    <div>
      <Box
        component='form'
        sx={{ '& > :not(style)': { m: 'auto', width: '20ch' } }}
        autoComplete='off'>
        <TextField
          id='searchBar'
          placeholder='Search ...'
          value={val}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          sx={{ color: '#32292F', border: '#32292F' }}
          variant='outlined'
        />
      </Box>
    </div>
  );
};

export default OutfitsSearchBar;
