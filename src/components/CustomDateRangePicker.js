import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Box } from '@mui/material';

const CustomDatePicker = (props) => {
    const {isArrivalVisible = false, onDateChange} = props;

    const [departureDate, setDepartureDate] = useState(null);
    const [arrivalDate, setArrivalDate] = useState(null);
    const [isArrivalOpen, setIsArrivalOpen] = useState(false);

    const handleDepartureChange = (newValue) => {
        setDepartureDate(newValue);
        setIsArrivalOpen(true);
        if (newValue) {
            setArrivalDate(null);
        }

        onDateChange(newValue, arrivalDate);
    };

    const handleArrivalChange = (newValue) => {
        setArrivalDate(newValue);
        setIsArrivalOpen(false);

        onDateChange(departureDate, newValue)
    };

    const handleArrivalOpen = () => {
        if (departureDate) {
            setIsArrivalOpen(true);
        }
    };

    const handleArrivalClose = () => {
        setIsArrivalOpen(false); 
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center"
                sx={{
                    width: {
                        xs: "100%",
                        sm: "80%",
                        md: isArrivalVisible ? "60%" : "40%",
                        lg: isArrivalVisible ? "40%" : "30%"
                    }
                }}
            >
                <DatePicker
                    label="Departure Date"
                    value={departureDate}
                    onChange={handleDepartureChange}
                    disablePast
                    textField={(params) => <TextField {...params} />}
                    sx={{ 
                        mx: "4px", 
                        width: isArrivalVisible ? { sm: "50%", md: `${1/5}%px` } : "100%"
                    }}
                />
                {isArrivalVisible && (
                    <DatePicker
                        label="Arrival Date"
                        value={arrivalDate}
                        open={isArrivalOpen}
                        onChange={handleArrivalChange}
                        minDate={departureDate}
                        disabled={departureDate === null}
                        onOpen={handleArrivalOpen}
                        onClose={handleArrivalClose}
                        textField={(params) => <TextField {...params} />}
                        sx={{ mx: "4px", width: { sm: "50%", md: `${1/5}%px` }}}
                    />
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default CustomDatePicker;
