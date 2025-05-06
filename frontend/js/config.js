// frontend/js/config.js
const config = {
  development: {
    apiBaseUrl: 'http://localhost:5000',
  },
  production: {
    // We'll update this after creating the Render service
    apiBaseUrl: "https://toolstack9921.pythonanywhere.com",
  }
};

// Determine current environment
const isProduction = window.location.hostname !== 'localhost' && 
                    !window.location.hostname.includes('127.0.0.1');
const environment = isProduction ? 'production' : 'development';

// Export the configuration
const apiConfig = config[environment];
