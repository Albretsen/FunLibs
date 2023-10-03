import FileManager from "./file_manager";
import FirebaseManager from "./firebase_manager";
import LibManager from "./lib_manager";

export default class CompatibilityVerification {

    static newestVersion = "5";

    static version = "";

    static RunCompatibilityVerification = async () => {
        this.version = await FileManager._retrieveData("version");
        if (parseInt(this.version) < parseInt(this.newestVersion)) {
            console.log("old version detected!");
        } else {
            console.log("Version OK. (Version " + this.newestVersion + ")");
        }
    }
}