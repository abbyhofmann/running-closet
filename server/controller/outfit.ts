import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import multer from 'multer';
import {
  FakeSOSocket,
  CreateOutfitRequest,
  GetUserRequest,
  Outfit,
  FindOutfitItemsByUserIdRequest,
  FindOutfitByIdRequest,
  ForwardGeocodeRequest,
  GenerateStaticMapImageRequest,
  GetHistoricalWeatherDataRequest,
  HourlyWeather,
  UploadImageRequest,
  FindOutfitRequest,
} from '../types';
import {
  fetchUserByUsername,
  fetchUserById,
  fetchWorkoutById,
  fetchTopById,
  fetchBottomById,
  fetchAccessoryById,
  fetchShoeById,
  saveOutfit,
  addOutfitToTop,
  addOutfitToBottom,
  addOutfitToOuterwear,
  addOutfitToAccessory,
  addOutfitToShoe,
  addOutfitToUser,
  fetchOuterwearById,
  fetchOutfitById,
  extractOutfitItems,
  fetchRatingById,
  fetchOutfitsByUser,
  fetchPartialOutfitsByUser,
  fetchCoordinates,
  fetchStaticMapImage,
  fetchHistoricalWeatherData,
  uploadImageToCloudinary,
  getOutfitsByOrder,
  filterOutfitsBySearch,
} from '../models/application';

const upload = multer({ storage: multer.memoryStorage() });

