const fs = require('fs');
const path = require('path');
const Logger = require('./logger');

class Cache {
    constructor(cacheDir = './cache') {
        this.cacheDir = cacheDir;
        this.ensureCacheDir();
    }

    ensureCacheDir() {
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
            Logger.debug('Cache directory created');
        }
    }

    getCacheKey(contractAddress) {
        return `${contractAddress.toLowerCase()}.json`;
    }

    getCachePath(contractAddress) {
        return path.join(this.cacheDir, this.getCacheKey(contractAddress));
    }

    async get(contractAddress) {
        const cachePath = this.getCachePath(contractAddress);
        
        try {
            if (fs.existsSync(cachePath)) {
                const stats = fs.statSync(cachePath);
                const age = Date.now() - stats.mtime.getTime();
                
                // Cache expires after 1 hour
                if (age < 3600000) {
                    const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
                    Logger.debug(`Cache hit for ${contractAddress}`);
                    return data;
                }
            }
        } catch (error) {
            Logger.warn('Error reading cache:', error.message);
        }
        
        return null;
    }

    async set(contractAddress, data) {
        const cachePath = this.getCachePath(contractAddress);
        
        try {
            fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
            Logger.debug(`Data cached for ${contractAddress}`);
        } catch (error) {
            Logger.warn('Error writing cache:', error.message);
        }
    }

    async clear(contractAddress = null) {
        if (contractAddress) {
            const cachePath = this.getCachePath(contractAddress);
            if (fs.existsSync(cachePath)) {
                fs.unlinkSync(cachePath);
                Logger.info(`Cache cleared for ${contractAddress}`);
            }
        } else {
            const files = fs.readdirSync(this.cacheDir);
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    fs.unlinkSync(path.join(this.cacheDir, file));
                }
            });
            Logger.info('All cache cleared');
        }
    }
}

module.exports = Cache;