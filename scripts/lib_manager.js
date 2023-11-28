import FileManager from "../scripts/file_manager.js";
import Lib from "../scripts/lib.js";
import officialLibs from '../assets/officialLibs.json';
import globalStyles from "../styles/globalStyles.js";
import { Text } from "react-native";
import nlp from "compromise";
import FirebaseManager from "./firebase_manager.js";

export default class LibManager {

    static libs = {}

    static localLibs = []

    static async initialize() {
        //await LibManager.loadLibsToMemory();

        LibManager.localLibs = [...LibManager.localLibs, ...officialLibs];
    }

    /**
     * 
     * @returns Returns a JS object with all libs in Lib object format (Can also use the LibManager.libs variable!)
     */
    static async getLibs(key = "libs") {
        let libs = await FileManager._retrieveData(key);
        console.log("libs: " + !libs);
        if (libs) {
            return JSON.parse(libs);
        } else {
            FileManager._storeData(key, LibManager.defaultLibs);
            return JSON.parse(LibManager.defaultLibs);
        }
    }

    static async initializeDefaultLibsInDatabase() {
        console.log("LENGTH: " + LibManager.libs.length)
        for (const element of LibManager.libs) {
            element.published = true;
            element.likes = 0;
            element.username = "Official";
            element.avatarID = 13;
            const now = new Date();
            const twoMonthsAgo = new Date(now);
            twoMonthsAgo.setMonth(now.getMonth() - 2);
            element.date = new Date(twoMonthsAgo.getTime() + Math.random() * (now.getTime() - twoMonthsAgo.getTime()));
            element.id = await FirebaseManager.AddDocumentToCollection("posts", element);
            await FirebaseManager.UpdateDocument("posts", element.id, { id: element.id })
        }
    }

    /**
     * Loads all libs to the LibManager.libs variable. This is to prevent having to read from a file every time the system requests a lib, which would require asynchronous calls.
     */
    static async loadLibsToMemory() {
        LibManager.libs = await LibManager.getLibs();
        //await LibManager.initializeDefaultLibsInDatabase();
        //FileManager._storeData("libs", JSON.stringify(LibManager.libs));
        //console.log(JSON.stringify(LibManager.libs));
        //let result = await FileManager._retrieveData("libs")
        //console.log(JSON.stringify(JSON.parse(result)["libs"]));
        return;
        console.log(JSON.stringify(LibManager.libs["libs"]));
        let length = LibManager.libs["libs"].length;
        for (let i = 0; i < length; i++) {
            let libClass = LibManager.libs["libs"][i];
            let lib = {};
            lib.name = libClass.name;
            lib.user = "HOv8K8Z1Q6bUuGxENrPrleECIWe2";
            lib.text = libClass.text;
            lib.prompts = libClass.prompts;
            lib.likes = Math.round(Math.random() * 100);
            lib.official = true;
            lib.playable = true;
            lib.date = getRandomDateFromLastYear();
            LibManager.libs["libs"][i] = lib;
            //FirebaseManager.AddDocumentToCollection("posts", lib);
        }

        FileManager._storeData("libs", JSON.stringify(LibManager.libs));
    }

