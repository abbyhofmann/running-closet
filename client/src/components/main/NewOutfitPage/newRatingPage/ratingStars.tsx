import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

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
    <Box sx={{ width: 200, display: 'flex', alignItems: 'center' }}>
      <Rating
        name='hover-feedback'
        value={stars}
        precision={1}
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setStars(newValue ?? 0);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
      />
      {stars !== null && <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : stars]}</Box>}
    </Box>
  );
};

export default RatingStars;
