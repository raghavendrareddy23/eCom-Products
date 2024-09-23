import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { getProducts } from "../services/ProductService";
import Loader from "../components/Loader";
import SearchFilter from "../components/SearchFilter";
import CategoryFilter from "../components/CategoryFilter";
import SortButton from "../components/SortButton";
import cart from "../assets/cart.avif";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { products, totalResults } = await getProducts(
          currentPage,
          pageSize
        );
        setProducts(products);
        setTotalProducts(parseInt(totalResults, 10));
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, pageSize]);

  const handleRowClick = (params) => {
    const productId = params.row.id || params.row.sku_code;
    navigate(`/product/${productId}`, { state: { page: currentPage } });
  };

  const handlePageChange = (params) => {
    setCurrentPage(params.page + 1);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize.pageSize);
    setCurrentPage(1);
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory === "All"
        ? true
        : product.main_category === selectedCategory
    )
    .filter((product) =>
      selectedSubCategory
        ? product.category_level_1 === selectedSubCategory
        : true
    )
    .sort((a, b) =>
      sortOrder === "asc" ? a.mrp.mrp - b.mrp.mrp : b.mrp.mrp - a.mrp.mrp
    );

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  // const categories = [
  //   ...new Set(products.map((product) => product.main_category)),
  // ];

  return (
    <div >
      {/* Header */}
      <div className="text-center py-6 w-full">
        <h1 className="text-4xl font-bold text-gray-800">Ecom Products</h1>
        <p className="text-lg text-gray-600">View Products from Data Table and Explore to Product Details.</p>
      </div>
      <div className="p-4 bg-gray-100 flex flex-col md:flex-row">

      {/* Filters and Sort */}
      <div className="flex flex-col md:w-1/4 mb-6 md:mb-0">
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          className="mb-4"
        />
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
          categories={products}
          className="mb-4"
        />
        <SortButton
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
        />
      </div>

      {/* DataGrid */}
      <Box
        sx={{
          flex: 1,
          height: { xs: 500, md: 600 },
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <DataGrid
          rows={filteredProducts.map((product) => ({
            id: product.sku_code || product.id,
            name: product.name,
            mrp: product.mrp.mrp,
            image: product.images.front || cart,
          }))}
          columns={[
            {
              field: "image",
              headerName: "Image",
              flex: 1,
              minWidth: 100,
              renderCell: (params) => (
                <div className="flex justify-center text-black items-center h-full w-full">
                  <img
                    src={params.value}
                    alt={params.row.name}
                    className="object-cover"
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                </div>
              ),
              headerClassName: "header-image",
            },
            {
              field: "name",
              headerName: "Product Name",
              flex: 2,
              minWidth: 200,
              headerAlign: "left",
              align: "left",
              headerClassName: "header-name",
            },
            {
              field: "mrp",
              headerName: "MRP (₹)",
              flex: 1,
              minWidth: 150,
              headerClassName: "header-mrp",
            },
          ]}
          pageSize={pageSize}
          rowCount={totalProducts}
          paginationMode="server"
          pagination
          pageSizeOptions={[20]}
          paginationModel={{
            page: currentPage - 1,
            pageSize: pageSize,
          }}
          onPaginationModelChange={handlePageChange}
          rowHeight={100}
          onPageSizeChange={handlePageSizeChange}
          onRowClick={handleRowClick}
          disableColumnSorting
          disableColumnMenu
          disableColumnFilter
          disableSelectionOnClick
        />
      </Box>
      </div>
    </div>
  );
};

export default ProductsPage;
