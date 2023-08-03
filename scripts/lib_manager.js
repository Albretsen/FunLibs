import FileManager from "../scripts/file_manager.js";
import Lib from "../scripts/lib.js";
import libs from '../assets/libs.json'; 

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
        //console.log(JSON.stringify(LibManager.libs["libs"]));
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
        return JSON.stringify(libs);
    }

    static getPromptExplanation(prompt) {
        const explanations = {
            "adjective": "Adjective: describes something.",
            "verb": "Verb: shows action or being.",
            "noun": "Noun: name for a person, place, or thing.",
            "proper noun": "Proper Noun: name for specific things, people, and places.",
            "superlative": "Superlative: fastest, best, etc.",
            "occupation": "Occupation: job title.",
            "profession": "Profession: job title."
        };
    
        // Regular expression to extract the first word from the input string
        const keywordMatch = prompt.match(/^\w+/);
        const keyword = keywordMatch ? keywordMatch[0].toLowerCase() : "";
    
        return explanations[keyword] || " ";
    }

    static getPromptFill(prompt) {
        if (prompt === "NaN" || prompt === null || prompt === "") return "";
        const fill = {
            "adjective": ["blue", "tacky", "sassy", "groovy", "fantabulous", "awesome", "snazzy", "goofy", "dope", "stellar", "wacky", "zany", "bizarre", "funky", "quirky", "spiffy", "gnarly", "epic", "radical", "fabulous", "bubbly", "silly", "crazy", "gigantic", "marvelous", "hilarious", "fierce", "chill", "tubular", "hilarious", "nifty", "smashing", "chillaxing", "stellar", "swell"],
            "verb": ["drink", "jump", "fly", "dance", "sing", "frolic", "laugh", "skate", "surf", "chillax", "yodel", "dab", "moonwalk", "boogie", "twerk", "high-five", "whoop", "floss", "swoosh", "wobble", "gallop", "belly-flop", "sizzle", "bamboozle", "splish-splash", "wiggle", "twirl", "giggle", "noodle", "snicker", "shimmer", "zest", "glide", "shuffle", "exclaim"],
            "noun": ["cat", "hat", "banana", "penguin", "unicorn", "narwhal", "taco", "donut", "pickle", "rainbow", "marshmallow", "sneaker", "pineapple", "jellybean", "toaster", "koala", "bumblebee", "flamingo", "ninja", "giraffe", "cupcake", "chinchilla", "panda", "robot", "sushi", "lollipop", "bubblegum", "rocket", "watermelon", "gummy bear", "doodle", "wonderland", "glimmer", "munchkin", "chatter", "magic"],
            "plural noun": ["friends", "wizards", "unicorns", "narwhals", "tacos", "donuts", "pickles", "rainbows", "marshmallows", "sneakers", "pineapples", "jellybeans", "koalas", "bumblebees", "flamingos", "ninjas", "giraffes", "cupcakes", "chinchillas", "pandas", "robots", "sushis", "lollipops", "bubblegums", "rockets", "watermelons", "gummy bears", "doodles", "wonderlands", "glimmers", "munchkins", "chatters", "magics", "whimsies", "dazzles", "fizzles", "zaps"],
            "noun (plural)": ["friends", "wizards", "unicorns", "narwhals", "tacos", "donuts", "pickles", "rainbows", "marshmallows", "sneakers", "pineapples", "jellybeans", "koalas", "bumblebees", "flamingos", "ninjas", "giraffes", "cupcakes", "chinchillas", "pandas", "robots", "sushis", "lollipops", "bubblegums", "rockets", "watermelons", "gummy bears", "doodles", "wonderlands", "glimmers", "munchkins", "chatters", "magics", "whimsies", "dazzles", "fizzles", "zaps"],
            "nouns": ["adventures", "jubilation", "mischief", "whimsy", "happiness", "laughter", "wonders", "shenanigans", "dreams", "fantasies", "frolics", "silliness", "delights", "bliss", "thrills", "giggles", "wanderlust", "curiosity", "sparkle", "jazz", "charm", "glitter", "glimpse", "snickers", "gadgets", "wonderment", "merriment", "zestiness", "gusto", "wittiness", "quirkiness", "snuggles", "tickles", "bubbles", "whispers", "wobbles"],
            "proper noun": ["Zorg", "Nebula", "Mystique", "Waldo", "Bumblewump", "Whimsydale", "Bamboozleton", "Fizzleton", "Sprocket", "Twizzlebottom", "Snickerdoodle", "Zippity", "Kazoink", "Wobbleworth", "Fluffernutter", "Wigglesworth", "Peachbottom", "Sassafras", "Snicklefritz", "Muffinpuff", "Whifflepuff", "Zazzlebee", "Wiggletail", "Skedoodle", "Glimmerglen", "Fiddlesticks", "Bumblewhiff", "Dazzlefoot", "Sizzlepop", "Wigglesnort", "Glimmerwump", "Snickerwhip", "Bamboozlewump", "Fluffernoodle", "Zanytooth", "Whimsysnort", "Sprocketwhip"],
            "superlative": ["craziest", "largest", "silliest", "happiest", "zaniest", "greatest", "funkiest", "coolest", "sparkliest", "weirdest", "wildest", "grooviest", "fiercest", "fluffiest", "bounciest", "swooshiest", "snazziest", "snuggliest", "quickest", "zappiest", "giganticest", "marvelousest", "tastiest", "dreamiest", "proudest", "splashiest", "bamboozliest", "awesome-est", "dazzliest", "swell-est", "spiffiest", "quirkiest", "giggle-tastic", "glimmerific", "zestiest"],
            "occupation": ["accountant", "teacher", "pirate", "astronaut", "ninja", "superhero", "wizard", "space cowboy", "fashion designer", "detective", "pop star", "mad scientist", "juggler", "clown", "chocolatier", "treasure hunter", "time traveler", "dragon trainer", "toymaker", "circus performer", "taco taste tester", "unicorn wrangler", "robotic engineer", "candy alchemist", "cookie inspector", "bubbleologist", "inventor of rainbows", "chief laughter officer", "official tickle monster", "fantasy author", "chief adventure architect", "happiness ambassador", "chief of wizardry", "professor of silliness", "mirth maker", "director of dreams"],
            "profession": ["firewatch", "assistant to the regional manager", "time travel consultant", "director of fun and games", "chief meme officer", "wizarding supplies specialist", "chief unicorn herder", "chief mischief officer", "master of pranks", "head of bubble wrap design", "supreme pizza critic", "chief adventure officer", "executive doodler", "celestial cartographer", "vibe curator", "supreme happiness engineer", "ambassador of laughter", "chief of whimsy", "master of chill vibes", "chief of silliness", "professor of awesomeness", "chief of shenanigans", "head of dream weaving", "captain of the laughter brigade", "supreme doodle artist", "chief of imagination", "commander of the dance floor", "architect of joy", "chief of wonderment", "executive dreamweaver", "captain of cheerfulness", "sultan of sparkle", "jester of joy", "champion of laughter", "czar of curiosity"],
            "animal": ["penguin", "narwhal", "koala", "bumblebee", "flamingo", "giraffe", "chinchilla", "panda", "sloth", "elephant", "octopus", "kangaroo", "zebra", "polar bear", "chameleon", "hedgehog", "jellyfish", "peacock", "lemur", "platypus", "pangolin", "butterfly", "meerkat", "dolphin", "otter", "cheetah", "gorilla", "unicorn", "dragon", "griffin", "phoenix", "mermaid", "sphinx", "yeti", "centaur"],
            "animal (plural)": ["penguins", "narwhals", "koalas", "bumblebees", "flamingos", "giraffes", "chinchillas", "pandas", "sloths", "elephants", "octopuses", "kangaroos", "zebras", "polar bears", "chameleons", "hedgehogs", "jellyfish", "peacocks", "lemurs", "platypuses", "pangolins", "butterflies", "meerkats", "dolphins", "otters", "cheetahs", "gorillas", "unicorns", "dragons", "griffins", "phoenixes", "mermaids", "sphinxes", "yetis", "centaurs"],
            "animals": ["penguin", "narwhal", "koala", "bumblebee", "flamingo", "giraffe", "chinchilla", "panda", "sloth", "elephant", "octopus", "kangaroo", "zebra", "polar bear", "chameleon", "hedgehog", "jellyfish", "peacock", "lemur", "platypus", "pangolin", "butterfly", "meerkat", "dolphin", "otter", "cheetah", "gorilla", "unicorn", "dragon", "griffin", "phoenix", "mermaid", "sphinx", "yeti", "centaur"],
            "place": ["enchanted forest", "wonderland", "dreamscape", "candyland", "whimsical garden", "magic castle", "cosmic realm", "laughing meadow", "serendipity square", "jubilation junction", "fairy tale land", "merry-go-round", "chocolate factory", "giggle mountain", "rainbow valley", "whimsyville", "bubblegum beach", "unicorn meadow", "wonder world", "chuckle town", "glimmer glen", "joyful island", "sparkle city", "laughing lagoon", "fantastic falls", "giggleopolis", "gleeful galaxy", "blissful bay", "sugarplum skies"],
            "name": ["Whimsy", "Bubbles", "Sunny", "Twinkle", "Jazz", "Chuckles", "Fable", "Ziggy", "Glimmer", "Frost", "Breezy", "Misty", "Zephyr", "Fizz", "Snicker", "Pip", "Zigzag", "Zest", "Zany", "Zigzag", "Wiggles", "Woozy", "Fluffy", "Dazzle", "Whiffle", "Sizzle", "Nibbles", "Zippy", "Giggle", "Doodle", "Jolly", "Giggle", "Snoozy", "Sunny", "Whiffy", "Wiggle"],
            "city": ["Whimsyville", "Giggletown", "Mirthburg", "Chuckleburg", "Laughington", "Smilesville", "Joyopolis", "Gleeville", "Blissburgh", "Giggleton", "Jovialburg", "Chortleburg", "Cheerland", "Wonderville", "Merryburg", "Charmville", "Jubilant City", "Delightville", "Jollityville", "Witburg", "Jesterville", "Jocundburg", "Ecstasyburg", "Feliciton", "Gaietyburg", "Jubilopolis", "Merrimenton", "Glamourburg", "Frolicburg", "Serenityburg", "Pleasureville", "Guffawburg", "Merrymakington", "Radiantburg", "Cheerfulburg"],
            "material": ["glitter", "sparkle", "rainbows", "bubblegum", "cotton candy", "pixie dust", "stardust", "sugar", "marshmallow", "magic", "dreams", "whimsy", "chocolate", "gumdrops", "laughter", "fairy lights", "confetti", "wishes", "jelly beans", "happiness", "unicorns", "glimmer", "fizz", "zest", "fluff", "sprinkles", "bubbles", "snickers", "silliness", "delights", "bliss", "glamour", "giggle", "dazzle", "sizzle", "whispers"],
            "emotion": ["joy", "bliss", "happiness", "giggles", "glee", "delight", "mirth", "exhilaration", "jubilation", "euphoria", "ecstasy", "merriment", "glee", "elation", "enthusiasm", "jolliness", "gusto", "hilarity", "gaiety", "joviality", "euphoria", "zest", "felicity", "rapture", "cheerfulness", "jocundity", "frolicsomeness", "rapture", "mirthfulness", "blitheness", "jollity", "exuberance", "radiance", "cheeriness", "guffaw"],
            "body part": ["heart", "soul", "smile", "twinkle", "sparkle", "giggle", "glitter", "grin", "hug", "dance", "wink", "chuckle", "tummy", "glimmer", "twirl", "zest", "fizz", "wiggle", "jiggle", "pinky", "glisten", "flutter", "tickle", "waddle", "skip", "bounce", "nuzzle", "gaze", "sizzle", "blink", "snicker", "wonder", "gusto", "gaze", "whisper", "glimpse"],
            "body parts": ["hearts", "souls", "smiles", "twinkles", "sparkles", "giggles", "glitters", "grins", "hugs", "dances", "winks", "chuckles", "tummies", "glimmers", "twirls", "zests", "fizzes", "wiggles", "jiggles", "pinkies", "glistens", "flutters", "tickles", "waddles", "skips", "bounces", "nuzzles", "gazes", "sizzles", "blinks", "snickers", "wonders", "gustos", "gazes", "whispers", "glimpses"],
            "body part (plural)": ["hearts", "souls", "smiles", "twinkles", "sparkles", "giggles", "glitters", "grins", "hugs", "dances", "winks", "chuckles", "tummies", "glimmers", "twirls", "zests", "fizzes", "wiggles", "jiggles", "pinkies", "glistens", "flutters", "tickles", "waddles", "skips", "bounces", "nuzzles", "gazes", "sizzles", "blinks", "snickers", "wonders", "gustos", "gazes", "whispers", "glimpses"],
            "famous person": ["Willy Wonka", "Mary Poppins", "Frodo Baggins", "Elvis Presley", "Marilyn Monroe", "Mr. Bean", "Charlie Chaplin", "Fred Astaire", "Lucille Ball", "Charlie Brown", "Homer Simpson", "Wonder Woman", "Sherlock Holmes", "Yoda", "Indiana Jones", "Captain Jack Sparrow", "Superman", "Beyoncé", "Michael Jackson", "Albert Einstein", "Harry Potter", "Captain America", "Mickey Mouse", "Dumbledore", "Spider-Man", "James Bond", "Winnie the Pooh", "SpongeBob SquarePants", "Darth Vader", "Madonna", "Marie Curie", "Leonardo da Vinci", "Daffy Duck", "Oprah Winfrey"],
        };
    
        // Regular expression to extract the first word from the input string
        const keywordMatch = prompt.match(/^\w+/);
        const keyword = keywordMatch ? keywordMatch[0].toLowerCase() : "";

        if (fill[keyword] === undefined) return '"' + prompt + '"';
        return fill[keyword][Math.floor(Math.random()*fill[keyword].length)] || " ";
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