import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductBreadcrumbProps {
  category: string;
  title: string;
}

const ProductBreadcrumb = ({ category, title }: ProductBreadcrumbProps) => (
  <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
    <Link to="/" className="transition hover:text-orange-600">Home</Link>
    <ChevronRight className="h-4 w-4" />
    <Link to={`/product?category=${encodeURIComponent(category)}`} className="transition hover:text-orange-600">
      {category}
    </Link>
    <ChevronRight className="h-4 w-4" />
    <span className="line-clamp-1 text-gray-900">{title}</span>
  </nav>
);

export default ProductBreadcrumb;
