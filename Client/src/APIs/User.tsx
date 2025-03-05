import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (formData: { email: string; username: string; name: string; password: string }) => {
  const res = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Registration failed");

  return await res.json();
};

export const loginUser = async (formData: { email: string; password: string }) => {
  const res = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Login failed");

  return await res.json();
};

export const getUserNotifications = async (token: string) => {
  const res = await fetch(`${API_URL}/notification`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch notifications");

  return await res.json();
};

export const getProfileData = async (token: string) => {
  const res = await fetch(`${API_URL}/user/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
  });

  if (!res.ok) throw new Error("Failed to fetch notifications");

  return await res.json();
}

export const uploadImage = async (formData: FormData, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/post/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to upload image");
  }
};

export const getUSers = async (token: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/user/users`,
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
}