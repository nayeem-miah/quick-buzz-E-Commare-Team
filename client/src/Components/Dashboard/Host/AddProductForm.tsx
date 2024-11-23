import React, { useState } from "react";

interface FormState {
  productTitle: string;
  brandName: string;
  price: number | string;
  discount: number | string;
  category: string;
  stockQuantity: number | string;
  sku: string;
  tags: string;
  description: string;
  productImage: File | null;
}

const AddProductForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    productTitle: "",
    brandName: "",
    price: "",
    discount: "",
    category: "",
    stockQuantity: "",
    sku: "",
    tags: "",
    description: "",
    productImage: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = e.target;

    // Handle file inputs
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      setFormState((prev) => ({
        ...prev,
        [id]: fileInput.files?.[0] || null,
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [id]: value,
      }));
    }

    // Clear errors when user types
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: { [key: string]: string } = {};
    if (!formState.productTitle)
      newErrors.productTitle = "Product title is required.";
    if (!formState.price) newErrors.price = "Price is required.";
    if (!formState.category) newErrors.category = "Category is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Form submitted:", formState);
  };

  return (
    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-semibold text-gray-700 capitalize dark:text-white">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Product Title */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            htmlFor="productTitle"
          >
            Product Title
          </label>
          <input
            id="productTitle"
            type="text"
            placeholder="Enter product title"
            className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${
              errors.productTitle ? "border-red-500" : "border-gray-200"
            } rounded-md dark:bg-gray-800 dark:text-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-300`}
            value={formState.productTitle}
            onChange={handleChange}
          />
          {errors.productTitle && (
            <p className="mt-1 text-sm text-red-500">{errors.productTitle}</p>
          )}
        </div>

        {/* Brand Name */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            htmlFor="brandName"
          >
            Brand Name
          </label>
          <input
            id="brandName"
            type="text"
            placeholder="Enter brand name"
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-300"
            value={formState.brandName}
            onChange={handleChange}
          />
        </div>

        {/* Price */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            htmlFor="price"
          >
            Price ($)
          </label>
          <input
            id="price"
            type="number"
            placeholder="Enter product price"
            className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${
              errors.price ? "border-red-500" : "border-gray-200"
            } rounded-md dark:bg-gray-800 dark:text-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-300`}
            value={formState.price}
            onChange={handleChange}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            className={`block w-full px-4 py-2 mt-2 text-gray-700 bg-white border ${
              errors.category ? "border-red-500" : "border-gray-200"
            } rounded-md dark:bg-gray-800 dark:text-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-300`}
            value={formState.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
            <option value="books">Books</option>
            <option value="toys">Toys</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Enter product description"
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-300"
            value={formState.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Product Image */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            htmlFor="productImage"
          >
            Product Image
          </label>
          <input
            id="productImage"
            type="file"
            accept="image/*"
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddProductForm;
