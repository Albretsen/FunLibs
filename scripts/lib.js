export default class Lib {
    words;

    constructor(name, id, text, suggestions, words = []) {
        this.name = name;
        this.id = id;
        this.text = text;
        this.suggestions = suggestions;
        this.words = words;
    }

    /**
     * 
     * @param {A user-generated string that will be converted into a lib object} text 
     * @returns A Lib object
     */
    static createLib(text) {
        let textResult = [];
        let suggestionsResult = [];
        let wordStartIndex = null;

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '"') {
                if (wordStartIndex) {
                    let j = Infinity;
                    for (j = wordStartIndex - 1; j >= 0; j--) {
                        if (text[j] === '"') {
                            break;       
                        }
                    }
                    textResult.push(text.substr(j + 1, wordStartIndex - (j + 1)));
                    suggestionsResult.push(text.substr(wordStartIndex + 1, i - (wordStartIndex + 1)));
                    wordStartIndex = null;
                } else {
                    wordStartIndex = i;
                }
            }
        }

        return new Lib("TestLib", 0, textResult, suggestionsResult);
    }
    
    /**
     * @returns Returns a readable story by combining the text with the user-inputted words
     */
    get display() {
        let text = ""
        for (let i = 0; i < this.text.length || i < this.words.length; i++) {
            if (this.text[i] != undefined) text += this.text[i];
            if (this.words[i] != undefined) text += this.words[i];
        }
        return text;
    }
}

//let lib = new Lib("Name", 0, ["This is a ", " text"], ["Adjective"], ["funny"])
//console.log(lib.display);
//let lib = Lib.createLib('This is a "Adjective" text. "Noun"');
//lib.words = ["beautiful", "Box"];
//console.log(lib.display);