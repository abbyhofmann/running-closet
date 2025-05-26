import { Box } from '@mui/system';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { IconButton, Typography } from '@mui/material';
import { downvoteQuestion, upvoteQuestion } from '../../../services/questionService';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';
import { Question } from '../../../types';
import useVoteStatus from '../../../hooks/useVoteStatus';

/**
 * Interface represents the props for the VoteComponent.
 *
 * question - The question object containing voting information.
 */
interface VoteComponentProps {
  question: Question;
}

/**
 * A Vote component that allows users to upvote or downvote a question.
 *
 * @param question - The question object containing voting information.
 */
const VoteComponent = ({ question }: VoteComponentProps) => {
  const { user } = useUserContext();
  const { count, voted } = useVoteStatus({ question });

  /**
   * Function to handle upvoting or downvoting a question.
   *
   * @param type - The type of vote, either 'upvote' or 'downvote'.
   */
  const handleVote = async (type: string) => {
    try {
      if (question._id) {
        if (type === 'upvote') {
          await upvoteQuestion(question._id, user.username);
        } else if (type === 'downvote') {
          await downvoteQuestion(question._id, user.username);
        }
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', padding: 2, marginLeft: 2 }}>
      <IconButton
        aria-label='upvote'
        sx={{ color: voted === 1 ? '#473BF0' : '#' }}
        onClick={() => handleVote('upvote')}>
        <ThumbUpIcon />
      </IconButton>
      <IconButton
        aria-label='downvote'
        sx={{ color: voted === -1 ? '#E77963' : '#' }}
        onClick={() => handleVote('downvote')}>
        <ThumbDownIcon />
      </IconButton>
      <Typography sx={{ marginLeft: 1 }}>{count}</Typography>
    </Box>
  );
};

export default VoteComponent;
