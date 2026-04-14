import Link from "next/link";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { getBlogPosts } from "@/lib/services/content";
import { getFeaturedProducts } from "@/lib/services/products";
import { formatCurrency } from "@/lib/utils";

const HomePage = async () => {
  const [featuredProducts, blogPosts] = await Promise.all([
    getFeaturedProducts(),
    getBlogPosts(),
  ]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[480px] w-full rounded-xl overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          aria-label="Zen-like forest scene with soft morning mist rolling over ancient green trees and filtered sunlight rays." 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGsqMbyhgERqEMFzOkuX0PWQYzLP5CVVkJwfsK5bfy-0VBxMZR69sMzalGNQNyDUEBWRvkVVcvJS3w9PtblDqtdzZP4CbA9An5d3SdItnQIrH5AK5h_-GONAQzms6UlxJDdsQ_XWx8lpKS_DCxtDg5k7OlKJMsHmtz4tW1fwNDFaijBzQDIFsIkcOG6v9_Okdj-SzCf2W9WQYkkfdf19gneowyczKbmDAl2sqpSABKi328rQRDKPzXum8LOJ-3DSbTYOv6gG7YH4k')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <h2 className="font-headline text-4xl text-surface mb-2 tracking-tight">Balance Your Doshas</h2>
          <p className="text-surface-container-low font-light mb-6 opacity-90">Ancient wisdom for modern living</p>
          <Link href="/products" className="inline-block bg-surface text-primary px-8 py-3 rounded-full font-label text-[10px] tracking-widest uppercase font-bold hover:bg-primary-fixed transition-colors duration-400">
            Explore Rituals
          </Link>
        </div>
        {/* Carousel Pagination Indicator */}
        <div className="absolute bottom-4 right-8 flex gap-2">
          <div className="w-8 h-1 bg-surface rounded-full"></div>
          <div className="w-2 h-1 bg-surface/40 rounded-full"></div>
          <div className="w-2 h-1 bg-surface/40 rounded-full"></div>
        </div>
      </section>

      {/* Smart Intent Section */}
      <section className="bg-surface-container-low rounded-xl p-6">
        <h3 className="font-headline text-xl text-on-surface mb-6">What are you looking for today?</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/products?category=skin-beauty" className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-full text-sm font-medium text-secondary shadow-sm hover:bg-primary-container hover:text-surface-container transition-all duration-400">
            <span>Radiance</span><span>✨</span>
          </Link>
          <Link href="/products?category=mental-wellness" className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-full text-sm font-medium text-secondary shadow-sm hover:bg-primary-container hover:text-surface-container transition-all duration-400">
            <span>Better Sleep</span><span>🌙</span>
          </Link>
          <Link href="/products?category=immunity-health" className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-full text-sm font-medium text-secondary shadow-sm hover:bg-primary-container hover:text-surface-container transition-all duration-400">
            <span>Digestion</span><span>🌿</span>
          </Link>
          <Link href="/products?category=mental-wellness" className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-full text-sm font-medium text-secondary shadow-sm hover:bg-primary-container hover:text-surface-container transition-all duration-400">
            <span>Stress Relief</span><span>🧘</span>
          </Link>
          <Link href="/products?category=immunity-health" className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-full text-sm font-medium text-secondary shadow-sm hover:bg-primary-container hover:text-surface-container transition-all duration-400">
            <span>Immunity</span><span>⚡</span>
          </Link>
        </div>
      </section>

      {/* Shop by Concern */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="font-headline text-2xl">Shop by Concern</h3>
          <Link href="/products" className="block text-tertiary-fixed-dim text-sm font-medium underline underline-offset-4 decoration-tertiary cursor-pointer hover:opacity-80 hover:text-tertiary transition-opacity">Discover More</Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/products?category=skin-beauty" className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" alt="Skin" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGXFLJim-YQm8WGozZpbP9QteEBqe-R4XSM_ytWzMYfzRgYq9V2JYvWig3OdFtYn_pShznomAAnEpe7-5EXC0iJ6r5yx_Cb0fjKI9g2zoj6_hMTfNDKqx9bgZJEdZCcmb3fgjOINzgi2FykgksvP7ZeO5NL_AzHQmoDGQMHed9OndfQl-o4m22OzX6tB0TEWkNyiu8L6UQv1a02MmkfRRWWHk67fkNjPlZ-O-dep0GHqe2Wv7DnfEE8GmTuk-BI44NYOH_6FMh3nA"/>
            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-surface font-headline text-lg">Skin</span>
            </div>
          </Link>
          <Link href="/products?category=mental-wellness" className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" alt="Sleep" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxe1yil6y9T9gvq2Kqrjxwb-04qR_TLmVMdYKXPW1patcHwQkoMyne5elEEn8_GXWknl02R0p-J_703F3w4k8bEt4U8C0t1X8iP4HGFAqaDW59c2pZmIAdVza_h7JsAu_ur8v4Mkey6WA22UVooT1KV9qpajun3NQ6kUD5hJeAm9rpR5y8kqQZxHIVivb6mMVEtu_LbvXuO_vINsX0YuJmamwPJTIk5SsdgJiQS66vWp2uwJHl8Y6rgde8eg3kXJYZC9SRBQ-KdSM"/>
            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-surface font-headline text-lg">Sleep</span>
            </div>
          </Link>
          <Link href="/products?category=immunity-health" className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" alt="Digestion" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlo2ALq2YCg7D08S3yGvFW9gk2HVGxcFW7lbQlhE2nZQuuc1QkIcKX6WV7TKb2wBLGvbhQIXiAHDazDKsBta9PQ_K4MKt1rYN0uLSoypFqthgrsTH187G-Ohs4Cq3q-BNWY_PzWCcwhFSjydjmwb0x4h88AoYm7Yu8CIUdyfrD-YYgFM_A4liE0dVCVl3CtlZABuwKQ4X1yuvEPZcuadrtE0SgZXlIuQIQPvl9AVhg-_osHjZZPm9cKJntQTqK8hMXXYrGDZONRUM"/>
            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-surface font-headline text-lg">Digestion</span>
            </div>
          </Link>
          <Link href="/products" className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" alt="Hair" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC33V30ZoeRS0Qp4IQpCdC06Q8VlYzLmTRqg-a-8QV79Xj6Wo6hJeUiWDZoUl8e1CLSeqNJobcv6y9E7iMEuhZrNvWdcNQQw7h9m3tm2xAIMRiY1qNnYsqZEAk4Yxiw3PAMY60Lq2xLVIujM5sLFVySlfTueeSc1ciedcKbrml3p8CjOImUq-S4RiP90J2TK3h31-freAqMcA1lFe7p1QnZ1friZ9q_oLPiMhVPZGro6ZfCxZKTEpYNFWsrwDp1ActbNYOKjl52av4"/>
            <div className="absolute inset-0 bg-primary/30 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-surface font-headline text-lg">Hair</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="-mx-4 px-4 overflow-hidden">
        <div className="flex justify-between items-end mb-6">
          <h3 className="font-headline text-2xl">Featured Elixirs</h3>
          <Link href="/products" className="text-tertiary-fixed-dim text-sm font-medium underline underline-offset-4 decoration-tertiary cursor-pointer hover:opacity-80 hover:text-tertiary transition-opacity">View All</Link>
        </div>
        <div className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4 select-none">
          {featuredProducts.map((product, index) => {
            const badgeColors = index % 2 === 0 
              ? "bg-primary/10 text-primary" 
              : "bg-tertiary-fixed/30 text-on-tertiary-fixed-variant";
            
            return (
              <div key={product.id} className="min-w-[280px] bg-surface-container-lowest rounded-xl p-4 snap-start shadow-[0px_20px_40px_rgba(28,28,22,0.04)] block">
                <div className="relative aspect-[4/5] bg-surface-container-low rounded-lg mb-4 overflow-hidden group/img cursor-pointer">
                  <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      className="object-cover w-full h-full group-hover/img:scale-105 transition-transform duration-700" 
                      alt={product.name} 
                      src={product.images[0]}
                    />
                  </Link>
                  {product.tags && product.tags.length > 0 && (
                    <div className="absolute top-2 left-2 pointer-events-none">
                      <span className={`${badgeColors} text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full backdrop-blur-md`}>
                        {product.tags[0].replace("-", " ")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Link href={`/products/${product.slug}`}>
                    <h4 className="font-headline text-lg text-primary truncate hover:opacity-80 transition-opacity" title={product.name}>{product.name}</h4>
                  </Link>
                  <p className="text-on-surface-variant text-sm">{formatCurrency(product.price, product.currency)}</p>
                  
                  <AddToCartButton 
                    product={product} 
                    className="w-full mt-4 py-2 border border-outline-variant/30 rounded-full font-label text-[10px] tracking-widest uppercase hover:bg-primary-container hover:text-white transition-all bg-transparent text-primary"
                    label="Add to Ritual"
                    icon={null}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Wisdom/Journal Section */}
      <section className="-mx-4 px-4 overflow-hidden">
        <div className="flex justify-between items-end mb-6">
          <h3 className="font-headline text-2xl">The Wisdom Journal</h3>
          <Link href="/blogs" className="block text-tertiary-fixed-dim text-sm font-medium underline underline-offset-4 decoration-tertiary cursor-pointer hover:opacity-80 hover:text-tertiary transition-opacity">Read All</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 select-none">
          {blogPosts.map((post, index) => {
            const cardThemes = [
              "bg-secondary-container text-on-secondary-fixed-variant text-primary",
              "bg-tertiary-container/30 text-on-tertiary-fixed-variant text-primary",
              "bg-surface-container-high text-primary text-primary"
            ];
            const activeTheme = cardThemes[index % cardThemes.length];
            const [bgClass, tagColor, titleColor] = activeTheme.split(" ");
            
            return (
              <Link key={post.id} href={`/blogs/${post.slug}`} className={`min-w-[300px] h-64 ${bgClass} rounded-xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 block`}>
                <div>
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${tagColor}`}>{post.category}</span>
                  <h4 className={`font-headline text-2xl mt-2 leading-tight ${titleColor}`}>{post.title}</h4>
                </div>
                <div className="flex justify-between items-center text-xs opacity-70">
                  <span>{post.readTime}</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Quote Block */}
      <section className="py-16 text-center border-t border-outline-variant/10">
        <div className="max-w-xs mx-auto">
          <p className="font-headline italic text-2xl text-primary leading-relaxed mb-4">
            &quot;Healing begins when balance is restored within.&quot;
          </p>
          <p className="font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">
            Inspired by Sushruta Samhita
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
