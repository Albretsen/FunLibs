import FileManager from "./file_manager";

export default class Analytics {
    // Production flag. Used all throughout the codebase.
    static production = false;

    static log(message) {
        try {
            if (!this.production) {
                const stack = new Error().stack;
                const callerName = stack.split('\n')[2].trim().split(' ')[1];
                console.log(`[${callerName}] ${message}`);
                if (message.includes("requires and index")) console.log("\n\n INDEX \n" + message + "\n\n INDEX")
            }
        } catch(error) {
            console.log("Logging error; aborting log call: " + error);
        }
    }

    /**
     * 
     * @param {string} key - increments the integer in local storage with paramater key
     */
    static async increment(key) {
        let result = await FileManager._retrieveData(key);
        if (result) {
            result = parseInt(result) + 1;
        } else {
            result = 1;
        }
        FileManager._storeData(key, String(result));
        return result;
    }

    /**
    * 
    * @param {string} key - decrements the integer in local storage with parameter key
    */
    static async decrement(key) {
        let result = await FileManager._retrieveData(key);
        if (result) {
            result = parseInt(result) - 1;
        } else {
            result = 0;
        }
        FileManager._storeData(key, String(result));
        return result;
    }
}