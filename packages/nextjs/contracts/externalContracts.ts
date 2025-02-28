import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * ABI for CervejaNFT.
 */
const externalContracts = {
  412_346: {
    CervejaNFT: {
      address: "0xdb2d15a3eb70c347e0d2c2c7861cafb946baab48",
      abi: [
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ownerOf",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "tokenURI",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "uint8",
              name: "taste",
              type: "uint8",
            },
            {
              internalType: "uint8",
              name: "texture",
              type: "uint8",
            },
            {
              internalType: "uint8",
              name: "aroma",
              type: "uint8",
            },
            {
              internalType: "uint8",
              name: "smoothness",
              type: "uint8",
            },
          ],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
    },
  },
  421_614: {
    CervejaNFT: {
      address: "0x40503bed56a675effc87352a98131a303aa83ddf",
      abi: [
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ownerOf",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "tokenURI",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "uint8",
              name: "taste",
              type: "uint8",
            },
            {
              internalType: "uint8",
              name: "texture",
              type: "uint8",
            },
            {
              internalType: "uint8",
              name: "aroma",
              type: "uint8",
            },
            {
              internalType: "uint8",
              name: "smoothness",
              type: "uint8",
            },
          ],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
