import LibManager from "./lib_manager";
import IAP from "./IAP";

class PackManager {
    // JS object to store pack details
    static packs = {
        christmas_pack: {
            name: "Christmas Pack",
            description: "A collection of Christmas themed Mad Libs stories.",
            price: 0 // Set the price or other relevant information
        },
        historic_pack: {
            name: "Historic Pack",
            description: "Dive into history with these Mad Libs stories.",
            price: 0 // Set the price or other relevant information
        },
        romance_pack: {
            name: "Romance Pack",
            description: "Romantic Mad Libs stories for a heartfelt experience.",
            price: 0 // Set the price or other relevant information
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

}

export default PackManager;