import React from "react";
import { useNavigate } from "react-router-dom";
import { ICollection } from "src/pages/MintPage";
import { loader } from "../assets";
import CollectionCard from "./CollectionCard";

const DisplayCollections = ({
  title,
  isLoading,
  collections,
}: IDisplayCollections) => {
  const navigate = useNavigate();
  const handleNavigate = (collection: ICollection) => {
    navigate(`/collections/${collection.collectionAddress}`, {
      state: collection,
    });
  };
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({collections.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && collections.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            no collections created any collection yet
          </p>
        )}

        {!isLoading &&
          collections.length > 0 &&
          collections.map((collection, index) => (
            <CollectionCard
              key={index}
              {...collection}
              handleClick={() => handleNavigate(collection)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCollections;

interface IDisplayCollections {
  title: String;
  isLoading: Boolean;
  collections: ICollection[];
}
