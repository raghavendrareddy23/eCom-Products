import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import cartImage from "../assets/cart.avif";
import Loader from "../components/Loader";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { page } = location.state || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products?page=${page}`
        );

        const foundProduct = response.data.products.find(
          (prod) => prod.id === id || prod.sku_code === id
        );

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, page]);

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  const {
    sku_code = "N/A",
    name = "No Name",
    description = "No Description",
    mrp = { mrp: "0", currency: "INR" },
    main_category = "No Category",
    label = "Label not available",
    attributes = { ingredients: "Ingredients data not available" },
    isLocalProduct = "Unknown",
    images = {},
  } = product || {};

  const imageUrls = Object.values(images).filter(
    (imgUrl) => imgUrl !== null && imgUrl !== ""
  );

  return (
    <>
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Product Details</h1>
          <Link to="/">
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md">
              Back to Products
            </button>
          </Link>
        </div>
      </header>

      <title>{name} - Product Details</title>
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-6xl mx-auto bg-white  rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4 bg-gray-50">
              {imageUrls.length > 0 ? (
                <Carousel
                  showThumbs={false}
                  infiniteLoop
                  autoPlay
                  interval={3000}
                  showArrows
                  className="rounded-lg shadow-md"
                >
                  {imageUrls.map((imgUrl, index) => (
                    <div key={index}>
                      <img
                        src={imgUrl}
                        alt={`${name} - Img ${index + 1}`}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <img
                  src={cartImage}
                  alt="Cart"
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>

            <div className="p-6 flex flex-col space-y-4">
              <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
              <p className="text-gray-600 text-sm">
                SKU Code: <span className="text-gray-800">{sku_code}</span>
              </p>
              <p className="text-gray-600">
                <strong>Description:</strong>{" "}
                {description || "Data not Available"}
              </p>

              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <p className="text-lg font-semibold text-blue-600">Price</p>
                <p className="text-xl font-bold text-blue-800">
                  {mrp.currency || "INR"} {mrp.mrp || 0}
                </p>
              </div>

              <p className="text-gray-600">
                <strong>Category:</strong>{" "}
                <span className="text-gray-800">{main_category}</span>
              </p>
              <p className="text-gray-600">
                <strong>Label:</strong>{" "}
                <span className="text-gray-800">
                  {label || "Data not Available"}
                </span>
              </p>
              <p className="text-gray-600">
                <strong>Ingredients:</strong>{" "}
                <span className="text-gray-800">
                  {attributes.ingredients || "Data not Available"}
                </span>
              </p>
              <p className="text-gray-600">
                <strong>Local Product:</strong>{" "}
                <span className="text-gray-800">{isLocalProduct}</span>
              </p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
