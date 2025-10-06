const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // serve static files

// Handle calculation
app.post("/calculate", (req, res) => {
  const { num1, num2, operation } = req.body;

  const a = parseFloat(num1);
  const b = parseFloat(num2);

  if (isNaN(a) || isNaN(b)) {
    return res.send({ error: "❌ Please enter valid numbers!" });
  }

  let result;
  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      if (b === 0) {
        return res.send({ error: "⚠️ Cannot divide by zero!" });
      }
      result = a / b;
      break;
    default:
      return res.send({ error: "❌ Unknown operation!" });
  }

  res.send({ result });
});

app.listen(port, () => {
  console.log(`🎉 Kid Calculator running at http://localhost:${port}`);
});
