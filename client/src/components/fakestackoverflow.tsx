import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './layout';
import Login from './login';
import { FakeSOSocket, Outfit, User } from '../types';
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
import NewOutfitPage from './main/newOutfitPage';
import OutfitContext from '../contexts/OutfitContext';
import RatingForm from './main/newOutfitPage/newRatingPage/ratingForm';
import MyOutfitsPage from './main/myOutfitsPage';
import ViewOutfitPage from './main/viewOutfitPage';
import FeedPage from './main/feedPage';
import ViewAllOutfitsPage from './main/viewAllOutfitsPage';

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

  // Initial state for OutfitContext
  const initialOutfit: Outfit = {
    tops: [],
    bottoms: [],
    outerwear: [],
    accessories: [],
  };
  const [outfit, setOutfit] = useState<Outfit>(initialOutfit);

  const resetOutfit = () => setOutfit(initialOutfit);

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
            {/* Outfit Routes */}
            {/* view logged-in user's outfits */}
            <Route path='myOutfits' element={<MyOutfitsPage />} />
            {/* view one outfit */}
            <Route path='/outfit/:oid' element={<ViewOutfitPage />} />
            {/* view all outfits */}
            <Route path='/allOutfits' element={<ViewAllOutfitsPage />} />
            {/* NEW HOME PAGE (TODO - update /home route to route to this page instead) */}
            <Route path='/newHome' element={<FeedPage />} />
            <Route
              path='/createOutfit/*'
              element={
                <OutfitContext.Provider value={{ outfit, setOutfit, resetOutfit }}>
                  <Routes>
                    <Route path='/' element={<NewOutfitPage />} />
                    <Route path='rating' element={<RatingForm />} />
                  </Routes>
                </OutfitContext.Provider>
              }
            />
          </Route>
        }
      </Routes>
    </LoginContext.Provider>
  );
};

export default FakeStackOverflow;
