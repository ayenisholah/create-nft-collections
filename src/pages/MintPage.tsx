import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { ethers } from "ethers";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { discord, loader, opensea, twitter, verified, web } from "../assets";
import { CustomButton } from "../components";
import { Web3Context } from "../context";
import { ABI, ADDRESS } from "../contract";
import { retrieve } from "../utils/UploadToIpfs";
import { supabase } from "src/lib/api";

const MintPage = () => {
  const { userSigner, address, injectedProvider } =
    useContext<any>(Web3Context);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [collections, setCollections] = useState([]);
  const [collectionSize, setCollectionSize] = useState(0);
  const { id } = useParams();
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [minted, setMinted] = useState(0);
  const [collectionDetails, setCollectionDetails] = useState({
    name: "",
    content: "",
    twitter: "",
    discord: "",
    opensea: "",
    website: "",
    created_at: "",
    id: "",
  });

  useLayoutEffect(() => {
    const provider = new ethers.providers.InfuraProvider(
      "goerli",
      "359c5140734c47e990cf43bb7052527b"
    );

    const myContract = new ethers.Contract(ADDRESS, ABI, provider);

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
  }, []);

  let data: any = collections.find(
    (item: ICollection) =>
      item.collectionAddress.toLowerCase() === (id as string).toLowerCase()
  );

  let maxPerMint = 0;
  let maxPerWallet = 0;
  let collectionIndex = 0;
  let mintFee = "";
  let tokenRootCid = "";
  let collectionAddress = "";
  let name = "";
  let open = true;
  let creator = "";

  if (data) {
    maxPerWallet = data.maxPerWallet;
    maxPerMint = data.maxPerMint;
    collectionIndex = data.collectionIndex;
    mintFee = data.mintFee;
    tokenRootCid = data.tokenRootCid;
    collectionAddress = id as string;
    name = data.name;
    open = data.open;
    creator = data.creator;
  }

  useEffect(() => {
    const myContract = new ethers.Contract(ADDRESS, ABI, userSigner);

    async function fetchWhitelist() {
      try {
        const res = await myContract.getWhiteList(Number(collectionIndex));
        setWhitelist(res);
      } catch (error) {
        console.log(error);
      }
    }

    async function getUserBalance() {
      try {
        const res = await myContract.getTokenBalance(
          Number(collectionIndex),
          address
        );
        setMinted(res);
      } catch (error) {}
    }

    fetchWhitelist();
    getUserBalance();
  }, [address, collectionIndex, userSigner]);

  const myContract = new ethers.Contract(ADDRESS, ABI, userSigner);

  const onChange = (event: ChangeEvent) => {
    if (amount > Number(maxPerMint)) setAmount(10);
    const target = event.target as HTMLInputElement;
    setAmount(+target.value);
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
    // make images load faster
    async function retrieveTokenDetails() {
      let res;

      if (data) {
        res = await retrieve(tokenRootCid);
      }

      if (res && data) {
        setCollectionSize(res.length);
        const images: string[] = [];
        for (let i = 0; i < 4; i++) {
          const tokenUri = await (
            await fetch(`https://ipfs.io/ipfs/${res[i].cid}`)
          ).json();
          images.push(tokenUri.external_url);
        }
        setImages(images);
      }
    }
    retrieveTokenDetails();

    async function getCollection() {
      try {
        const { data, error } = await supabase
          .from("collections")
          .select("*")
          .eq("collectionAddress", collectionAddress);

        if (data?.length) setCollectionDetails(data[0]);

        if (error) console.log(error);
      } catch (error) {
        console.log(error);
      }
    }
    getCollection();
  }, [collectionAddress, data, tokenRootCid]);

  const mint = async (event: Event) => {
    event.preventDefault();
    const value = parseFloat(mintFee) * amount * 1.05;
    let gasEstimate =
      (await (await injectedProvider.getGasPrice()).toString()) / 10 ** 9;

    gasEstimate += 20;

    try {
      setIsLoading(true);
      await myContract.mintNft(Number(collectionIndex), amount, {
        value: ethers.utils.parseEther(value.toString()),
        gasLimit: 2000000,
        gasPrice: ethers.utils.parseUnits(gasEstimate.toString(), "gwei"),
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex  justify-center items-center md:flex-row flex-col">
      {isLoading ? (
        <img src={loader} alt="loader" className="h-[300px] mx-auto mt-20" />
      ) : null}

      <div className="col-1 md:w-1/2 h-screen pr-10">
        <h1 className="text-[#e8eaed] text-2xl">About this collection</h1>
        <div className="flex flex-row justify-start my-4 items-center">
          <div className="rounded-md">
            <img className="w-[36px] rounded-md" src={images[0]} alt={name} />
          </div>
          <span className="text-[#bdc1c6] text-base font-bold ml-6 mr-2">
            {name}
          </span>
          <div>
            <img
              className="w-[15px] h-[15px]"
              src={verified}
              alt="verified icon"
            />
          </div>
        </div>
        <div className="text-[#bdc1c6] capitalize font-bold text-lg mb-8">
          <span className="capitalize">items: {collectionSize}</span>
        </div>

        {collectionDetails.content && (
          <p className="text-white">{collectionDetails.content}</p>
        )}
        <h3 className="text-white mt-8 font-black text-xl">
          Max per mint: {maxPerMint}
        </h3>
        <h3 className="text-white mt-8 font-black text-xl">
          Max per wallet: {maxPerWallet}
        </h3>

        <h3 className="text-white mt-8 font-black text-xl">
          Minted: {minted.toString()}
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
                : Number(minted) === Number(maxPerWallet)
                ? true
                : Number(minted) + Number(amount) > maxPerWallet
                ? true
                : open === false && !whitelist.includes(address)
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
        <div className="text-white mt-20 flex flex-row justify-start">
          {collectionDetails.twitter && (
            <a
              className="mr-6 w-[40px] h-[40px]"
              href={collectionDetails?.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <img src={twitter} alt="twitter logo" />
            </a>
          )}

          {collectionDetails.opensea && (
            <a
              className="mr-6 w-[40px] h-[40px]"
              href={collectionDetails?.opensea}
              target="_blank"
              rel="noreferrer"
            >
              <img src={opensea} alt="twitter logo" />
            </a>
          )}

          {collectionDetails.discord && (
            <a
              className="mr-6 w-[40px] h-450px]"
              href={collectionDetails?.discord}
              target="_blank"
              rel="noreferrer"
            >
              <img src={discord} alt="twitter logo" />
            </a>
          )}
          {collectionDetails.website && (
            <a
              className="mr-6 w-[40px] h-[40px]"
              href={collectionDetails?.website}
              target="_blank"
              rel="noreferrer"
            >
              <img src={web} alt="" />
            </a>
          )}
        </div>
        {creator === address ? (
          <div className="flex items-center mt-20 gap-[40px]">
            <CustomButton
              btnType="button"
              title="configure mint website"
              styles="bg-[#1dc071] font-normal px-2 text-sm"
              handleClick={() => {
                navigate(`../update/collection/${collectionAddress}`, {
                  state: state,
                  replace: true,
                });
              }}
            />
            <CustomButton
              btnType="button"
              title="configure smart contract"
              styles="bg-[#1dc071] font-normal px-2 text-sm"
              handleClick={() => {
                navigate(`../update/contract/${collectionAddress}`, {
                  state: state,
                  replace: true,
                });
              }}
            />
            <CustomButton
              btnType="button"
              title="update whitelist"
              styles="bg-[#1dc071] font-normal px-2 text-sm"
              handleClick={() => {
                navigate(`../update/whitelist/${collectionAddress}`, {
                  state: state,
                  replace: true,
                });
              }}
            />
          </div>
        ) : null}
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
              alt={name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MintPage;

export interface ICollection {
  name: string;
  symbol: string;
  tokenRootCid: string;
  mintFee: string;
  maxPerWallet: number;
  maxPerMint: number;
  splitAddress: string;
  splitRatio: number;
  creator: string;
  collectionIndex: number;
  collectionAddress: string;
  open: boolean;
}
