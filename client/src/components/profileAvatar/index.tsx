import { Avatar } from '@mui/material';

/**
 * Props needed for the profile icon. The profileGraphic corresponds to which
 * profile icon will be displayed, and the size determines how big the icon will be.
 */
interface ProfileAvatarProps {
  profileGraphic: number;
  size: number;
}

/**
 * Reusable component for the profile icon.
 */
const ProfileAvatar = ({ profileGraphic, size }: ProfileAvatarProps) => (
  <Avatar style={{ width: size, height: size }}>
    <img
      src={`/profileGraphics/image${profileGraphic}.jpeg`}
      style={{
        width: '110%',
        height: '110%',
        objectFit: 'cover',
        borderRadius: '50%',
      }}
    />
  </Avatar>
);

export default ProfileAvatar;
