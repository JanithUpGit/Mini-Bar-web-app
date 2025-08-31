
# Mini-Bar-web-app

This project is a web application designed to manage bar stock online. The frontend is developed using **HTML, CSS, and JavaScript**, while the backend is built with **Express.js**.

-----

## Folder Structure

The project is divided into two main parts: `frontend` and `backend`.

### Backend Folder Structure

The `backend` folder contains the RESTful API built with **Node.js** and **Express.js**.

```
/backend
├── node_modules/
├── controllers/
│   ├── productController.js  (Business logic for products)
│   ├── orderController.js    (Business logic for orders)
│   └── userController.js     (Business logic for users)
├── models/
│   ├── Product.js            (Product model)
│   ├── Order.js              (Order model)
│   └── User.js               (User model)
├── routes/
│   ├── productRoutes.js      (API routes for products)
│   ├── orderRoutes.js        (API routes for orders)
│   └── userRoutes.js         (API routes for users)
├── config/
│   └── db.js                 (Database connection settings)
├── middleware/
│   └── authMiddleware.js     (For authentication and other tasks)
├── app.js                    (The main Express.js server file)
└── package.json              (List of dependencies)
```

-----

### Frontend Folder Structure

The `frontend` folder contains all the files for the web application's user interface (UI).

```
/frontend
├── css/
│   └── style.css       (CSS code for the web page's appearance)
├── js/
│   ├── api.js          (Manages all API calls)
│   ├── main.js         (Main DOM manipulations and logic)
│   └── components.js   (Reusable components for the website)
├── images/
│   └── logo.png        (Project images and icons)
├── index.html          (The main page of the web app)
└── about.html          (Other optional pages as needed)
```


## project setup steps

* cd backend            'go to the backend folder'
* npm install express    'run'
* npm install mysql2
* npm install dotenv
* npm install express-session
* npm install bcryptjs
* npm install node-cron
* npm install cors
* create .env file
* go to the .env file and fix database connection with your settings
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=minibar_db
```
* node app.js 'run this file'
* cd frontend
* npm install react-router-dom
* npm install tailwindcss @tailwindcss/vite
* npm install lucide-react
* cd backend
npm install serverless-http

firebase functions:config:set db.host="DB_HOST=database-1.c5q2guagq7cg.eu-north-1.rds.amazonaws.com" db.user="postgres" db.password="TrTidiNQKuHsC4OJ3IK2" db.name="madura-db" db.port="5432"

DB_HOST=database-1.c5q2guagq7cg.eu-north-1.rds.amazonaws.com
DB_USER=postgres
DB_PASSWORD=TrTidiNQKuHsC4OJ3IK2
DB_NAME=madura-db
SESSION_SECRET=a_very_secret_and_long_string
FRONT_PORT=http://localhost:5175
DB_PORT=5432

NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5175

