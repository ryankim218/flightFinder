export const BASE_API_URL_V1 = "https://sky-scrapper.p.rapidapi.com/api/v1"
export const BASE_API_URL_V2 = "https://sky-scrapper.p.rapidapi.com/api/v2"
export const API_KEY = "8b87b7074dmsh45ac64a3c67d1a4p18840fjsn163a63b9471c"

export const ROUND_TRIP = 0;
export const ONE_WAY = 1;
export const FLIGHT_TYPE_MAP = ["Round Trip", "One Way"];
export const CABIN_CLASS_MAP = [
    {
        key: "economy",
        value: "Economy"
    },
    {
        key: "premium_economy",
        value: "Premium Economy"
    },
    {
        key: "business",
        value: "Business"
    },
    {
        key: "first",
        value: "First Class"
    }
];

export const LOCATION_ERROR = "Geolocation is not supported by this browser.";
export const ERROR_MESSAGE = "Unable to load available flights. Please try again later."
