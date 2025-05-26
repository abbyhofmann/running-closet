import { Box, Card, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

/**
 * Represents the props for the ClothingItemCard component.
 */
interface ClothingItemCardProps {
  clothingItemType: string;
  brand: string;
  model: string;
  s3PhotoUrl: string;
}

/**
 * Represents a clothing item card for displaying the clothing item of an outfit.
 * @returns the clothing item card element.
 */
const ClothingItemCard = (props: ClothingItemCardProps) => {
  const { clothingItemType, brand, model, s3PhotoUrl } = props;

  return (
    <Card key={s3PhotoUrl}>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: grey[300],
          padding: 1,
        }}>
        {/* TODO - add avatar for displaying the photo */}
        <Typography
          variant='h6'
          sx={{ textAlign: 'center', marginY: 'auto', color: '#32292F', paddingLeft: 2 }}
          noWrap>
          {clothingItemType} {brand} {model}
        </Typography>
      </Box>
    </Card>
  );
};
export default ClothingItemCard;
