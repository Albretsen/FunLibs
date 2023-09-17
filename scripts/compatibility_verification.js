import FileManager from "./file_manager";
import FirebaseManager from "./firebase_manager";
import LibManager from "./lib_manager";

export default class CompatibilityVerification {

    static newestVersion = "4";

    static version = "";

    static RunCompatibilityVerification = async () => {
        this.version = await FileManager._retrieveData("version");
        if (this.version !== this.newestVersion) {
            console.log("Bad version detected. Deleting data");
            await FileManager._storeData("libs", "");
            await FileManager._storeData("read", "");
            await FileManager._storeData("my_content", "");
            await FileManager._storeData("version", this.newestVersion);
            await LibManager.initialize();
            await FirebaseManager.RefreshList(null);

        } else {
            console.log("Version OK. (Version " + this.newestVersion + ")");
        }
    }
}