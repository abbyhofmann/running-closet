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
    <Stack alignItems='center' direction='column'>
      <Typography sx={{ m: 1, fontSize: '1.7rem', color: '#32292F' }}>
        <strong> Temperature Suitability </strong>
      </Typography>
      <Typography sx={{ mt: 1, mb: 2, fontSize: '1.1rem', color: '#32292F', fontStyle: 'italic' }}>
        {`How did you feel while wearing the outfit?`}
      </Typography>
      <Stack alignItems='center' direction='row' gap={8}>
        {TEMP_TUPLES.map(([color, label]) => (
          <Stack
            key={color}
            alignItems='center'
            direction='column'
            justifyContent='flex-start'
            sx={{ minHeight: '150px' }}>
            <IconButton
              onClick={() => setTempGauge(label)}
              sx={{
                // border: tempGauge === label ? '2px solid #000' : '2px solid transparent',
                // backgroundColor: tempGauge === label ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                transform: tempGauge === label ? 'scale(1.5)' : 'scale(1)',
              }}>
              <ThermostatIcon
                style={{ width: '70px', height: '70px' }}
                fontSize='large'
                color={color}
              />
            </IconButton>
            <Typography
              sx={{
                mt: 3,
                fontSize: '1.25rem',
                textAlign: 'center',
                maxWidth: '125px',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}>
              {label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default TempGauge;
