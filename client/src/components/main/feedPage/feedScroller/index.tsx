import { Box, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { FaRunning } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Outfit } from '../../../../types';
import FeedCard from '../feedCard';

const FeedScroller = ({ outfits }: { outfits: Outfit[] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Stack direction='row' sx={{ gap: 1 }} alignItems='center'>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Feed
        </Typography>
        <FaRunning color='#473BF0' size={'20px'} />
      </Stack>
      <Box
        sx={{
          'display': 'flex',
          'overflowX': 'auto', // Enables horizontal scrolling
          'gap': 2, // Spacing between cards
          'padding': 2, // Padding inside container
          'scrollbarWidth': 'thin', // hides scrollbar
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'gray', borderRadius: 4 },
          'whiteSpace': 'nowrap', // prevents wrapping
        }}>
        {outfits.map(outfit => {
          if (!outfit._id || !outfit.wearer || !outfit.dateWorn) return null;
          return (
            <FeedCard
              key={outfit._id}
              wearer={outfit.wearer.username}
              dateWorn={outfit.dateWorn}
              photoUrl={'/run_outfit.jpg'}
              clickOutfit={() => navigate(`/outfit/${outfit._id}`)}
            />
          );
        })}
      </Box>
    </div>
  );
};

export default FeedScroller;
