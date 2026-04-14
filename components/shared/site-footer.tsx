import Link from "next/link";
import { siteConfig } from "@/constants";

export const SiteFooter = () => {
  return (
    <footer className="hidden md:block border-t border-outline-variant/10 bg-surface-container-low py-10 mb-0">
      <div className="page-shell flex flex-col gap-4 text-sm text-on-surface-variant sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="font-headline font-bold text-primary text-lg uppercase tracking-[0.15em]">
            {siteConfig.name}
          </p>
          <p className="text-xs max-w-xs leading-relaxed">{siteConfig.description}</p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs uppercase tracking-widest font-bold">
          <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
          <Link href="/blogs" className="hover:text-primary transition-colors">Wisdom</Link>
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <a href={`mailto:${siteConfig.supportEmail}`} className="hover:text-primary transition-colors">
            {siteConfig.supportEmail}
          </a>
        </div>
      </div>
    </footer>
  );
};
