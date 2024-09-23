import axios from 'axios';

export const getProducts = async (page = 1, pageSize = 20) => {
  try {
    const response = await axios.get(
      `https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products?page=${page}&limit=${pageSize}`
    );
    const { products, totalPages, totalResults } = response.data;
    return { products, totalPages, totalResults };
  } catch (err) {
    throw new Error('Error fetching products');
  }
};

