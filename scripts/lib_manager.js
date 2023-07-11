import FileManager from "../scripts/file_manager.js";
import Lib from "../scripts/lib.js";

export default class LibManager {
    static libs = {
        "libs": [{
            "name": "Loading libs...",
            "id": 0,
            "text": [
                "This is a ",
                " text. It is called ",
                ""
            ],
            "suggestions": [
                "Adjective",
                "Name"
            ],
            "words": [
                "funny",
                "Cool text"
            ]
        }]
    }

    static async initialize() {
        await LibManager.loadLibsToMemory();
    }

    /**
     * 
     * @returns Returns a JS object with all libs in Lib object format (Can also use the LibManager.libs variable!)
     */
    static async getLibs(key = "libs") {
        let libs = await FileManager._retrieveData(key);
        if (libs != null || libs != undefined) {
            return LibManager.libJsonToJSObjectWithLib(JSON.parse(libs));
        } else {
            FileManager._storeData(key, LibManager.defaultLibs);
            return LibManager.libJsonToJSObjectWithLib(JSON.parse(LibManager.defaultLibs));
        }
    }

    /**
     * Loads all libs to the LibManager.libs variable. This is to prevent having to read from a file every time the system requests a lib, which would require asynchronous calls.
     */
    static async loadLibsToMemory() {
        LibManager.libs = await LibManager.getLibs();
    }

    /**
     * 
     * @param {The lib that will be stored to a local file} lib 
     * @param {The key for the file storage location} key 
     */
    static storeLib(lib, key = "libs") {
        if (lib.id || key != "stories") {
            LibManager.libs[key][parseInt(lib.id)] = lib;
            FileManager._storeData("libs", JSON.stringify(LibManager.libs));
        } else {
            lib.id = LibManager.libs[key].length;
            LibManager.libs[key].push(lib);
            FileManager._storeData("libs", JSON.stringify(LibManager.libs));
        }
    }

    /**
     * Loads libs written by the Fun Libs team
     * TO DO: Load from a JSON file (Not doing it now because it is added complexity that might break)
     */
    static get defaultLibs() {
        return '{"libs":[{"name":"First Lib","id":0,"text":["This is a "," text. It is called ",""],"suggestions":["Adjective","Name"]},{"name":"Second lib","id":1,"text":["This is a "," text. It is called ",""],"suggestions":["Adjective","Name for a text"]}],"stories":[{"name":"Lib story 1","id":0,"text":["This is a "," text. It is called ",""],"suggestions":["Adjective","Name"],"words":["funny","Cool text"]},{"name":"Lib story 2","id":1,"text":["This is a "," text. It is called ",""],"suggestions":["Adjective","Name for a text"],"words":["funny","Stupid text"]}],"yourLibs":[{"name":"YourLib 1","id":0,"text":["This is a "," text. It is called ",""],"suggestions":["Adjective","Name"]},{"name":"Your Lib 2","id":1,"text":["This is a "," text. It is called ",""],"suggestions":["Adjective","Name for a text"]}]}';
    }

    static getLibByID(id, key = "libs") {
        let lib = LibManager.libs[key][parseInt(id)];
        return lib;
    }

    /**
     * 
     * @param {All libs, stories and your libs in a JSON format. To be converted to a JS object with Lib objects} json 
     * @returns Array of lib objects
     */
    static libJsonToJSObjectWithLib(json) {
        let dict = {
            "libs": [],
            "stories": [],
            "yourLibs": []
        };
        for (let i = 0; i < json["libs"].length; i++) {
            if (json["libs"][i].words) {
                dict["libs"].push(new Lib(json["libs"][i].name, json["libs"][i].id, json["libs"][i].text, json["libs"][i].suggestions, json["libs"][i].words));
            } else {
                dict["libs"].push(new Lib(json["libs"][i].name, json["libs"][i].id, json["libs"][i].text, json["libs"][i].suggestions));
            }
        }
        for (let i = 0; i < json["stories"].length; i++) {
            if (json["stories"][i].words) {
                dict["stories"].push(new Lib(json["stories"][i].name, json["stories"][i].id, json["stories"][i].text, json["stories"][i].suggestions, json["stories"][i].words));
            } else {
                dict["stories"].push(new Lib(json["stories"][i].name, json["stories"][i].id, json["stories"][i].text, json["stories"][i].suggestions));
            }
        }
        for (let i = 0; i < json["yourLibs"].length; i++) {
            if (json["yourLibs"][i].words) {
                dict["yourLibs"].push(new Lib(json["yourLibs"][i].name, json["yourLibs"][i].id, json["yourLibs"][i].text, json["yourLibs"][i].suggestions, json["yourLibs"][i].words));
            } else {
                dict["yourLibs"].push(new Lib(json["yourLibs"][i].name, json["yourLibs"][i].id, json["yourLibs"][i].text, json["yourLibs"][i].suggestions));
            }
        }
        /*for (let i = 0; i < json.length; i++) {
            if (json[i].words) {
                result.push(new Lib(json[i].name, json[i].id, json[i].text, json[i].suggestions, json[i].words));
            } else {
                result.push(new Lib(json[i].name, json[i].id, json[i].text, json[i].suggestions));
            }
        }*/
        return dict;
    }
}