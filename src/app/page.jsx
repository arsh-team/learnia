// Developed by Arshia Afshani

import AIFeaturesSection from "../components/intro";
import HeroSlider from "../components/bigSlider";
import Header from "../components/header";
import ProductsSection from "../components/productSlider";
import Footer from "../components/footer";

export default function Home() {
  return (
    <div className="w-full">
      <Header />
      <main className="flex flex-col row-start-2 items-center sm:items-start pt-28">
        <div className="md:px-10 px-2 w-full gap-[32px]">
        <HeroSlider />
        <ProductsSection />
        </div>
        <AIFeaturesSection></AIFeaturesSection>
        <Footer></Footer>
      </main>
    </div>
  );
}