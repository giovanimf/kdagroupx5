"use client";

import { useEffect, useState } from "react";

interface Jogador {
  id: string;
  nome: string;
  vitorias: number;
  derrotas: number;
  bagre: number;
  mvp: number;
}

const Ranking = () => {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRanking = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/jogador", { cache: "no-store" }); // Garante que os dados não venham do cache
      if (!response.ok) throw new Error("Erro ao buscar ranking.");
      const data = await response.json();

      // Ordena por número de vitórias (desc) e, em seguida, por nome (asc)
      const sortedData = data.sort(
        (a: Jogador, b: Jogador) =>
          b.vitorias - a.vitorias || a.nome.localeCompare(b.nome)
      );

      setJogadores(sortedData);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar o ranking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  const atribuirCategorias = (jogadores: Jogador[]) => {
    const categorias: Record<string, string> = {};
    const categoriasLista = ["Ouro", "Prata", "Bronze", "Ferro", "Alumínio"];
    let posicaoAtual = 0;

    for (let i = 0; i < jogadores.length; i++) {
      const jogador = jogadores[i];
      if (i === 0 || jogador.vitorias < jogadores[i - 1].vitorias) {
        posicaoAtual++;
      }
      categorias[jogador.id] =
        posicaoAtual <= categoriasLista.length
          ? categoriasLista[posicaoAtual - 1]
          : "Alumínio";
    }

    return categorias;
  };

  if (loading) return <div className="text-white">Carregando...</div>;

  const categorias = atribuirCategorias(jogadores);

  return (
    <div className="p-4 bg-colorDeepCharcoal text-white rounded-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ranking de Jogadores</h1>
        <button
          className="bg-colorSkyBlue hover:bg-colorMintGreen text-black px-4 py-2 rounded"
          onClick={fetchRanking}
        >
          Atualizar
        </button>
      </div>
      <table className="w-full border-collapse border border-slate-500 text-center">
        <thead>
          <tr className="bg-colorSlateBlue text-white">
            <th className="border border-slate-600 w-auto">Elo</th>
            <th className="border border-slate-600">Nome</th>
            <th className="border border-slate-600 p-1">Vitórias</th>
            <th className="border border-slate-600 p-1">Derrotas</th>
            <th className="border border-slate-600 p-1">MVP</th>
            <th className="border border-slate-600 p-1">Bagre</th>
            <th className="border border-slate-600 p-1">Partidas Jogadas</th>
          </tr>
        </thead>
        <tbody>
          {jogadores.map((jogador, index) => {
            const categoria = categorias[jogador.id];
            const categoriaCor =
              categoria === "Ouro"
                ? "bg-yellow-500 text-black"
                : categoria === "Prata"
                  ? "bg-gray-300 text-black"
                  : categoria === "Bronze"
                    ? "bg-orange-400 text-black"
                    : categoria === "Ferro"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-400 text-black";

            return (
              <tr
                key={jogador.id}
                className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}`}
              >
                <td
                  className={`border border-slate-700 w-auto p-1 ${categoriaCor}`}
                >
                  {categoria}
                </td>
                <td className="border border-slate-700 p-1 whitespace-nowrap">
                  {jogador.nome}
                </td>
                <td className="border border-slate-700 p-1">
                  {jogador.vitorias}
                </td>
                <td className="border border-slate-700 p-1">
                  {jogador.derrotas || 0}
                </td>
                <td className="border border-slate-700 p-1">
                  {jogador.mvp || 0}
                </td>
                <td className="border border-slate-700 p-1">
                  {jogador.bagre || 0}
                </td>
                <td className="border border-slate-700 p-1">
                  {jogador.vitorias + (jogador.derrotas || 0)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Ranking;
