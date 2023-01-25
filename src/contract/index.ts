export const ADDRESS = "0x97018c0F80A6C9eAe2E3f171C8Dfe07f2078A3e2";

export const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contractIndex",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "toAddAddresses",
        "type": "address[]"
      }
    ],
    "name": "addToWhitelist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "basicNftArrays",
    "outputs": [
      {
        "internalType": "contract BasicNft",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "collections",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tokenRootCid",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "mintFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxPerWallet",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxPerMint",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "splitAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "splitRatio",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "collectionIndex",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "collectionAddress",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "open",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "collectionName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "collectionSymbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "mintFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxPerWallet",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxPerMint",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxSupply",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "splitAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "splitRatio",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "tokenRootCid",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "open",
        "type": "bool"
      }
    ],
    "name": "createNft",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContracts",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "tokenRootCid",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "mintFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxPerWallet",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxPerMint",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "splitAddress",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "splitRatio",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "collectionIndex",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "collectionAddress",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "open",
            "type": "bool"
          }
        ],
        "internalType": "struct BasicNftFactory.Collection[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contractIndex",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "minter",
        "type": "address"
      }
    ],
    "name": "getTokenBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contractIndex",
        "type": "uint256"
      }
    ],
    "name": "getWhiteList",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contractIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "mintAmount",
        "type": "uint256"
      }
    ],
    "name": "mintNft",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contractIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "mintFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxPerWallet",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxPerMint",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "splitAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "splitRatio",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "open",
        "type": "bool"
      }
    ],
    "name": "updateCollection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]