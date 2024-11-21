"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

const FormEditar = ({ id }: { id: string }) => {
  const [partida, setPartida] = useState<Partida | null>(null);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePartida = await fetch(`/api/partida/${id}`);
        if (!responsePartida.ok) throw new Error("Erro ao buscar partida.");
        const dataPartida = await responsePartida.json();
        setPartida(dataPartida);

        const responseJogadores = await fetch(`/api/jogador`);
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

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleInputChange = (field: keyof Partida, value: any) => {
    setPartida((prev) => {
      if (prev) {
        const updatedPartida = { ...prev, [field]: value };
        if (field === "vitoria") {
          updatedPartida.derrota = value === "time1" ? "time2" : "time1";
          updatedPartida.mvpId = ""; // Reset MVP ao trocar time vencedor
          updatedPartida.bagreId = ""; // Reset Bagre ao trocar time vencedor
        }
        return updatedPartida;
      }
      return null;
    });
  };

  const handleSalvar = async () => {
    if (!partida) return;

    // Validações
    if (!partida.vitoria) {
      alert("Você deve selecionar um time vencedor.");
      return;
    }

    if (!partida.mvpId) {
      alert("Você deve selecionar um MVP.");
      return;
    }

    if (!partida.bagreId) {
      alert("Você deve selecionar um Bagre.");
      return;
    }

    try {
      const response = await fetch(`/api/partida/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partida),
      });

      if (!response.ok) throw new Error("Erro ao salvar partida.");

      alert("Partida atualizada com sucesso!");
      router.push(`/partidas`);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar a partida.");
    }
  };

  if (loading) return <div className="text-white">Carregando...</div>;
  if (!partida) return <div className="text-white">Partida não encontrada.</div>;

  // Filtra os jogadores dos times com base nas IDs
  const jogadoresTime1 = jogadores.filter((jogador) =>
    partida?.time1Ids.includes(jogador.id)
  );
  const jogadoresTime2 = jogadores.filter((jogador) =>
    partida?.time2Ids.includes(jogador.id)
  );

  // Define os jogadores para MVP e Bagre com base no time vencedor
  const jogadoresMVP = partida?.vitoria === "time1" ? jogadoresTime1 : jogadoresTime2;
  const jogadoresBagre = partida?.derrota === "time1" ? jogadoresTime1 : jogadoresTime2;

  const handleDeletar = async () => {
    if (!window.confirm("Tem certeza de que deseja deletar esta partida?")) {
      return; // Se o usuário cancelar, interrompe a ação
    }

    try {
      const response = await fetch(`/api/partida/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro: Erro ao deletar a partida.");
      }

      alert("Partida deletada com sucesso!");
      // Redireciona ou atualiza a página, se necessário
      router.push(`/partidas`);
    } catch (error) {
      console.error(error);
      alert("Erro: Erro ao deletar a partida.");
    }
  };

  return (
    <div className="p-4 rounded-md bg-colorDeepCharcoal border-colorSlateBlue border-2 flex flex-row gap-4 justify-between">
      <div className="flex flex-col gap-4 w-2/4 text-start">
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

      <div className="flex flex-col w-fit text-start">
        <strong className="text-white">ID da Partida:</strong> {partida.id}
        <strong className="text-white">Data de Criação:</strong>{" "}
        {new Date(partida.createdAt).toLocaleString()}
      </div>

      <div className="flex flex-col gap-4 w-1/3 text-start">
        <div>
          <label className="block mb-2 font-semibold text-white">
            Selecionar Time Vencedor:
          </label>
          <select
            value={partida.vitoria || ""}
            onChange={(e) => handleInputChange("vitoria", e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="">Selecione o Time</option>
            <option value="time1">Time 1</option>
            <option value="time2">Time 2</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-semibold text-white">Selecionar MVP:</label>
          <select
            value={partida.mvpId || ""}
            onChange={(e) => handleInputChange("mvpId", e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            disabled={!partida.vitoria}
          >
            <option value="">Selecione o MVP</option>
            {jogadoresMVP.map((jogador) => (
              <option key={jogador.id} value={jogador.id}>
                {jogador.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 font-semibold text-white">Selecionar Bagre:</label>
          <select
            value={partida.bagreId || ""}
            onChange={(e) => handleInputChange("bagreId", e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            disabled={!partida.derrota}
          >
            <option value="">Selecione o Bagre</option>
            {jogadoresBagre.map((jogador) => (
              <option key={jogador.id} value={jogador.id}>
                {jogador.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={handleSalvar}
            className="p-2 text-black bg-green-500 font-bold rounded cursor-pointer w-full hover:bg-colorMintGreen"
          >
            Salvar Alterações
          </button>
        </div>
        <div>
          <button
            onClick={handleDeletar}
            className="p-2 text-black bg-red-500 font-bold rounded cursor-pointer w-full hover:bg-colorMintGreen"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormEditar;
