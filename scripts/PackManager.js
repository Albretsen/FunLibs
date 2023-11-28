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
        historic: {
            name: "Historic",
            price: 0,
            image: "historic",
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
     * Initiates the purchase process for a pack.
     * 
     * @param {string} packId - The identifier of the pack to be purchased.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the purchase was successful, `false` otherwise.
     */
    static async buyPack(packId) {
        try {
            // Fetch the product details for the pack
            const products = await IAP.fetchProducts();

            // Find the specific package for the packId
            const packageItem = products.find(p => p.product.identifier === packId);

            if (!packageItem) {
                console.error(`Pack with ID ${packId} not found in available products.`);
                return false;
            }

            // Use the IAP class to make the purchase
            const purchaseSuccessful = await IAP.purchasePackage(packageItem);

            if (purchaseSuccessful) {
                // Additional logic can be added here if needed, e.g., updating user's pack access.
                console.log(`Purchase successful for pack: ${packId}`);
            } else {
                console.log(`Purchase failed for pack: ${packId}`);
            }

            return purchaseSuccessful;
        } catch (error) {
            console.error(`Error during the purchase of pack ${packId}: ${error}`);
            return false;
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
     * Retrieves the price of a pack based on its identifier.
     * 
     * @param {string} packId - The identifier of the pack.
     * @returns {Promise<string>} - A promise that resolves to the price of the pack as a formatted string.
     */
    static async getPackPrice(packId) {
        try {
            // Retrieve the price from the IAP class
            return await IAP.getProductPrice(packId);
        } catch (error) {
            console.error("Error retrieving pack price: " + error);
            throw error;
        }
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