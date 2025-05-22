import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Country, State, City } from 'country-state-city';
import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import { Box } from '@mui/system';

interface LocationInputProps {
  onSelectLocation: (location: string) => void;
}

const LocationInput = (props: LocationInputProps) => {
  const { onSelectLocation } = props;

  const addressFromik = useFormik({
    initialValues: {
      country: 'US',
      state: '',
      city: '',
    },
    onSubmit: values => console.log(JSON.stringify(values)), // TODO - needed?
  });

  const countries = Country.getAllCountries();

  const updatedStates = (countryIsoCode: string) =>
    State.getStatesOfCountry(countryIsoCode).map(state => ({
      label: state.name,
      value: state.isoCode,
      ...state,
    }));
  const updatedCities = (countryIsoCode: string, stateIsoCode: string) =>
    City.getCitiesOfState(countryIsoCode, stateIsoCode).map(city => ({
      label: city.name,
      value: city.name,
      ...city,
    }));

  const { values, handleSubmit, setValues } = addressFromik;

  // re-render when the categories get updated
  useEffect(() => {}, [values]);

  return (
    <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
      <form onSubmit={handleSubmit}>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Select Location
        </Typography>
        <FormControl sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
          <Typography>Country</Typography>
          <Select
            labelId='country-select-label'
            id='country-select'
            value={values.country}
            onChange={event => {
              setValues({ country: event.target.value, state: '', city: '' }, false);
            }}>
            {countries.map(({ isoCode, name }, index) => (
              <MenuItem key={index} value={isoCode}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
          <Typography>State</Typography>
          <Select
            labelId='state-select-label'
            id='state-select'
            value={values.state}
            onChange={event => {
              setValues({ country: values.country, state: event.target.value, city: '' }, false);
            }}>
            {updatedStates(values.country).map(({ isoCode, name }, index) => (
              <MenuItem key={index} value={isoCode}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
          <Typography>City</Typography>
          <Select
            labelId='city-select-label'
            id='city-select'
            value={values.city}
            onChange={event => {
              setValues(
                { country: values.country, state: values.state, city: event.target.value },
                false,
              );
              onSelectLocation(`${event.target.value}, ${values.state}, ${values.country}`);
            }}>
            {updatedCities(values.country, values.state).map(({ name }, index) => (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    </Box>
  );
};

export default LocationInput;
