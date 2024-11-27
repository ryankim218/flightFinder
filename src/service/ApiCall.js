import axios from "axios";
import {
    API_KEY,
    BASE_API_URL_V1,
    BASE_API_URL_V2
} from "../constants/Constants"

class ApiCall {
    searchAirport = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL_V1}/flights/searchAirport`, {
                headers: {
                    "x-rapidapi-key": API_KEY
                },
                params: {
                    query: "new",
                    locale: "en-US"
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    getNearByAirports = async (latitude, longitude) => {
        try {
            const response = await axios.get(`${BASE_API_URL_V1}/flights/getNearByAirports`, {
                headers: {
                    "x-rapidapi-key": API_KEY
                },
                params: { 
                    lat: latitude,
                    lng: longitude
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    searchFlightEverywhere = async (params) => {
        try {
            const response = await axios.get(`${BASE_API_URL_V2}/flights/searchFlightEverywhere`, {
                headers: {
                    "x-rapidapi-key": API_KEY
                },
                params: { ...params }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    searchFlights = async (params) => {
        try {
            const response = await axios.get(`${BASE_API_URL_V2}/flights/searchFlights`, {
                headers: {
                    "x-rapidapi-key": API_KEY
                },
                params: { ...params }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default ApiCall;

