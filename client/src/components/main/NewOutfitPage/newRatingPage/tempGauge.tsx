import { IconButton, Stack, Typography } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';

interface TempGaugeProps {
  tempGauge: string;
  setTempGauge: (gaugeToSet: string) => void;
}

// array of tuples for temp gauge icon color paired with measure of temperature
// appropriateness of outfit
const TEMP_TUPLES: [
  (
    | 'primary'
    | 'error'
    | 'disabled'
    | 'action'
    | 'inherit'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
  ),
  string,
][] = [
  ['primary', 'Too Cold'],
  ['action', 'Appropriately Dressed'],
  ['error', 'Too Warm'],
];

const TempGauge = (props: TempGaugeProps) => {
  const { tempGauge, setTempGauge } = props;
  return (
    <Stack alignItems='center' direction='row' gap={2}>
      {TEMP_TUPLES.map(item => (
        <Stack key={item[0]} alignItems='center' direction='column' gap={2}>
          <IconButton onClick={() => setTempGauge(item[1])}>
            <ThermostatIcon fontSize='large' color={item[0]} />
          </IconButton>
          <Typography>{item[1]}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default TempGauge;
