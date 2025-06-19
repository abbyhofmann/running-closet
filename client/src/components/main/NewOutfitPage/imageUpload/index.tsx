import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Box, Stack } from '@mui/system';
import { Typography } from '@mui/material';
import { FaImage } from 'react-icons/fa';
import useImageUpload from '../../../../hooks/useImageUpload';

/**
 * Component for selecting and uploading an image, which is used when adding
 * a photo to an outfit.
 */
const ImageUpload = () => {
  const { imageUrl, handleImageUpload, fileUploadRef, uploadImageDisplay } = useImageUpload();

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {/* label aligned to left */}
      <Stack direction='row' alignItems='center' spacing={1}>
        <Typography variant='h6' fontWeight='bold'>
          Upload Outfit Photo
        </Typography>
        <FaImage color='#473BF0' size='20px' />
      </Stack>

      {/* image remains centered */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        <img
          src={imageUrl}
          alt='Uploaded outfit'
          style={{ width: 'auto', height: '450px', borderRadius: '12px' }}
        />

        <form id='form' encType='multipart/form-data'>
          <button
            type='submit'
            onClick={handleImageUpload}
            className='flex-center absolute bottom-6 right-6 h-9 w-9 rounded-full'>
            <FileUploadIcon />
          </button>
          <input
            type='file'
            id='file'
            accept='image/*'
            ref={fileUploadRef}
            onChange={uploadImageDisplay}
            hidden
          />
        </form>
      </Box>
    </Stack>
  );
};

export default ImageUpload;
