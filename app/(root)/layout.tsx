import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { BottomNav } from "@/components/shared/bottom-nav";
import { ConsultFab } from "@/components/shared/consult-fab";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <SiteHeader />
      <div className="pt-24 pb-32">{children}</div>
      <SiteFooter />
      <BottomNav />
      <ConsultFab />
    </main>
  );
};

export default Layout;
