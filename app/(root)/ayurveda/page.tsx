import Link from "next/link";
import { Leaf, Sparkles } from "lucide-react";

import { ProductCard } from "@/components/shared/product-card";
import { getAyurvedaContent } from "@/lib/services/content";
import { getProducts } from "@/lib/services/products";

const AyurvedaPage = async () => {
  const [content, products] = await Promise.all([
    getAyurvedaContent(),
    getProducts(),
  ]);

  const curatedProducts = products.filter((product) =>
    ["cat-wellness", "cat-ghee", "cat-honey"].includes(product.categoryId)
  );

  return (
    <div className="page-shell space-y-12">
      <section className="glass-card overflow-hidden px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <p className="badge-soft">Ayurveda</p>
            <h1 className="display-title">Bring Ayurvedic thinking into a modern daily pantry.</h1>
            <p className="section-copy">
              This section turns content into commerce: educational entry points, seasonal wellness narratives,
              and direct product pairings that make the catalog easier to navigate on mobile.
            </p>
            <div className="grid gap-3">
              {content.heroPoints.map((point) => (
                <div key={point} className="rounded-2xl bg-white/70 p-4 text-sm text-muted-foreground">
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {content.sections.map((section, index) => (
              <div key={section.title} className={`glass-card p-5 ${index === 1 ? "lg:translate-x-8" : ""}`}>
                <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                  {index % 2 === 0 ? <Leaf className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  {section.title}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="badge-soft">Foundations</p>
          <h2 className="section-title mt-3">Learning-led wellness sections</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {content.sections.map((section) => (
            <div key={section.title} className="glass-card p-6">
              <h3 className="font-display text-3xl">{section.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{section.description}</p>
              <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-2xl bg-white p-4">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="badge-soft">Curated Collections</p>
            <h2 className="section-title mt-3">Shop by wellness intent</h2>
          </div>
          <Link href="/blogs" className="text-sm font-semibold text-primary">
            Read the journal
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {content.collections.map((collection) => (
            <Link key={collection.title} href={collection.href} className="glass-card p-6 transition hover:-translate-y-1">
              <p className="font-display text-3xl">{collection.title}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{collection.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="badge-soft">Wellness Catalog</p>
          <h2 className="section-title mt-3">Ayurveda-friendly products</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {curatedProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AyurvedaPage;
