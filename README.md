# Web aplikacija za demonstraciju SQL injection i CSRF napada
Web-aplikacija demonstrira dvije uobičajene ranjivosti web-aplikacija: SQL Injection i CSRF (Cross-Site Request Forgery). Aplikacija je osmišljena kao edukativni alat za razumijevanje tih sigurnosnih prijetnji te načina kako ih potencijalni napadači mogu iskoristiti. U aplikaciji je omogućeno uključivanje i isključivanje ranjivosti kako bi se jednostavno vidio efekt napada i procijenila važnost implementacije sigurnosnih zaštita.

**Funkcionalnosti**
- SQL Injection
  SQL Injection ranjivost omogućava napadaču manipulaciju SQL upitima kroz unos korisničkih podataka.
  Implementirana funkcionalnost omogućuje korisniku da:
  - Omogući ili onemogući SQL Injection ranjivost putem sučelja (npr. pomoću checkboxa ili padajućeg izbornika).
  - Pokrene SQL Injection napad kroz sučelje aplikacije i vidi efekt na bazi podataka ili u prikazu podataka na stranici.

- CSRF (Cross-Site Request Forgery)
  CSRF napad omogućava napadaču pokretanje neovlaštenih akcija u ime žrtve bez njenog pristanka.
  Implementirana funkcionalnost omogućuje korisniku da:
  - Omogući ili onemogući CSRF ranjivost u aplikaciji.
  - Pokrene CSRF napad koji izvršava neovlaštene akcije i prikaže efekt kroz promjene na korisničkom sučelju, npr. prikazom izmijenjenih podataka, izmijenjenih sesijskih informacija ili alert dijaloga s informacijama o sesiji (document.cookie).

**Prikaz efekta napada**
Napadi se mogu pokretati izravno kroz korisničko sučelje aplikacije, a svaki uspješan napad prikazuje:
 - Popis izvršenih akcija na korisničkom sučelju.
 - Promjene u bazi podataka kao rezultat SQL Injection napada.
 - Prikaz informacija o sesiji kroz alert dijaloge kao rezultat CSRF napada.

