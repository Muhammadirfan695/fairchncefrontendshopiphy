import { useEffect, useState } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';


export const useGetProducts = () => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsEmpty, setProductsEmpty] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await axiosInstance.get(endpoints.product.shopify); 
        if (response.data && response.data.length > 0) {
          setProducts(response.data);
          setProductsEmpty(false);
        } else {
          setProductsEmpty(true);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductsEmpty(true);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return {
    products,
    productsLoading,
    productsEmpty,
  };
};
