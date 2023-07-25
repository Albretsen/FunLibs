export default class Lib {
    words;

    constructor(name, id, text, prompts, words = []) {
        this.name = name;
        this.id = id;
        this.text = text;
        this.prompts = prompts;
        this.words = words;
    }

    /**
     * Converts user-generated input into a Lib object for mad libs.
     *
     * @param {string} text - A user-generated string with placeholders in double quotes.
     * @param {string} name - Name of the Lib object.
     * @returns {Lib} A Lib object containing the extracted text and suggestions.
     */
    static createLib(text, name) {
        const textResult = [];
        const promptResult = [];
        const regex = /"([^"]+)"/g;

        let match;
        let lastIndex = 0;

        let i = 0;
        let x = 0;
        while ((match = regex.exec(text)) !== null) {
            const suggestion = match[1];
            const textBeforeSuggestion = text.substring(lastIndex, match.index);
            lastIndex = regex.lastIndex;

            if (i !== 0) textResult.push(textBeforeSuggestion);
            if (isNum(suggestion.slice(-1))) {
                let found = false;
                for (let j = 0; j < promptResult.length; j++) {
                    try {
                        promptResult[j][suggestion].push(x*2);
                        textResult.push(suggestion);
                        found = true;
                        break;
                    } catch { }
                }
                if (!found) { 
                    promptResult[i] = { [suggestion]: [x*2] };
                    textResult.push(suggestion); 
                    i++;
                }
            } else {
                promptResult[i] = { [suggestion]: [x*2] };
                textResult.push(suggestion);
                i++;
            }
            x++;
        }

        // Add the remaining text after the last suggestion, if any.
        if (lastIndex < text.length) {
            textResult.push(text.substring(lastIndex));
        }

        console.log(JSON.stringify(new Lib(name, 0, textResult, promptResult)));
        return new Lib(name, 0, textResult, promptResult);
    }
    
    /**
     * @returns Returns a readable story by combining the text with the user-inputted words
     */
    get display() {
        return this.text.join("");
    }

    /**
     * 
     */
    static removeDuplicates(array) {
        let result = [];
        for (let i = 0; i < array.length; i++) {
            if (isNum(array[i][array[i].length - 1])) {
                if(!result.includes(array[i]))
                    result.push(array[i]);
            } else {
                result.push(array[i]);
            }
        }
        return result;
    }
}

function isNum(n) {
    return /.*[0-9].*/.test(n);
}

//let lib = new Lib("Name", 0, ["This is a ", " text"], ["Adjective"], ["funny"])
//console.log(lib.display);
//let lib = Lib.createLib('This is a "Adjective" text. "Noun"');
//lib.words = ["beautiful", "Box"];
//console.log(lib.display);