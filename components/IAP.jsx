import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import Purchases from 'react-native-purchases';

const IAP = () => {
    const [products, setProducts] = useState([]);
    const [purchased, setPurchased] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch available products
        const fetchProducts = async () => {
            try {
                console.log("FETCHING PRODUCTS:")
                const { products } = await Purchases.getOfferings(); // Replace with your product IDs
                console.log(JSON.stringify(products));
                setProducts(products);
            } catch (error) {
                console.log('Error fetching products:', error);
                setError(error.message);
            }
        };

        fetchProducts();
    }, []);

    return (
        <View>
            {error && <Text>There was an error: {error}</Text>}
        </View>
    );
};

export default IAP;
