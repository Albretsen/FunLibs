export default class Analytics {
    // Production flag. Used all throughout the codebase.
    static production = false;

    static log(message) {
        try {
            if (!this.production) {
                const stack = new Error().stack;
                const callerName = stack.split('\n')[2].trim().split(' ')[1];
                console.log(`[${callerName}] ${message}`);
            }
        } catch(error) {
            console.log("Logging error; aborting log call: " + error);
        }
    }
}