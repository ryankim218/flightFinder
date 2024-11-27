import { 
    Box, 
    Button, 
    Card, 
    CardMedia, 
    CircularProgress, 
    Typography 
} from "@mui/material";
import { ROUND_TRIP } from "../../constants/Constants";
import { formatDate } from "../../utils/DateFormat";

function FlightList({
    isInitState,
    isLoading,
    flights,
    originDetails,
    selectedType,
    dates,
    error
}) {
    return (
        !isInitState && (
            <Box
                width="90%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                py={2}
                borderRadius={2}
            >
                <Typography variant="h6" gutterBottom>
                    Available Flights
                </Typography>

                {isLoading && (
                    <Box
                        width="100%"
                        alignItems="center"
                        py={2}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {(flights !== undefined && flights.length > 0) ? (
                    flights.map((flight, index) => (
                        <Card
                            key={index}
                            sx={{ 
                                display: "flex",
                                width: "100%",
                                flexDirection: {
                                    xs: "column",
                                    sm: "column",
                                    md: "row",
                                    lg: "row"
                                },
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 0,
                                mb: 2,
                                borderBottom: "1px solid #ddd"
                            }}
                        >
                            <CardMedia
                                component="img"
                                sx={{
                                    width: {
                                        xs: "100%",
                                        sm: "100%",
                                        md: "30%",
                                        lg: "30%"
                                    },
                                    height: 200,
                                    objectFit: "cover"
                                }} 
                                image={flight.content.image.url !== undefined && flight.content.image.url}
                                alt=""
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: {
                                        xs: "column",
                                        sm: "column",
                                        md: "row",
                                        lg: "row"
                                    },
                                    justifyContent: "space-between",
                                    width: {
                                        xs: "90%",
                                        sm: "90%",
                                        md: "70%",
                                        lg: "70%"
                                    },
                                    p: 2
                                }}
                            >
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="start"
                                >
                                    <Typography variant="body1">
                                        <strong>Flight No:</strong> {flight.content.location.id}
                                    </Typography>
                                    <Typography variant="body2">
                                        {originDetails.name} → {flight.content.location.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        Departure: {dates.departureDate !== null ? formatDate(dates.departureDate) : ""}
                                    </Typography>
                                    {selectedType === ROUND_TRIP &&
                                        <Typography variant="body2">
                                            Arrival: {dates.arrivalDate !== null ? formatDate(dates.arrivalDate) : ""}
                                        </Typography>
                                    }
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end"
                                    }}
                                >
                                    <Typography variant="body1" color="primary">
                                        {
                                            flight.content.flightQuotes && flight.content.flightQuotes.cheapest 
                                                ? flight.content.flightQuotes.cheapest.price 
                                                : "Price unavailable"
                                        }
                                    </Typography>
                                    <Button variant="outlined" size="small" sx={{ mt: 1 }}>Book Now</Button>
                                </Box>
                            </Box>
                        </Card>
                        ))) : (
                            !isLoading && (
                                <Typography variant="body1">
                                    {(!error || error.message === "") ? "No available flights found." : error }
                                </Typography>
                            )
                        )
                }
            </Box>
        )
    );
}

export default FlightList;
