import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useLocation } from "react-router-dom";
import { loader, verified } from "../assets";
import { CustomButton } from "../components";
import { Web3Context } from "../context";
import { ABI, ADDRESS } from "../contract";
import { retrieve } from "../utils/UploadToIpfs";

const CollectionList = () => {
  const { userSigner }: { userSigner: any } = useContext(Web3Context);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const [amount, setAmount] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [collectionSize, setCollectionSize] = useState(0);
  const { maxPerMint, collectionIndex, mintFee } = state;

  const myContract = new ethers.Contract(ADDRESS, ABI, userSigner);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (amount > Number(maxPerMint)) setAmount(10);
    setAmount(+event.target.value);
  };

  const increment = () => {
    if (amount === Number(maxPerMint)) return;
    setAmount((prev) => prev + 1);
  };

  const decrement = () => {
    if (amount === 1) return;
    setAmount((prev) => prev - 1);
  };

  useEffect(() => {
    async function retrieveTokenDetails() {
      const res = await retrieve(state.tokenRootCid);
      if (res) {
        setCollectionSize(res.length);
        const images: string[] = [];
        for (let i = 0; i < 4; i++) {
          const tokenUri = await (
            await fetch(`https://ipfs.io/ipfs/${res[i].cid}`)
          ).json();
          images.push(tokenUri.external_url);
        }
      }

      setImages(images);
    }
    retrieveTokenDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log({ collectionIndex, amount });

  const mint = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    try {
      const value = Number(mintFee) * amount;
      setIsLoading(true);
      await myContract.mintNft(Number(collectionIndex) - 1, Number(amount), {
        value: ethers.utils.parseEther(value.toString()),
        gasLimit: 3000000,
        gasPrice: ethers.utils.parseUnits("10", "gwei"),
      });
      setIsLoading(false);

      //   handle notification
    } catch (error) {
      alert(JSON.stringify(error));
      setIsLoading(false);
    }
  };

  console.log({ state });
  return (
    <div className="flex md:flex-row flex-col">
      {isLoading && <img src={loader} alt="loader" />}

      <div className="col-1 md:w-1/2 h-screen pr-10">
        <h1 className="text-[#e8eaed] text-2xl">About this collection</h1>
        <div className="flex flex-row justify-start my-4 items-center">
          <div className="rounded-md">
            <img
              className="w-[36px] rounded-md"
              src={images[0]}
              alt={state.name}
            />
          </div>
          <span className="text-[#bdc1c6] text-base font-bold ml-6 mr-2">
            {state.name}
          </span>
          <div>
            <img
              className="w-[15px] h-[15px]"
              src={verified}
              alt="verified icon"
            />
          </div>
        </div>

        <div className="text-[#bdc1c6] capitalize font-bold text-lg mb-8 flex flex-row items-center justify-between">
          <span className="capitalize">items</span>
          <span>{collectionSize}</span>
        </div>

        <p className="text-white">
          {state.name} will be a digital collectible project that will be
          inspired by the trends of the 1990's / 2000's and the skateboard
          culture. We want to develop a brand with a unique aesthetic that will
          connect NFTS, Clothing and Skateboarding. We aim to create exclusive
          products that will generate a hype around the community, by sponsoring
          events, skateboarders and artist and hosting monthly art and skate
          contests. We will build the next dope web3 brand.
        </p>

        <h3 className="text-white mt-8 font-black text-xl">
          Max per mint: {maxPerMint}
        </h3>
        <div className="mt-8 flex justify-start items-center">
          <div className="flex">
            <button
              onClick={decrement}
              className="text-white font-bold text-2xl"
            >
              -
            </button>
            <input
              onChange={onChange}
              type="text"
              className="mint-button text-center py-[15px] mx-4 px-[25px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] w-[80px]"
              step="1"
              min="1"
              value={amount}
            />
            <button
              onClick={increment}
              className="text-white font-bold text-2xl"
            >
              +
            </button>
          </div>
          <CustomButton
            disabled={
              Number(amount) > Number(maxPerMint)
                ? true
                : isNaN(+amount)
                ? true
                : false
            }
            btnType="button"
            title="Mint"
            styles={`bg-[#1dc071] mt-0 px-[25px] py-[15px] ml-6`}
            handleClick={mint}
          />
        </div>
        {Number(amount) > Number(maxPerMint) ||
          (isNaN(+amount) && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              <span className="font-medium">Oh, snapp!</span> Please enter a
              number less than or equal to the max per mint
            </p>
          ))}
      </div>
      <div className="col-2 md:w-1/2 h-screen pl-10">
        <div className="banner w-[586px] h-[586px]">
          <img className="rounded-lg" src={images[1]} alt="" />
        </div>

        <div className="sample flex justify-evenly mt-16">
          {images.slice(1, 4).map((item, index) => (
            <img
              className="w-[150px] h-[150px] rounded-lg"
              key={index}
              src={item}
              alt={state.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionList;
