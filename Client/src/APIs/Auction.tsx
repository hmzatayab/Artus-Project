import { AuctionResponse } from "@/Types/Auction";
import { AppError } from "@/Types/error";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAuctionDetails = async (auctionId: string): Promise<AuctionResponse> => {
    try {
        const response = await axios.get(`${API_URL}/auction/${auctionId}`);
        return response.data as AuctionResponse;
    } catch (error) {
        console.error("Error fetching auction details:", error);
        throw error;
    }
};

export const placeBid = async (auctionId: string, token: string, bidAmount: number) => {
    try {
        const response = await axios.post(
            `${API_URL}/auction/bid/${auctionId}`,
            { bidAmount },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Bid placed successfully:", response.data);
        return response.data;
    } catch (err) {
        const error = err as AppError;
        console.error("Error placing bid:", error.response?.data || error.message);
        throw error;
    }
};
