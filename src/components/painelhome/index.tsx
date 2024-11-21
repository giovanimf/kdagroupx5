import Link from "next/link";
import { FaGamepad, FaTrophy } from "react-icons/fa";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Certifique-se de configurar isso corretamente

interface PainelHomeProps {
  page?: string;
}

export default async function PainelHome({ page }: PainelHomeProps) {
  // Obtém a sessão no servidor
  const session = await getServerSession(authOptions);

  return (
    <>
      <Link href="/">
        <span className="md:text-7xl text-5xl font-semibold font-chakra text-titlebase2 hover:text-colorMintGreen titleshadow">
          KDA GROUP - X5
        </span>
      </Link>
      <div className="flex flex-row gap-4 justify-center">
        {session && (
          <Link href="/criarx5">
            <div
              className={`flex items-center gap-4 p-4 rounded cursor-pointer hover:bg-colorMintGreen hover:text-deepcharcoal transition-colors text-black font-bold ${page === "criarx5" ? "bg-colorMintGreen" : "bg-colorSkyBlue"
                }`}
            >
              <FaGamepad size={25} />
              <span>Criar x5</span>
            </div>
          </Link>
        )}
        <Link href="/ranking">
          <div
            className={`flex items-center gap-4 p-4 rounded cursor-pointer hover:bg-colorMintGreen hover:text-deepcharcoal transition-colors text-black font-bold ${page === "ranking" ? "bg-colorMintGreen" : "bg-colorSkyBlue"
              }`}
          >
            <FaTrophy size={25} />
            <span>Ranking</span>
          </div>
        </Link>
      </div>
    </>
  );
}
