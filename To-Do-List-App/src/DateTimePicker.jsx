import { Stack, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';

export const DateTimePickerComponent = () => {
  const [value, setValue] = useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DateTimePicker
          label="Select Date and Time"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <TextField />
        </DateTimePicker>
      </Stack>
    </LocalizationProvider>
  );
};