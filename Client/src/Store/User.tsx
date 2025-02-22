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
