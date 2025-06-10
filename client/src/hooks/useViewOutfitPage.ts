import { useEffect, useState } from 'react';
import { FaTshirt } from 'react-icons/fa';
import { GiBilledCap, GiMonclerJacket, GiRunningShoe, GiUnderwearShorts } from 'react-icons/gi';
import { RelativeRoutingType, useParams } from 'react-router-dom';
import { IconType } from 'react-icons';
import { HourlyWeather, LocationCoordinates, Outfit, Rating, Shoe, User, Workout } from '../types';
import useOutfitCard from './useOutfitCard';
import {
  forwardGeocodeLocation,
  generateStaticMapImage,
  getOutfitById,
} from '../services/outfitService';

/**
 * Custom hook for managing the view outfit page state.
 */
const useViewOutfitPage = () => {
  const { oid } = useParams();

  // map of clothing item strings to react icons
  const outfitItemNamesAndIcons: Map<string, IconType> = new Map([
    ['Tops', FaTshirt],
    ['Bottoms', GiUnderwearShorts],
    ['Shoes', GiRunningShoe],
    ['Outerwear', GiMonclerJacket],
    ['Accessories', GiBilledCap],
  ]);

  // outfit being viewed/displayed
  const [outfit, setOutfit] = useState<Outfit | null>(null);

  // location coordinates of the outfit being viewed/displayed
  const [locationCoordinates, setLocationCoordinates] = useState<LocationCoordinates | null>(null);

  // map image url of the location
  const [mapImageUrl, setMapImageUrl] = useState<string>('');
  const [weather, setWeather] = useState<HourlyWeather | null>(null);
  const { formatDateTime } = useOutfitCard();

  useEffect(() => {
    async function fetchOutfitData() {
      if (oid) {
        const fetchedOutfit = await getOutfitById(oid);
        setOutfit(fetchedOutfit);
      }
    }
    fetchOutfitData();
  }, [oid]);

  useEffect(() => {
    async function fetchCoordinateData() {
      if (outfit && outfit.location) {
        const fetchedCoordinates = await forwardGeocodeLocation(outfit.location);
        setLocationCoordinates(fetchedCoordinates);
      }
    }
    fetchCoordinateData();
  }, [outfit]);

  useEffect(() => {
    async function fetchMapImageUrl() {
      if (locationCoordinates) {
        const fetchedMapImageUrl = await generateStaticMapImage(locationCoordinates);
        setMapImageUrl(fetchedMapImageUrl);
      }
    }

    fetchMapImageUrl();
  }, [locationCoordinates]);

  const isShoe = (
    shoe: string | Shoe | User | Date | Workout | Rating | RelativeRoutingType | undefined,
  ): shoe is Shoe => (shoe as Shoe).brand !== undefined && (shoe as Shoe).model !== undefined;

  return {
    outfit,
    isShoe,
    formatDateTime,
    mapImageUrl,
    outfitItemNamesAndIcons,
  };
};

export default useViewOutfitPage;
