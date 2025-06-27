import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getOutfitsByFilter } from '../services/outfitService';
import { OrderType, Outfit } from '../types';

const useViewAllOutfitsPage = () => {
  const [searchParams] = useSearchParams();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [titleText, setTitleText] = useState<string>('All Outfits');
  const [search, setSearch] = useState<string>('');
  const [outfitOrder, setOutfitOrder] = useState<OrderType>('newest');

  const navigate = useNavigate();

  const handleClickOutfit = (outfitId: string) => {
    navigate(`/outfit/${outfitId}`);
  };

  useEffect(() => {
    let pageTitle = 'All Outfits';
    let searchString = '';

    const searchQuery = searchParams.get('search');

    if (searchQuery) {
      searchString = searchQuery;
      pageTitle = `Search results for "${searchString}"`;
    }

    setTitleText(pageTitle);
    setSearch(searchString);
  }, [searchParams]);

  useEffect(() => {
    /**
     * Function to fetch outfits based on the search.
     */
    const fetchData = async () => {
      try {
        const res = await getOutfitsByFilter(outfitOrder, search);
        setOutfits(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    fetchData();
  }, [outfitOrder, search]);

  return {
    titleText,
    outfits,
    handleClickOutfit,
  };
};

export default useViewAllOutfitsPage;
