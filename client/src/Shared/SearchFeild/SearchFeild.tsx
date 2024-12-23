import React, { useState } from "react";

const SearchFeild: React.FC = () => {
  const [search, setSearch] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const SearchFelidValue = e.target.search.value;
    setSearch(SearchFelidValue);
  };
  // console.log(search);
  return (
    <div>
      <div className="w-full h-auto mx-auto p-4 bg-red-400">
        {/* Heading Section */}
        <div className="text-center mb-4">
          <h2 className="text-2xl   font-semibold">Search Products</h2>
          <div className="divider divider-neutral">All Product</div>
          <p className="text-xl">
            Find your desired products by brand, category, or title
          </p>
        </div>

        {/* Search Box Section */}
        <form
          onSubmit={handleSearch}
          className="flex  md:flex-row items-center justify-center gap-2 w-full"
        >
          <input
            type="text"
            placeholder="Search by brand, category, or title"
            name="search"
            required
            //   value={searchText}
            //   onChange={(e) => setSearchText(e.target.value)}
            className="input input-bordered w-full md:w-full max-w-screen-sm"
          />

          <button
            className=" px-5  py-3 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                    border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchFeild;
