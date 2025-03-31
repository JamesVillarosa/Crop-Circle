# 100-project: Crop Circle
Section: U2L

Members:
  1. Gonzales, Katrina
  2. Reyes, Mark Andrei
  3. Valles, Algie
  4. Villarosa, James

# Project Features
**User Types and Accounts**
1. **User Registration and Login:**
    - Users can register using an email address without the need for verification or OTP.
    - Users register with a username in an email format.
    - Upon registration, users are assigned the role of 'Customer.'

2. **Authentication and Authorization:**
    - Users must log in to access the system.
    - Users can log out of the system.
    - Only logged-in users can access the website.
    - Customers do not have access to the admin dashboard or any admin-specific routes.

**E-commerce Management (Administrator/Merchant Users)**
1. **Admin Dashboard:**
    - Provides access to various e-commerce management modules.

2. **User Account Management:**
    - View a list of all registered users.
    - Generate reports on the total number of registered users.

3. **Product Listings:**
    - Create and manage a list of products.
    - Inventory management with details such as Product Name, Product Type (crops or poultry), Product Price, Product Description, and Quantity.
    - Ability to sort products by name, type, price, or quantity in ascending or descending order.

4. **Order Fulfillment:**
    - Confirm customer orders, marking them as final and ready for delivery.

5. **Sales Reports:**
    - Generate lists of products sold and the income generated from each.
    - Provide summaries of transactions, including weekly, monthly, and annual sales reports.

**Shop (Customer Users)**
1. **Product Listings and Order Fulfillment:**
    - View and manage product listings.
    - Sort products by name, type, price, or quantity in ascending or descending order.

2. **Shopping Cart Management:**
    - Add items to the shopping cart.
    - Delete items from the shopping cart.
    - Count the total number of items in the shopping cart.
    - Calculate the total price of items in the shopping cart.

3. **Order Management:**
    - Place orders from the shopping cart.
    - Transactions are handled as cash-on-delivery.
    - Option to cancel orders if they have not been confirmed by the merchant.

# Screenshots
<img width="1428" alt="Screenshot 2024-05-30 at 15 52 18" src="https://github.com/klgonzales/100-project/assets/125255901/4b457a5a-be27-4725-a2d9-dfff06002249">
<img width="1428" alt="Screenshot 2024-05-30 at 15 52 05" src="https://github.com/klgonzales/100-project/assets/125255901/55ae804b-3b8c-43c8-a1c6-7672792e426d">
<img width="1428" alt="Screenshot 2024-05-30 at 15 48 18" src="https://github.com/klgonzales/100-project/assets/125255901/57c7336b-1347-4070-8c2f-9c909bba4d45">
<img width="1428" alt="Screenshot 2024-05-30 at 15 47 45" src="https://github.com/klgonzales/100-project/assets/125255901/223f2d30-880e-471d-8f09-e6963780ef55">
<img width="1428" alt="Screenshot 2024-05-30 at 15 47 04" src="https://github.com/klgonzales/100-project/assets/125255901/7c650088-05ae-4ef2-a612-ed296f62c748">
<img width="1428" alt="Screenshot 2024-05-30 at 16 03 45" src="https://github.com/klgonzales/100-project/assets/125255901/0236883d-85a5-44ff-9329-9f0d84709140">
<img width="1428" alt="Screenshot 2024-05-30 at 16 03 03" src="https://github.com/klgonzales/100-project/assets/125255901/b0677e51-5ccd-4a18-b32e-c6848a34e0b3">
<img width="1428" alt="Screenshot 2024-05-30 at 16 02 21" src="https://github.com/klgonzales/100-project/assets/125255901/ea628a13-6646-492a-972d-6015a5bb2ec1">
<img width="1428" alt="Screenshot 2024-05-30 at 16 02 54" src="https://github.com/klgonzales/100-project/assets/125255901/6b5aeaa9-6805-4548-9f74-c531f0f34aa6">
<img width="1428" alt="Screenshot 2024-05-30 at 16 02 06" src="https://github.com/klgonzales/100-project/assets/125255901/af6f4186-0544-4c36-972d-9fc4ed583daa">
<img width="1428" alt="Screenshot 2024-05-30 at 15 56 42" src="https://github.com/klgonzales/100-project/assets/125255901/dc0cf3df-8e6a-4c84-bf41-21ebfbd45f66">
<img width="1428" alt="Screenshot 2024-05-30 at 15 52 52" src="https://github.com/klgonzales/100-project/assets/125255901/29091a66-6577-49f0-b101-1f6c94e71f6c">
<img width="1428" alt="Screenshot 2024-05-30 at 15 52 38" src="https://github.com/klgonzales/100-project/assets/125255901/07119a95-648f-417d-b040-9a10282c699e">

# User Guidelines
1. **Getting Started**
   #### Registration
   - Go to the registration page.
   - Enter your email address and choose a username.
   - Click "Register" to create your account.

   #### Login
   - Go to the login page.
   - Enter your registered email address and password.
   - Click "Login" to access your account.
    
2. **Navigating the Dashboard**
   #### Customer Dashboard
   **View Products:**
   
   - Browse available products listed in the shop.
   - Sort products by name, type, price, or quantity.

   **Shopping Cart:**
   - Add items to your shopping cart.
   - View the total price and item count in your cart.
   - Remove items if needed.

   **Place Orders:**
   - Review items in your cart.
   - Click "Place Order" to finalize your purchase.
   - Orders are processed as cash-on-delivery.
   
   **Manage Orders:**
   - View your order history.
   - Cancel orders if they have not been confirmed by the merchant.

   #### Admin Dashboard (Department of Agriculture)
   **User Management:**
   - View the list of registered users.
   - Generate user reports.
   
   **Product Management:**
   - Add new products with details like name, type, price, description, and quantity.
   - Edit or delete existing products.
   - Sort and manage product listings.
   
   **Order Management:**
   - View and confirm customer orders.
   - Mark orders as ready for delivery.
   
   **Sales Reports:**
   - Generate and view sales reports by week, month, and year.
   - Analyze income generated from product sales.
  
3. **Account Management**
   **Edit Profile:**
   - Go to the account settings page.
   - Update your email or username.
   - Save changes to update your profile.

  **Logout:**
  - Click the "Logout" button to securely exit your account.
  
# How to Run 
1. Open MongoDB Compass and paste the following URL: mongodb+srv://mmreyes22:XdjdjPVtO8s3QUCO@projectdb.1qwz3vt.mongodb.net/.
2. Open VS Code and open two terminals. In the first terminal, navigate to the group4-cmsc100-project root directory and type npm i.
3. In the second terminal, navigate to the backend root directory and type npm i.
4. Go back to the first terminal and type npm run dev.
5. Go back to the second terminal and type node server.js.
