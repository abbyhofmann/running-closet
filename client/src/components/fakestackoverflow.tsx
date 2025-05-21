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
import ClothingItemForm from './main/newOutfitPage/newClothingItem/clothingItemForm';
import RatingForm from './main/newOutfitPage/newRatingPage/ratingForm';

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
    wearer: null,
    workout: null,
    dateWorn: new Date(),
    location: '',
    ratings: [],
    tops: [],
    bottoms: [],
    outerwear: [],
    accessories: [],
    shoe: null,
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
            <Route
              path='/createOutfit/*'
              element={
                <OutfitContext.Provider value={{ outfit, setOutfit, resetOutfit }}>
                  <Routes>
                    <Route path='/' element={<NewOutfitPage />} />
                    <Route
                      path='top'
                      element={
                        <ClothingItemForm clothingItem={'top'} nextClothingItem={'bottom'} />
                      }
                    />
                    <Route
                      path='bottom'
                      element={
                        <ClothingItemForm clothingItem={'bottom'} nextClothingItem={'outerwear'} />
                      }
                    />
                    <Route
                      path='outerwear'
                      element={
                        <ClothingItemForm
                          clothingItem={'outerwear'}
                          nextClothingItem={'accessory'}
                        />
                      }
                    />
                    <Route
                      path='accessory'
                      element={
                        <ClothingItemForm clothingItem={'accessory'} nextClothingItem={'shoe'} />
                      }
                    />
                    <Route
                      path='shoe'
                      element={
                        <ClothingItemForm
                          clothingItem={'shoe'}
                          nextClothingItem={'outfitOverview'}
                        />
                      }
                    />
                    {/* <Route
                      path='outfitOverview'
                      element={<OutfitOverviewPage />}
                    /> */}
                    {/* TODO - updating routing so that upon creating a new outfit, you are redirected to view my outfits page */}
                    <Route path='rating' element={<RatingForm />} />
                    {/* <Route path='accessories' element={<AccessoriesForm />} />
                    <Route path='shoes' element={<ShoesForm />} /> */}
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
