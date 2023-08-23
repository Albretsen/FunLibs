export default class Analytics {
    // Production flag. Used all throughout the codebase.
    static production = false;

    static log(message) {
        if (!this.production) {
            console.log(message);
        }
    }
}