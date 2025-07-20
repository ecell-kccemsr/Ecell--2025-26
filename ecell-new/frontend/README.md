# E-Cell Website

This is a React-based website for the Entrepreneurship Cell (E-Cell) of a college/university. The website showcases E-Cell's events, team, and activities to foster entrepreneurship among students.

## Features

- Modern and responsive design
- Authentication system (login/register)
- Event management and display
- Team showcase
- Contact form
- User dashboard

## Technologies Used

- React 18
- React Router for navigation
- CSS for styling
- React Icons for iconography

## Project Structure

```
├── public/                # Static files
├── src/                   # Source files
│   ├── components/        # Reusable components
│   │   ├── Footer/        # Footer component
│   │   ├── Header/        # Header component
│   │   ├── HeroSection/   # Hero section component
│   │   └── ...            # Other components
│   ├── pages/             # Page components
│   │   ├── Home/          # Home page
│   │   ├── About/         # About page
│   │   ├── Events/        # Events page
│   │   ├── Team/          # Team page
│   │   ├── Contact/       # Contact page
│   │   ├── Auth/          # Authentication pages
│   │   └── Dashboard/     # Dashboard page
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main App component
│   ├── App.css            # App-level styles
│   ├── index.jsx          # Entry point
│   └── index.css          # Global styles
└── netlify/               # Netlify configuration files
    └── functions/         # Serverless functions for Netlify
```

## Setup and Running

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ecell-new/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

## Deployment

This project is set up to be deployed on Netlify. The configuration file `netlify.toml` contains the necessary settings for deployment.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=<api-url>
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
