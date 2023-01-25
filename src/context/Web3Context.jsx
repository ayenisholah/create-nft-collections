import { createContext, useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import Web3Modal from "web3modal";
import { INFURA_ID, DEFAULT_NETWORK } from "../constants";
import { useUserSigner } from "../hooks";

/// 📡 What chain are your contracts deployed to?
const targetNetwork = DEFAULT_NETWORK; // <------- select your target frontend network (localhost, goerli, mainnet)

const localProviderUrl = targetNetwork.rpcUrl;
// // as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = localProviderUrl;
// if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(
  localProviderUrlFromEnv
);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

// Coinbase walletLink init
const walletLink = new WalletLink({
  appName: "coinbase",
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(
  `https://mainnet.infura.io/v3/${INFURA_ID}`,
  1
);

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme: {
    background: "rgb(3, 10, 52)",
    main: "rgb(199, 199, 199)",
    secondary: "rgb(255,255,255)",
    border: "rgba(195, 195, 195, 0.14)",
    hover: "rgb(252, 75, 163)",
  }, // optional. Change to "dark" for a dark theme.
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        bridge: "https://polygon.bridge.walletconnect.org",
        infuraId: INFURA_ID,
        rpc: {
          1: `https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
          100: "https://dai.poa.network", // xDai
        },
      },
    },
    /*torus: {
          package: Torus,
        },*/
    "custom-walletlink": {
      display: {
        logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
        name: "Coinbase",
        description: "Connect to Coinbase Wallet (not Coinbase App)",
      },
      package: walletLinkProvider,
      connector: async (provider, options) => {
        await provider.enable();
        return provider;
      },
    },
  },
});

const initialState = {
  address: null,
  userSigner: null,
  selectedChainId: null,
  blockExplorer: null,
  loadWeb3Modal: null,
  web3Modal: null,
};

export const Web3Context = createContext(initialState);

const Web3ContextProvider = ({ children }) => {
  //   const mainnetProvider = localProvider;

  const [injectedProvider, setInjectedProvider] = useState(null);
  const [address, setAddress] = useState("");

  const logoutOfWeb3Modal = useCallback(async () => {
    await web3Modal.clearCachedProvider();
    if (
      injectedProvider &&
      injectedProvider.provider &&
      typeof injectedProvider.provider.disconnect == "function"
    ) {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  }, [injectedProvider]);

  const userSigner = useUserSigner(injectedProvider, localProvider);

  useEffect(() => {
    // console.log("get addresses useeffect running");
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId =
    localProvider && localProvider._network && localProvider._network.chainId;

  const selectedChainId =
    userSigner &&
    userSigner.provider &&
    userSigner.provider._network &&
    userSigner.provider._network.chainId;

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const loadWeb3Modal = useCallback(async () => {
    //console.log('inside web3modal function');
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", (chainId) => {
      // console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      //console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const valuesObject = {
    address,
    userSigner,
    selectedChainId,
    blockExplorer,
    loadWeb3Modal,
    web3Modal,
    injectedProvider,
    logoutOfWeb3Modal,
    localChainId,
    targetNetwork,
  };

  //console.log("from web3Context", readContracts, address, userSigner);
  return (
    <Web3Context.Provider value={valuesObject}>{children}</Web3Context.Provider>
  );
};

export default Web3ContextProvider;
