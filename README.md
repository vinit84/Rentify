# Rentify - Project Documentation

## Introduction
Rentify is a real estate web application developed as part of the Presidio Challenge. The goal of Rentify is to streamline the process of renting properties by connecting property owners (sellers) with potential tenants (buyers). This documentation outlines the project's features, architecture, setup, and deployment instructions.

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation and Setup](#installation-and-setup)
5. [Usage](#usage)
6. [Deployment](#deployment)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)

## Features
### Basic Application (Mandatory)
- **User Registration and Login:** Users can register as sellers or buyers by providing their first name, last name, email, and phone number.
- **Seller Functionality:** 
  - Post property details.
  - View, update, or delete posted properties.
- **Buyer Functionality:** 
  - View all posted rental properties.
  - Click "I'm Interested" to view seller details.
  - Apply filters to search for properties based on specific criteria.

### Add-On Features (Advanced)
- **Form Validation:** Proper validation for all forms.
- **Pagination:** Implemented for property listings.
- **Authentication:** Login required for buyers to view seller details.
- **Unauthorized Access Handling:** Redirect unauthorized users to the login screen.
  
### Bonus Points (Optional)
- **Cloud Deployment:** The application is deployed on a cloud platform.

## Tech Stack
- **Front-end:** React.js, Tailwind CSS
- **Back-end:** Firebase

## Project Structure
```
rentify/
├── public/                  # Public assets and HTML files
│   ├── index.html           # Main HTML file
│   ├── manifest.json        # Manifest file for PWA configuration
│   └── ...                  # Other static files like icons, robots.txt
├── src/                     # Source files
│   ├── components/          # React components
│   │   ├── Auth/            # Authentication related components
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Buyer/           # Components specific to buyers
│   │   ├── Seller/          # Components specific to sellers
│   │   │   ├── Upload.jsx
│   │   │   └── Listed.jsx
│   │   └── ...              # Other shared components
│   ├── firebase/            # Firebase configuration and services
│   │   └── firebaseconfig.js
│   ├── services/            # Services for API calls and other logic
│   ├── styles/              # CSS files and other styling resources
│   ├── App.js               # Main React component that includes routing
│   ├── index.js             # Entry point for React application
│   └── ...                  # Other utility or helper JS files
├── .env                     # Environment variables
├── firebase.json            # Firebase configuration
├── package.json             # NPM package configuration
├── README.md                # Project documentation
└── ...                      # Other configuration files like .gitignore, .eslintrc.js
```

## Installation and Setup
### Prerequisites
- Node.js and npm installed
- Firebase account

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repository/rentify.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd rentify
   ```
3. **Install the dependencies:**
   ```bash
   npm install
   ```
4. **Configure Firebase:**
   - Create a Firebase project in the Firebase console.
   - Set up Firebase Authentication and Firestore.
   - Add your Firebase configuration to the `.env` file:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```
5. **Start the development server:**
   ```bash
   npm start
   ```
6. **Open the application in your browser at `http://localhost:3000`.**

## Usage
### Registration and Login
- **Register** as a new user by providing the required details.
- **Login** using your email and password.

### Seller Flow
- **Post Property:** Provide details such as location, area, number of bedrooms, bathrooms, nearby amenities, etc.
- **Manage Properties:** View, update, or delete your posted properties.

### Buyer Flow
- **View Properties:** Browse all available rental properties.
- **Show Interest:** Click "I'm Interested" to view seller details.
- **Apply Filters:** Use filters to narrow down your search based on specific criteria.

## Deployment
The application is deployed on [Heroku/AWS/Microsoft Azure]. You can access the live application using the following link: [Online Deployment Link]

### Deploying to Firebase
1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```
2. **Login to Firebase:**
   ```bash
   firebase login
   ```
3. **Initialize Firebase in your project:**
   ```bash
   firebase init
   ```
4. **Deploy the application:**
   ```bash
   npm run build
   firebase deploy
   ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Contact
For any questions or support, please contact Vinit Upadhyay at vinitupadhyay8454@gmail.co
