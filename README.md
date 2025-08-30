
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