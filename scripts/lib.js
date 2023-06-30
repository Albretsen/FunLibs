class Lib {
    words;

    constructor(name, id, text, suggestions, words = []) {
        this.name = name;
        this.id = id;
        this.text = text;
        this.suggestions = suggestions;
        this.words = words;
    }

    get display() {
        let text = ""
        for (let i = 0; i < this.text.length || i < this.words.length; i++) {
            if (this.text[i] != undefined) text += this.text[i];
            if (this.words[i] != undefined) text += this.words[i];
        }
        return text;
    }
}

let lib = new Lib("Name", 0, ["This is a ", " text"], ["Adjective"], ["funny"])
console.log(lib.display);