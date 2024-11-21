import React from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import './index.css';
import TagView from './tag';
import useTagPage from '../../../hooks/useTagPage';
import AskQuestionButton from '../askQuestionButton';

/**
 * Represents the TagPage component which displays a list of tags
 * and provides functionality to handle tag clicks and ask a new question.
 */
const TagPage = () => {
  const { tlist, clickTag } = useTagPage();

  return (
    <Box sx={{ paddingRight: 3 }}>
      <Box className='space_between right_padding'>
        <Typography variant='h5'>
          <strong>{tlist.length} Tags</strong>
        </Typography>
        <Typography variant='h5'>
          <strong>All Tags</strong>
        </Typography>
        <AskQuestionButton />
      </Box>
      <Box className='tag_list right_padding'>
        {tlist.map((t, idx) => (
          <TagView key={idx} t={t} clickTag={clickTag} />
        ))}
      </Box>
    </Box>
  );
};

export default TagPage;