    /**
     * 
     * @param {The lib that will be stored to a local file} lib 
     * @param {The key for the file storage location} key 
     */
    static storeLib(lib, key = "libs") {
        lib = JSON.parse(JSON.stringify(lib));
        //lib = new Lib(lib.name, lib.id, lib.text, lib.prompts);
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

    static displayInDrawer(text_) {
        // 1. Merge the array into one text
        let mergedText = "";
        for (let i = 0; i < text_.length; i++) {
            (i + 1) % 2 === 0 ? mergedText += '(' + text_[i] + ')' : mergedText += text_[i];
        }

        mergedText = fixArticles(mergedText);

        let lib = Lib.createLib(mergedText);

        return (
            <Text style={[globalStyles.fontMedium, { marginTop: 16, lineHeight: 34 }]}>
                {lib.text.map((key, index) => (
                    <Text key={key + index} style={(index + 1) % 2 === 0 ? { fontStyle: "italic", color: "#006D40" } : null}>{key}</Text>
                ))}
            </Text>
        )
    }

    static displayPreview(text_) {
        // 1. Merge the array into one text
        let mergedText = "";
        for (let i = 0; i < text_.length; i++) {
            (i + 1) % 2 === 0 ? mergedText += '(' + text_[i] + ')' : mergedText += text_[i];
        }

        mergedText = fixArticles(mergedText);

        let lib = Lib.createLib(mergedText);
    
        return (
            <Text 
                numberOfLines={3}
                ellipsizeMode="tail"
                style={[globalStyles.fontSmall, { lineHeight: 34 }]}
            >
                {lib.text.map((key, index) => (
                    <Text key={key + index} style={(index + 1) % 2 === 0 ? { fontStyle: "italic", color: "#6294C9" } : {color: "#49454F"}}>{key}</Text>
                ))}
            </Text>
        )
    }
    

    static displayForShare(text_) {
        // 1. Merge the array into one text
        let mergedText = "";
        for (let i = 0; i < text_.length; i++) {
            (i + 1) % 2 === 0 ? mergedText += '(' + text_[i] + ')' : mergedText += text_[i];
        }

        mergedText = fixArticles(mergedText);

        let lib = Lib.createLib(mergedText);

        return lib.display;
    }

    static getPromptExplanation(prompt) {
        const explanations = {
            'adjective': 'Adjective: describes something.',
            'verb': 'Verb: shows action or being.',
            'adverb': 'A word or phrase that modifies or qualifies an adjective or verb: gently, quite, then, there, etc.',
            'noun': 'Noun: name for a person, place, or thing.',
            'proper noun': 'Proper Noun: name for specific things, people, and places.',
            'superlative': 'Superlative: fastest, best, etc.',
            'occupation': 'Occupation: job title.',
            'profession': 'Profession: job title.',
            'place': 'A location: school, garden, etc.',
            'name': 'A name: John, Sizzle, Bubbles etc.',
            'town': 'The name of a small city: Townsville, Florence, etc.',
            'weather': 'The state of the weather at a particular time: rain, wind, etc.',
            'emotion': 'A feeling: sad, happy, cheerful, etc.',
            'material': 'What something is made of: sand, wood, etc.',
            'sound': 'A noise or auditory event that can be heard, such as ring, boom, quack etc.',
            'subject': 'What we learn or teach.',
            'historical figure': 'Someone from the past who did something important.',
            'book name': 'What a book is called.',
            'destination': 'Where someone or something is going.',
            'snack': 'A small amount of food.',
            'book genre': 'A type of book.',
            'food': 'What we eat to live and grow.',
            'beverage': 'Something we drink that is not water.',
            'instrument': 'A tool, often for science.',
            'festival': 'A special time of celebration.',
            'superhero': 'A made-up hero with special powers.',
            'villain': 'A bad character in a story.',
            'verb ending in -ed': 'A past action word.',
            'verb with -ing ending': 'An action word that is happening now.',
            'animal plural': 'A group of the same animals.',
            'noun plural': 'More than one person, place, or thing.',
            'ingredient': 'What is used to make a dish.',
            'spice': 'Something used to give flavor to food.',
            'city': 'A big place where lots of people live.',
            'town': 'A place where people live, smaller than a city.',
            'color': 'What we see like red, blue, or yellow.',
            'dog breed': 'A type of dog: labrador, chihuahua, poodle',
            'cooking technique': 'A way to prepare food: frying, baking, boiling',
            'dish': 'A specific food; pasta, soup, cake',
            'kitchen appliance': 'A tool for preparing food; toaster, blender.',
            'topic': 'Anything you can talk about; weather, videogames',
        };
    
        // Use compromise to get the base form of the word
        prompt = prompt.replace(/[0-9]/g, '');
        const baseForm = nlp(prompt).out('root');

        let closestKey = "";
        let minDistance = Infinity;

        for (const key in explanations) {
            if (key.includes(baseForm)) {
                const distance = levenshteinDistance(baseForm, key);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestKey = key;
                }
            }
        }

        return explanations[closestKey] || ' ';
    }

