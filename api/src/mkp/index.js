const express = require("express");
const router = express.Router();

router.post("/custos", (req, res) => {
  const { custosDiretos, custosIndiretos } = req.body;

  if (typeof custosDiretos !== "number" || typeof custosIndiretos !== "number") {
    return res.status(400).json({
      erro: "Informe custosDiretos e custosIndiretos como números.",
    });
  }

  const custoTotal = custosDiretos + custosIndiretos;

  return res.json({
    custosDiretos,
    custosIndiretos,
    custoTotal,
  });
});

module.exports = router;
