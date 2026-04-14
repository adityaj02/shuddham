import Link from "next/link";
import Image from "next/image";

import { BlogCard } from "@/components/shared/blog-card";
import { getBlogPosts } from "@/lib/services/content";

const BlogsPage = async () => {
  const posts = await getBlogPosts();
  const featured = posts[0];
  const articleList = posts.slice(1, 4);
  const archives = posts.slice(4);

  /* Unique categories for filter chips */
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  /* Category icon mapping */
  const categoryIcons: Record<string, string> = {
    Ghee: "spa",
    Honey: "eco",
    Ayurveda: "self_improvement",
    Pantry: "healing",
    "Seasonal Wellness": "calendar_today",
    Mindfulness: "self_improvement",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-12">
      {/* ─── Hero Section ──────────────────────────────────────────── */}
      <section className="relative w-full h-[530px] rounded-3xl overflow-hidden group">
        <div className="absolute inset-0 bg-primary/40 z-10 transition-colors group-hover:bg-primary/30"></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Forest canopy with soft sunlight filtering through leaves"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2aW9Flqn_ZprKu80IaB9Gp0tnwkmGg4-A7FlJrcKnFEl-KwG1puaFKNK0kiIk2skz62PcLaRN8Xv99O4rX235RioyTaH9UesiF8NrRVp6yNLAJxacQsKtFnNP1HGpbtLVwZR8Llf6qmEHXhpeANVbfbQFLCQkLlqlmaGpvrsnFLOqC6DJa7Bz1YGLJ7ajk-veJzrkUjvkZmVx5cNPHvjcbSYRtuE9KMns-OldJRR2d9tZY-wk1LdGB-5-HnQVXpbESSYiQmSwGnk"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-4xl md:text-6xl font-headline text-surface font-bold leading-tight max-w-3xl">
            Sacred Wisdom for Modern Living
          </h2>
          <p className="mt-6 text-lg md:text-xl text-surface-variant font-light max-w-xl">
            Where ancient lineage meets the rhythm of your current soul.
          </p>
          <div className="mt-10 h-12 w-px bg-surface/50"></div>
        </div>
      </section>

      {/* ─── Category Filters ──────────────────────────────────────── */}
      <section className="py-4">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4">
          <span className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-label text-sm tracking-wider shadow-lg shrink-0">
            <span className="material-symbols-outlined text-sm">filter_list</span> All
          </span>
          {categories.map((cat) => (
            <span
              key={cat}
              className="flex items-center gap-2 px-6 py-3 bg-surface-container-high text-on-surface rounded-full font-label text-sm tracking-wider hover:bg-surface-variant transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                {categoryIcons[cat] ?? "spa"}
              </span>
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Featured Article ──────────────────────────────────────── */}
      {featured && (
        <section>
          <div className="grid md:grid-cols-12 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0px_20px_40px_rgba(28,28,22,0.06)] border border-outline-variant/10">
            <Link href={`/blogs/${featured.slug}`} className="md:col-span-7 h-80 md:h-auto overflow-hidden block relative">
              <Image
                src={featured.coverImage}
                alt={featured.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </Link>
            <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center bg-surface-container-lowest">
              <div className="flex items-center gap-4 text-xs font-label uppercase tracking-widest text-primary/60 mb-6">
                <span>{featured.category}</span>
                <span className="w-1 h-1 bg-primary/20 rounded-full"></span>
                <span>{featured.readTime}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-headline text-primary mb-6 leading-tight">
                {featured.title}
              </h3>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                {featured.excerpt}
              </p>
              <Link
                href={`/blogs/${featured.slug}`}
                className="group flex items-center gap-3 text-primary font-bold tracking-widest text-sm uppercase"
              >
                Read Narrative
                <span className="w-8 h-px bg-primary transition-all group-hover:w-12"></span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Article List (Magazine Layout) ────────────────────────── */}
      {articleList.length > 0 && (
        <section className="space-y-10">
          <h4 className="text-xs font-label uppercase tracking-[0.2em] text-primary/50 text-center">
            Recent Narratives
          </h4>
          <div className="grid gap-12">
            {articleList.map((post) => (
              <BlogCard key={post.id} post={post} variant="magazine" />
            ))}
          </div>
        </section>
      )}

      {/* ─── Quote Block ───────────────────────────────────────────── */}
      <section className="py-20 flex flex-col items-center text-center">
        <span
          className="material-symbols-outlined text-tertiary-container text-4xl mb-6"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          eco
        </span>
        <blockquote className="text-3xl md:text-5xl font-headline italic text-primary leading-tight max-w-2xl px-4">
          &quot;Healing begins when balance is restored within.&quot;
        </blockquote>
        <div className="mt-8 h-px w-24 bg-primary/20"></div>
      </section>

      {/* ─── Visual Story Cards ────────────────────────────────────── */}
      {posts.length >= 2 && (
        <section className="grid md:grid-cols-2 gap-6">
          {posts.slice(0, 2).map((post, index) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="relative h-[450px] rounded-3xl overflow-hidden group cursor-pointer shadow-lg block"
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${index === 0 ? "from-primary/80" : "from-[#4e3d00]/80"} to-transparent flex flex-col justify-end p-10`}>
                <span className="text-xs font-label uppercase tracking-widest text-white/70 mb-2">Visual Story</span>
                <h5 className="text-3xl font-headline text-white mb-4">{post.title}</h5>
                <div className="w-10 h-1 bg-tertiary-fixed rounded-full group-hover:w-20 transition-all duration-500"></div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* ─── Newsletter Section ────────────────────────────────────── */}
      <section className="pb-12">
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-16 text-center shadow-[0px_30px_60px_rgba(28,28,22,0.05)] border border-outline-variant/5">
          <div className="max-w-xl mx-auto">
            <h3 className="text-3xl font-headline text-primary mb-4">The Shuddham Letter</h3>
            <p className="text-on-surface-variant mb-10 leading-relaxed">
              A monthly curation of seasonal rituals, artisanal discoveries, and botanical wisdom delivered to your sanctuary.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                className="flex-1 bg-surface-container-low border-none focus:ring-0 focus:border-primary px-6 py-4 rounded-2xl placeholder:text-on-surface-variant/40"
                placeholder="Email Address"
                type="email"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-label tracking-widest rounded-2xl shadow-xl hover:shadow-2xl transition-all uppercase text-sm font-bold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── Journal Archives ──────────────────────────────────────── */}
      {archives.length > 0 && (
        <section className="space-y-10">
          <h3 className="font-headline text-3xl text-primary border-b border-outline-variant/15 pb-6">
            Journal Archives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {archives.map((post) => (
              <BlogCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogsPage;
