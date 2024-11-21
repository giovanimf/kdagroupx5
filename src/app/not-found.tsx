import Container from "@/components/container";
import Header from "@/components/header";
import PainelHome from "@/components/painelhome";

export default function NotFoundPage() {
  return (
    <Header>
      <Container>
        <PainelHome />
        {/* Conteúdo */}
        <div className="md:max-w-screen-md w-full mx-auto p-4 md:p-4 flex flex-col gap-4 justify-center text-center rounded-md bg-colorMidnightNavy border-colorSlateBlue border-2">
          <h2 className="text-2xl font-bold text-white">Ops! Página Não Encontrada!</h2>
          <span className="text-start">
            Parece que você se perdeu! A página que você está procurando não existe mais ou talvez nunca tenha existido... vai saber...<br /><br />
            Mas não se preocupe, você ainda pode se divertir! Volte para a página principal clicando na logo ou usando os menu ou coisa assim.<br /><br />
          </span>
        </div>
      </Container>
    </Header>
  );
}