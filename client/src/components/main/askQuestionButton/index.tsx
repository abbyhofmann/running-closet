import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AskQuestionButton component that renders a button for navigating to the
 * "New Question" page. When clicked, it redirects the user to the page
 * where they can ask a new question.
 */
const AskQuestionButton = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "New Question" page.
   */
  const handleNewQuestion = () => {
    navigate('/new/question');
  };

  return (
    <Button
      variant='contained'
      sx={{ bgcolor: '#473BF0', color: '#f5f3f5', height: 50, marginY: 'auto' }}
      onClick={() => {
        handleNewQuestion();
      }}>
      Ask a Question
    </Button>
  );
};

export default AskQuestionButton;
