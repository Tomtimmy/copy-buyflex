import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Product, FilterState, Review } from '../types';
import { ProductCard } from './ProductCard';
import { HeroCarousel } from './HeroCarousel';
import { Testimonials } from './Testimonials';
import { LocationMap } from './LocationMap';
import { NewArrivals } from './NewArrivals';
import { BestSellers } from './BestSellers';
import { BrandGallery } from './BrandGallery';
import { Awards } from './Awards';
import { Subscription } from './Subscription';

interface Testimonial extends Review {
    productName: string;
}

interface ShopProps {
  products: Product[];
  wishlist: number[];
  filters: FilterState;
  sortBy: string;
  searchQuery: string;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onSortChange: (sortBy: string) => void;
  onQuickView: (product: Product) => void;
  allCategories: string[];
  approvedReviews: Testimonial[];
  newArrivals: Product[];
  bestSellers: Product[];
  onSubscribe: (email: string) => void;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
  </svg>
);


export const Shop: React.FC<ShopProps> = ({
  products,
  wishlist,
  filters,
  sortBy,
  searchQuery,
  onAddToCart,
  onSelectProduct,
  onToggleWishlist,
  onFiltersChange,
  onSortChange,
  onQuickView,
  allCategories,
  approvedReviews,
  newArrivals,
  bestSellers,
  onSubscribe,
}) => {
  const showHomepageSections = !searchQuery;

  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useCallback(node => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && visibleCount < products.length) {
            setIsLoadingMore(true);
            setTimeout(() => {
                setVisibleCount(prev => prev + 6);
                setIsLoadingMore(false);
            }, 500); // Simulate network delay
        }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, visibleCount, products.length]);
  
  // Reset visible count when filters or products change
  useEffect(() => {
    setVisibleCount(9);
  }, [products]);


  return (
    <>
      {showHomepageSections && <HeroCarousel onCategorySelect={(category) => onFiltersChange({ category })} />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <div className="sticky top-24 bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Filters</h3>
              <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select id="category" value={filters.category} onChange={e => onFiltersChange({ category: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500">
                        {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Price Filter */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">Max Price: <span className="font-bold text-green-400">${filters.price.toFixed(0)}</span></label>
                    <input type="range" id="price" min="10" max="200" step="5" value={filters.price} onChange={e => onFiltersChange({ price: parseInt(e.target.value) })} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                  </div>
                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                    <div className="flex justify-between items-center">
                      {[1, 2, 3, 4].map(star => (
                        <button key={star} onClick={() => onFiltersChange({ rating: star })} className={`flex items-center justify-center p-2 w-10 h-10 rounded-full transition-colors text-sm ${filters.rating === star ? 'bg-green-500 text-white' : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'}`}>
                          {star}<StarIcon className="w-3 h-3 ml-0.5"/>+
                        </button>
                      ))}
                      {filters.rating > 0 && <button onClick={() => onFiltersChange({ rating: 0 })} className="text-xs text-gray-400 hover:text-white">clear</button>}
                    </div>
                  </div>
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-3xl font-bold text-white">{searchQuery ? `Results for "${searchQuery}"` : 'Our Products'}</h2>
              <div>
                  <label htmlFor="sort" className="sr-only">Sort by</label>
                  <select id="sort" value={sortBy} onChange={e => onSortChange(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500">
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating-desc">Highest Rating</option>
                      <option value="name-asc">Name (A-Z)</option>
                  </select>
              </div>
            </div>
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.slice(0, visibleCount).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={onAddToCart}
                      onSelectProduct={onSelectProduct}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlist.includes(product.id)}
                      onQuickView={onQuickView}
                    />
                  ))}
                </div>
                <div ref={loaderRef} className="h-20 flex justify-center items-center">
                    {isLoadingMore && (
                        <div className="flex items-center space-x-2 text-gray-400">
                            <svg className="animate-spin h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading more...</span>
                        </div>
                    )}
                    {visibleCount >= products.length && products.length > 0 && !isLoadingMore && (
                        <p className="text-gray-500">You've reached the end.</p>
                    )}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-lg">No products found.</p>
                  <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showHomepageSections && (
        <div className="space-y-16 md:space-y-24 mt-12">
            <NewArrivals products={newArrivals} onSelectProduct={onSelectProduct} />
            <BestSellers products={bestSellers} onSelectProduct={onSelectProduct} />
            <BrandGallery />
            {approvedReviews.length > 0 && <Testimonials reviews={approvedReviews} />}
            <Awards />
            <Subscription onSubscribe={onSubscribe} />
            <LocationMap />
        </div>
      )}
    </>
  );
};