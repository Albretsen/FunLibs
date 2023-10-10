import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import {
    initConnection,
    getProducts,
    requestPurchase,
    finishTransaction,
    purchaseUpdatedListener,
    purchaseErrorListener
} from 'react-native-iap';

const productIds = ['test']; // Replace with your product IDs

function IAP() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function prepareIAP() {
            try {
                console.log("INITTIGN");
                await initConnection();
                console.log("INNITED");
                const fetchedProducts = await getProducts(['christmas_pack', 'test', 'mega_pack']);
                console.log("FETCHED PRODUCST: " + fetchedProducts);
                setProducts(fetchedProducts);
            } catch (err) {
                console.log("ERROR: " + err);
                setError(err);
            }
        }

        const purchaseUpdateSubscription = purchaseUpdatedListener((purchase) => {
            console.log('New purchase:', purchase);
            finishTransaction(purchase);
        });

        const purchaseErrorSubscription = purchaseErrorListener((err) => {
            setError(err);
        });

        prepareIAP();

        return () => {
            purchaseUpdateSubscription.remove();
            purchaseErrorSubscription.remove();
        };
    }, []);

    async function handlePurchase(productId) {
        try {
            await requestPurchase(productId);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <View style={{flex: 1}}>
            <Text>IAP Testing</Text>
            {error && <Text>Error: {error}</Text>}
            {products.map((product) => (
                <View key={product.productId}>
                    <Text>{product.title}</Text>
                    <Text>{product.description}</Text>
                    <Text>{product.priceString}</Text>
                    <Button title="Buy" onPress={() => handlePurchase(product.productId)} />
                </View>
            ))}
        </View>
    );
}

export default IAP;
