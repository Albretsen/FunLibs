import AsyncStorage from '@react-native-async-storage/async-storage';

export default class FileManager {

    static _storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(
                key,
                value
            );
        } catch (error) {
            console.log("ERROR SAVING DATA: " + error);
            return null;
        }
    };

    static _retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                return value;
            }
        } catch (error) {
            console.log("ERROR RETRIEVING DATA: " + error);
            return null;
        }
    };
}