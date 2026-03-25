import { Header }     from "@/components/nav/header";
import { Footer }     from "@/components/footer/footer";
import { CartDrawer } from "@/components/store/cart-drawer";

/**
 * Store layout — wraps every route inside the (store) group
 * with the sticky navigation header and site footer.
 *
 * Routes:  /  /products  /products/[slug]  /cart  /checkout  etc.
 */
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <CartDrawer />

      {/*
       * pt-[var(--nav-height)] pushes page content below the fixed header.
       * The hero section on the homepage intentionally overrides this with
       * its own negative margin to bleed under the transparent header.
       */}
      <main
        id="main-content"
        className="min-h-dvh pt-[var(--nav-height)]"
        tabIndex={-1}
      >
        {/* Skip-to-content target */}
        {children}
      </main>

      <Footer />
    </>
  );
}
