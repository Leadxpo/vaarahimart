import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SafeAreaView, View, FlatList, Text, TouchableOpacity, ImageBackground, Dimensions ,StyleSheet} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarts } from '../../Redux/Actions/cartAction';  // Assuming these actions exist
import Header from '../../components/userHeader';  // Assuming you have a Header component

const Category = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const width = Dimensions.get("screen").width;
  const { loading: loadingCart, carts } = useSelector(state => state.carts);
  const { userInfo } =  useSelector(state => state.userDetails);
  const { routeParent, type } = route.params;

  // States
  const [products, setProducts] = useState(routeParent || []);
  const [searchData, setSearchData] = useState(routeParent || []);  // Initialize with routeParent
  const [productQuery, setProductQuery] = useState('');  // Search query
  const [userID, setUserID] = useState('');

  // Search logic using useCallback for performance optimization
  const onSearchProductQuery = useCallback((query) => {
    setProductQuery(query);
  }, []);

  // Effect for handling products and search filtering
  useEffect(() => {
    if (productQuery.length > 0) {
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(productQuery.toLowerCase())
      );
      setSearchData(filteredProducts);
    } else {
      setSearchData(products);  // Reset to all products when query is empty
    }
  }, [productQuery, products]);

  // Fetch user carts if userID exists
  useEffect(() => {
    const fetchData = async () => {
      if (userInfo?.id) {
        setUserID(userInfo.id);
        await dispatch(fetchCarts(userInfo.id));
      }
    };

    fetchData();
  }, [dispatch, userInfo]);

  // Update products if routeParent change
  useEffect(() => {
    setProducts(routeParent || []);
    setSearchData(routeParent || []);  // Sync searchData with routeParent on change
  }, [routeParent]);

  // Render each category item
  const renderCategoryItem = useCallback(({ item }) => (
    <TouchableOpacity key={item.name} style={[{ marginBottom: 20 }]} onPress={() => { navigation.navigate("Products", { routeProducts: item.productDetails, type: item.name }) }}>
      <ImageBackground
        source={{ uri: item.image }}
        imageStyle={{ borderRadius: 8 }}
        style={[styles.card, { width: width / 2.6, height: width / 2.6 }]}
      />
      <Text numberOfLines={1} style={[styles.categoryName, { alignSelf: 'center',marginBottom:12 }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  ), [width]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* Header Section */}
        <Header onSearchQuery={onSearchProductQuery} />

        {/* Product List */}
        <FlatList
          data={searchData}
          style={{marginBottom:120}}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.name.toString()}  // Ensure it is stringified
          numColumns={2}
          ListEmptyComponent={<View><Text style={{color:'#aaaaaa',fontWeight:'600',fontSize:18}}> Categories Not Added </Text></View>}
          columnWrapperStyle={{ justifyContent: 'space-between',columnGap:30 }}  // Ensure equal spacing
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingBottom: 20,
    alignSelf: "center"
  },
  personalItem: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    padding: 8,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
  },
  categoryName: {
    fontSize: 14,
    textAlign: 'center',
    width: 100,
    color: "#6c290f"
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#6c290f',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  showDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  showDetailsText: {
    fontSize: 14,
    color: '#D35400',
    marginRight: 5,
  },
});

export default Category;
