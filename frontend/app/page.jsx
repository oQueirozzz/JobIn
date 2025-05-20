import Jobs from "@/components/landingPage/Jobs";
import HeroSection from "../components/landingPage/HeroSection";
import Empresas from "../components/landingPage/Empresas";
import Funcionamento from "../components/landingPage/Funcionamento";
import HeaderLanding from "../components/landingPage/HeaderLanding";

export default function Home() {
  return (
    <>
    <HeaderLanding/>
     <HeroSection />
     <Jobs/>
     <Empresas/>
     <Funcionamento/>
     </>
  );
}