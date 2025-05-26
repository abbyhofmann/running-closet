import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { StarOutline } from '@mui/icons-material';
import { Typography } from '@mui/material';

const labels: { [index: string]: string } = {
  0: 'Useless',
  1: 'Poor',
  2: 'Ok',
  3: 'Good',
  4: 'Excellent',
  5: 'Perfect',
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

interface RatingStarsProps {
  stars: number;
  setStars: (starsToSet: number) => void;
}

const RatingStars = (props: RatingStarsProps) => {
  const [hover, setHover] = React.useState(-1);
  const { stars, setStars } = props;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ m: 1, fontSize: '1.70rem', color: '#32292F' }}>
        <strong> Overall Performance </strong>
      </Typography>
      <Typography sx={{ mt: 1, mb: 2, fontSize: '1.1rem', color: '#32292F', fontStyle: 'italic' }}>
        {`How did the outfit fare given the day's running conditions?`}
      </Typography>
      <Rating
        name='hover-feedback'
        value={stars}
        precision={1}
        // size='large'
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setStars(newValue ?? 0);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        icon={<StarIcon style={{ width: '60px', height: '60px' }} />}
        emptyIcon={<StarOutline style={{ width: '60px', height: '60px' }} />}
      />
      {stars !== null && (
        <Typography sx={{ mt: 1, fontSize: '1.25rem', textAlign: 'center' }}>
          {labels[hover !== -1 ? hover : stars]}
        </Typography>
      )}
    </Box>
  );
};

export default RatingStars;
