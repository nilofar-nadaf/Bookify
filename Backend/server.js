const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require("./Routes/user");
const cartRoutes = require("./Routes/cart");
const orderRoutes = require("./Routes/order");
const adminRoutes = require("./Routes/admin");

app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});