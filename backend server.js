const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= DATABASE =================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= SCHEMAS =================

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    default: "user"
  }
});

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  stock: Number
});

const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: Array,
  total: Number,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", UserSchema);
const Product = mongoose.model("Product", ProductSchema);
const Order = mongoose.model("Order", OrderSchema);

// ================= AUTH MIDDLEWARE =================

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token)
      return res.status(401).json({
        message: "Access Denied"
      });

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token"
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin Only"
    });
  }

  next();
};

// ================= AUTH ROUTES =================

// Register

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists)
      return res.status(400).json({
        message: "Email already exists"
      });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    res.json({
      message: "Registration Successful",
      user
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Login

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        message: "User not found"
      });

    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid)
      return res.status(400).json({
        message: "Wrong Password"
      });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ================= PRODUCT ROUTES =================

// Get Products

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Add Product (Admin)

app.post(
  "/api/products",
  auth,
  adminOnly,
  async (req, res) => {
    try {
      const product = await Product.create(req.body);

      res.json(product);
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

// Update Product

app.put(
  "/api/products/:id",
  auth,
  adminOnly,
  async (req, res) => {
    try {
      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true
          }
        );

      res.json(product);
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

// Delete Product

app.delete(
  "/api/products/:id",
  auth,
  adminOnly,
  async (req, res) => {
    try {
      await Product.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Product Deleted"
      });
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

// ================= ORDER ROUTES =================

// Checkout

app.post(
  "/api/orders",
  auth,
  async (req, res) => {
    try {
      const { items, total } = req.body;

      const order = await Order.create({
        userId: req.user.id,
        items,
        total
      });

      res.json({
        message: "Order Placed",
        order
      });
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

// User Orders

app.get(
  "/api/orders",
  auth,
  async (req, res) => {
    try {
      const orders = await Order.find({
        userId: req.user.id
      });

      res.json(orders);
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

// Admin View All Orders

app.get(
  "/api/admin/orders",
  auth,
  adminOnly,
  async (req, res) => {
    try {
      const orders = await Order.find();

      res.json(orders);
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

// Update Order Status

app.put(
  "/api/admin/orders/:id",
  auth,
  adminOnly,
  async (req, res) => {
    try {
      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            status: req.body.status
          },
          {
            new: true
          }
        );

      res.json(order);
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

// ================= SEED PRODUCTS =================

app.get("/api/seed", async (req, res) => {
  try {
    await Product.deleteMany();

    await Product.insertMany([
      {
        name: "Laptop",
        description: "Gaming Laptop",
        price: 65000,
        stock: 10,
        image:
          "https://via.placeholder.com/200"
      },
      {
        name: "Smartphone",
        description: "Android Phone",
        price: 20000,
        stock: 25,
        image:
          "https://via.placeholder.com/200"
      },
      {
        name: "Headphones",
        description: "Wireless Headphones",
        price: 3000,
        stock: 50,
        image:
          "https://via.placeholder.com/200"
      }
    ]);

    res.json({
      message: "Products Seeded"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ================= HOME =================

app.get("/", (req, res) => {
  res.send("E-Commerce API Running");
});

// ================= SERVER =================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
