"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { arbitrumSepolia } from "viem/chains";
import { useWalletClient } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

type TokenDetail = {
  tokenId: number;
  owner: string;
  imageUrl: string;
  taste: number;
  texture: number;
  aroma: number;
  smoothness: number;
  overallRating: number;
};

const CervejasPage: NextPage<{ params: { name: string } }> = ({ params }) => {
  const { name } = params;
  const [tokens, setTokens] = useState<TokenDetail[]>([]);
  const router = useRouter();
  const { data: walletClient } = useWalletClient();
  const { data: contract } = useScaffoldContract({
    contractName: "CervejaNFT",
    chainId: arbitrumSepolia.id,
    walletClient,
  });

  useEffect(() => {
    const fetchTokensByName = async (contract: any, name: string, setTokens: any) => {
      if (!contract) return;
      try {
        // Fetch totalSupply to iterate over tokenIds
        const totalSupply = await contract?.read.totalSupply();
        const tokenIds = Array.from({ length: Number(totalSupply) }, (_, i) => BigInt(i));

        // Fetch metadata and owner for each token
        const tokens = await Promise.all(
          tokenIds.map(async tokenId => {
            try {
              // Fetch metadata from tokenURI
              const metadataString = await contract?.read.tokenURI([tokenId]);
              const metadata = JSON.parse(metadataString);

              if (!metadata.attributes) return null;

              // Extract ratings
              const taste = metadata.attributes.find((attr: any) => attr.trait_type === "Sabor")?.value || 0;
              const texture = metadata.attributes.find((attr: any) => attr.trait_type === "Textura")?.value || 0;
              const aroma = metadata.attributes.find((attr: any) => attr.trait_type === "Aroma")?.value || 0;
              const smoothness = metadata.attributes.find((attr: any) => attr.trait_type === "Suavidade")?.value || 0;
              const overallRating = (taste + texture + aroma + smoothness) / 4;

              // Fetch owner of the token
              const owner = await contract?.read.ownerOf([tokenId]);

              return {
                tokenId: Number(tokenId),
                owner,
                imageUrl: metadata.image || "/default-image.png",
                name: metadata.name,
                taste,
                texture,
                aroma,
                smoothness,
                overallRating,
              };
            } catch (err) {
              console.error(`Erro ao buscar metadata para token ${tokenId}`, err);
              return null;
            }
          }),
        );

        // Filter tokens by name and remove null values
        setTokens(tokens.filter(t => t && t.name?.toLowerCase() === name.toLowerCase()));
      } catch (error) {
        console.error("Erro ao buscar NFTs:", error);
      }
    };

    fetchTokensByName(contract, name, setTokens);
  }, [contract, name]);

  return (
    <div className="container mx-auto p-8">
      <button className="mb-4 px-4 py-2 bg-secondary text-white rounded" onClick={() => router.back()}>
        Voltar
      </button>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Avaliações da &quot;{name}&quot; – Cervejas Artesanais</h1>
      {tokens.length === 0 ? (
        <p>Nenhuma cerveja encontrada com esse nome.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map(token => (
            <div key={token.tokenId} className="border rounded p-4 shadow">
              <div className="flex justify-center w-full">
                <div className="mt-2" dangerouslySetInnerHTML={{ __html: token.imageUrl }} />
              </div>
              <p>
                <strong>ID:</strong> {token.tokenId}
              </p>
              <p>
                <strong>Proprietário:</strong> {token.owner?.slice(0, 6) + "..." + token.owner?.slice(-4)}
              </p>
              <p>
                <strong>Sabor:</strong> {token.taste}
              </p>
              <p>
                <strong>Textura:</strong> {token.texture}
              </p>
              <p>
                <strong>Aroma:</strong> {token.aroma}
              </p>
              <p>
                <strong>Suavidade:</strong> {token.smoothness}
              </p>
              <p>
                <strong>Avaliação Geral:</strong> {token.overallRating.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CervejasPage;
