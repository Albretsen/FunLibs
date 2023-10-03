import FileManager from "./file_manager";
import FirebaseManager from "./firebase_manager";
import LibManager from "./lib_manager";

export default class CompatibilityVerification {

    static newestVersion = "5";

    static version = "";

    static RunCompatibilityVerification = async () => {
        this.version = await FileManager._retrieveData("version");
        if (parseInt(this.version) < parseInt(this.newestVersion)) {
            console.log("Old version detected. Running old account recovery scheme.");
            try {
                this.UploadAccount();
            } catch {
                console.log("Old account recovery scheme failed.")
            }
            await FileManager._storeData("version", this.newestVersion);
            console.log("Version number updated.");
            /*await LibManager.initialize();
            await FirebaseManager.RefreshList(null);*/

        } else {
            console.log("Version OK. (Version " + this.newestVersion + ")");
        }
    }

    static UploadAccount = async () => {
        let localData = await FileManager._retrieveData("authData");
        let localAuthData = JSON.parse(localData).auth;
        if (localAuthData?.uid) {
            if (localAuthData.uid.length > 5) {
                console.log("Local account looks valid, uploading...");
                FirebaseManager.AddUserDataToDatabase(localAuthData);
                FirebaseManager.storeUsername(localAuthData.displayName, localAuthData.uid);
                console.log("Local account has been uploaded.");
            }
        } else {
            console.log("Local account data is not valid. Recovery scheme failed.");
        }
    }
}