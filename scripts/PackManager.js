import LibManager from "./lib_manager";
import IAP from "./IAP";
import { Text, StyleSheet } from "react-native";

class PackManager {
    // JS object to store pack details
    static packs = {
        christmas_pack: {
            name: "Christmas Pack",
            price: 0
        },
        historic_pack: {
            name: "Historic Pack",
            price: 0
        },
        romance_pack: {
            name: "Romance Pack",
            price: 0
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
            return await IAP.verifyPurchase(packId);
        } catch (error) {
            console.error("Error verifying purchase: " + error);
            return false;
        }
    }

    static styles = StyleSheet.create({
        title: {
            // Custom styles for the title
        },
        description: {
            // Custom styles for the description
        },
        image: {
            // Styles for the image
        }
    });

}

export default PackManager;