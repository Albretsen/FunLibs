import Purchases from 'react-native-purchases';
import FirebaseManager from './firebase_manager';
import FileManager from './file_manager';

class IAP {
    static purchases = [];
    static subscription = false;
    static subscriptionExpiration = 0;

    static async initialize() {
        await this.getPurchases();
        // setInterval(async function () {
        //     console.log("SUBSCRIPOTION: " + JSON.stringify(await IAP.verifySubscription()));
        //     let subscription = await FileManager._retrieveData("subscription");
        //     if (subscription) {
        //         subscription = JSON.parse(subscription);
        //         console.log("EXPIRATIONJ: " + (subscription.premium.expirationDateMillis > new Date().getTime()));
        //     }
        // }, 10000);
    }

    static async verifyPurchase(identifier) {
        let customerInfo = await this.getCustomerInfo();

        return Object.keys(customerInfo.allPurchaseDates).includes(identifier);
    }

    static async verifySubscription() {
        let customerInfo = await this.getCustomerInfo();
        console.log(JSON.stringify(customerInfo.entitlements.active));

        return (customerInfo.entitlements?.active?.premium != undefined);
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
     * Retrieves the price of a product based on its identifier.
     * 
     * @param {String} productId - The identifier of the product.
     * @returns {String} - The price of the product as a formatted string.
     * @throws {Error} - Throws an error if the product is not found or in case of an API failure.
     */
    static async getProductPrice(productId) {
        try {
            const offerings = await Purchases.getOfferings();
            if (!offerings || !offerings.current) {
                throw new Error('No offerings available.');
            }

            const allPackages = offerings.current.availablePackages;
            const productPackage = allPackages.find(p => p.product.identifier === productId);

            if (!productPackage) {
                throw new Error(`Product with ID ${productId} not found.`);
            }

            return productPackage.product.priceString;
        } catch (error) {
            console.log('Error retrieving product price: ' + error);
            throw error;
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
                if (this.verifySubscription()) {
                    this.subscription = true;
                    this.storeSubscriptionInfoLocally(customerInfo.entitlements.active);
                    this.storeSubscriptionInfoDatabase(customerInfo.entitlements.active);
                    return true;
                } else {
                    return false;
                }
            } else {
                // It's a consumable or non-consumable product
                if (await this.verifyPurchase(identifier)) {
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

    static async storeSubscriptionInfoLocally(subscription) {
        try {
            await FileManager._storeData("subscription", JSON.stringify(subscription));
        } catch (error) {
            console.log("Error storing subscription info locally: " + error);
        }
    }

    static async storeSubscriptionInfoDatabase(subscription) {
        try {
            await FirebaseManager.UpdateDocument("users", FirebaseManager.currentUserData.auth.uid, { subscription: subscription});
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
            if (!this.userIsSignedIn()) throw "not_signed_in";
            
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