const outfitController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided create outfit request contains the required fields.
   *
   * @param req The request object containing the new outfit's clothing items. There must
   * be at least one top, one bottom, and one shoe, while the outerwear and accessories are optional (i.e.
   * can be empty lists).
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isCreateOutfitRequestValid(req: CreateOutfitRequest): boolean {
    return (
      !!req.body.creatorId &&
      !!req.body.dateWorn &&
      !!req.body.location && // TODO - does this check need to be more specific (like not an empty string?)
      !!req.body.workoutId &&
      !!req.body.ratingId &&
      !!req.body.topIds &&
      req.body.topIds.length > 0 &&
      !!req.body.bottomIds &&
      req.body.bottomIds.length > 0 &&
      !!req.body.outerwearIds &&
      !!req.body.accessoriesIds &&
      !!req.body.shoesId &&
      !!req.body.imageUrl
    );
  }

  /**
   * Checks if the provided ForwardGeocodeRequest contains the necessary fields.
   *
   * @param req ForwardGeocodeRequest object containing the location.
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isForwardGeocodeRequestValid = (req: ForwardGeocodeRequest): boolean =>
    !!req.body.location && req.body.location !== '';

  /**
   * Checks if the provided GenerateStaticMapImageRequest contains the necessary fields.
   *
   * @param req GenerateStaticMapImageRequest object containing the coordinates.
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isGenerateStaticMapImageRequestValid = (req: GenerateStaticMapImageRequest): boolean =>
    !!req.body.coordinates && !!req.body.coordinates.lat && !!req.body.coordinates.lng;

  /**
   * Checks if the provided GetHistoricalWeatherDataRequest contains the necessary fields.
   *
   * @param req GetHistoricalWeatherDataRequest object containing the coordinates and dateTimeInfo.
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isGetHistoricalWeatherDataRequestValid = (req: GetHistoricalWeatherDataRequest): boolean =>
    !!req.body.coordinates &&
    !!req.body.coordinates.lat &&
    !!req.body.coordinates.lng &&
    !!req.body.dateTimeInfo;

  /**
   * Checks if the provided UploadImageRequest contains the necessary field.
   *
   * @param req UploadImageRequest object containing the form data of the image to upload.
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isUploadImageRequestValid = (req: UploadImageRequest): boolean => !!req.body.imageToUpload;

  /**
   * Adds a new outfit to the database. The outfit request is validated and the outfit is then saved.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The CreateOutfitRequest object containing the Outfit data.
   * @param res The HTTP response object used to send back the result of the operation. The response object contains
   * the new user.
   *
   * @returns A Promise that resolves to void.
   */
  const createOutfit = async (req: CreateOutfitRequest, res: Response): Promise<void> => {
    if (!isCreateOutfitRequestValid(req)) {
      console.log('req bodyyy ', req.body);
      res.status(400).send('Invalid create outfit request');
      return;
    }

    const {
      creatorId,
      dateWorn,
      location,
      workoutId,
      ratingId,
      topIds,
      bottomIds,
      outerwearIds,
      accessoriesIds,
      shoesId,
      imageUrl,
    } = req.body;

    try {
      // function to fetch and validate the components of the outfit
      const fetchAndValidate = async <T extends object>(
        fetchFunction: (id: string) => Promise<T | { error: string }>,
        ids: string[],
      ): Promise<T[]> => {
        const responses = await Promise.all(ids.map(id => fetchFunction(id)));

        for (const response of responses) {
          if ('error' in response) {
            throw new Error(response.error as string);
          }
        }

        return responses as T[];
      };

      // fetch the components of the outfit, as provided in the initial request
      const [user, workout, rating, tops, bottoms, outerwear, accessories, shoes] =
        await Promise.all([
          fetchUserById(creatorId).then(userRes => {
            if ('error' in userRes) throw new Error(userRes.error);
            return userRes;
          }),
          fetchWorkoutById(workoutId).then(workoutRes => {
            if ('error' in workoutRes) throw new Error(workoutRes.error);
            return workoutRes;
          }),
          fetchRatingById(ratingId).then(ratingRes => {
            if ('error' in ratingRes) throw new Error(ratingRes.error);
            return ratingRes;
          }),
          fetchAndValidate(fetchTopById, topIds),
          fetchAndValidate(fetchBottomById, bottomIds),
          fetchAndValidate(fetchOuterwearById, outerwearIds),
          fetchAndValidate(fetchAccessoryById, accessoriesIds),
          fetchShoeById(shoesId).then(shoeRes => {
            if ('error' in shoeRes) throw new Error(shoeRes.error);
            return shoeRes;
          }),
        ]);

      // create and save the outfit
      const outfit = {
        wearer: user,
        dateWorn: new Date(dateWorn),
        location,
        workout,
        rating,
        tops,
        bottoms,
        outerwear,
        accessories,
        shoes,
        imageUrl,
      };

      const outfitFromDb = await saveOutfit(outfit);
      if ('error' in outfitFromDb) {
        throw new Error(outfitFromDb.error as string);
      }

      // function to update items with the new outfit
      const updateWithOutfit = async <T extends object>(
        updateFn: (outfit: Outfit, item: T) => Promise<T | { error: string }>,
        items: T[],
      ) => {
        const responses = await Promise.all(items.map(item => updateFn(outfitFromDb, item)));
        for (const response of responses) {
          if ('error' in response) {
            throw new Error(`Error while updating: ${response.error}`);
          }
        }
        return responses;
      };

      // update all related items with the new outfit
      await Promise.all([
        updateWithOutfit(addOutfitToTop, tops),
        updateWithOutfit(addOutfitToBottom, bottoms),
        updateWithOutfit(addOutfitToOuterwear, outerwear),
        updateWithOutfit(addOutfitToAccessory, accessories),
        addOutfitToShoe(outfitFromDb, shoes).then(outfitToShoeRes => {
          if ('error' in outfitToShoeRes) throw new Error(outfitToShoeRes.error);
        }),
        addOutfitToUser(outfitFromDb, creatorId).then(outfitToUserRes => {
          if ('error' in outfitToUserRes) throw new Error(outfitToUserRes.error);
        }),
      ]);

      // fetch the most updated outfit
      if (!outfitFromDb._id) {
        throw new Error('Outfit ID is undefined');
      }

      const updatedOutfit = await fetchOutfitById(outfitFromDb._id.toString());
      if ('error' in updatedOutfit) {
        throw new Error(updatedOutfit.error);
      }

      res.json(updatedOutfit);
    } catch (err) {
      res.status(500).send(`Error when creating outfit: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves a list of all outfits from the database.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The request object that will be empty
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getAllOutfits = async (req: Request, res: Response): Promise<void> => {
    // try {
    //   const olist = await fetchAllOutfits();
    //   if ('error' in olist) {
    //     throw new Error(olist.error as string);
    //   }
    //   res.json(olist);
    // } catch (err) {
    //   res.status(500).send(`Error when fetching all outfits: ${(err as Error).message}`);
    // }
  };

  /**
   * Retrieves the user with the given username from the database.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The request object with the username of the user to retrieve.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getUserByUsername = async (req: GetUserRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.params;

      const user = await fetchUserByUsername(username);

      if ('error' in user) {
        throw new Error(user.error as string);
      }

      res.json(user);
    } catch (err) {
      res.status(500).send(`Error when fetching user: ${(err as Error).message}`);
    }
  };

  const getAllOutfitItems = async (
    req: FindOutfitItemsByUserIdRequest,
    res: Response,
  ): Promise<void> => {
    const { uid } = req.params;

    if (!ObjectId.isValid(uid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const user = await fetchUserById(uid);

      if ('error' in user) {
        throw new Error(user.error as string);
      }
      const allOutfitItems = await extractOutfitItems(user.outfits);
      if ('error' in allOutfitItems) {
        throw new Error(allOutfitItems.error as string);
      }
      res.json(allOutfitItems);
    } catch (err) {
      res.status(500).send(`Error when fetching all outfit items: ${(err as Error).message}`);
    }
  };

  const getOutfitsByUser = async (
    req: FindOutfitItemsByUserIdRequest,
    res: Response,
  ): Promise<void> => {
    const { uid } = req.params;

    if (!ObjectId.isValid(uid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const outfits = await fetchOutfitsByUser(uid);
      if ('error' in outfits) {
        throw new Error(outfits.error as string);
      }
      res.json(outfits);
    } catch (err) {
      res.status(500).send(`Error when fetching all outfit items: ${(err as Error).message}`);
    }
  };

  const getPartialOutfitsByUser = async (
    req: FindOutfitItemsByUserIdRequest,
    res: Response,
  ): Promise<void> => {
    const { uid } = req.params;

    if (!ObjectId.isValid(uid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const partialOutfits = await fetchPartialOutfitsByUser(uid);
      if ('error' in partialOutfits) {
        throw new Error(partialOutfits.error as string);
      }
      res.json(partialOutfits);
    } catch (err) {
      res
        .status(500)
        .send(`Error when fetching all partial outfit items: ${(err as Error).message}`);
    }
  };

  const getOutfitById = async (req: FindOutfitByIdRequest, res: Response): Promise<void> => {
    const { oid } = req.params;

    if (!ObjectId.isValid(oid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const outfit = await fetchOutfitById(oid);
      if ('error' in outfit) {
        throw new Error(outfit.error as string);
      }
      res.json(outfit);
    } catch (err) {
      res.status(500).send(`Error when fetching outfit: ${(err as Error).message}`);
    }
  };

  const forwardGeocodeLocation = async (
    req: ForwardGeocodeRequest,
    res: Response,
  ): Promise<void> => {
    if (!isForwardGeocodeRequestValid(req)) {
      res.status(400).send('Invalid forward geocode location request body');
      return;
    }

    const { location } = req.body;

    try {
      const coordinates = await fetchCoordinates(location);
      // TODO - need response check?
      res.json(coordinates);
    } catch (err) {
      res.status(500).send(`Error when fetching coordinates: ${(err as Error).message}`);
    }
  };

  const generateStaticMapImage = async (
    req: GenerateStaticMapImageRequest,
    res: Response,
  ): Promise<void> => {
    if (!isGenerateStaticMapImageRequestValid(req)) {
      res.status(400).send('Invalid generate static map image request body');
      return;
    }

    const { coordinates } = req.body;
    const { lat, lng } = coordinates;

    try {
      const mapUrl = await fetchStaticMapImage(lat, lng);
      // TODO - need response check?
      res.json(mapUrl);
    } catch (err) {
      res.status(500).send(`Error when fetching static map image: ${(err as Error).message}`);
    }
  };

  const getHistoricalWeatherData = async (
    req: GetHistoricalWeatherDataRequest,
    res: Response,
  ): Promise<void> => {
    if (!isGetHistoricalWeatherDataRequestValid(req)) {
      res.status(400).send('Invalid get historical weather data request body');
      return;
    }

    const { coordinates, dateTimeInfo } = req.body;
    const { lat, lng } = coordinates;

    try {
      const weatherData = await fetchHistoricalWeatherData(lat, lng, dateTimeInfo.toString());
      const hourStr = new Date(dateTimeInfo).toTimeString().slice(0, 5); // 'HH:MM'
      const hourData = weatherData.hours.find((h: HourlyWeather) => h.datetime.startsWith(hourStr));
      console.log(hourData);
      res.json(hourData);
    } catch (err) {
      // console.log('err: ', err);
      res
        .status(500)
        .send(`Error when fetching historical weather data: ${(err as Error).message}`);
    }
  };

  const uploadImage = async (req: Request, res: Response): Promise<void> => {
    if (!req.file || !req.file.buffer) {
      res.status(400).send('No file uploaded');
      return;
    }

    try {
      const uploadedImage = await uploadImageToCloudinary(req.file.buffer);
      res.json(uploadedImage.secure_url);
    } catch (err) {
      res.status(500).send(`Error uploading image: ${(err as Error).message}`);
    }
  };

  const getOutfitsByFilter = async (req: FindOutfitRequest, res: Response): Promise<void> => {
    const { order } = req.query;
    const { search } = req.query;
    try {
      const olist: Outfit[] = await getOutfitsByOrder(order);

      // Filter by search keyword
      const resolist: Outfit[] = await filterOutfitsBySearch(olist, search);
      res.json(resolist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching outfits by filter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching outfits by filter`);
      }
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/createOutfit', createOutfit);
  router.get('/getAllOutfitItems/:uid', getAllOutfitItems);
  router.get('/getOutfitsByUser/:uid', getOutfitsByUser);
  router.get('/getPartialOutfitsByUser/:uid', getPartialOutfitsByUser);
  router.get('/getOutfitById/:oid', getOutfitById);
  router.post('/forwardGeocodeLocation', forwardGeocodeLocation);
  router.post('/generateStaticMapImage', generateStaticMapImage);
  router.post('/getHistoricalWeatherData', getHistoricalWeatherData);
  router.post('/uploadImage', upload.single('file'), uploadImage);
  router.get('/getOutfit', getOutfitsByFilter);

  return router;
};

export default outfitController;
