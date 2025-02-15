import requestIp from "request-ip";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import prisma from "../config/DB";

export const locationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let ip = requestIp.getClientIp(req);
  console.log(ip);
  

  // Convert localhost IP to public IP for testing
  if (!ip || ip === "::1" || ip === "127.0.0.1") {
    ip = "157.20.146.169"; // Google DNS IP for local testing
  }

  try {
    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { ip: clientIp, city, country_name } = data;

    console.log(`IP: ${clientIp}, City: ${city}, Country: ${country_name}`);

    // User ID ko request object se le kar database update karna
    const userId = (req as any).user?.id;
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ipAddress: clientIp,
          city: city || "Unknown",
          country: country_name || "Unknown",
        },
      });
    }
  } catch (error) {
    console.error("Location Middleware Error:", error);
  }
  next();
};
