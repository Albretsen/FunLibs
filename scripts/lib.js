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
     * Converts user-generated input into a Lib object for mad libs.
     *
     * @param {string} text - A user-generated string with placeholders in double quotes.
     * @param {string} name - Name of the Lib object.
     * @returns {Lib} A Lib object containing the extracted text and suggestions.
     */
    static createLib(text, name) {
        const textResult = [];
        const suggestionsResult = [];
        const regex = /"([^"]+)"/g;

        let match;
        let lastIndex = 0;

        while ((match = regex.exec(text)) !== null) {
            const suggestion = match[1];
            const textBeforeSuggestion = text.substring(lastIndex, match.index);
            lastIndex = regex.lastIndex;

            textResult.push(textBeforeSuggestion);
            suggestionsResult.push(suggestion);
        }

        // Add the remaining text after the last suggestion, if any.
        if (lastIndex < text.length) {
            textResult.push(text.substring(lastIndex));
        }

        return new Lib(name, 0, textResult, suggestionsResult);
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