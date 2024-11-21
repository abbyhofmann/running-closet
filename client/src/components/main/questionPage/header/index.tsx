import React from 'react';
import './index.css';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import OrderButton from './orderButton';
import { OrderType, orderTypeDisplayName } from '../../../../types';
import AskQuestionButton from '../../askQuestionButton';

/**
 * Interface representing the props for the QuestionHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * qcnt - The number of questions to be displayed in the header.
 * setQuestionOrder - A function that sets the order of questions based on the selected message.
 */
interface QuestionHeaderProps {
  titleText: string;
  qcnt: number;
  setQuestionOrder: (order: OrderType) => void;
}

/**
 * QuestionHeader component displays the header section for a list of questions.
 * It includes the title, a button to ask a new question, the number of the quesions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 */
const QuestionHeader = ({ titleText, qcnt, setQuestionOrder }: QuestionHeaderProps) => (
  <Grid container>
    <Grid size={6} sx={{ marginTop: 3 }}>
      <Box
        sx={{
          justifyContent: 'flex-start',
          display: 'flex',
          alignItems: 'start',
          marginY: 2,
          paddingLeft: 4,
        }}>
        <Typography variant='h4' sx={{ color: '#32292F' }}>
          <strong>{titleText}</strong>
        </Typography>
      </Box>
    </Grid>
    <Grid size={6} sx={{ marginTop: 3 }}>
      <Box
        sx={{
          justifyContent: 'flex-end',
          display: 'flex',
          alignItems: 'end',
          marginY: 2,
          paddingRight: 4,
        }}>
        <AskQuestionButton />
      </Box>
    </Grid>
    <Grid size={4}>
      <Box
        sx={{
          justifyContent: 'flex-start',
          display: 'flex',
          alignItems: 'start',
          marginY: 2,
          paddingLeft: 5,
        }}>
        <Typography variant='h6' sx={{ color: '#32292F' }}>
          {qcnt} questions
        </Typography>
      </Box>
    </Grid>
    <Grid size={{ xs: 12, md: 8 }}>
      <Box
        sx={{
          justifyContent: 'flex-end',
          display: 'flex',
          alignItems: 'end',
          marginY: 2,
          paddingRight: 3,
        }}>
        {Object.keys(orderTypeDisplayName).map((order, idx) => (
          <OrderButton
            key={idx}
            orderType={order as OrderType}
            setQuestionOrder={setQuestionOrder}
          />
        ))}
      </Box>
    </Grid>
  </Grid>
);

export default QuestionHeader;
