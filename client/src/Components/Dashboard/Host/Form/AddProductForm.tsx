import React, { useState, useCallback, KeyboardEvent } from "react";
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

  // Form State
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  
  // Tags State
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Validation State
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

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

  // Computed Form Validity
  const isFormValid = 
    title.trim() !== "" && 
    brand.trim() !== "" && 
    price.trim() !== "" && 
    quantity.trim() !== "" && 
    category !== "" && 
    description.trim() !== "" && 
    images.length > 0;

  // --- Handlers ---
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
  }, [images]);

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

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Handler
  const submitForm = async (status: ApprovalStatus) => {
    setHasSubmitted(true);
    
    if (!isFormValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);
      
      const uploadRes = await axiosPublic.post("/upload/images", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const imageUrls = uploadRes.data.data.display_urls;
      const primaryImage = imageUrls[0];

      const productData = {
        productTitle: title.trim(),
        brandName: brand.trim(),
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : 0,
        quantity: parseInt(quantity),
        tags: tags.join(","),
        category,
        description: description.trim(),
        productImage: primaryImage,
        productImages: imageUrls,
        hostEmail: user?.email,
        hostName: user?.displayName,
        hostPhoto: user?.photoURL,
        adminIsApproved: status,
        createdAt: new Date().toISOString()
      };

      const res = await axiosPublic.post("/products", productData);
      if (res.data.data.insertedId) {
        toast.success(`Product ${status === ApprovalStatus.PENDING ? 'added' : 'saved as draft'} successfully`);
        // Reset form
        setTitle("");
        setBrand("");
        setPrice("");
        setDiscount("");
        setQuantity("");
        setDescription("");
        setTags([]);
        setCategory("");
        setImages([]);
        setImagePreviews([]);
        setHasSubmitted(false);
        setTouched({});
        navigate("/dashboard/my-host-listings");
      }
    } catch (err) {
      console.error("Product addition failed:", err);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(ApprovalStatus.PENDING);
  };

  const handleDraft = () => {
    submitForm(ApprovalStatus.DRAFT as ApprovalStatus);
  };

  // Helper for input styles
  const inputBaseStyle = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-inter text-gray-800 placeholder-gray-400";
  const errorStyle = "border-red-400 focus:ring-red-500/20 focus:border-red-500";

  return (
    <section className="w-full p-4 sm:p-6 font-inter">
      <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8">
        <Heading title="Add New Product" subtitle="Fill out the form below to list a new product." />

        <form onSubmit={handleSubmit} className="mt-8 space-y-10">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="title">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => handleBlur('title')}
                  placeholder="Enter product title"
                  className={`${inputBaseStyle} ${(hasSubmitted || touched.title) && !title.trim() ? errorStyle : ""}`}
                />
                {(hasSubmitted || touched.title) && !title.trim() && <p className="text-red-500 text-xs mt-1.5 font-medium">Title is required.</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="brand">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  onBlur={() => handleBlur('brand')}
                  placeholder="Enter brand name"
                  className={`${inputBaseStyle} ${(hasSubmitted || touched.brand) && !brand.trim() ? errorStyle : ""}`}
                />
                {(hasSubmitted || touched.brand) && !brand.trim() && <p className="text-red-500 text-xs mt-1.5 font-medium">Brand is required.</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  value={category}
                  onChange={setCategory}
                  searchable={true}
                  className={`w-full ${hasSubmitted && !category ? "border border-red-400 rounded-xl" : ""}`}
                  options={[
                    { value: "", label: "Select category" },
                    ...categories.map((cat: Category) => ({
                      value: cat.name,
                      label: cat.name
                    }))
                  ]}
                />
                {hasSubmitted && !category && <p className="text-red-500 text-xs mt-1.5 font-medium">Category is required.</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Pricing & Inventory</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="price">
                  Price (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onBlur={() => handleBlur('price')}
                  placeholder="0.00"
                  className={`${inputBaseStyle} ${(hasSubmitted || touched.price) && !price ? errorStyle : ""}`}
                />
                {(hasSubmitted || touched.price) && !price && <p className="text-red-500 text-xs mt-1.5 font-medium">Price is required.</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="discount">
                  Discount (%)
                </label>
                <input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                  className={inputBaseStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="quantity">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onBlur={() => handleBlur('quantity')}
                  placeholder="0"
                  className={`${inputBaseStyle} ${(hasSubmitted || touched.quantity) && !quantity ? errorStyle : ""}`}
                />
                {(hasSubmitted || touched.quantity) && !quantity && <p className="text-red-500 text-xs mt-1.5 font-medium">Quantity is required.</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Product Details</h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="tags">
                Tags
              </label>
              <div className="w-full min-h-[50px] p-2 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span key={index} className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    {tag}
                    <button type="button" onClick={() => removeTag(index)} className="hover:text-orange-900 focus:outline-none ml-1">
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? "Type and press Enter to add tags..." : ""}
                  className="flex-1 min-w-[150px] bg-transparent outline-none py-1.5 px-2 text-sm text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleBlur('description')}
                placeholder="Enter comprehensive product description"
                className={`${inputBaseStyle} resize-none ${(hasSubmitted || touched.description) && !description.trim() ? errorStyle : ""}`}
              ></textarea>
              {(hasSubmitted || touched.description) && !description.trim() && <p className="text-red-500 text-xs mt-1.5 font-medium">Description is required.</p>}
            </div>
          </div>

          {/* Section 4: Media */}
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b pb-2 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Product Images <span className="text-red-500">*</span></h3>
              <span className={`text-sm font-semibold ${images.length === 5 ? 'text-orange-500' : 'text-gray-500'}`}>
                {images.length}/5 Uploaded
              </span>
            </div>
            
            <div 
              className={`w-full relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300
                ${isDragging ? "border-orange-500 bg-orange-50" : 
                  (hasSubmitted && images.length === 0) ? "border-red-400 bg-red-50" : 
                  "border-gray-200 bg-gray-50 hover:bg-gray-100"}
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
                disabled={images.length >= 5}
              />
              <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                <FiUploadCloud className={`w-8 h-8 ${isDragging ? "text-orange-600 scale-110" : "text-gray-400"} transition-transform`} />
              </div>
              <p className="text-gray-700 font-semibold mb-1 text-center">Click or drag images here to upload</p>
              <p className="text-gray-400 text-sm text-center">PNG, JPG or WEBP</p>
            </div>
            {hasSubmitted && images.length === 0 && <p className="text-red-500 text-xs mt-1.5 font-medium">At least one image is required.</p>}

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 shadow-sm">
                    <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-white/90 text-red-500 hover:text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 shadow-sm z-20"
                    >
                      <FiX size={16} />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-6 mt-8 border-t flex flex-col sm:flex-row justify-end items-center gap-4">
            <button
              type="button"
              onClick={handleDraft}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 text-gray-700 font-bold bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-4 focus:ring-gray-100"
            >
              Save as Draft
            </button>
            <button
              disabled={loading || (hasSubmitted && !isFormValid)}
              type="submit"
              className={`w-full sm:w-auto sm:min-w-[200px] px-8 py-3.5 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center
                ${!isFormValid && hasSubmitted
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
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
