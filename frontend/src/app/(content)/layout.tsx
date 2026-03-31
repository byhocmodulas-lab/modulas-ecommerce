import { Header }     from "@/components/nav/header";
import { Footer }     from "@/components/footer/footer";
import { CartDrawer } from "@/components/store/cart-drawer";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <CartDrawer />
      <main
        id="main-content"
        className="min-h-dvh pt-[var(--nav-height)]"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
