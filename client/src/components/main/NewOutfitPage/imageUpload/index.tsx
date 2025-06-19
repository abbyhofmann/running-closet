import FileUploadIcon from '@mui/icons-material/FileUpload';
import React, { useState, useRef } from 'react';
import { Box, Stack } from '@mui/system';
import { Typography } from '@mui/material';
import { FaImage } from 'react-icons/fa';
import { uploadImage } from '../../../../services/outfitService';

const ImageUpload = () => {
  const defaultImage = '/clothing_compilation.jpg';
  const [imageUrl, setImageUrl] = useState<string>(defaultImage); // TODO - choose different default photo

  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fileUploadRef.current?.click();
  };

  const uploadImageDisplay = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedImageFile = event.target.files?.[0];
      if (!selectedImageFile) return;
      setImageUrl('/uploading.gif');

      // send file as form data
      const formData = new FormData();
      formData.append('file', selectedImageFile);

      const uploadedImageCloudUrl = await uploadImage(formData);
      setImageUrl(uploadedImageCloudUrl);
      // TODO add url to outfit state
    } catch (error) {
      console.error(error);
      setImageUrl(defaultImage);
    }
  };

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
