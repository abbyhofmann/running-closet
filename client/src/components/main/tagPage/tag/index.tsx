import React from 'react';
import './index.css';
import { Card, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { TagData } from '../../../../types';
import useTagSelected from '../../../../hooks/useTagSelected';

/**
 * Props for the Tag component.
 *
 * t - The tag object.
 * clickTag - Function to handle the tag click event.
 */
interface TagProps {
  t: TagData;
  clickTag: (tagName: string) => void;
}

/**
 * Tag component that displays information about a specific tag.
 * The component displays the tag's name, description, and the number of associated questions.
 * It also triggers a click event to handle tag selection.
 *
 * @param t - The tag object .
 * @param clickTag - Function to handle tag clicks.
 */
const TagView = ({ t, clickTag }: TagProps) => {
  const { tag } = useTagSelected(t);

  return (
    <Card
      sx={{ bgcolor: grey[300] }}
      className='tagNode'
      onClick={() => {
        clickTag(t.name);
      }}>
      <Typography sx={{ color: '#E77963', marginY: 'auto' }}>
        <strong>{tag.name.toLowerCase()}</strong>
      </Typography>
      <Typography sx={{ color: '#32292F', marginY: 'auto' }}>{tag.description}</Typography>
      <Typography sx={{ color: '#5171A5', marginY: 'auto' }}>{t.qcnt} questions</Typography>
    </Card>
  );
};

export default TagView;
