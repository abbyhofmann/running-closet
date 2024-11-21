import './index.css';
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Form from '../baseComponents/form';
import TextArea from '../baseComponents/textarea';
import useAnswerForm from '../../../hooks/useAnswerForm';

/**
 * NewAnswerPage component allows users to submit an answer to a specific question.
 */
const NewAnswerPage = () => {
  const { text, textErr, setText, postAnswer } = useAnswerForm();

  return (
    <Form>
      <TextArea
        title={'Answer Text'}
        id={'answerTextInput'}
        val={text}
        setState={setText}
        err={textErr}
      />
      <Box className='btn_indicator_container'>
        <Button className='form_postBtn' variant='contained' onClick={postAnswer}>
          Post Answer
        </Button>
        <Typography className='mandatory_indicator'>* indicates mandatory fields</Typography>
      </Box>
    </Form>
  );
};

export default NewAnswerPage;