    static getPromptFill(prompt) {
        if (prompt === "NaN" || prompt === null || prompt === "") return "";
        const fill = {
            "adjective": ["blue", "tacky", "sassy", "groovy", "fantabulous", "awesome", "snazzy", "goofy", "dope", "stellar", "wacky", "zany", "bizarre", "funky", "quirky", "spiffy", "gnarly", "epic", "radical", "fabulous", "bubbly", "silly", "crazy", "gigantic", "marvelous", "hilarious", "fierce", "chill", "tubular", "hilarious", "nifty", "smashing", "chillaxing", "stellar", "swell"],
            "verb": ["drink", "jump", "fly", "dance", "sing", "frolic", "laugh", "skate", "surf", "chillax", "yodel", "dab", "moonwalk", "boogie", "twerk", "high-five", "whoop", "floss", "swoosh", "wobble", "gallop", "belly-flop", "sizzle", "bamboozle", "splish-splash", "wiggle", "twirl", "giggle", "noodle", "snicker", "shimmer", "zest", "glide", "shuffle", "exclaim"],
            "noun": ["cat", "hat", "banana", "penguin", "unicorn", "narwhal", "taco", "donut", "pickle", "rainbow", "marshmallow", "sneaker", "pineapple", "jellybean", "toaster", "koala", "bumblebee", "flamingo", "ninja", "giraffe", "cupcake", "chinchilla", "panda", "robot", "sushi", "lollipop", "bubblegum", "rocket", "watermelon", "gummy bear", "doodle", "wonderland", "glimmer", "munchkin", "chatter", "magic"],
            "plural noun": ["friends", "wizards", "unicorns", "narwhals", "tacos", "donuts", "pickles", "rainbows", "marshmallows", "sneakers", "pineapples", "jellybeans", "koalas", "bumblebees", "flamingos", "ninjas", "giraffes", "cupcakes", "chinchillas", "pandas", "robots", "sushis", "lollipops", "bubblegums", "rockets", "watermelons", "gummy bears", "doodles", "wonderlands", "glimmers", "munchkins", "chatters", "magics", "whimsies", "dazzles", "fizzles", "zaps"],
            "noun plural": ["friends", "wizards", "unicorns", "narwhals", "tacos", "donuts", "pickles", "rainbows", "marshmallows", "sneakers", "pineapples", "jellybeans", "koalas", "bumblebees", "flamingos", "ninjas", "giraffes", "cupcakes", "chinchillas", "pandas", "robots", "sushis", "lollipops", "bubblegums", "rockets", "watermelons", "gummy bears", "doodles", "wonderlands", "glimmers", "munchkins", "chatters", "magics", "whimsies", "dazzles", "fizzles", "zaps"],
            "nouns": ["adventures", "jubilation", "mischief", "whimsy", "happiness", "laughter", "wonders", "shenanigans", "dreams", "fantasies", "frolics", "silliness", "delights", "bliss", "thrills", "giggles", "wanderlust", "curiosity", "sparkle", "jazz", "charm", "glitter", "glimpse", "snickers", "gadgets", "wonderment", "merriment", "zestiness", "gusto", "wittiness", "quirkiness", "snuggles", "tickles", "bubbles", "whispers", "wobbles"],
            "proper noun": ["Zorg", "Nebula", "Mystique", "Waldo", "Bumblewump", "Whimsydale", "Bamboozleton", "Fizzleton", "Sprocket", "Twizzlebottom", "Snickerdoodle", "Zippity", "Kazoink", "Wobbleworth", "Fluffernutter", "Wigglesworth", "Peachbottom", "Sassafras", "Snicklefritz", "Muffinpuff", "Whifflepuff", "Zazzlebee", "Wiggletail", "Skedoodle", "Glimmerglen", "Fiddlesticks", "Bumblewhiff", "Dazzlefoot", "Sizzlepop", "Wigglesnort", "Glimmerwump", "Snickerwhip", "Bamboozlewump", "Fluffernoodle", "Zanytooth", "Whimsysnort", "Sprocketwhip"],
            "superlative": ["craziest", "largest", "silliest", "happiest", "zaniest", "greatest", "funkiest", "coolest", "sparkliest", "weirdest", "wildest", "grooviest", "fiercest", "fluffiest", "bounciest", "swooshiest", "snazziest", "snuggliest", "quickest", "zappiest", "giganticest", "marvelousest", "tastiest", "dreamiest", "proudest", "splashiest", "bamboozliest", "awesome-est", "dazzliest", "swell-est", "spiffiest", "quirkiest", "giggle-tastic", "glimmerific", "zestiest"],
            "occupation": ["accountant", "teacher", "pirate", "astronaut", "ninja", "superhero", "wizard", "space cowboy", "fashion designer", "detective", "pop star", "mad scientist", "juggler", "clown", "chocolatier", "treasure hunter", "time traveler", "dragon trainer", "toymaker", "circus performer", "taco taste tester", "unicorn wrangler", "robotic engineer", "candy alchemist", "cookie inspector", "bubbleologist", "inventor of rainbows", "chief laughter officer", "official tickle monster", "fantasy author", "chief adventure architect", "happiness ambassador", "chief of wizardry", "professor of silliness", "mirth maker", "director of dreams"],
            "profession": ["firewatch", "assistant to the regional manager", "time travel consultant", "director of fun and games", "chief meme officer", "wizarding supplies specialist", "chief unicorn herder", "chief mischief officer", "master of pranks", "head of bubble wrap design", "supreme pizza critic", "chief adventure officer", "executive doodler", "celestial cartographer", "vibe curator", "supreme happiness engineer", "ambassador of laughter", "chief of whimsy", "master of chill vibes", "chief of silliness", "professor of awesomeness", "chief of shenanigans", "head of dream weaving", "captain of the laughter brigade", "supreme doodle artist", "chief of imagination", "commander of the dance floor", "architect of joy", "chief of wonderment", "executive dreamweaver", "captain of cheerfulness", "sultan of sparkle", "jester of joy", "champion of laughter", "czar of curiosity"],
            "animal": ["penguin", "narwhal", "koala", "bumblebee", "flamingo", "giraffe", "chinchilla", "panda", "sloth", "elephant", "octopus", "kangaroo", "zebra", "polar bear", "chameleon", "hedgehog", "jellyfish", "peacock", "lemur", "platypus", "pangolin", "butterfly", "meerkat", "dolphin", "otter", "cheetah", "gorilla", "unicorn", "dragon", "griffin", "phoenix", "mermaid", "sphinx", "yeti", "centaur"],
            "animal plural": ["penguins", "narwhals", "koalas", "bumblebees", "flamingos", "giraffes", "chinchillas", "pandas", "sloths", "elephants", "octopuses", "kangaroos", "zebras", "polar bears", "chameleons", "hedgehogs", "jellyfish", "peacocks", "lemurs", "platypuses", "pangolins", "butterflies", "meerkats", "dolphins", "otters", "cheetahs", "gorillas", "unicorns", "dragons", "griffins", "phoenixes", "mermaids", "sphinxes", "yetis", "centaurs"],
            "animals": ["penguin", "narwhal", "koala", "bumblebee", "flamingo", "giraffe", "chinchilla", "panda", "sloth", "elephant", "octopus", "kangaroo", "zebra", "polar bear", "chameleon", "hedgehog", "jellyfish", "peacock", "lemur", "platypus", "pangolin", "butterfly", "meerkat", "dolphin", "otter", "cheetah", "gorilla", "unicorn", "dragon", "griffin", "phoenix", "mermaid", "sphinx", "yeti", "centaur"],
            "place": ["enchanted forest", "wonderland", "dreamscape", "candyland", "whimsical garden", "magic castle", "cosmic realm", "laughing meadow", "serendipity square", "jubilation junction", "fairy tale land", "merry-go-round", "chocolate factory", "giggle mountain", "rainbow valley", "whimsyville", "bubblegum beach", "unicorn meadow", "wonder world", "chuckle town", "glimmer glen", "joyful island", "sparkle city", "laughing lagoon", "fantastic falls", "giggleopolis", "gleeful galaxy", "blissful bay", "sugarplum skies"],
            "name": ["Whimsy", "Bubbles", "Sunny", "Twinkle", "Jazz", "Chuckles", "Fable", "Ziggy", "Glimmer", "Frost", "Breezy", "Misty", "Zephyr", "Fizz", "Snicker", "Pip", "Zigzag", "Zest", "Zany", "Zigzag", "Wiggles", "Woozy", "Fluffy", "Dazzle", "Whiffle", "Sizzle", "Nibbles", "Zippy", "Giggle", "Doodle", "Jolly", "Giggle", "Snoozy", "Sunny", "Whiffy", "Wiggle"],
            "city": ["Whimsyville", "Giggletown", "Mirthburg", "Chuckleburg", "Laughington", "Smilesville", "Joyopolis", "Gleeville", "Blissburgh", "Giggleton", "Jovialburg", "Chortleburg", "Cheerland", "Wonderville", "Merryburg", "Charmville", "Jubilant City", "Delightville", "Jollityville", "Witburg", "Jesterville", "Jocundburg", "Ecstasyburg", "Feliciton", "Gaietyburg", "Jubilopolis", "Merrimenton", "Glamourburg", "Frolicburg", "Serenityburg", "Pleasureville", "Guffawburg", "Merrymakington", "Radiantburg", "Cheerfulburg"],
            "city": ["Whimsyville", "Giggletown", "Mirthburg", "Chuckleburg", "Laughington", "Smilesville", "Joyopolis", "Gleeville", "Blissburgh", "Giggleton", "Jovialburg", "Chortleburg", "Cheerland", "Wonderville", "Merryburg", "Charmville", "Jubilant City", "Delightville", "Jollityville", "Witburg", "Jesterville", "Jocundburg", "Ecstasyburg", "Feliciton", "Gaietyburg", "Jubilopolis", "Merrimenton", "Glamourburg", "Frolicburg", "Serenityburg", "Pleasureville", "Guffawburg", "Merrymakington", "Radiantburg", "Cheerfulburg"],
            "material": ["glitter", "sparkle", "rainbows", "bubblegum", "cotton candy", "pixie dust", "stardust", "sugar", "marshmallow", "magic", "dreams", "whimsy", "chocolate", "gumdrops", "laughter", "fairy lights", "confetti", "wishes", "jelly beans", "happiness", "unicorns", "glimmer", "fizz", "zest", "fluff", "sprinkles", "bubbles", "snickers", "silliness", "delights", "bliss", "glamour", "giggle", "dazzle", "sizzle", "whispers"],
            "emotion": ["joy", "bliss", "happiness", "giggles", "glee", "delight", "mirth", "exhilaration", "jubilation", "euphoria", "ecstasy", "merriment", "glee", "elation", "enthusiasm", "jolliness", "gusto", "hilarity", "gaiety", "joviality", "euphoria", "zest", "felicity", "rapture", "cheerfulness", "jocundity", "frolicsomeness", "rapture", "mirthfulness", "blitheness", "jollity", "exuberance", "radiance", "cheeriness", "guffaw"],
            "body part": ["heart", "soul", "smile", "twinkle", "sparkle", "giggle", "glitter", "grin", "hug", "dance", "wink", "chuckle", "tummy", "glimmer", "twirl", "zest", "fizz", "wiggle", "jiggle", "pinky", "glisten", "flutter", "tickle", "waddle", "skip", "bounce", "nuzzle", "gaze", "sizzle", "blink", "snicker", "wonder", "gusto", "gaze", "whisper", "glimpse"],
            "body parts": ["hearts", "souls", "smiles", "twinkles", "sparkles", "giggles", "glitters", "grins", "hugs", "dances", "winks", "chuckles", "tummies", "glimmers", "twirls", "zests", "fizzes", "wiggles", "jiggles", "pinkies", "glistens", "flutters", "tickles", "waddles", "skips", "bounces", "nuzzles", "gazes", "sizzles", "blinks", "snickers", "wonders", "gustos", "gazes", "whispers", "glimpses"],
            "body part plural": ["hearts", "souls", "smiles", "twinkles", "sparkles", "giggles", "glitters", "grins", "hugs", "dances", "winks", "chuckles", "tummies", "glimmers", "twirls", "zests", "fizzes", "wiggles", "jiggles", "pinkies", "glistens", "flutters", "tickles", "waddles", "skips", "bounces", "nuzzles", "gazes", "sizzles", "blinks", "snickers", "wonders", "gustos", "gazes", "whispers", "glimpses"],
            "famous person": ["Willy Wonka", "Mary Poppins", "Frodo Baggins", "Elvis Presley", "Marilyn Monroe", "Mr. Bean", "Charlie Chaplin", "Fred Astaire", "Lucille Ball", "Charlie Brown", "Homer Simpson", "Wonder Woman", "Sherlock Holmes", "Yoda", "Indiana Jones", "Captain Jack Sparrow", "Superman", "Beyoncé", "Michael Jackson", "Albert Einstein", "Harry Potter", "Captain America", "Mickey Mouse", "Dumbledore", "Spider-Man", "James Bond", "Winnie the Pooh", "SpongeBob SquarePants", "Darth Vader", "Madonna", "Marie Curie", "Leonardo da Vinci", "Daffy Duck", "Oprah Winfrey"],
            "weather": ["rain", "wind", "sun", "clouds", "cold", "dry"],
            "color": ["red", "blue", "orange", "yellow", "brown", "black", "white", "pink", "lime", "teal", "purple", "magenta", "gray"],
            "sound": ["rustle", "chirp", "boom", "babble", "roar", "howl", "ring", "thunder", "splash", "buzz", "crunch", "quack"],
            "subject": ["Mathematics", "History", "Biology", "Physics", "Chemistry", "Literature", "Art", "Music", "Geography", "Computer Science", "Philosophy", "Psychology", "Economics", "Political Science", "Sociology", "Astronomy", "Environmental Science", "Linguistics", "Theology", "Physical Education"],
            "historical figure": ["Albert Einstein", "Cleopatra", "Mahatma Gandhi", "Martin Luther King Jr.", "Marie Curie", "Nelson Mandela", "Winston Churchill", "Leonardo da Vinci", "Abraham Lincoln", "Joan of Arc", "Socrates", "Christopher Columbus", "William Shakespeare", "Thomas Edison", "Adolf Hitler", "Mao Zedong", "Napoleon Bonaparte", "Charles Darwin", "Queen Victoria", "Genghis Khan"],
            "book name": ["To Kill a Mockingbird", "1984", "The Great Gatsby", "The Catcher in the Rye", "Harry Potter and the Sorcerer's Stone", "Moby-Dick", "Pride and Prejudice", "The Lord of the Rings", "The Hobbit", "Brave New World", "Jane Eyre", "The Chronicles of Narnia", "The Da Vinci Code", "The Hunger Games", "The Grapes of Wrath", "Wuthering Heights", "Frankenstein", "The Handmaid's Tale", "The Little Prince", "Alice's Adventures in Wonderland"],
            "destination": ["Paris", "New York", "Tokyo", "London", "Rome", "Sydney", "Cairo", "Rio de Janeiro", "Beijing", "Barcelona", "Amsterdam", "Istanbul", "Bangkok", "Cape Town", "Jerusalem", "Venice", "San Francisco", "Dubai", "Athens", "Machu Picchu"],
            "snack": ["Chips", "Popcorn", "Cookies", "Pretzels", "Nuts", "Crackers", "Granola Bar", "Cheese", "Fruit", "Yogurt", "Ice Cream", "Chocolate", "Candy", "Trail Mix", "Muffin", "Croissant", "Donut", "Pastry", "Pudding", "Gelato"],
            "book genre": ["Fantasy", "Science Fiction", "Mystery", "Thriller", "Romance", "Historical Fiction", "Non-Fiction", "Biography", "Autobiography", "Horror", "Drama", "Comedy", "Poetry", "Adventure", "Classic", "Graphic Novel", "Short Story", "Young Adult", "Children's", "Literary Fiction"],
            "food": ["Pizza", "Pasta", "Burger", "Sushi", "Salad", "Steak", "Sandwich", "Soup", "Tacos", "Fried Chicken", "Rice", "Noodles", "Fish", "Seafood", "Vegetables", "Fruits", "Bread", "Cheese", "Eggs", "Bacon"],
            "beverage": ["Water", "Tea", "Coffee", "Milk", "Juice", "Soda", "Lemonade", "Hot Chocolate", "Smoothie", "Wine", "Beer", "Cocktail", "Whiskey", "Vodka", "Rum", "Champagne", "Gin", "Brandy", "Liqueur", "Sports Drink"],
            "instrument": ["Piano", "Guitar", "Violin", "Drums", "Flute", "Cello", "Trumpet", "Saxophone", "Clarinet", "Harp", "Trombone", "Accordion", "Banjo", "Ukulele", "Mandolin", "Synthesizer", "Harmonica", "Bass Guitar", "Viola", "Percussion"],
            "festival": ["Christmas", "Diwali", "Easter", "Halloween", "Thanksgiving", "Hanukkah", "Chinese New Year", "Holi", "Carnival", "Oktoberfest", "Mardi Gras", "Ramadan", "St. Patrick's Day", "Valentine's Day", "New Year's Eve", "Day of the Dead", "Independence Day", "Songkran", "La Tomatina", "Burning Man"],
            "superhero": ["Superman", "Batman", "Spider-Man", "Iron Man", "Wonder Woman", "Captain America", "Thor", "Hulk", "Black Widow", "Doctor Strange", "Flash", "Green Lantern", "Aquaman", "Black Panther", "Ant-Man", "Daredevil", "Wolverine", "Deadpool", "Harley Quinn", "Supergirl"],
            "villain": ["Joker", "Thanos", "Lex Luthor", "Green Goblin", "Loki", "Magneto", "Doctor Octopus", "Red Skull", "Kingpin", "Ultron", "Two-Face", "Venom", "Darkseid", "Penguin", "Catwoman", "Sandman", "Ra's al Ghul", "Black Manta", "Mysterio", "Doctor Doom"],
            "verb ending in -ed": ["jumped", "danced", "laughed", "sang", "ran", "slept", "talked", "walked", "worked", "played", "cooked", "cleaned", "watched", "read", "wrote", "studied", "listened", "painted", "swam", "climbed"],
            "verb with -ing ending": ["jumping", "dancing", "laughing", "singing", "running", "sleeping", "talking", "walking", "working", "playing", "cooking", "cleaning", "watching", "reading", "writing", "studying", "listening", "painting", "swimming", "climbing"],
            "ingredient": ["Flour", "Sugar", "Salt", "Eggs", "Milk", "Butter", "Baking Powder", "Vanilla Extract", "Cocoa Powder", "Honey", "Yeast", "Olive Oil", "Water", "Cream", "Cheese", "Lemon Juice", "Garlic", "Onion", "Tomato", "Cinnamon"],
            "spice": ["Pepper", "Cinnamon", "Cumin", "Ginger", "Garlic Powder", "Paprika", "Nutmeg", "Turmeric", "Cardamom", "Cloves", "Coriander", "Chili Powder", "Oregano", "Thyme", "Rosemary", "Sage", "Basil", "Mint", "Fennel", "Saffron"],
            "dog breed": ["Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog", "Bulldog", "Poodle", "Beagle", "Rottweiler", "German Shorthaired Pointer", "Siberian Husky", "Dachshund", "Great Dane", "Doberman Pinscher", "Australian Shepherd", "Boxer", "Cavalier King Charles Spaniel", "Shih Tzu", "Pembroke Welsh Corgi", "Yorkshire Terrier", "Miniature Schnauzer", "Chihuahua"],
            "cooking technique": ["Fry", "Boil", "Stir", "Bake", "Grill", "Roast", "Marinate", "Microwave", "Deep fry", "Caramelize"],
            "dish": ["Lasagna", "Curry", "Paella", "Sushi", "Tacos", "Pizza", "Burger", "Quiche", "Risotto", "Chowder", "Barbecue Ribs", "Pad Thai", "Falafel", "Carbonara", "Beef Stroganoff", "Ratatouille", "Gumbo", "Fish and Chips", "Tiramisu", "Shepherd's Pie"],
            "kitchen appliance": ["Refrigerator", "Oven", "Microwave", "Blender", "Toaster", "Dishwasher", "Coffee Maker", "Electric Kettle", "Food Processor", "Slow Cooker", "Rice Cooker", "Air Fryer", "Grill", "Juicer", "Mixer", "Pressure Cooker", "Deep Fryer", "Hand Blender", "Induction Cooktop", "Bread Maker"],
            "topic": ["Technology", "Art", "History", "Science", "Travel", "Sports", "Music", "Literature", "Cinema", "Fashion", "Cuisine", "Politics", "Economics", "Education", "Environment", "Health", "Psychology", "Philosophy", "Astronomy", "Gaming", "Gardening", "Photography", "Theater", "Dance", "Languages", "Engineering", "Mathematics", "Physics", "Biology", "Chemistry", "Sociology", "Anthropology", "Religion", "Mythology", "Archaeology", "Geography", "Meteorology", "Oceanography", "Zoology", "Botany", "Ethics", "Legal Studies", "Media Studies", "Entrepreneurship", "Human Resources", "Marketing", "Finance", "International Relations", "Public Health", "Veterinary Science", "Nursing", "Medicine", "Architecture", "Urban Planning", "Graphic Design", "Web Development", "Software Engineering", "Cybersecurity", "Data Science", "Artificial Intelligence", "Robotics", "Sustainable Energy", "Space Exploration"]
        };

        // Use compromise to get the base form of the word
        prompt = prompt.replace(/[0-9]/g, '');
        const baseForm = nlp(prompt).out('root');

        let closestKey = "";
        let minDistance = Infinity;

        for (const key in fill) {
            if (key.includes(baseForm)) {
                const distance = levenshteinDistance(baseForm, key);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestKey = key;
                }
            }
        }

