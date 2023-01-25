import React, { useEffect, useState } from "react";
import { retrieve } from "../utils/UploadToIpfs";

const CollectionCard = ({
  name,
  tokenRootCid,
  mintFee,
  handleClick,
}: ICollectionCard) => {
  const [collectionDetails, setCollectionDetails] = useState({
    collectionImage: "",
    collectionSize: 0,
  });
  const { collectionSize, collectionImage } = collectionDetails;
  useEffect(() => {
    async function retrieveTokenDetails() {
      const res = (await retrieve(tokenRootCid)) as any[];

      const tokenUri = await (
        await fetch(`https://ipfs.io/ipfs/${res[0].cid}`)
      ).json();
      setCollectionDetails({
        collectionImage: tokenUri.external_url,
        collectionSize: res.length,
      });
    }
    retrieveTokenDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sm:w-[320px] w-full rounded-t-[15px] bg-[#1c1c24] cursor-pointer">
      <img
        src={collectionImage}
        alt="fund"
        className="w-full h-auto object-cover rounded-t-[15px]"
        onClick={handleClick}
      />
      <div className="flex flex-col p-4">
        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">
            Collection Name: {name}
          </h3>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              Mint Fee: {mintFee}
            </h4>
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              items: {collectionSize}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;

interface ICollectionCard {
  name: string;
  tokenRootCid: string;
  mintFee: string;
  handleClick: () => void;
}
