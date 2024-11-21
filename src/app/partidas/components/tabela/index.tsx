"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Partida {
  id: string;
  createdAt: string;
  time1Ids: string[];
  time2Ids: string[];
  mvpId?: string;
  bagreId?: string;
  vitoria?: string;
  derrota?: string;
}

interface Jogador {
  id: string;
  nome: string;
}

const VisualizarPartidas = () => {
  const { data: session } = useSession(); // Verifica se o usuário está logado
  const [partidas, setPartidas] = useState<Partida[]>([]); // Estado para armazenar as partidas
  const [jogadores, setJogadores] = useState<Jogador[]>([]); // Estado para armazenar os jogadores
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePartidas = await fetch("/api/partida"); // Buscar todas as partidas
        if (!responsePartidas.ok) throw new Error("Erro ao buscar partidas.");
        const dataPartidas = await responsePartidas.json();
        setPartidas(dataPartidas);

        const responseJogadores = await fetch("/api/jogador"); // Buscar todos os jogadores
        if (!responseJogadores.ok) throw new Error("Erro ao buscar jogadores.");
        const dataJogadores = await responseJogadores.json();
        setJogadores(dataJogadores);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-white">Carregando...</div>;
  if (!partidas.length) return <div className="text-white">Nenhuma partida encontrada.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {partidas.map((partida) => {
        // Filtra os jogadores dos times com base nas IDs
        const jogadoresTime1 = jogadores.filter((jogador) =>
          partida.time1Ids.includes(jogador.id)
        );
        const jogadoresTime2 = jogadores.filter((jogador) =>
          partida.time2Ids.includes(jogador.id)
        );

        // Obtém MVP e Bagre, caso existam
        const mvpJogador = partida.mvpId
          ? jogadores.find((jogador) => jogador.id === partida.mvpId)
          : null;
        const bagreJogador = partida.bagreId
          ? jogadores.find((jogador) => jogador.id === partida.bagreId)
          : null;

        return (
          <div key={partida.id} className="p-4 rounded-md bg-colorDeepCharcoal border-colorSlateBlue border-2 flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-4 w-full text-start">
              <div>
                <table className="border-collapse border border-slate-500 w-full text-center">
                  <thead>
                    <tr>
                      <th className="border border-slate-600">Time 1</th>
                      <th className="border border-slate-600">Time 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-start align-top">
                      <td className="border border-slate-700 px-4 py-2">
                        {jogadoresTime1.map((jogador) => (
                          <div key={jogador.id}>{jogador.nome}</div>
                        ))}
                      </td>
                      <td className="border border-slate-700 px-4 py-2">
                        {jogadoresTime2.map((jogador) => (
                          <div key={jogador.id}>{jogador.nome}</div>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-col w-fit text-start gap-2">
              <div>
                <strong className="text-white">ID da Partida: </strong>{partida.id}<br />
                <strong className="text-white">Data de Criação: </strong>
                {new Date(partida.createdAt).toLocaleString()}
              </div>
              <div className="flex md:flex-row flex-col gap-4">
                <div>
                  <strong className="font-semibold text-white">Vencedor: </strong>
                  {partida.vitoria === "time1"
                    ? "Time 1"
                    : partida.vitoria === "time2"
                      ? "Time 2"
                      : "Não definido"}
                  {mvpJogador && (
                    <div>
                      <strong className="text-white">MVP: </strong>{mvpJogador.nome}
                    </div>
                  )}</div>
                <div>
                  <strong className="font-semibold text-white">Derrotado: </strong>
                  {partida.derrota === "time1"
                    ? "Time 1"
                    : partida.derrota === "time2"
                      ? "Time 2"
                      : "Não definido"}
                  {bagreJogador && (
                    <div>
                      <strong className="text-white">Bagre: </strong>{bagreJogador.nome}
                    </div>
                  )}
                </div>
              </div>
              {session && ( // Exibe o botão de editar apenas se o usuário estiver logado
                <Link href={`/editar-partida/${partida.id}`}>
                  <button className="p-1 text-black bg-blue-500 font-bold rounded cursor-pointer hover:bg-colorMintGreen">
                    Editar
                  </button>
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div >
  );
};

export default VisualizarPartidas;
