import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import crypto from "crypto";
import https from "https";
import fs from "fs";
import cors from "cors";

import disableCSRF from "./middleware/disableCSRF";
import { Console } from "console";

//definiranje porta
const port = process.env.PORT || 3000;

//konfiguracija env
dotenv.config({
  path: path.join(__dirname, "environments/.env.development"),
});

//konfiguracija aplikacije
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: `https://localhost:${port}`, credentials: true })); //azuriraj kod deploya!

//postavljanje sesijskog middleware-a
app.use(
  session({
    secret: "RTdVLXcv7U88ulLTgB4wra5CBIAg83I6", // iz online generatora secreta
    resave: false, // Avoid resaving session if it hasn't changed
    saveUninitialized: false, // Avoid saving uninitialized sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
      secure: false, // Set to `true` if using HTTPS
      httpOnly: true,
    },
  })
);

//postavljanje cookie-ja za autentifikaciju(ako korisnik vec nema cookie, dodjeljuje mu se ovdje)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.session_id) {
    //generiranje session_id-a
    const uniqueSessionId = `user_session_${crypto.randomUUID()}`;

    res.cookie("session_id", uniqueSessionId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
  }

  //generiranje CSRF tokena
  if (!req.cookies.csrf_token) {
    const csrfToken = crypto.randomBytes(32).toString("hex");
    res.cookie("csrf_token", csrfToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    console.log("CSRF token cookie created:", csrfToken);
  }

  next();
});

//postavljanje direktorija za staticke datoteke
app.use(express.static(path.join(__dirname, "./public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//definiranje osnovne rute za posluzivanje pocetne stranice
app.get("/", async (req: Request, res: Response) => {
  try {
    //renderiranje pocetne stranice
    const csrfTokenFromServer = req.cookies.csrf_token;
    res.render("index", {
      csrfTokenFromServer: csrfTokenFromServer,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while loading home page.");
  }
});

//definiranje rute za prebacivanje novaca
app.post("/transfer-funds", disableCSRF, (req: Request, res: Response) => {
  const { amount, account } = req.body;
  console.log("Amout: ", amount, "Account: ", account);
  res.send(
    `Funds transfer successful: Transferred ${amount} to account ${account}`
  );
});

app.get("/csrf-attack", (req: Request, res: Response) => {
  res.render("csrf_attack", {});
});

https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.cert"),
    },
    app
  )
  .listen(port, () => {
    console.log(`Server started, port: ${port}!`);
  });

/**
 app.listen(port, () => {
  console.log(`Klijentski server je pokrenut, port: ${port}!`);
});

 */
