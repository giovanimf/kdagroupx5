import Container from "@/components/container";
import Header from "@/components/header";
import PainelHome from "@/components/painelhome";
import FormEditar from "./components/form";

export default function EditarPartida({ params }: { params: { id: string } }) {
  return (
    <Header>
      <Container>
        <PainelHome />
        <div className="p-4 md:p-4 flex flex-col gap-4 justify-center text-center rounded-md bg-colorMidnightNavy border-colorSlateBlue border-2">
          <h2 className="text-2xl font-bold text-white">Editar Partida</h2>
          <FormEditar id={params.id} />
        </div>
      </Container>
    </Header>
  );
}
