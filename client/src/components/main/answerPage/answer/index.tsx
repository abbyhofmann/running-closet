import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/system';
import { grey } from '@mui/material/colors';
import { Card, Typography } from '@mui/material';
import { handleHyperlink } from '../../../../tool';
import CommentSection from '../../commentSection';
import './index.css';
import { Comment } from '../../../../types';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The username of the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - handleAddComment Callback function to handle adding a new comment.
 */
interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the answer's author.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param handleAddComment Function to handle adding a new comment.
 */
const AnswerView = ({ text, ansBy, meta, comments, handleAddComment }: AnswerProps) => {
  const navigate = useNavigate();
  return (
    <Card sx={{ margin: 2, padding: 3, bgcolor: grey[300] }}>
      <Grid container>
        <Grid container size={6}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Box>
              <Typography
                sx={{ color: '#5171A5', textDecoration: 'underline' }}
                onClick={() => {
                  navigate(`/profile/${ansBy}`);
                }}>
                {ansBy}
              </Typography>
              <Typography sx={{ color: '#5171A5' }}>{meta}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 9 }}>
            <Box id='answerText'>{handleHyperlink(text)}</Box>
          </Grid>
        </Grid>
        <Grid size={6} sx={{ bgcolor: grey[300] }}>
          <CommentSection comments={comments} handleAddComment={handleAddComment} />
        </Grid>
      </Grid>
    </Card>
  );
};

export default AnswerView;
