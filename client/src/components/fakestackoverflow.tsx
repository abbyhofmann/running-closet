import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './layout';
import Login from './login';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import ConversationsPage from './main/conversationsPage';
import Register from './register';
import ProfilePage from './main/profile';

const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: User | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  if (!user || !socket) {
    return <Navigate to='/' />;
  }

  return <UserContext.Provider value={{ user, socket }}>{children}</UserContext.Provider>;
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <LoginContext.Provider value={{ setUser }}>
      <Routes>
        {/* Public Route */}
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        {/* Protected Routes */}
        {
          <Route
            element={
              <ProtectedRoute user={user} socket={socket}>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path='/home' element={<QuestionPage />} />
            <Route path='tags' element={<TagPage />} />
            <Route path='/question/:qid' element={<AnswerPage />} />
            <Route path='/new/question' element={<NewQuestionPage />} />
            <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
            <Route path='/profile/:username' element={<ProfilePage />} />
            <Route path='/conversations' element={<ConversationsPage />}>
              <Route path=':cid' element={<ConversationsPage />} />
            </Route>
          </Route>
        }
      </Routes>
    </LoginContext.Provider>
  );
};

export default FakeStackOverflow;
