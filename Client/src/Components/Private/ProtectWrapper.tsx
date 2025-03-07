import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface WrapperProps {
  children: ReactNode;
}

export const UserProtectWrapper: React.FC<WrapperProps> = ({ children }) => {
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

  }, [token, navigate]); 

  return <>{children}</>;
};

export const UserRedirectWrapper: React.FC<WrapperProps> = ({ children }) => {
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return <>{children}</>;
};

export const AdminProtectWrapper: React.FC<WrapperProps> = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  return <>{children}</>;
};