        if (fill[closestKey] === undefined) return "";
        return fill[closestKey][Math.floor(Math.random()*fill[closestKey].length)] || " ";
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

    static async getLibByID(id, key = "libs") {
        const localLib = LibManager.localLibs.find(item => item.id === id);
        if (localLib) {
            return localLib;
        }

        let lib;
        try {
            // Try to get lib from Database
            lib = await FirebaseManager.getDocumentFromCollectionById("posts", id);
        } catch (error) {
            // If database fails, try to get a local lib
            lib = LibManager.libs.find(item => item.id === id);
            console.log("Error getting lib from DB: " + error);
        }
        return lib;
    }

    static getLibsByPack(pack) {
        return LibManager.localLibs.filter(item => item.pack === pack);
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

    /**
    * @returns Returns an editable story
    */
    static display_edit(text, prompts) {
        for (let i = 0; i < prompts.length; i++) {
            let key = Object.keys(prompts[i]);
            for (let j = 0; j < prompts[i][key].length; j++) {
                text[prompts[i][key][j]] = '(' + key + ')';
            }
        }

        return fixArticles(text.join(""));
    }

    /**
    * @returns Returns a JSX text node containing the context of a prompt within the given story
    */
    static createPromptContext(lib, promptIndex, input, currentPrompt) {
        const text = lib.text;
        const prompts = lib.prompts;
        const promptPos = Object.values(prompts[promptIndex])[0][0];

        // When the user hasn't written anything, show the name of the prompt
        if(input == "") {
            input = currentPrompt;
        }

        // Max length of each surrounding block of text
        const maxTextLength = 30;

        // Set text preceding the prompt
        let beforeTextFull = text[promptPos - 1];
        // Establish iterator
        let beforeI = 2;
        // Keep going backwards in the array until the before text is long enough, or stop if there is no more text
        while(beforeTextFull.length < maxTextLength && text[promptPos - beforeI]) {
            beforeTextFull = `${text[promptPos - beforeI]}${beforeTextFull}`;
            beforeI++;
        }

        // Ditto, but the other way around
        let afterTextFull = text[promptPos + 1];
        let afterI = 2;
        while(afterTextFull.length < maxTextLength && text[promptPos + afterI]) {
            afterTextFull = `${afterTextFull}${text[promptPos + afterI]}`;
            afterI++;
        }


        // Limit to maxTextLength characters, also subtracting the length of the input
        const beforeSubtract = maxTextLength - Math.floor(input.length / 2);
        const beforeText = beforeTextFull.length > beforeSubtract
            ? beforeTextFull.slice(-beforeSubtract) 
            : beforeTextFull;
        
        const afterSubtract = maxTextLength - Math.ceil(input.length / 2);
        const afterText = afterTextFull.length > afterSubtract 
            ? afterTextFull.slice(0, afterSubtract) 
            : afterTextFull;


        return (
            <Text>
                ...{beforeText}
                <Text style={{color: "#006D40"}}>{input}</Text>
                {afterText}...
            </Text>
        )
    }
}

LibManager.initialize();

function fixArticles(txt) {
    var valTxt = txt.replace(/\b(a|an) ([\s\(\"'“‘-]?\w*)\b/gim, function (match, article, following) {
        var input = following.replace(/^[\s\(\"'“‘-]+|\s+$/g, ""); //strip initial punctuation symbols
        var res = AvsAnSimple.query(input);
        var newArticle = res.replace(/^a/i, article.charAt(0));
        if (newArticle !== article) {
            newArticle = newArticle;
        }
        return newArticle + ' ' + following;
    });

    return valTxt;
}

function levenshteinDistance(a, b) {
    const matrix = [];
    
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1,
                                        Math.min(matrix[i][j - 1] + 1,
                                                 matrix[i - 1][j] + 1));
            }
        }
    }

    return matrix[b.length][a.length];
}

function getRandomDateFromLastYear() {
    const today = new Date();
    const lastYear = new Date(today);
    
    lastYear.setFullYear(today.getFullYear() - 1);

    const differenceInTime = today.getTime() - lastYear.getTime();
    const randomTime = Math.random() * differenceInTime;

    const randomDate = new Date(lastYear.getTime() + randomTime);

    return randomDate;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

var AvsAnSimple=function(n){function i(n){var r=parseInt(t,36)||0,f=r&&r.toString(36).length,u,e;for(n.article=t[f]=="."?"a":"an",t=t.substr(1+f),u=0;u<r;u++)e=n[t[0]]={},t=t.substr(1),i(e)}var t="2h.#2.a;i;&1.N;*4.a;e;i;o;/9.a;e;h1.o.i;l1./;n1.o.o;r1.e.s1./;01.8;12.1a;01.0;12.8;9;2.31.7;4.5.6.7.8.9.8a;0a.0;1;2;3;4;5;6;7;8;9;11; .22; .–.31; .42; .–.55; .,.h.k.m.62; .k.72; .–.82; .,.92; .–.8;<2.m1.d;o;=1.=1.E;@;A6;A1;A1.S;i1;r1;o.m1;a1;r1; .n1;d1;a1;l1;u1;c1.i1.a1.n;s1;t1;u1;r1;i1;a1;s.t1;h1;l1;e1;t1;e1.s;B2.h2.a1.i1;r1;a.á;o1.r1.d1. ;C3.a1.i1.s1.s.h4.a2.i1.s1;e.o1.i;l1.á;r1.o1.í;u2.i;r1.r1.a;o1.n1.g1.j;D7.a1.o1.q;i2.n1.a1.s;o1.t;u1.a1.l1.c;á1. ;ò;ù;ư;E7;U1;R.b1;o1;l1;i.m1;p1;e1;z.n1;a1;m.s1;p5.a1.c;e;h;o;r;u1.l1;o.w1;i.F11. ;,;.;/;0;1;2;3;4;5;6;71.0.8;9;Ae;B.C.D.F.I2.L.R.K.L.M.N.P.Q.R.S.T.B;C1;M.D;E2.C;I;F1;r.H;I3.A1;T.R1. ;U;J;L3.C;N;P;M;O1. ;P1;..R2.A1. ;S;S;T1;S.U2.,;.;X;Y1;V.c;f1.o.h;σ;G7.e1.r1.n1.e;h1.a3.e;i;o;i1.a1.n1.g;o2.f1. ;t1.t1. ;r1.i1.a;w1.a1.r1.r;ú;Hs. ;&;,;.2;A.I.1;2;3;5;7;B1;P.C;D;F;G;H1;I.I6;C.G.N.P.S1.D;T.K1.9;L;M1;..N;O2. ;V;P;R1;T.S1.F.T;V;e2.i1.r;r1.r1.n;o2.n6;d.e1.s;g.k.o2;l.r1;i1.f;v.u1.r;I3;I2;*.I.n1;d1;e1;p1;e1;n1;d2;e1;n1;c1;i.ê.s1;l1;a1;n1;d1;s.J1.i1.a1.o;Ly. ;,;.;1;2;3;4;8;A3. ;P;X;B;C;D;E2. ;D;F1;T.G;H1.D.I1.R;L;M;N;P;R;S1;m.T;U1. ;V1;C.W1.T;Z;^;a1.o1.i1.g;o1.c1.h1.a1;b.p;u1.s1.h1;o.ộ;M15. ;&;,;.1;A1;.1;S./;1;2;3;4;5;6;7;8;Ai;B.C.D.F.G.J.L.M.N.P.R.S.T.V.W.X.Y.Z.B1;S1;T.C;D;E3.P1;S.W;n;F;G;H;I4. ;5;6;T1;M.K;L;M;N;O1.U;P;Q;R;S;T1;R.U2. ;V;V;X;b1.u1.m;f;h;o2.D1.e.U1;..p1.3;s1.c;Ny. ;+;.1.E.4;7;8;:;A3.A1;F.I;S1.L;B;C;D;E3.A;H;S1. ;F1;U.G;H;I7.C.D1. ;K.L.N.O.S.K;L;M1;M.N2.R;T;P1.O1.V1./1.B;R2;J.T.S1;W.T1;L1.D.U1.S;V;W2.A;O1.H;X;Y3.C1.L;P;U;a1.s1.a1.n;t1.h;v;²;×;O5;N1;E.l1;v.n2;c1.e.e1.i;o1;p.u1;i.P1.h2.i1.a;o2.b2;i.o.i;Q1.i1.n1.g1.x;Rz. ;&;,;.1;J./;1;4;6;A3. ;.;F1;T.B1;R.C;D;E3. ;S1.P;U;F;G;H1.S;I2.A;C1. ;J;K;L1;P.M5;1.2.3.5.6.N;O2.H;T2;A.O.P;Q;R1;F.S4;,...?.T.T;U4;B.M.N.S.V;X;c;f1;M1...h2.A;B;ò;S11. ;&;,;.4.E;M;O;T1..3.B;D;M;1;3;4;5;6;8;9;A3. ;8;S2;E.I.B;C3.A1. ;R2.A.U.T;D;E6. ;5;C3;A.O.R.I1.F.O;U;F3;&.H.O1.S.G1;D.H3.2;3;L;I2. ;S1.O.K2.I.Y.L3;A2. ;.;I1. ;O.M3;A1. ;I.U1.R.N5.A.C3.A.B.C.E.F.O.O5. ;A1.I;E;S1;U.V;P7;A7;A.C.D.M.N.R.S.E1. ;I4;C.D.N.R.L1;O.O.U.Y.Q1. ;R;S1;W.T9.A1. ;C;D;F;I;L;M;S;V;U7.B.L.M.N.P.R.S.V;W1.R;X1.M;h1.i1.g1.a1.o;p1.i1.o1;n.t2.B;i1.c1.i;T4.a2.i2.g1.a.s1.c;v1.e1.s;e1.a1.m1.p;u1.i2.l;r;à;Um..1.N1..1.C;/1.1;11. .21.1;L1.T;M1.N;N4.C1.L;D2. .P.K;R1. .a;b2;a.i.d;g1.l;i1.g.l2;i.y.m;no. ;a1.n.b;c;d;e1;s.f;g;h;i2.d;n;j;k;l;m;n;o;p;q;r;s;t;u;v;w;p;r3;a.e.u1.k;s3. ;h;t1;r.t4.h;n;r;t;x;z;í;W2.P1.:4.A1.F;I2.B;N1.H.O1.V;R1.F1.C2.N.U.i1.k1.i1.E1.l1.i;X7;a.e.h.i.o.u.y.Y3.e1.t1.h;p;s;[5.A;E;I;a;e;_2._1.i;e;`3.a;e;i;a7; .m1;a1;r1. .n1;d2; .ě.p1;r1;t.r1;t1;í.u1;s1;s1;i1. .v1;u1;t.d3.a1.s1. ;e2.m1. ;r1. ;i2.c1.h1. ;e1.s1.e2.m;r;e8;c1;o1;n1;o1;m1;i1;a.e1;w.l1;i1;t1;e1;i.m1;p1;e1;z.n1;t1;e1;n1;d.s2;a1. .t4;a1; .e1; .i1;m1;a1;r.r1;u1.t.u1.p1. ;w.f3. ;M;y1.i;h9. ;,;.;C;a1.u1.t1;b.e2.i1.r1;a.r1.m1.a1.n;o4.m2.a1; .m;n8; .b.d.e3; .d.y.g.i.k.v.r1.s1. ;u1.r;r1. ;t1;t1;p1;:.i6;b1;n.e1;r.n2;f2;l1;u1;ê.o1;a.s1;t1;a1;l1;a.r1; .s1; .u.k1.u1. ;l3.c1.d;s1. ;v1.a;ma. ;,;R;b1.a.e1.i1.n;f;p;t1.a.u1.l1.t1.i1.c1.a1.m1.p1.i;×;n6. ;V;W;d1; .t;×;o8;c2;h1;o.u1;p.d1;d1;y.f1; .g1;g1;i.no. ;';,;/;a;b;c1.o;d;e2.i;r;f;g;i;l;m;n;o;r;s;t;u;w;y;z;–;r1;i1;g1;e.t1;r1.s;u1;i.r3. ;&;f;s9.,;?;R;f2.e.o.i1.c1.h;l1. ;p2.3;i1. ;r1.g;v3.a.e.i.t2.A;S;uc; ...b2.e;l;f.k2.a;i;m1;a1. .n3;a3; .n5.a;c;n;s;t;r1;y.e2; .i.i8.c2.o1.r1.p;u1.m;d1;i1.o;g1.n;l1.l;m1;o.n;s1.s;v1.o1;c.r5;a.e.i.l.o.s3. ;h;u1.r2;e.p3;a.e.i.t2.m;t;v.w1.a;xb. ;';,;.;8;b;k;l;m1;a.t;y1. ;y1.l;{1.a;|1.a;£1.8;À;Á;Ä;Å;Æ;É;Ò;Ó;Ö;Ü;à;á;æ;è;é1;t3.a;o;u;í;ö;ü1; .Ā;ā;ī;İ;Ō;ō;œ;Ω;α;ε;ω;ϵ;е;–2.e;i;ℓ;";return i(n),{raw:n,query:function(t){var i=n,f=0,u,r;do r=t[f++];while("\"‘’“”$'-(".indexOf(r)>=0);for(;;){if(u=i.article||u,i=i[r],!i)return u;r=t[f++]||" "}}}}({})
