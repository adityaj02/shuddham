import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/shared/blog-card";
import { ProductCard } from "@/components/shared/product-card";
import { getBlogPostBySlug, getBlogPosts, getRelatedBlogPosts } from "@/lib/services/content";
import { getFeaturedProducts } from "@/lib/services/products";

const BlogDetailsPage = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const [relatedPosts, featuredProducts] = await Promise.all([
    getRelatedBlogPosts(post.slug, post.category),
    getFeaturedProducts(),
  ]);
  const fallbackPosts = relatedPosts.length ? relatedPosts : (await getBlogPosts()).slice(0, 3);

  return (
    <>
      {/* ─── Hero Section ──────────────────────────────────────────── */}
      <section className="relative w-full h-[500px] md:h-[618px] flex items-end overflow-hidden rounded-b-3xl">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12 w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-surface-container-lowest/70 backdrop-blur-md text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20">
              {post.category}
            </span>
            <span className="text-surface/80 text-sm">{post.readTime}</span>
          </div>
          <h1 className="font-headline text-4xl md:text-6xl text-surface leading-tight tracking-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-surface font-semibold text-sm">SHUDDHAM Journal</p>
              <p className="text-surface/70 text-xs">
                {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Article Content ───────────────────────────────────────── */}
      <article className="max-w-3xl mx-auto px-6 mt-16 space-y-12 leading-relaxed">
        <div className="text-lg md:text-xl text-on-surface-variant font-light italic border-l-2 border-primary-fixed-dim pl-6 py-2">
          {post.excerpt}
        </div>

        <div className="space-y-6">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-on-surface text-lg leading-8">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/20">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 bg-surface-container-highest rounded-full text-xs text-secondary font-medium uppercase tracking-widest"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>

      {/* ─── Quote Break ───────────────────────────────────────────── */}
      <section className="py-20 flex flex-col items-center text-center max-w-3xl mx-auto">
        <span
          className="material-symbols-outlined text-tertiary-container text-3xl mb-4"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          eco
        </span>
        <blockquote className="text-2xl md:text-3xl font-headline italic text-primary leading-tight max-w-lg px-4">
          &quot;Healing begins when balance is restored within.&quot;
        </blockquote>
        <div className="mt-6 h-px w-16 bg-primary/20"></div>
      </section>

      {/* ─── Related Products ──────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mt-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-1">
              <span className="text-tertiary-fixed-dim text-xs tracking-widest font-bold uppercase">
                Curated For Balance
              </span>
              <h3 className="font-headline text-3xl text-primary">Support Your Dosha</h3>
            </div>
            <Link
              href="/products"
              className="text-primary text-sm font-medium underline underline-offset-8 decoration-outline-variant hover:decoration-primary transition-all"
            >
              View Apothecary
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-6 no-scrollbar snap-x pb-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} variant="carousel" />
            ))}
          </div>
        </section>
      )}

      {/* ─── Related Articles ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 mt-16 mb-12 space-y-8">
        <div className="space-y-1">
          <span className="text-tertiary-fixed-dim text-xs tracking-widest font-bold uppercase">Keep Reading</span>
          <h2 className="font-headline text-3xl text-primary">Related Articles</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {fallbackPosts.map((relatedPost) => (
            <BlogCard key={relatedPost.id} post={relatedPost} variant="compact" />
          ))}
        </div>
      </section>
    </>
  );
};

export default BlogDetailsPage;
