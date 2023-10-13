import Purchases from 'react-native-purchases';
import FirebaseManager from './firebase_manager';
import FileManager from './file_manager';

class IAP {
    static purchases = [];
    static subscription = false;

    static async initialize() {
        this.getPurchases();
    }

    static async getPurchases() {
        try {
            let purchases = await FileManager._retrieveData("purchases");
            if (!purchases) return;
            purchases = JSON.parse(purchases);
            this.purchases = purchases;
        } catch (error) {
            console.log("Error getting local purchases: " + error);
        }

        try {
            if (!this.userIsSignedIn) throw "not_signed_in";
            let purchases = await FirebaseManager.getDocumentFromCollectionById("users", FirebaseManager.currentUserData.auth.uid);
            this.purchases = purchases.purchases;
        } catch (error) {
            console.log("Error getting database purchases: " + error);
        }
    }

    /**
     * Fetches product offerings from RevenueCat.
     *
     * @returns {Array} - Array of available packages from the current offerings.
     * @throws {Error} - Throws an error with message "Unexpected products shape" if the fetched product structure doesn't match expectation. Other errors are logged to the console.
     */
    static async fetchProducts() {
        try {
            const fetchedProducts = await Purchases.getOfferings();
            console.log("HEY");
            console.log("FETCHE DPRODCUTS: " + JSON.stringify(fetchedProducts));

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
            if (!this.userIsSignedIn()) throw "not_signed_in";

            const { customerInfo } = await Purchases.purchasePackage(packageItem);

            let identifier = packageItem.product.identifier;

            // Check if the product is a subscription or consumable
            if (packageItem.product.productType === "AUTO_RENEWABLE_SUBSCRIPTION") {
                // It's a subscription
                if (Object.keys(customerInfo.entitlements?.active || {}).includes(identifier)) {
                    this.subscription = true;
                    this.storeSubscriptionInfoLocally(true);
                    this.storeSubscriptionInfoDatabase(true);
                    return true;
                } else {
                    return false;
                }
            } else {
                // It's a consumable or non-consumable product
                if (Object.keys(customerInfo.allPurchaseDates).includes(identifier)) {
                    this.purchases.push(identifier);
                    this.storePurchaseInfoLocally(identifier);
                    this.storePurchaseInfoDatabase(identifier);
                    return true;
                } else {
                    return false;
                }
            }
        } catch (error) {
            console.log("Error: " + error);
            if (!error.userCancelled) {
                console.log(error);
            }
            return false;
        }
    }

    static async storePurchaseInfoLocally(identifier) {
        try {
            let local_purchases = await FileManager._retrieveData("purchases");

            if (!local_purchases) {
                local_purchases = [identifier];
                await FileManager._storeData("purchases", JSON.stringify(local_purchases));
                return;
            }

            local_purchases = JSON.parse(local_purchases);
            local_purchases.push(identifier);
            await FileManager._storeData("purchases", JSON.stringify(local_purchases));
        } catch (error) {
            console.log("Error storing purchase info locally: " + error);
        }
    }

    static async storePurchaseInfoDatabase(identifier) {
        try {
            await FirebaseManager.UpdateDocument("users", FirebaseManager.currentUserData.auth.uid, {}, { purchases: [identifier] });
        } catch (error) {
            console.log("Error storing purchase info in database: " + error);
        }
    }

    static async storeSubscriptionInfoLocally(status) {
        try {
            await FileManager._storeData("subscription", status);
        } catch (error) {
            console.log("Error storing subscription info locally: " + error);
        }
    }

    static async storeSubscriptionInfoDatabase() {
        try {
            await FirebaseManager.UpdateDocument("users", FirebaseManager.currentUserData.auth.uid, { });
        } catch (error) {
            console.log("Error storing subscription info in database: " + error);
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

    static userIsSignedIn() {
        if (FirebaseManager.currentUserData?.auth) return true;
        return false;
    }
}

export default IAP;
