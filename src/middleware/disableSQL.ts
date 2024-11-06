import { Request, Response, NextFunction } from "express";

const disableSQL = (req: Request, res: Response, next: NextFunction): void => {
  console.log("Disable SQL injection middleware invoked");

  const sql_injection_enabled = req.cookies.sql_injection_enabled === "true";
  console.log(`SQL injection protection enabled: ${sql_injection_enabled}`);

  if (sql_injection_enabled) {
    //prociscavanje parametara, odnosno u ovom slucaju postavljanje indikatorske varijable
    req.sqlInjectionEnabled = sql_injection_enabled;
    console.log("Setting indicator variable: ", req.sqlInjectionEnabled);
  } else {
    console.log("SQL injection protection is disabled");
  }

  next();
};

export default disableSQL;
