import React, { useState } from 'react';
import { 
    Button,
    Menu,
    Box,
    Typography,
    IconButton,
    TextField,
    InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    ArrowDropDown,
    ArrowDropUp,
    PeopleAlt
} from '@mui/icons-material';

function CustomDropdown({ value, onChange }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [travelers, setTravelers] = useState({
        adults: 0,
        children: 0,
        infants: 0
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const increment = (type) => {
        setTravelers(prev => ({
            ...prev,
            [type]: prev[type] + 1
        }));
    };

    const decrement = (type) => {
        setTravelers(prev => ({
            ...prev,
            [type]: prev[type] > 0 ? prev[type] - 1 : 0
        }));
    };

    const handleDone = () => {
        const totalTravelers = travelers.adults + travelers.children + travelers.infants;
        onChange(travelers, totalTravelers);
        handleClose();
    };

    const handleCancel = () => {
        setTravelers({
            adults: 0,
            children: 0,
            infants: 0
        });
        handleClose();
    };

    const renderItem = (title, subtitle, type) => (
        <Box 
            display="flex"
            flexDirection="row" 
            justifyContent="space-between" 
            alignItems="center"
        >
            <Box>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2" color="textSecondary">
                    {subtitle}
                </Typography>
            </Box>
            <Box 
                display="flex"
                justifyContent="space-between" 
                alignItems="center"
            >
                <IconButton onClick={() => decrement(type)}>
                    <RemoveIcon />
                </IconButton>

                <Typography>{travelers[type]}</Typography>

                <IconButton onClick={() => increment(type)}>
                    <AddIcon />
                </IconButton>
            </Box>
        </Box>
    );

    return (
        <Box>
            <TextField
                id="traveler"
                label="Travelers"
                value={value}
                aria-readonly
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <PeopleAlt />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {anchorEl ? <ArrowDropUp /> : <ArrowDropDown />}
                            </InputAdornment>
                        )
                    }
                }}
                sx={{
                    maxWidth: "100px",
                    mx: "4px",
                    height: "40px",
                    '& .MuiInputBase-root': {
                        height: '100%',
                        padding: '0 8px',
                    }
                }}
                onClick={handleClick}
            />
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            width: 250,
                            padding: 16
                        }
                    }
                }}
            >
                <Box>
                    {renderItem("Adults", "12+ years", "adults")}
                    {renderItem("Children", "Aged 2-12", "children")}
                    {renderItem("Infants", "Under 2", "infants")}

                    <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        mt={2}
                    >
                        <Button
                            variant="outlined" 
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleDone}
                        >
                            Done
                        </Button>
                    </Box>
                </Box>
            </Menu>
        </Box>
    );
}

export default CustomDropdown;
