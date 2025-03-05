import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const depositAmount = async (amount: number, token: string): Promise<any> => {
    try {
        const response = await axios.post(
            `${API_URL}/wallet/deposit`,
            { amount },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error in deposit API:", error);
        throw error;
    }
};

export const withdrawAmount = async (amount: number, token: string): Promise<any> => {
    try {
        const response = await axios.post(
            `${API_URL}/wallet/withdraw`,
            { amount },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error in withdraw API:", error);
        throw error;
    }
};

export const transferAmount = async (amount: number, receiverId: string, token: string): Promise<any> => {
    try {
        const response = await axios.post(
            `${API_URL}/wallet/transfer`,
            { amount, receiverId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error("Error in transfer API:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Transfer failed"); 
    }
};

export const getWallet = async (token: string): Promise<any> => {
    try {
        const response = await axios.get(
            `${API_URL}/wallet`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error in wallet API:", error);
        throw error;
    }
};