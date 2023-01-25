import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ABI, ADDRESS } from "../contract";
import { Web3Context } from "../context";
import { CustomButton, DisplayCollections } from "../components";
import { useNavigate } from "react-router-dom";
import { ICollection } from "./MintPage";

const Home = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { injectedProvider, loadWeb3Modal, address } =
    useContext<any>(Web3Context);
  const navigate = useNavigate();
  useEffect(() => {
    if (!injectedProvider) return;
    const myContract = new ethers.Contract(ADDRESS, ABI, injectedProvider);

    async function getCollections() {
      try {
        setIsLoading(true);
        let res = await myContract.getContracts();

        res = res.map((collection: any) => {
          return {
            name: collection[0],
            symbol: collection[1],
            tokenRootCid: collection[2],
            mintFee: ethers.utils.formatEther(collection[3]),
            maxPerWallet: collection[4].toString(),
            maxPerMint: collection[5].toString(),
            splitAddress: collection[6],
            splitRatio: collection[7],
            creator: collection[8],
            collectionIndex: collection[9].toString(),
            collectionAddress: collection[10],
            open: collection[11],
          };
        });
        setCollections(res);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getCollections();
  }, [injectedProvider]);

  const ownerCollections = collections.filter(
    (collection: ICollection) => collection.creator === address
  );

  return (
    <div>
      {address && ownerCollections?.length > 0 ? (
        <DisplayCollections
          title="All Collections"
          isLoading={isLoading}
          collections={ownerCollections}
        />
      ) : (
        <div className="text-center text-white text-4xl mt-40 font-black uppercase">
          <h1 className="mb-10">Create Smart Contract</h1>
          <h2 className="mb-10">No Code</h2>
          <h2 className="mb-10">
            You only need a wallet, images and/or metadata
          </h2>
          <CustomButton
            btnType="button"
            title={address ? "Create a collection" : "Connect"}
            styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
            handleClick={() => {
              if (address) navigate("create-collection");
              else loadWeb3Modal();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
