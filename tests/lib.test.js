import Lib from '../scripts/lib.js';

describe('Lib Class', () => {
    test('createLib should generate a valid Lib object', () => {
        const text = 'Hello, my name is "name" and I am "age" years old.';
        const name = 'testLib';
        const libObject = Lib.createLib(text, name);

        // Check if the libObject is an instance of Lib class
        expect(libObject instanceof Lib).toBe(true);

        // Check if the properties are set correctly
        expect(libObject.name).toBe(name);
        expect(libObject.id).toBe(0);

        // Add more checks for text, prompts, and words arrays if required
    });

    test('display_with_prompts should return the story with prompts', () => {
        const text = 'Hello, my name is "name" and I am "age" years old.';
        const name = 'testLib';
        const libObject = Lib.createLib(text, name);

        // Test the display_with_prompts method
        expect(libObject.display_with_prompts).toBe(
            'Hello, my name is "name" and I am "age" years old.'
        );

        // Add more test cases to cover different scenarios
    });
});
