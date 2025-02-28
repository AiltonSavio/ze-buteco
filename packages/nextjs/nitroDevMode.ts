import { defineChain } from "viem";

export const nitroDevMode = /*#__PURE__*/ defineChain({
  id: 412_346,
  name: "Nitro Dev Mode",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8547"],
      webSocket: ["ws://127.0.0.1:8547"],
    },
  },
});
