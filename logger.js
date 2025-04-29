const config = require('./config');

class Logger {
    static log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        
        console.log(logEntry);
        
        if (data && config.logging.debug) {
            console.log('Data:', JSON.stringify(data, null, 2));
        }
    }

    static info(message, data) {
        this.log('info', message, data);
    }

    static error(message, data) {
        this.log('error', message, data);
    }

    static debug(message, data) {
        if (config.logging.debug) {
            this.log('debug', message, data);
        }
    }

    static warn(message, data) {
        this.log('warn', message, data);
    }
}

module.exports = Logger;