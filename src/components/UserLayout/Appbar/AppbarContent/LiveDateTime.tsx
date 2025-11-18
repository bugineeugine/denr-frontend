'use client';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import Box from '@mui/material/Box';
const LiveDateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="flex items-center gap-1">
      <CalendarTodayOutlinedIcon color="primary" fontSize="small" />
      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
        {dateTime.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}{' '}
        {dateTime.toLocaleTimeString(undefined, { hour12: false })}
      </Typography>
    </Box>
  );
};

export default LiveDateTime;
