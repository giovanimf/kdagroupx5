import Container from "@/components/container";
import Header from "@/components/header";
import PainelHome from "@/components/painelhome";

export default function CadastrarJogador() {
  return (
    <Header>
      <Container>
        <PainelHome />
        {/* Conteúdo */}
        <div className="p-4 md:p-4 flex flex-col gap-4 justify-center text-center rounded-md bg-colorMidnightNavy border-colorSlateBlue border-2">
          <h2 className="text-2xl font-bold text-white">Jogadores</h2>
          <span className="text-start">
            Em construção</span>
        </div>
      </Container>
    </Header>
  );
}