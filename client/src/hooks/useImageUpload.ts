import { useRef, useState } from 'react';
import { uploadImage } from '../services/outfitService';

/**
 * Custom hook to handle image upload functionality.
 */
const useImageUpload = () => {
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

  return {
    imageUrl,
    handleImageUpload,
    fileUploadRef,
    uploadImageDisplay,
  };
};

export default useImageUpload;
