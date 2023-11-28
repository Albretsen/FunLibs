import React from "react";
import LibManager from "./lib_manager";
import IAP from "./IAP";
import { View, Text, StyleSheet } from "react-native";
import FileManager from "./file_manager";
import globalStyles from "../styles/globalStyles";

class PackManager {
    // JS object to store pack details
    static packs = {
        christmas: {
            name: "Christmas",
            price: 0,
            image: "christmas",
            description: (
                <Text>
                Get into the festive spirit with our specially curated collection of <Text style={globalStyles.highlightText}>8 magical Christmas Libs</Text>, crafted by the Fun Libs Team!
                {"\n"}
                Embrace the holiday cheer with <Text style={globalStyles.highlightText}>Jingle Bells</Text>, <Text style={globalStyles.highlightText}>A Christmas Carol</Text>, and many more Yuletide delights. Each Lib in this pack promises to fill your holidays with laughter, wonder, and an unforgettable touch of Christmas magic.
                </Text>
            )

        },
        historical: {
            name: "Historical",
            price: 0,
            image: "historical",
            description: (
                <Text>
                Get ready to immerse yourself in history! <Text style={globalStyles.highlightText}>The Historical Events pack</Text> is filled with funny takes on famous moments throughout history!
                {"\n"}
                Dust off the old history book and write libs about the <Text style={globalStyles.highlightText}>sinking of the Titanic, the Boston Tea Party and the Wright Brothers' first flight!</Text>
                </Text>
            )
        },
        romance: {
            name: "Romance",
            price: 0,
            image: "romance",
            description: (
                <Text>
                    Dive into a world of romance with our collection of <Text style={globalStyles.highlightText}>10 heartwarming Libs</Text>, each crafted with passion by the Fun Libs Team!
                    {"\n"}
                    Embark on an enchanting journey with classics like <Text style={globalStyles.highlightText}>Romeo and Juliet</Text>, get swept off your feet in the modern twists of <Text style={globalStyles.highlightText}>Twilight</Text>, and discover more thrilling, heart-fluttering adventures.
                </Text>
            )
        }
    }

    /**
     * Retrieves a lib by its ID.
     * @param {number} id - The ID of the lib to retrieve.
     * @returns {object} - The retrieved lib object.
     */
    static getLibByID(id) {
        return LibManager.getLibByID(id);
    }

    /**
     * Retrieves all libs associated with a specific pack.
     * @param {string} packName - The name of the pack.
     * @returns {array} - An array of lib objects.
     */
    static getLibsByPack(packName) {
        return LibManager.getLibsByPack(packName);
    }

    /**
     * Verifies whether a pack has been purchased by the user.
     * @param {string} packId - The ID of the pack to verify.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the pack is purchased, `false` otherwise.
     */
    static async verifyPurchase(packId) {
        try {
            // First, check the local storage for the purchase
            let localPurchases = await FileManager._retrieveData('purchases');
            if (localPurchases) {
                localPurchases = JSON.parse(localPurchases);
                if (localPurchases.includes(packId)) {
                    return true;
                }
            }

            // If not found in local storage, check the purchases API
            if (!IAP.userIsSignedIn) { 
                console.log("Purchase could not be verified locally. User is not signed in, so database verification is not possible.");
                return false;
            } 
            return await IAP.verifyPurchase(packId);
        } catch (error) {
            console.error("Error verifying purchase: " + error);
            return false;
        }
    }

}

export default PackManager;