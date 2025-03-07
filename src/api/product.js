import useSWR from 'swr';
import { useMemo } from 'react';
// utils
// eslint-disable-next-line import/named
// import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';
import axios from 'axios';

import { endpoints } from 'src/utils/endpoints';
import { fetcher } from 'src/utils/fetchers';

// ----------------------------------------------------------------------

export const fetchShopifyProducts = async (shopName, accessToken) => {
  if (!shopName || !accessToken) {
    console.error('Missing shopName or accessToken');
    return [];
  }

  try {
    const response = await axios.get(
      `https://${shopName}/admin/api/2023-01/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
        },
      }
    );
    return response.data.products;
  } catch (error) {
    console.error('Error fetching Shopify products:', error.response?.data || error.message);
    return [];
  }
};


// const fetchStoreData = async (shop) => {
//    try {
//        const response = await api.get(`/shopify/data`, { params: { shop } });
//        console.log(response.data);
//    } catch (error) {
//        console.error('Error fetching store data:', error);
//    }
// };

// fetchStoreData('your-store.myshopify.com');


export function useGetProducts() {
  const URL = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: data?.products || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.products, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const URL = productId ? [endpoints.product.details, { params: { productId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
