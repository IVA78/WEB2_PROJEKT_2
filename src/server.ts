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
import disableSQL from "./middleware/disableSQL";
import sendQuery from "./utils/sendQuery";

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

//inicijalno definiranje entiteta u bazi
async function databaseInit() {
  await sendQuery("DROP TABLE users");
  const queryText1 = `CREATE TABLE IF NOT EXISTS users (
                      username VARCHAR(100) PRIMARY KEY,
                      password VARCHAR(100) NOT NULL,
                      firstName VARCHAR(100) NOT NULL,
                      lastName VARCHAR(100) NOT NULL,
                      email VARCHAR(100) UNIQUE NOT NULL,
                      phoneNumber VARCHAR(100)
                      );`;

  await sendQuery(queryText1);

  const queryText2 = `INSERT INTO users (username, password, firstName, lastName, email, phoneNumber) VALUES
                      ('ivanp', 'lozinka123', 'Ivan', 'Perić', 'ivanp@example.com', '091-234-5678'),
                      ('anam', 'sigurnaLozinka1', 'Ana', 'Marić', 'anam@example.com', '092-345-6789'),
                      ('markov', 'lozinka!23', 'Marko', 'Vuković', 'markov@example.com', '095-456-7890'),
                      ('petral', 'Petra#22', 'Petra', 'Lukić', 'petral@example.com', '097-567-8901'),
                      ('sanjak', 'sigurno@123', 'Sanja', 'Kovač', 'sanjak@example.com', '098-678-9012');
                      `;
  await sendQuery(queryText2);

  const result = await sendQuery(`SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public';`);

  if (result) {
    console.log("Query result:", result.rows);
  } else {
    console.log("Query execution failed.");
  }
}
//databaseInit();

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

//definiranje rute za simuliranje CSRF napada
app.get("/csrf-attack", (req: Request, res: Response) => {
  res.render("csrf_attack", {});
});

//definiranje rute za prijavu korisnika u sustav
app.post("/login", disableSQL, async (req: Request, res: Response) => {
  //slanje korisničkih podataka iz baze ovisno o unesenom korisnickom imenu i lozinki
  console.log("Korisničko ime: ", req.body.username);
  //dohvat podataka iz baze
  try {
    const username = req.body.username;
    const password = req.body.password;
    const params = [username, password];

    let queryText;
    let result;

    if (req.sqlInjectionEnabled) {
      // Ako je zaštita uključena, koristi parametarski upit (AUTOMATSKA ZASTITA)
      queryText = `SELECT * FROM users WHERE username = $1 AND password = $2`;
      result = await sendQuery(queryText, params);
    } else {
      // Ako zaštita nije uključena, koristi direktni upit
      queryText = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
      result = await sendQuery(queryText);
    }

    if (result && result.rows.length > 0) {
      res.json({ message: "Uspješna prijava", user: result.rows });
    } else {
      res.status(401).send("Neispravno korisničko ime ili lozinka");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Greška na serveru");
  }
});

/**
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
 */

app.listen(port, () => {
  console.log(`Klijentski server je pokrenut, port: ${port}!`);
});
