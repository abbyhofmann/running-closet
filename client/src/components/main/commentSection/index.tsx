import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid2';
import { Button, Card, Grid2, TextField, Typography } from '@mui/material';
import { getMetaData } from '../../../tool';
import { Comment } from '../../../types';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';

/**
 * Interface representing the props for the Comment Section component.
 *
 * - comments - list of the comment components
 * - handleAddComment - a function that handles adding a new comment, taking a Comment object as an argument
 */
interface CommentSectionProps {
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
}

/**
 * CommentSection component shows the users all the comments and allows the users add more comments.
 *
 * @param comments: an array of Comment objects
 * @param handleAddComment: function to handle the addition of a new comment
 */
const CommentSection = ({ comments, handleAddComment }: CommentSectionProps) => {
  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);
  const navigate = useNavigate();

  /**
   * Function to handle the addition of a new comment.
   */
  const handleAddCommentClick = () => {
    if (text.trim() === '' || user.username.trim() === '') {
      setTextErr(text.trim() === '' ? 'Comment text cannot be empty' : '');
      return;
    }

    const newComment: Comment = {
      text,
      commentBy: user.username,
      commentDateTime: new Date(),
    };

    handleAddComment(newComment);
    setText('');
    setTextErr('');
  };

  return (
    <Box sx={{ margin: 1, padding: 1 }}>
      <Button
        fullWidth
        sx={{ bgcolor: '#C8C7EC', color: '#32292F', marginX: 'auto' }}
        variant='contained'
        onClick={() => setShowComments(!showComments)}>
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </Button>

      {showComments && (
        <Box className='comments-container'>
          <Box className='comments-list'>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Card
                  key={index}
                  className='comment-item'
                  sx={{ bgcolor: 'white', display: 'flex', paddingY: 1 }}>
                  <Grid container sx={{ width: '100%' }}>
                    <Grid size={12}>
                      <Box
                        sx={{
                          marginY: 'auto',
                          paddingY: 'auto',
                          paddingLeft: 'auto',
                          width: '100%',
                        }}>
                        <Typography
                          className='comment-meta'
                          onClick={() => {
                            navigate(`/profile/${comment.commentBy}`);
                          }}>
                          <span className='underline-name'>{comment.commentBy}</span>
                          {', '}
                          {getMetaData(new Date(comment.commentDateTime))}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={12}>
                      <Box
                        sx={{
                          marginY: 'auto',
                          paddingY: 'auto',
                          paddingRight: 'auto',
                          width: '100%',
                        }}>
                        <Typography>{comment.text}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              ))
            ) : (
              <Typography className='no-comments'>No comments yet.</Typography>
            )}
          </Box>

          <Box className='add-comment'>
            <Grid2 container sx={{ width: '100%' }}>
              <Grid2 size={7}>
                <TextField
                  variant='outlined'
                  placeholder='Comment'
                  value={text}
                  sx={{ bgcolor: 'white', width: '100%' }}
                  onChange={e => setText(e.target.value)}
                  className='comment-textarea'
                />
              </Grid2>
              <Grid2 size={5} sx={{ paddingRight: 2 }}>
                <Button
                  className='add-comment-button'
                  onClick={handleAddCommentClick}
                  fullWidth
                  sx={{
                    bgcolor: '#5171A5',
                    color: '#EDE6E3',
                    height: '100%',
                    marginX: 2,
                  }}>
                  Add Comment
                </Button>
              </Grid2>
            </Grid2>
            {textErr && <Typography className='error'>{textErr}</Typography>}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;
