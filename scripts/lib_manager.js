import FileManager from "../scripts/file_manager.js";
import Lib from "../scripts/lib.js";

export default class LibManager {
    static libs = {
        "libs": [{
            "name": "Loading libs...",
            "id": 0,
            "text": [
                "Adjective: ",
                " Name 1: ",
                " Noun: ",
                " Adjective: ",
                " Name 1"
            ],
            "words": [
                "funny",
                "Cool text"
            ],
            "prompts": [{"Adjective": [0]}, {"Name 1": [1, 4]}, {"Noun": [2]}, {"Adjective": [3]}]
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
        lib = JSON.parse(JSON.stringify(lib));
        lib = new Lib(lib.name, lib.id, lib.text, lib.prompts);
        if ((lib.id || lib.id == 0) && key === "libs") {
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
        return '{"libs":[{"name":"First lib","id":0,"text":[""," builds a ",""," house. ",""," is a carpenter, and he is ","","."],"prompts":[{"Name 1":[0,4]},{"Adjective":[2]},{"Adjective":[6]}],"words":[]},{"name":"Second lib","id":1,"text":[""," builds a ",""," house. ",""," is a carpenter, and he is ","","."],"prompts":[{"Name 1":[0,4]},{"Adjective":[2]},{"Adjective":[6]}],"words":[]}],"stories":[{"name":"Lib story 1","id":0,"text":["Adjective: ",""," Name 1: ",""," Noun: ",""," Adjective: ",""," Name 1",""],"prompts":[{"Adjective":[1]},{"Name 1":[3,9]},{"Noun":[5]},{"Adjective":[7]}],"words":["funny","Cool text"]},{"name":"Lib story 2","id":1,"text":["Adjective: ",""," Name 1: ",""," Noun: ",""," Adjective: ",""," Name 1",""],"prompts":[{"Adjective":[0]},{"Name 1":[1,4]},{"Noun":[2]},{"Adjective":[3]}],"words":["funny","Stupid text"]}],"yourLibs":[{"name":"YourLib 1","id":0,"text":["This is a "," text. It is called ",""],"prompts":[{"Adjective":[0]},{"Name 1":[1,4]},{"Noun":[2]},{"Adjective":[3]}]},{"name":"Your Lib 2","id":1,"text":["This is a "," text. It is called ",""],"prompts":[{"Adjective":[0]},{"Name 1":[1,4]},{"Noun":[2]},{"Adjective":[3]}]}]}';
    }

    static getPromptExplanation(prompt) {
        console.log(prompt);
        const explanations = {
            "adjective": "Adjective: describes something.",
            "verb": "Verb: shows action or being.",
            "noun": "Noun: name for a person, place, or thing.",
            "superlative": "Superlative: fastest, best, etc.",
            "occupation": "Occupation: job title."
        };

        // Regular expression to extract the first word from the input string
        const keywordMatch = prompt.match(/\b\w+\b/);
        const keyword = keywordMatch ? keywordMatch[0].toLowerCase() : "";

        return explanations[keyword] || " ";
    }

    /**
     * 
     */
    static deleteLib(id, type) {
        for (let i = 0; i < LibManager.libs[type].length; i++) {
            if (LibManager.libs[type][i].id == id) LibManager.libs[type].splice(i, 1);
        }
        for (let i = 0; i < LibManager.libs[type].length; i++) {
            LibManager.libs[type][i].id = i;
        }
        FileManager._storeData("libs", JSON.stringify(LibManager.libs));
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
                dict["libs"].push(new Lib(json["libs"][i].name, json["libs"][i].id, json["libs"][i].text, json["libs"][i].prompts, json["libs"][i].words));
            } else {
                dict["libs"].push(new Lib(json["libs"][i].name, json["libs"][i].id, json["libs"][i].text, json["libs"][i].prompts));
            }
        }
        for (let i = 0; i < json["stories"].length; i++) {
            if (json["stories"][i].words) {
                dict["stories"].push(new Lib(json["stories"][i].name, json["stories"][i].id, json["stories"][i].text, json["stories"][i].prompts, json["stories"][i].words));
            } else {
                dict["stories"].push(new Lib(json["stories"][i].name, json["stories"][i].id, json["stories"][i].text, json["stories"][i].prompts));
            }
        }
        for (let i = 0; i < json["yourLibs"].length; i++) {
            if (json["yourLibs"][i].words) {
                dict["yourLibs"].push(new Lib(json["yourLibs"][i].name, json["yourLibs"][i].id, json["yourLibs"][i].text, json["yourLibs"][i].prompts, json["yourLibs"][i].words));
            } else {
                dict["yourLibs"].push(new Lib(json["yourLibs"][i].name, json["yourLibs"][i].id, json["yourLibs"][i].text, json["yourLibs"][i].prompts));
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