// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = "87574716c077414ba7640ea54f4b40d4";

// MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = "QQ9N41ZPXT7P3P5QMV15IY1QK7TG3PFZSF";

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = "7aa11af8-6bab-40f0-8be9-efce89085cb1";

export const NETWORKS = {
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    chainId: 5,
    faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
  },
};

export const NETWORK = (chainId) => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};

const devUrl = ["dev--suspicious-babbage-5fa6bd.netlify.app", "localhost"];

const isDev =
  devUrl.findIndex((e) => window.location.href.indexOf(e) > -1) > -1;

const variableToUse = isDev
  ? process.env.REACT_APP_DEV_NETWORK_NAME
  : process.env.REACT_APP_DEV_NETWORK_NAME;

export const DEFAULT_NETWORK = NETWORKS[variableToUse];

let defaultNetworkName = isDev
  ? process.env.REACT_APP_DEV_NETWORK_NAME
  : process.env.REACT_APP_DEV_NETWORK_NAME;

export const IS_DEV = isDev;

export const DEFAULT_NETWORK_NAME = defaultNetworkName;
