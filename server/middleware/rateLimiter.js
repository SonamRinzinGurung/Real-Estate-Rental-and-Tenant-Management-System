import rateLimiter from "express-rate-limit";

// rate limiter for login and register routes
export const apiLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message:
    "Request Limit reached for this IP Address. Please wait for 60 seconds and try again",
});
