import Container from "@/components/container";
import Header from "@/components/header";
import PainelHome from "@/components/painelhome";
import Ranking from "./componentes/ranking";

export default function Sobre() {
  return (
    <Header>
      <Container>
        <PainelHome page="ranking" />
        {/* Conteúdo */}
        <div className="p-4 md:p-4 flex flex-col gap-4 justify-center text-center rounded-md bg-colorMidnightNavy border-colorSlateBlue border-2">
          <h2 className="text-2xl font-bold text-white">Ranking</h2>
          <Ranking />
        </div>
      </Container>
    </Header>
  );
}