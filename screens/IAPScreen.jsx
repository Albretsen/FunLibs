import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import IAP from '../scripts/IAP';

const IAPScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchaseStatus, setPurchaseStatus] = useState('');

    useEffect(() => {
        async function fetchProducts() {
            try {
                const fetchedProducts = await IAP.fetchProducts();
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const handlePurchase = async (product) => {
        try {
            const success = await IAP.purchasePackage(product);
            if (success) {
                setPurchaseStatus('Purchase successful! Enjoy your pro content.');
            } else {
                setPurchaseStatus('Purchase failed. Please try again.');
            }
        } catch (error) {
            console.log("Error:" + error);
            setPurchaseStatus('An error occurred during purchase.');
        }
    };

    if (loading) {
        return <Text>Loading products...</Text>;
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.identifier}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 20 }}>
                        <Text>{item.product.title}</Text>
                        <Text>{item.product.description}</Text>
                        <Text>{item.product.price}</Text>
                        <Button title="Purchase" onPress={() => handlePurchase(item)} />
                    </View>
                )}
            />
            {purchaseStatus && <Text>{purchaseStatus}</Text>}
        </View>
    );
};

export default IAPScreen;
