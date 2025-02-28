"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { arbitrumSepolia } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import Modal from "~~/components/Modal";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: contract } = useScaffoldContract({
    contractName: "CervejaNFT",
    chainId: arbitrumSepolia.id,
    walletClient,
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mint form state
  const [mintName, setMintName] = useState("");
  const [taste, setTaste] = useState(3);
  const [texture, setTexture] = useState(3);
  const [aroma, setAroma] = useState(3);
  const [smoothness, setSmoothness] = useState(3);
  const [status, setStatus] = useState("");

  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "CervejaNFT",
    functionName: "totalSupply",
  });

  const [leaderboard, setLeaderboard] = useState<{ name: string; overallRating: number; count: number }[]>([]);

  useEffect(() => {
    const fetchNFTData = async () => {
      if (!contract) return;
      try {
        if (!totalSupply || totalSupply === BigInt(0)) return;

        const cervejaMap: Record<string, { totalRating: number; count: number }> = {};

        // Loop through each tokenId and fetch owner + metadata
        for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
          const metadata = await contract?.read.tokenURI([BigInt(tokenId)]);
          if (!metadata) continue;

          // Parse JSON from tokenURI
          const parsedMetadata = JSON.parse(metadata);
          const name = parsedMetadata.name;
          const taste = parsedMetadata.attributes.find((attr: any) => attr.trait_type === "Sabor")?.value || 0;
          const texture = parsedMetadata.attributes.find((attr: any) => attr.trait_type === "Textura")?.value || 0;
          const aroma = parsedMetadata.attributes.find((attr: any) => attr.trait_type === "Aroma")?.value || 0;
          const smoothness = parsedMetadata.attributes.find((attr: any) => attr.trait_type === "Suavidade")?.value || 0;

          const overallRating = (taste + texture + aroma + smoothness) / 4;

          if (cervejaMap[name]) {
            cervejaMap[name].totalRating += overallRating;
            cervejaMap[name].count += 1;
          } else {
            cervejaMap[name] = { totalRating: overallRating, count: 1 };
          }
        }

        // Convert to leaderboard format
        const leaderboardData = Object.entries(cervejaMap).map(([name, stats]) => ({
          name,
          overallRating: stats.totalRating / stats.count,
          count: stats.count,
        }));

        // Sort by overall rating
        leaderboardData.sort((a, b) => b.overallRating - a.overallRating);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Erro ao buscar NFTs:", error);
      }
    };

    fetchNFTData();
  }, [contract, totalSupply]);

  // Hook for writing to the contract.
  const { writeContractAsync: mintCervejaAsync } = useScaffoldWriteContract({
    contractName: "CervejaNFT",
  });

  const handleMint = async () => {
    try {
      setStatus("Mintando...");
      await mintCervejaAsync({
        functionName: "mint",
        args: [connectedAddress, mintName, taste, texture, aroma, smoothness],
      });
      setStatus("Mintado com sucesso!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Mint falhou", error);
      setStatus("Mint falhou");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 bg-base-100">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Placar de Cervejas Artesanais NFT</h1>
        <p className="mt-2 text-base sm:text-lg">Veja as avaliações e mint novas Cervejas!</p>
      </header>

      <section className="w-full max-w-md mb-8">
        {leaderboard.length === 0 ? (
          <p className="text-center">Nenhuma avaliação mintada ainda.</p>
        ) : (
          <ul className="w-full">
            {leaderboard.map((cerveja, index) => (
              <li key={index} className="flex flex-col sm:flex-row justify-between items-center py-3 border-b">
                <div className="w-full sm:w-auto">
                  <span className="font-semibold">{cerveja.name}</span>{" "}
                  <span>({cerveja.overallRating.toFixed(1)})</span>
                </div>
                <Link
                  href={`/cerveja/${encodeURIComponent(cerveja.name)}`}
                  className="mt-2 sm:mt-0 px-4 py-2 bg-primary text-white rounded w-full sm:w-auto text-center"
                >
                  Ver Detalhes
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        className="mb-8 px-6 py-3 bg-primary text-white rounded w-full max-w-xs"
        onClick={() => setIsModalOpen(true)}
      >
        Criar Nova Avaliação de Cerveja
      </button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl sm:text-2xl mb-4 text-center">Mintar Novo NFT de Cerveja</h2>
          <div className="space-y-3">
            <label className="block">
              Nome:
              <input
                type="text"
                value={mintName}
                onChange={e => setMintName(e.target.value)}
                className="mt-1 block w-full border rounded p-1"
              />
            </label>
            <label className="block">
              Sabor (1-5):
              <input
                type="number"
                value={taste}
                onChange={e => setTaste(Number(e.target.value))}
                min="1"
                max="5"
                className="mt-1 block w-full border rounded p-1"
              />
            </label>
            <label className="block">
              Textura (1-5):
              <input
                type="number"
                value={texture}
                onChange={e => setTexture(Number(e.target.value))}
                min="1"
                max="5"
                className="mt-1 block w-full border rounded p-1"
              />
            </label>
            <label className="block">
              Aroma (1-5):
              <input
                type="number"
                value={aroma}
                onChange={e => setAroma(Number(e.target.value))}
                min="1"
                max="5"
                className="mt-1 block w-full border rounded p-1"
              />
            </label>
            <label className="block">
              Suavidade (1-5):
              <input
                type="number"
                value={smoothness}
                onChange={e => setSmoothness(Number(e.target.value))}
                min="1"
                max="5"
                className="mt-1 block w-full border rounded p-1"
              />
            </label>
          </div>
          <button className="mt-4 w-full px-4 py-2 bg-secondary text-white rounded" onClick={handleMint}>
            Mintar NFT
          </button>
          {status && <p className="mt-2 text-center">{status}</p>}
        </Modal>
      )}
    </div>
  );
};

export default Home;
