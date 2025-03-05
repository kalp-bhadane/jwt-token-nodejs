const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
const jwtSecretKey = "kalpesh";
var user = {};

app.post("/login", (req, res) => {
  user = req.body;
  const token = jwt.sign({ user }, jwtSecretKey, { expiresIn: "100000ms" });
  res.json({ token });
});

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const user = jwt.verify(token, jwtSecretKey);
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

app.get("/get-user", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
});

app.listen(3000, () => {
  console.log("listening to port: 3000");
});
