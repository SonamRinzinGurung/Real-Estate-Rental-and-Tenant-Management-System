const config = {
    development: {
        API_BASE_URL: 'http://localhost:5000/api',
        SOCKET_URL: 'http://localhost:5000',
        APP_BASE_URL: 'http://localhost:3000'
    },
    production: {
        API_BASE_URL: '/api',  // Proxied through nginx
        SOCKET_URL: window.location.origin,  // Same origin
        APP_BASE_URL: window.location.origin  // Same origin
    }
};

export default config[process.env.NODE_ENV || 'development'];