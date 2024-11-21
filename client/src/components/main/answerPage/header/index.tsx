import React from 'react';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import './index.css';
import AskQuestionButton from '../../askQuestionButton';

/**
 * Interface representing the props for the AnswerHeader component.
 *
 * - ansCount - The number of answers to display in the header.
 * - title - The title of the question or discussion thread.
 */
interface AnswerHeaderProps {
  ansCount: number;
  title: string;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 * It includes the number of answers, the title of the question, and a button to ask a new question.
 *
 * @param ansCount The number of answers to display.
 * @param title The title of the question or discussion thread.
 */
const AnswerHeader = ({ ansCount, title }: AnswerHeaderProps) => (
  <Grid container>
    <Grid size={6}>
      <Box
        sx={{
          justifyContent: 'flex-start',
          display: 'flex',
          alignItems: 'start',
          marginTop: 2,
          paddingLeft: 4,
        }}>
        <Typography variant='h5'>
          <strong>{title}</strong>
        </Typography>
      </Box>
    </Grid>
    <Grid size={6}>
      <Box
        sx={{
          justifyContent: 'flex-end',
          display: 'flex',
          alignItems: 'end',
          marginTop: 2,
          paddingRight: 4,
        }}>
        <Typography variant='h6'>
          <strong>{ansCount} answers</strong>
        </Typography>
      </Box>
    </Grid>
    <Grid size={12}>
      <Box
        sx={{
          justifyContent: 'flex-end',
          display: 'flex',
          alignItems: 'end',
          paddingRight: 4,
          marginTop: 2,
        }}>
        <AskQuestionButton />
      </Box>
    </Grid>
  </Grid>
);

export default AnswerHeader;
