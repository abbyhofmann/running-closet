import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { Box } from '@mui/system';
import { Button, Card, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { getMetaData } from '../../../../tool';
import { Question } from '../../../../types';

/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 */
interface QuestionProps {
  q: Question;
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param q - The question object containing question details.
 */
const QuestionView = ({ q }: QuestionProps) => {
  const navigate = useNavigate();

  /**
   * Function to navigate to the home page with the specified tag as a search parameter.
   *
   * @param tagName - The name of the tag to be added to the search parameters.
   */
  const clickTag = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  /**
   * Function to navigate to the specified question page based on the question ID.
   *
   * @param questionID - The ID of the question to navigate to.
   */
  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  return (
    <Card
      sx={{ bgcolor: grey[300], marginX: 4 }}
      className='question right_padding'
      onClick={() => {
        if (q._id) {
          handleAnswer(q._id);
        }
      }}>
      <Box className='postStats' sx={{ marginY: 'auto' }}>
        <Typography sx={{ color: '#32292F' }}>{q.answers.length || 0} answers</Typography>
        <Typography sx={{ color: '#32292F' }}>{q.views.length} views</Typography>
      </Box>
      <Box className='question_mid' sx={{ marginY: 'auto' }}>
        <Typography sx={{ color: '#5171A5' }}>{q.title}</Typography>
        <Box className='question_tags'>
          {q.tags.map((tag, idx) => (
            <Button
              size='small'
              variant='contained'
              sx={{ bgcolor: '#32292F', color: '#C8C7EC', height: 25, marginRight: 1 }}
              key={idx}
              onClick={e => {
                e.stopPropagation();
                clickTag(tag.name);
              }}>
              {tag.name}
            </Button>
          ))}
        </Box>
      </Box>
      <Box sx={{ width: '25%' }}>
        <Typography
          sx={{ color: '#E77963', textDecoration: 'underline' }}
          onClick={e => {
            e.stopPropagation();
            navigate(`/profile/${q.askedBy}`);
          }}>
          {q.askedBy}
        </Typography>
        <Typography sx={{ color: '#32292F' }}>
          asked {getMetaData(new Date(q.askDateTime))}
        </Typography>
      </Box>
    </Card>
  );
};

export default QuestionView;
