import React, { useState, useCallback } from "react";
import Heading from "../../../../Shared/Heading/Heading";
import useAuth from "../../../../Hooks/UseAuth";
import toast from "react-hot-toast";
import useAxiosPublic from "../../../../Hooks/UsePublic";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ImSpinner } from "react-icons/im";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { Category } from "../../../../types/category.type";
import { ApprovalStatus } from "../../../../constants/enums";
import CustomDropdown from "../../../../Shared/Dropdown/CustomDropdown";

const AddProductForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/categories");
      return res.data;
    },
  });
  const categories = categoryData?.data || [];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    addImages(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addImages(files);
    }
  };

  const addImages = (files: File[]) => {
    if (images.length + files.length > 5) {
      toast.error("You can only upload up to 5 images");
      return;
    }
    setImages(prev => [...prev, ...files]);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const productTitle = (form.elements.namedItem("productTitle") as HTMLInputElement).value;
    const brandName = (form.elements.namedItem("brandName") as HTMLInputElement).value;
    const priceString = (form.elements.namedItem("price") as HTMLInputElement).value;
    const price = parseFloat(priceString);
    const discount = (form.elements.namedItem("discount") as HTMLInputElement).value;
    const quantity = (form.elements.namedItem("quantity") as HTMLInputElement).value;
    const tags = (form.elements.namedItem("tags") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;

    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);
      
      // Upload images to backend
      const uploadRes = await axiosPublic.post("/upload/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      const imageUrls = uploadRes.data.data.display_urls;
      const primaryImage = imageUrls[0];

      const productData = {
        productTitle,
        brandName,
        price,
        discount: discount ? parseFloat(discount) : 0,
        quantity: quantity ? parseInt(quantity) : 0,
        tags,
        category: selectedCategory,
        description,
        productImage: primaryImage,
        productImages: imageUrls,
        hostEmail: user?.email,
        hostName: user?.displayName,
        hostPhoto: user?.photoURL,
        adminIsApproved: ApprovalStatus.PENDING,
        createdAt: new Date().toISOString()
      };

      const res = await axiosPublic.post("/products", productData);
      if (res.data.data.insertedId) {
        toast.success("Product added successfully");
        form.reset();
        setImages([]);
        setImagePreviews([]);
        setSelectedCategory("");
        navigate("/dashboard/my-host-listings");
      }
    } catch (err) {
      console.error("Product addition failed:", err);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl p-6 mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <Heading title="Add New Product" subtitle="Fill out the form below to list a new product." />

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="productTitle">
                Product Title
              </label>
              <input
                id="productTitle"
                name="productTitle"
                type="text"
                placeholder="Enter product title"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                required
              />
            </div>

            {/* Brand Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="brandName">
                Brand Name
              </label>
              <input
                id="brandName"
                name="brandName"
                type="text"
                placeholder="Enter brand name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="price">
                Price ($)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="Enter product price"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                required
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="discount">
                Discount (%)
              </label>
              <input
                id="discount"
                name="discount"
                type="number"
                min="0"
                max="100"
                placeholder="Enter discount percentage (optional)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="quantity">
                Stock Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                placeholder="Enter stock quantity"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="category">
                Category
              </label>
              <CustomDropdown
                value={selectedCategory}
                onChange={setSelectedCategory}
                className="w-full"
                options={[
                  { value: "", label: "Select category" },
                  ...categories.map((cat: Category) => ({
                    value: cat.name,
                    label: cat.name
                  }))
                ]}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="tags">
              Tags (Comma separated)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              placeholder="e.g. tech, new, trending"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Enter comprehensive product description"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
              required
            ></textarea>
          </div>

          {/* Product Images (Drag & Drop) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Images (Up to 5)
            </label>
            
            <div 
              className={`w-full relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors
                ${isDragging ? "border-orange-500 bg-orange-50/50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                <FiUploadCloud className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-gray-700 font-semibold mb-1">Click or drag images here to upload</p>
              <p className="text-gray-400 text-sm">PNG, JPG or WEBP (Max 5 images)</p>
            </div>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 shadow-sm">
                    <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md z-20"
                    >
                      <FiX size={14} />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-gray-900/80 backdrop-blur text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              disabled={loading || images.length === 0}
              type="submit"
              className={`w-full md:w-auto md:min-w-[200px] px-8 py-3.5 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center
                ${loading || images.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30"
                }`}
            >
              {loading ? (
                <ImSpinner size={22} className="animate-spin" />
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddProductForm;
