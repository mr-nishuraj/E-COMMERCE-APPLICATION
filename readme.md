# 🛒 E-Commerce Web Application

A full-stack E-Commerce Web Application built using **Node.js, Express.js, MongoDB, HTML, CSS, and JavaScript**. The application allows users to register, log in, browse products, add products to a cart, place orders, and track their order history. Admin users can manage products and monitor customer orders.

---

## 🚀 Features

### User Features

* User Registration
* User Login with JWT Authentication
* View Product Catalog
* Add Products to Cart
* Remove Products from Cart
* Checkout Functionality
* View Order History
* Order Tracking

### Admin Features

* Add New Products
* Update Existing Products
* Delete Products
* View All Orders
* Update Order Status

### Security Features

* Password Hashing using bcryptjs
* JWT Token Authentication
* Protected Routes
* Role-Based Access Control (Admin/User)

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT (JSON Web Token)
* bcryptjs

---

## 📁 Project Structure

```text
ecommerce-app/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   └── index.html
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ecommerce-app.git

cd ecommerce-app
```

### 2. Install Backend Dependencies

```bash
cd backend

npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/ecommerce

JWT_SECRET=supersecretkey123
```

### 4. Start MongoDB

Make sure MongoDB is installed and running:

```bash
mongod
```

### 5. Start Backend Server

```bash
npm run dev
```

or

```bash
npm start
```

Backend will run on:

```text
http://localhost:5000
```

### 6. Launch Frontend

Open:

```text
frontend/index.html
```

in your browser.

---

## 🔗 API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

#### Login User

```http
POST /api/auth/login
```

---

### Products

#### Get All Products

```http
GET /api/products
```

#### Add Product (Admin)

```http
POST /api/products
```

#### Update Product (Admin)

```http
PUT /api/products/:id
```

#### Delete Product (Admin)

```http
DELETE /api/products/:id
```

---

### Orders

#### Place Order

```http
POST /api/orders
```

#### Get User Orders

```http
GET /api/orders
```

#### View All Orders (Admin)

```http
GET /api/admin/orders
```

#### Update Order Status (Admin)

```http
PUT /api/admin/orders/:id
```

---

## 🧪 Test Workflow

1. Register a new user.
2. Login using credentials.
3. Browse products.
4. Add products to cart.
5. Checkout.
6. Verify order creation.
7. View order history.
8. Login as admin to manage products and orders.

---

## 📈 Future Enhancements

* Payment Gateway Integration (Razorpay/Stripe)
* Product Categories
* Product Search & Filtering
* Wishlist Functionality
* User Profile Management
* Product Reviews & Ratings
* Image Upload using Cloudinary
* Email Notifications
* Sales Analytics Dashboard

---

## 🎯 Learning Outcomes

This project demonstrates:

* Full-Stack Development
* REST API Development
* JWT Authentication
* MongoDB Database Integration
* CRUD Operations
* Role-Based Authorization
* Cart and Order Management
* Frontend & Backend Integration

---

## 👨‍💻 Author

**Nishu Raj**

BCA Student | Full Stack Developer | Technical Affairs Officer, CSI Student Chapter

---

## 📄 License

This project is developed for educational and internship evaluation purposes.
