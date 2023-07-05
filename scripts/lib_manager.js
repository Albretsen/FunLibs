import FileManager from "../scripts/file_manager.js";
import Lib from "../scripts/lib.js";

export default class LibManager {
    static libs;

    static async initialize() {
        await LibManager.loadLibsToMemory();
    }

    /**
     * Loads all libs to the LibManager.libs variable. This is to prevent having to read from a file every time the system requests a lib, which would require asynchronous calls.
     */
    static async loadLibsToMemory() {
        LibManager.libs = await LibManager.libs();
    }

    /**
     * 
     * @returns Returns an array of all libs (Can also use the LibManager.libs variable!)
     */
    static async libs(key = "libs") {
        let libs = await FileManager._retrieveData(key);
        if (libs != null || libs != undefined) {
            return LibManager.libJsonToLibArray(JSON.parse(libs));
        } else {
            FileManager._storeData(key, LibManager.defaultLibs);
            return LibManager.libJsonToLibArray(JSON.parse(LibManager.defaultLibs));
        }
    }

    /**
     * 
     * @param {The lib that will be stored to a local file} lib 
     * @param {The key for the file storage location} key 
     */
    static storeLib(lib, key) {
        if (lib.id) {
            LibManager.libs[parseInt(lib.id)] = lib;
            FileManager._storeData(key, JSON.stringify(LibManager.libs));
        } else {
            lib.id = LibManager.libs.length;
            LibManager.libs.push(lib);
            FileManager._storeData(key, JSON.stringify(LibManager.libs));
        }
    }

    /**
     * Loads libs written by the Fun Libs team
     * TO DO: Load from a JSON file (Not doing it now because it is added complexity that might break)
     */
    static get defaultLibs() {
        return '[{"name":"Lib Name","id":0,"text":["This is a "," text. It is called ",""],"suggestions":["Adjective","Name"],"words":["funny","Cool text"]},{"name":"Second lib","id":1,"text":["This is a "," text. It is called ",""],"suggestions":["Adjective","Name for a text"],"words":["funny","Stupid text"]}]';
    }

    static getLibByID(id) {
        let lib = LibManager.libs[parseInt(id)];
        return lib;
    }

    /**
     * 
     * @param {Array in JSON format. To be converted to array of lib objects} json 
     * @returns Array of lib objects
     */
    static libJsonToLibArray(json) {
        let result = [];
        for (let i = 0; i < json.length; i++) {
            if (json[i].words) {
                result.push(new Lib(json[i].name, json[i].id, json[i].text, json[i].suggestions, json[i].words));
            } else {
                result.push(new Lib(json[i].name, json[i].id, json[i].text, json[i].suggestions));
            }
        }
        return result;
    }
}