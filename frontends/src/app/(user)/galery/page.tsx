import NavHeader from "@/components/nav-header";
import Footer from "@/components/footer";
import PageContent from "@/components/page-content";

export default async function Galery() {
  const res = await fetch(`${process.env.API_URL}/api/galery`, {cache: 'no-cache'});
  const data = await res.json();
  return (
    <>
      <NavHeader />      

      {/* Galery Content */}
      <PageContent item={data}/>
      
      <Footer />
    </>
  );
}
