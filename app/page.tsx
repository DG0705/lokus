import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

// Fetch products from Supabase (only first 3 for homepage)
async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, image_url, slug')
    .limit(3);
  
  if (error || !data) return [];
  return data;
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <main className="bg-white">
      
      {/* HERO SECTION - Full screen with overlay */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background image - replace with your own hero image URL */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/30" /> {/* Dark overlay for text contrast */}
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-wider mb-4 font-light">Spring 2025 Collection</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Where every step<br />finds its place
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            LOKUS is not just footwear. It's the intersection of precision engineering and timeless design.
          </p>
          <Link 
            href="/men" 
            className="inline-block bg-white text-black px-10 py-4 rounded-full font-medium hover:bg-gray-100 transition transform hover:scale-105 duration-300"
          >
            Discover the Collection
          </Link>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS - Clean grid with hover zoom */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Curated Selection</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured this week</h2>
          <div className="w-16 h-0.5 bg-black mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.length > 0 ? products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group">
              <div className="bg-gray-50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-200">
                      👟
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-1">{product.name}</h3>
                  <p className="text-gray-500">${product.price}</p>
                </div>
              </div>
            </Link>
          )) : (
            // Placeholder if no products in DB
            [1,2,3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-4xl mb-4">
                  👟
                </div>
                <h3 className="font-semibold">Premium Sneaker {i}</h3>
                <p className="text-gray-500">$129</p>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/men" className="inline-flex items-center gap-2 border-b border-black pb-1 font-medium hover:gap-3 transition-all">
            View all shoes
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* BRAND STORY - Asymmetric layout */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Our ethos</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Engineered for the modern path
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Every LOKUS shoe is born from a simple belief: the ground beneath you deserves respect. 
                We spent two years studying foot mechanics, materials science, and timeless silhouettes 
                to create footwear that moves with you, not against you.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                From the city commute to the weekend escape, LOKUS is your silent partner. 
                No logos. No noise. Just purpose.
              </p>
              <Link href="/about" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                Our story
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-gray-200 rounded-2xl aspect-square flex items-center justify-center text-8xl overflow-hidden">
                {/* Replace with a real brand image */}
                <img 
                  src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2025&auto=format" 
                  alt="LOKUS craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER + COMMUNITY */}
      <section className="py-24 px-4 text-center max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Join the movement</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          First access, exclusive drops
        </h2>
        <p className="text-gray-600 mb-8">
          Be the first to know about new arrivals, limited editions, and members-only experiences.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email address"
            className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-black"
            required
          />
          <button 
            type="submit"
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl tracking-tight mb-4">LOKUS</h3>
            <p className="text-sm text-gray-500">Where every step finds its place.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/men">Men</Link></li>
              <li><Link href="/women">Women</Link></li>
              <li><Link href="/new-arrivals">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/size-guide">Size Guide</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Follow</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">TikTok</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
          © 2025 LOKUS. All rights reserved.
        </div>
      </footer>
    </main>
  );
}