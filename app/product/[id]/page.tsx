import { supabase } from '@/app/lib/supabase';
import { notFound } from 'next/navigation';

// Force dynamic rendering – no static generation at build time
export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product = null;
  let error = null;

  try {
    const { data, error: dbError } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (dbError) throw dbError;
    product = data;
  } catch (err) {
    console.error('Failed to fetch product:', err);
    error = err;
  }

  if (!product || error) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl">👟</span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-gray-600 mb-4">${product.price}</p>
          <p className="text-gray-700 mb-6">{product.description || 'Premium footwear for the modern path.'}</p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size: number) => (
                  <button
                    key={size}
                    className="border border-gray-300 rounded-lg px-4 py-2 hover:border-black transition"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    className="border border-gray-300 rounded-lg px-4 py-2 hover:border-black transition"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition font-medium">
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}