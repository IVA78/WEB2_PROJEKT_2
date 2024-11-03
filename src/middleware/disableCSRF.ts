import { Request, Response, NextFunction } from "express";

const disableCSRF = (req: Request, res: Response, next: NextFunction): void => {
  console.log("CSRF middleware invoked");

  const csrf_enabled = req.cookies.csrf_enabled === "true";
  console.log(`CSRF Enabled: ${csrf_enabled}`);

  if (csrf_enabled) {
    const tokenFromRequest = req.body.csrf_token;
    const tokenFromCookie = req.cookies.csrf_token;

    if (!tokenFromRequest || tokenFromRequest !== tokenFromCookie) {
      res.status(403).send("Forbidden: Invalid CSRF token!");
      return;
    } else {
      console.log("Valid CSRF token.");
    }
  } else {
    console.log("CSRF protection is disabled.");
  }

  next();
};

export default disableCSRF;
