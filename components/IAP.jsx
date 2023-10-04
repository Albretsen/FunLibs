import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import Purchases from 'react-native-purchases';

const IAP = () => {
    const [products, setProducts] = useState([]);
    const [purchaserInfo, setPurchaserInfo] = useState(null);

    useEffect(() => {
        // Initialize RevenueCat
        //Purchases.setDebugLogsEnabled(true);
        Purchases.setup("goog_XgnhUeKjYuxuYkDsCnROqYgnPpK");

        // Fetch available products
        const fetchProducts = async () => {
            try {
                const offerings = await Purchases.getOfferings();
                console.log(JSON.stringify(offerings));
                if (offerings.current !== null) {
                    setProducts(offerings.current.availablePackages);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const purchaseProduct = async (product) => {
        /*try {
            const purchaseResult = await Purchases.purchasePackage(product);
            const { purchaserInfo } = purchaseResult;
            setPurchaserInfo(purchaserInfo);
        } catch (error) {
            console.error("Purchase failed:", error);
        }*/
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>RevenueCat IAP Component</Text>
            {purchaserInfo && <Text>Thank you for your purchase!</Text>}
        </View>
    );
};

export default IAP;
