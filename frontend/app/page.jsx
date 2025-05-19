import Jobs from "@/components/landingPage/Jobs";
import HeroSection from "../components/landingPage/HeroSection";
import Empresas from "../components/landingPage/Empresas";
import Funcionamento from "../components/landingPage/Funcionamento";

export default function Home() {
  return (
    <>
     <HeroSection />
     <Jobs/>
     <Empresas/>
     <Funcionamento/>
     </>
  );
}
