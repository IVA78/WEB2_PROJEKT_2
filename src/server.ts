import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

//definiranje porta
const port = process.env.PORT || 3000;

//konfiguracija env
dotenv.config({
  path: path.join(__dirname, "environments/.env.development"),
});

//konfiguracija aplikacije
const app = express();
app.use(express.urlencoded({ extended: true }));

//postavljanje direktorija za staticke datoteke
app.use(express.static(path.join(__dirname, "./public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//definiranje osnovne rute za posluzivanje pocetne stranice
app.get("/", async (req: Request, res: Response) => {
  try {
    //renderiranje pocetne stranice
    res.render("index");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while loading home page.");
  }
});

app.listen(port, () => {
  console.log(`Klijentski server je pokrenut, port: ${port}!`);
});
