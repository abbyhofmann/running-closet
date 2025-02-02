import './index.css';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { handleHyperlink } from '../../../../tool';

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - views - The number of views the question has received.
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The username of the user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 */
interface QuestionBodyProps {
  views: number;
  text: string;
  askby: string;
  meta: string;
}

/**
 * QuestionBody component that displays the body of a question.
 * It includes the number of views, the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param views The number of views the question has received.
 * @param text The content of the question.
 * @param askby The username of the question's author.
 * @param meta Additional metadata related to the question.
 */
const QuestionBody = ({ views, text, askby, meta }: QuestionBodyProps) => {
  const navigate = useNavigate();
  return (
    <Box id='questionBody' className='questionBody right_padding'>
      <Typography variant='h5' sx={{ width: '10%' }}>
        <strong>{views} views</strong>
      </Typography>
      <Typography sx={{ width: '70%', paddingLeft: 3, paddingRight: 2 }}>
        {handleHyperlink(text)}
      </Typography>
      <Typography sx={{ width: '20%' }}>
        <Typography
          sx={{ textDecoration: 'underline', color: '#E77963' }}
          onClick={() => {
            navigate(`/profile/${askby}`);
          }}>
          {askby}
        </Typography>
        <Typography>asked {meta}</Typography>
      </Typography>
    </Box>
  );
};

export default QuestionBody;
