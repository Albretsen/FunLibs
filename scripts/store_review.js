import * as StoreReview from 'expo-store-review';
import * as Linking from 'expo-linking';

const requestReview = async () => {
    if (await StoreReview.hasAction()) {
        StoreReview.requestReview();
    } else {
        // Fallback to opening the store URL if the review flow isn't available
        const storeUrl = StoreReview.storeUrl();
        if (storeUrl) {
            Linking.openURL(storeUrl);
        }
    }
};

export { requestReview };