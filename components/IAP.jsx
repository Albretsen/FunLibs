import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import Purchases from 'react-native-purchases';

const IAP = () => {
    const [products, setProducts] = useState([]);
    const [purchased, setPurchased] = useState(false);

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
            }
        };

        fetchProducts();
    }, []);

    return (
        <View>
            {/* {products.map((product) => (
                <View key={product.identifier}>
                    <Text>{product.title}: {product.priceString}</Text>
                </View>
            ))}
            {purchased && <Text>Thank you for your purchase!</Text>} */}
        </View>
    );
};

export default IAP;
