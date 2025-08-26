Please see the complete API list in the requested format below.

-----

### **Public Endpoints**

  * **User Registration**

      * **Method:** `POST`
      * **URL:** `/api/users/register`
      * **Description:** Creates a new user account.
      * **Request Body (JSON):**
        ```json
        {
          "user_name": "Janith Upul",
          "email": "janith@example.com",
          "password": "password123",
          "user_role": "USER"
        }
        ```

  * **User Login**

      * **Method:** `POST`
      * **URL:** `/api/users/login`
      * **Description:** Authenticates a user and creates a new session.
      * **Request Body (JSON):**
        ```json
        {
          "email": "janith@example.com",
          "password": "password123"
        }
        ```

  * **User Logout**

      * **Method:** `POST`
      * **URL:** `/api/users/logout`
      * **Description:** Destroys the current user's session, effectively logging them out.
      * **Protected:** Requires an active session.

-----

### **Admin-Only Endpoints**

These endpoints require the user to be both **authenticated** and have the **"ADMIN"** `user_role` in their session.

  * **Get All Users**

      * **Method:** `GET`
      * **URL:** `/api/users`
      * **Description:** Retrieves a list of all users.
      * **Protected:** Requires `isAuthenticated` and `isAdmin`.

  * **Get User by ID**

      * **Method:** `GET`
      * **URL:** `/api/users/:id`
      * **Description:** Retrieves the details of a specific user.
      * **URL Parameter:** `:id` is the user's ID.
      * **Protected:** Requires `isAuthenticated` and `isAdmin`.

  * **Update User**

      * **Method:** `PUT`
      * **URL:** `/api/users/:id`
      * **Description:** Updates a user's information.
      * **URL Parameter:** `:id` is the user's ID.
      * **Request Body (JSON):**
        ```json
        {
          "user_name": "New Name",
          "email": "new@example.com",
          "user_status": "BLOCKED",
          "user_role": "USER"
        }
        ```
      * **Protected:** Requires `isAuthenticated` and `isAdmin`.

  * **Delete User**

      * **Method:** `DELETE`
      * **URL:** `/api/users/:id`
      * **Description:** Permanently deletes a user from the database.
      * **URL Parameter:** `:id` is the user's ID.
      * **Protected:** Requires `isAuthenticated` and `isAdmin`.

      

## Product Endpoints

### Admin-Only Endpoints (Product Management)

These endpoints are for managing the product inventory. All of these routes are protected and require the user to have an **"ADMIN"** `user_role` in their session.

* **Get All Products**
    * **Method:** `GET`
    * **URL:** `/api/products`
    * **Description:** Retrieves a list of all products in the database.
    * **Protected:** Requires `isAuthenticated` and `isAdmin`.

* **Create a New Product**
    * **Method:** `POST`
    * **URL:** `/api/products`
    * **Description:** Adds a new product to the database.
    * **Request Body (JSON):**
        ```json
        {
          "product_name": "Espresso Shot",
          "price": 250.00,
          "description": "A single shot of dark roasted espresso.",
          "stock_quantity": 50,
          "category_id": 1,
          "is_available": true
        }
        ```
    * **Protected:** Requires `isAuthenticated` and `isAdmin`.

* **Get Product by ID**
    * **Method:** `GET`
    * **URL:** `/api/products/:id`
    * **Description:** Retrieves the details of a specific product.
    * **URL Parameter:** `:id` is the product's ID.
    * **Protected:** Requires `isAuthenticated` and `isAdmin`.

* **Update a Product**
    * **Method:** `PUT`
    * **URL:** `/api/products/:id`
    * **Description:** Updates the information for an existing product.
    * **URL Parameter:** `:id` is the product's ID.
    * **Request Body (JSON):**
        ```json
        {
          "product_name": "Espresso Shot (Updated)",
          "price": 280.00,
          "stock_quantity": 45,
          "is_available": true
        }
        ```
    * **Protected:** Requires `isAuthenticated` and `isAdmin`.

* **Delete a Product**
    * **Method:** `DELETE`
    * **URL:** `/api/products/:id`
    * **Description:** Permanently deletes a product from the database.
    * **URL Parameter:** `:id` is the product's ID.
    * **Protected:** Requires `isAuthenticated` and `isAdmin`.


-----

### **Category Endpoints**


  * **Get All Categories**

      * **Method:** `GET`
      * **URL:** `/api/categories`
      * **Description:** Retrieves a list of all categories in the database.
      * **Protected:** Requires `no`.

  * **Create a New Category**

      * **Method:** `POST`
      * **URL:** `/api/categories`
      * **Description:** Adds a new category to the database.
      * **Request Body (JSON):**
        ```json
        {
          "category_name": "New Category"
        }
        ```
      * **Protected:** Requires `isAuthenticated` and `isAdmin`.

  * **Get a Category by ID**

      * **Method:** `GET`
      * **URL:** `/api/categories/:id`
      * **Description:** Retrieves the details of a specific category.
      * **URL Parameter:** `:id` is the category's ID.
      * **Protected:** 

  * **Update a Category**

      * **Method:** `PUT`
      * **URL:** `/api/categories/:id`
      * **Description:** Updates the information for an existing category.
      * **URL Parameter:** `:id` is the category's ID.
      * **Request Body (JSON):**
        ```json
        {
          "category_name": "Updated Category Name"
        }
        ```
      * **Protected:** Requires `isAuthenticated` and `isAdmin`.

  * **Delete a Category**

      * **Method:** `DELETE`
      * **URL:** `/api/categories/:id`
      * **Description:** Permanently deletes a category from the database.
      * **URL Parameter:** `:id` is the category's ID.
      * **Protected:** Requires `isAuthenticated` and `isAdmin`.