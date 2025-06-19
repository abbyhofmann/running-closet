import FileUploadIcon from '@mui/icons-material/FileUpload';
import { IconButton } from '@mui/material';
import React, { useState, useRef, ChangeEvent } from 'react';

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
      setImageUrl('/uploading.gif');
      //   const uploadedFile = fileUploadRef.current.files[0];
      // const cachedURL = URL.createObjectURL(uploadedFile);
      // setAvatarURL(cachedURL);
      const uploadedFile = event.target.files?.[0];
      console.log('uploadedFile: ', uploadedFile);
      if (!uploadedFile) return;

      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('https://api.escuelajs.co/api/v1/files/upload', {
        method: 'post',
        body: formData,
      });

      if (response.status === 201) {
        const data = await response.json();
        setImageUrl(data?.location);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error(error);
      setImageUrl(defaultImage);
    }
  };

  return (
    <div className='relative h-96 w-96 m-8'>
      <img src={imageUrl} alt='Uploaded outfit' className='h-96 w-96 rounded-full' />

      <form id='form' encType='multipart/form-data'>
        {/* <IconButton type='submit' aria-label='search' size='small' onClick={handleImageUpload}>
          <FileUploadIcon />
        </IconButton> */}
        <button
          type='submit'
          onClick={handleImageUpload}
          className='flex-center absolute bottom-12 right-14 h-9 w-9 rounded-full'>
          <FileUploadIcon />
          {/* <img src={EditIcon} alt='Edit' className='object-cover' /> */}
        </button>
        <input type='file' id='file' ref={fileUploadRef} onChange={uploadImageDisplay} hidden />
      </form>
    </div>
  );
};

export default ImageUpload;
