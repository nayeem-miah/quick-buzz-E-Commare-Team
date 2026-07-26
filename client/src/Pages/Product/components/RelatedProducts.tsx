import { Link } from 'react-router-dom';
import Card from '../Card';
import { ProductItem } from '../types';

interface RelatedProductsProps {
  category: string;
  products: ProductItem[];
}

const RelatedProducts = ({ category, products }: RelatedProductsProps) => {
  if (!products.length) return null;

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-950 sm:text-2xl">You may also like</h2>
        <Link to={`/product?category=${encodeURIComponent(category)}`} className="text-sm font-semibold text-orange-600 hover:text-orange-700">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {products.map((product) => (
          <Card key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
