import FileManager from "../scripts/file_manager.js";
import Lib from "../scripts/lib.js";

export default class LibManager {
    static libs;

    static initialize() {
        LibManager.loadLibsToMemory();
    }

    static async loadLibsToMemory() {
        LibManager.libs = await LibManager.libs();
    }

    static async libs() {
        let libs = await FileManager._retrieveData("libs");
        if (libs != null || libs != undefined) {
            return JSON.parse(libs);
        } else {
            FileManager._storeData("libs", LibManager.defaultLibs);
            return JSON.parse(LibManager.defaultLibs);
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
        return new Lib(lib.name, lib.id, lib.text, lib.suggestions);
    }
}