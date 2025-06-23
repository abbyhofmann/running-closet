import { ChangeEvent, useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const useOutfitsSearchBar = () => {
  const navigate = useNavigate();

  const [val, setVal] = useState<string>('');

  /**
   * Function to handle changes in the input field.
   *
   * @param e - the event object.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  /**
   * Function to handle 'Enter' key press and trigger the search.
   *
   * @param e - the event object.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const searchParams = new URLSearchParams();
      searchParams.set('search', val);

      navigate(`/allOutfits?${searchParams.toString()}`);
    }
  };

  return {
    val,
    handleInputChange,
    handleKeyDown,
  };
};

export default useOutfitsSearchBar;
