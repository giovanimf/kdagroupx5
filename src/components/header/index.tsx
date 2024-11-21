import { ReactNode } from "react";
import Navbar from "@/components/navbar";
import backgroundImage from "@/assets/general/background.jpg";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <section className="relative min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${backgroundImage.src})` }}>
      {/* Camada de gradiente sobre a imagem */}
      <div className="absolute inset-0 opacity-90 gradiente-background"></div>
      {/* Conteúdo da página */}
      <div className="relative flex flex-col justify-between min-h-screen">
        {/* Carregar Navbar */}
        <div className="header-navbar w-full"><Navbar /></div>
        {/* Conteúdo */}
        {children}
        {/* Div vazia pra centralizar */}
        <div></div>
      </div>
    </section>
  );
}
