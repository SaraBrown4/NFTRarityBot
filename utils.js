class RetryHelper {
    static async withRetry(fn, maxRetries = 3, delayMs = 1000) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                console.log(`Attempt ${attempt} failed: ${error.message}`);
                
                if (attempt < maxRetries) {
                    console.log(`Retrying in ${delayMs}ms...`);
                    await this.delay(delayMs * attempt); // Exponential backoff
                }
            }
        }
        
        throw lastError;
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class ValidationHelper {
    static isValidContractAddress(address) {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    static sanitizeMetadata(metadata) {
        if (!metadata || typeof metadata !== 'object') {
            return null;
        }

        return {
            name: metadata.name || 'Unknown',
            token_id: metadata.token_id || '0',
            traits: Array.isArray(metadata.traits) ? metadata.traits : []
        };
    }
}

module.exports = {
    RetryHelper,
    ValidationHelper
};