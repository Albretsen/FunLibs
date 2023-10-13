import Purchases from 'react-native-purchases';
import FirebaseManager from './firebase_manager';

class IAP {
    /**
     * Fetches product offerings from RevenueCat.
     *
     * @returns {Array} - Array of available packages from the current offerings.
     * @throws {Error} - Throws an error with message "Unexpected products shape" if the fetched product structure doesn't match expectation. Other errors are logged to the console.
     */
    static async fetchProducts() {
        try {
            const fetchedProducts = await Purchases.getOfferings();

            if (
                fetchedProducts &&
                fetchedProducts.current &&
                Array.isArray(fetchedProducts.current.availablePackages)
            ) {
                return fetchedProducts.current.availablePackages;
            } else {
                throw new Error("Unexpected products shape");
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Makes a purchase for the provided package via RevenueCat.
     *
     * @param {Object} packageItem - The package to purchase.
     * @returns {boolean} - `true` if the purchase was successful, `false` otherwise.
     * @throws {Error} - Throws an error with message "not_signed_in" if user isn't logged in. Non-cancellation errors are logged to the console.
     */
    static async purchasePackage(packageItem) {
        try {  
            if (!userIsSignedIn()) throw "not_signed_in";

            const { customerInfo } = await Purchases.purchasePackage(packageItem);

            if (Object.keys(customerInfo.allPurchaseDates).includes(packageItem.product.identifier)) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            if (!e.userCancelled) {
                console.log(error);
            }
            return false;
        }
    }

    /**
     * Fetches customer details from RevenueCat.
     *
     * @returns {Object} - Contains properties like:
     *   - `Request Date`: Server fetch date (affected by device cache).
     *   - `Original App User ID`: Initial recorded App User ID.
     *   - `First Seen`: User's first appearance in RevenueCat.
     *   - `Original Application Version`: Initial app version (iOS only).
     *   - `Original Purchase Date`: Initial app purchase date (iOS only).
     *   - `Management URL`: URL for active subscription management.
     *   - `All Purchased Product Identifiers`: Array of all purchased products.
     *   - `Non Consumable Purchases`: Array of non-consumable purchases.
     *   - `Active Subscriptions`: Array of active subscriptions.
     *   - `Entitlements`: Info about user's entitlements.
     * @throws {Error} - Throws an error with message "not_signed_in" if user isn't logged in. Other errors are logged to the console.
     */
    static async getCustomerInfo() {
        try {
            if (!userIsSignedIn()) throw "not_signed_in";
            
            return await Purchases.getCustomerInfo();
        } catch (error) {
            console.log(error);
        }
    }

    userIsSignedIn() {
        if (FirebaseManager.currentUserData?.auth) return true;
        return false;
    }
}

export default IAP;
