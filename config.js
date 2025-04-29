const config = {
    api: {
        opensea: {
            baseUrl: 'https://api.opensea.io/api/v1',
            timeout: 10000,
            maxRetries: 3,
            retryDelay: 2000
        }
    },
    
    analysis: {
        defaultLimit: 50,
        minRarityScore: 0,
        maxTopResults: 10
    },
    
    export: {
        directory: './exports',
        format: 'json'
    },

    logging: {
        level: process.env.LOG_LEVEL || 'info',
        debug: process.env.DEBUG === 'true'
    }
};

module.exports = config;