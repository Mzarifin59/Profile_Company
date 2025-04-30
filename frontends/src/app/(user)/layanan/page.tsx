import NavHeader from "@/components/nav-header";
import Footer from "@/components/footer";
import PageContent from "@/components/page-content";

export default async function Produk() {
  const res = await fetch(`${process.env.API_URL}/api/produk`, {cache: 'no-cache'});
  const data = await res.json();
  return (
    <>
      <NavHeader />      

      {/* Product Content */}
      <PageContent item={data}/>
      
      <Footer />
    </>
  );
}
