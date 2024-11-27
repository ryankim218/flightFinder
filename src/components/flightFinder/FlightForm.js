import {
    CompareArrows,
    FlightClass,
    FlightLand, 
    FlightTakeoff
} from "@mui/icons-material";
import { 
    Autocomplete,
    Box,
    Button,
    IconButton,
    InputAdornment,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import CustomDatePicker from "../CustomDateRangePicker";
import ApiCall from "../../service/ApiCall";
import CustomDropdown from "../CustomDropdown";
import { formatDate } from "../../utils/DateFormat";
import { CABIN_CLASS_MAP, ERROR_MESSAGE, FLIGHT_TYPE_MAP, LOCATION_ERROR, ROUND_TRIP } from "../../constants/Constants";
import FlightList from "./FlightList";

function FlightForm() {
    const apiCall = new ApiCall();
    const [travelers, setTravelers] = useState({});
    const [totalTravelers, setTotalTravelers] = useState(0);
    const [cabinClass, setCabinClass] = useState("Economy");
    const [flyingFrom, setFlyingFrom] = useState("");
    const [flyingTo, setFlyingTo] = useState("");
    const [selectedType, setSelectedType] = useState(ROUND_TRIP)
    const [dates, setDates] = useState({ departureDate: null, arrivalDate: null });
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [originDetails, setOriginDetails] = useState({
        skyId: "", entityId: "", name: ""
    });
    const [destinationDetails, setDestinationDetails] = useState({
        skyId: "", entityId: "", name: ""
    });
    const [nearbyAirports, setNearbyAirports] = useState({ current: {}, nearby: [], recent: [] });
    const [airports, setAirports] = useState([]);
    const [isNearbyAirportsLoading, setIsNearbyAirportsLoading] = useState(false);
    const [isAirportLoading, setIsAirportLoading] = useState(false);
    const [isInitState, setIsInitState] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (err) => {
                    setError(err.message);
                }
            );
        } else {
            setError(LOCATION_ERROR);
        }
    }, []);

    useEffect(() => {
        if (location.latitude && location.longitude && nearbyAirports.nearby.length === 0) {
            setIsNearbyAirportsLoading(true);
            apiCall.getNearByAirports(location.latitude, location.longitude)
                .then((resp) => {
                    setNearbyAirports(resp.data);
                    setFlyingFrom(resp.data.current.presentation.title);
                    setOriginDetails({
                        skyId: resp.data.current.skyId,
                        entityId: resp.data.current.entityId,
                        name: resp.data.current.navigation.localizedName
                    })
                })
                .catch((err) => {
                    setError("Failed to fetch nearby airports: " + err.message);
                })
                .finally(() => {
                    setIsNearbyAirportsLoading(false);
                }); 
        }
    }, [location.latitude, location.longitude]);

    const handleTravelersChange = (travelers, total) => {
        setTravelers(travelers);
        setTotalTravelers(total);
    }

    const handleFlyingFromChange = (_, newValue) => {
        setFlyingFrom(newValue);
      
        const selectedAirport = nearbyAirports.nearby.find((airport) =>
            airport.presentation.title === newValue
        );
      
        if (selectedAirport) {
            setOriginDetails({
                skyId: selectedAirport.navigation.relevantFlightParams.skyId,
                entityId: selectedAirport.navigation.relevantFlightParams.entityId,
                name: selectedAirport.navigation.localizedName
            })
        }
    };

    const handleFlyingToChange = (_, newValue) => {
        setFlyingTo(newValue);
      
        const selectedAirport = airports.find((airport) =>
            airport.presentation.title === newValue
        );
      
        if (selectedAirport) {
            setDestinationDetails({
                skyId: selectedAirport.skyId,
                entityId: selectedAirport.entityId,
                name: selectedAirport.presentation.title
            });
        }
    };

    const handleSwitch = () => {
        if (flyingTo === "") return;
        setFlyingFrom(flyingTo);
        setFlyingTo(flyingFrom);

        setOriginDetails(destinationDetails);
        setDestinationDetails(originDetails);
    }

    const handleDateChange = (departureDate, arrivalDate) => {
        setDates({ departureDate, arrivalDate });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setIsInitState(false);
        setIsLoading(true);
        setFlights([]);
        setError("");

        const params = {
            originSkyId: originDetails.skyId,
            destinationSkyId: destinationDetails.skyId,
            originEntityId: originDetails.entityId,
            destinationEntityId: destinationDetails.entityId,
            travelDate: formatDate(dates.departureDate),
            adults: travelers.adults,
            cabinClass: cabinClass,
        }

        if (selectedType === ROUND_TRIP) {
            const submittedParams = {
                ...params,
                returnDate: formatDate(dates.arrivalDate),
                journeyType: "round_trip"
            }
            apiCall.searchFlightEverywhere(submittedParams)
                .then((resp) => setFlights(resp.data.results))
                .catch((error) => setError(ERROR_MESSAGE))
                .finally(() => setIsLoading(false));
        } else {
            const submittedParams = {
                ...params,
                journeyType: "one_way"
            }
            apiCall.searchFlightEverywhere(submittedParams)
                .then((resp) => setFlights(resp.data.results))
                .catch((error) => setError(ERROR_MESSAGE))
                .finally(() => setIsLoading(false));
        }
    }

    return (
        <>
            <Box
                width="90%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                py={2}
                borderRadius={2}
                bgcolor="white"
            >
                <Typography variant="h4">
                    FLIGHT FINDER
                </Typography>

                <Box 
                    width="90%" 
                    sx={{
                        display: "flex",
                        mt: 2,
                        flexDirection: {
                            xs: "column",
                            sm: "column",
                            md: "row"
                        },
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        my: "8px"
                    }}>
                        {
                            FLIGHT_TYPE_MAP.map((type, index) => {
                                return (
                                    <Button
                                        id={`flight_type_${index}`}
                                        key={index}
                                        variant={selectedType === index ? "contained" : "outlined"}
                                        size="small"
                                        sx={{
                                            mx: "4px",
                                            maxHeight: "30px",
                                            borderRadius: "16px",
                                            fontSize: "12px"
                                        }}
                                        onClick={() => {
                                            setSelectedType(index);
                                            setFlights([]);
                                            setIsInitState(true);
                                        }}
                                    >
                                        {type}
                                    </Button>
                                );
                            })
                        }
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            my: "8px",
                            mx: "8px"
                        }}
                    >
                        <CustomDropdown
                            value={totalTravelers}
                            onChange={handleTravelersChange}
                        />

                        <TextField
                            id="cabin_class"
                            label="Cabin Class"
                            select
                            defaultValue="economy"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FlightClass />
                                        </InputAdornment>
                                    )
                                }
                            }}
                            sx={{
                                mx: "4px",
                                height: "40px",
                                '& .MuiInputBase-root': {
                                    height: '100%',
                                    padding: '0 14px',
                                }
                            }}
                            onChange={(e) => setCabinClass(e.target.value)}
                        >
                            {CABIN_CLASS_MAP.map((cabin) => (
                                <MenuItem key={cabin.key} value={cabin.key}>
                                    {cabin.value}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>

                <Box
                    width="90%"
                    sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            sm: "column",
                            md: "row"
                        },
                        alignItems: "center",
                        my: "8px",
                        mx: "8px"
                    }}
                >
                    <Box 
                        sx={{ 
                            display: "flex", 
                            flexDirection: {
                                xs: "column",
                                sm: "column",
                                md: "row"
                            },
                            position: "relative", 
                            alignItems: "center", 
                            my: 2,
                            width: {
                                xs: "100%",
                                sm: "80%",
                                md: "80%",
                                lg: "60%"
                            }
                        }}
                    >
                        <Autocomplete
                            id="flying_from"
                            disablePortal
                            aria-required
                            value={flyingFrom}
                            options={nearbyAirports.nearby.map((val) => val.presentation.title)}
                            loading={isNearbyAirportsLoading}
                            sx={{ 
                                ml: { xs: 0, sm: 0, md: 0.5 }, 
                                mr: { xs: 0, sm: 0, md: 2 }, 
                                mb: { xs: 2, sm: 2, md: 0 },
                                width: { xs: "100%", sm: "100%", md: `${1/5}%px` }
                            }}
                            renderInput={(params) => (
                                <TextField 
                                    {...params}
                                    label="Flying From"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{mr: "8px"}}>
                                                <FlightTakeoff />
                                            </InputAdornment>
                                        ),
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                            onChange={handleFlyingFromChange}
                        />
                        <IconButton
                            id="switch_btn"
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)", 
                                zIndex: 10,
                                border: "1px solid gray",
                                borderRadius: "50%",
                                padding: "8px",
                                backgroundColor: "#fff",
                            }}
                            onClick={handleSwitch}
                        >
                            <CompareArrows />
                        </IconButton>
                        <Autocomplete
                            id="flying_to"
                            disablePortal
                            value={flyingTo}
                            options={airports.map((val) => val.presentation.title)}
                            loading={isAirportLoading}
                            sx={{ 
                                ml: { xs: 0, sm: 0, md: 2 }, 
                                mr: { xs: 0, sm: 0, md: 0.5 },
                                mt: { xs: 2, sm: 2, md: 0 },
                                width: { xs: "100%", sm: "100%", md: `${1/5}%px` },
                            }}
                            renderInput={(params) => (
                                <TextField 
                                    {...params}
                                    label="Flying To"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{mr: "8px"}}>
                                                <FlightLand />
                                            </InputAdornment>
                                        ),
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                            onFocus={() => {
                                if (airports.length > 0) return;
                                setIsAirportLoading(true);
                                apiCall.searchAirport()
                                    .then((resp) => setAirports(resp.data))
                                    .catch((error) => setError(error))
                                    .finally(() => setIsAirportLoading(false));
                            }}
                            onChange={handleFlyingToChange}
                            // onInputChange={(_) => {
                            //     setDestinationDetails({});
                            // }}
                        />
                    </Box>

                    <CustomDatePicker
                        id="date_picker"
                        isArrivalVisible={selectedType === ROUND_TRIP}
                        onDateChange={handleDateChange}
                    />

                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            ml: "4px",
                            my: "16px",
                            width: { 
                                xs: "100%",
                                sm: "50%",
                                md: `${100/5}%`
                            },
                            height: "50px"
                        }}
                    >
                        Search
                    </Button>
                </Box>
            </Box>

            <FlightList
                isInitState={isInitState}
                isLoading={isLoading}
                flights={flights}
                originDetails={originDetails}
                selectedType={selectedType}
                dates={dates}
                error={error}
            />
        </>
    );
}

export default FlightForm;
