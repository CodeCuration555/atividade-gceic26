const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || "http://localhost:3001";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mkp-secret-2025",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
  })
);

function requireAuth(req, res, next) {
  if (req.session && req.session.mkpUser) return next();
  res.redirect("/mkp/login");
}

app.get("/", (req, res) => {
  res.redirect("/mkp");
});

// Splash
app.get("/mkp", (req, res) => {
  res.render("mkp/splash");
});

app.get("/mkp/splash", (req, res) => {
  res.render("mkp/splash");
});

// Login
app.get("/mkp/login", (req, res) => {
  if (req.session.mkpUser) return res.redirect("/mkp/calculo");
  res.render("mkp/login", { erro: null });
});

app.post("/mkp/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    req.session.mkpUser = { username: "admin", nome: "Administrador" };
    return res.redirect("/mkp/calculo");
  }
  res.render("mkp/login", { erro: "Usuário ou senha inválidos" });
});

// Logout
app.get("/mkp/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/mkp/login");
  });
});

// Calculo
app.get("/mkp/calculo", requireAuth, (req, res) => {
  res.render("mkp/calculo", { user: req.session.mkpUser });
});

// Sobre
app.get("/mkp/sobre", requireAuth, (req, res) => {
  res.render("mkp/sobre", { user: req.session.mkpUser });
});

// Help
app.get("/mkp/help", requireAuth, (req, res) => {
  res.render("mkp/help", { user: req.session.mkpUser });
});

// Proxy para API
app.post("/api/mkp/custos", requireAuth, async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${API_URL}/api/mkp/custos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`App MKP rodando: http://localhost:${PORT}/mkp`);
});

module.exports = app;
