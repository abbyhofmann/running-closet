import { Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Outfit } from '../../../../types';
import FeedCard from '../feedCard';

const FeedScroller = ({ outfits }: { outfits: Outfit[] }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          bgcolor: '#fafafa',
          width: 'fit-content', // only as wide as its content
          marginX: 'auto', // center it horizontally
          maxWidth: '100%', // prevent overflow on small screens
        }}>
        <Box
          sx={{
            'display': 'flex',
            'flexDirection': 'column', // Enables vertical scrolling
            'overflowY': 'auto',
            'gap': 2, // Spacing between cards
            'padding': 2, // Padding inside container
            'maxHeight': '60vh', // Limit height of box that contains the cards
            'scrollbarWidth': 'thin', // hides scrollbar
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'gray', borderRadius: 4 },
          }}>
          {outfits.map(outfit => {
            if (!outfit._id || !outfit.wearer || !outfit.dateWorn) return null;
            return (
              <FeedCard
                key={outfit._id}
                username={outfit.wearer.username}
                dateWorn={outfit.dateWorn}
                photoUrl={'/run_outfit.jpg'}
                clickOutfit={() => navigate(`/outfit/${outfit._id}`)}
              />
            );
          })}
        </Box>
      </Paper>
    </div>
  );
};

export default FeedScroller;
