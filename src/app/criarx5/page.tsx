import Container from "@/components/container";
import Header from "@/components/header";
import PainelHome from "@/components/painelhome";
import { FaCalendarAlt, FaUser, FaTv, FaFilm } from 'react-icons/fa';
import Sorteio from "./components/dropadndrop";

type InfoLink = {
  icon: JSX.Element;
  label: string;
  href: string;
};

const infoLinks: InfoLink[] = [
  {
    icon: <FaCalendarAlt className="text-xl text-mint" />,
    label: 'Ano de Lançamento',
    href: '/anime/ano-de-lancamento',
  },
  {
    icon: <FaTv className="text-xl text-mint" />,
    label: 'De onde é a cena',
    href: '/anime/advinhe-a-cena',
  },
  {
    icon: <FaUser className="text-xl text-mint" />,
    label: 'Nome do personagem',
    href: '/anime/nome-do-personagem',
  },
  {
    icon: <FaFilm className="text-xl text-mint" />,
    label: 'Nome do Anime',
    href: '/anime/nome-do-anime',
  },
];

export default function Criarx5() {
  return (
    <Header>
      <Container>
        <PainelHome page="criarx5" />
        {/* Conteúdo */}
        <div className="p-4 md:p-4 flex flex-col gap-4 justify-center text-center rounded-md bg-colorMidnightNavy border-colorSlateBlue border-2">
          <Sorteio />
        </div>
      </Container>
    </Header>
  );
}