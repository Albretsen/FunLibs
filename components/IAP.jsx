import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import Purchases from 'react-native-purchases';

const IAP = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("FETCHING");
        const productIdentifiers = ['test', 'videogames_pack']; // Replace with your product IDs
        const fetchedProducts = await Purchases.getProducts(productIdentifiers);
        console.log("FETCHED: " + JSON.stringify(fetchedProducts));
        setProducts(fetchedProducts);
      } catch (err) {
        setError(err);
      }
    }

    fetchProducts();
  }, []);

  const handlePurchase = async (productId) => {
    try {
      const purchaseResponse = await Purchases.purchaseProduct(productId);
      // Handle successful purchase here
      console.log('Purchase was successful:', purchaseResponse);
    } catch (err) {
      console.error('Purchase failed:', err);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {error && <Text>Error fetching products: {error.message}</Text>}
      <FlatList
        data={products}
        keyExtractor={(item) => item.identifier}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Price: {item.priceString}</Text>
            <Button title="Buy" onPress={() => handlePurchase(item.identifier)} />
          </View>
        )}
      />
    </View>
  );
};

export default IAP;
