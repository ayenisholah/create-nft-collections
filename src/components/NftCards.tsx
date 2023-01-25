const NftCards = ({ mintFee }: { mintFee: String }) => {
  return (
    <div className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer">
      <div className="flex flex-col p-4">
        <div className="block"></div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              Mint Fee: {mintFee}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftCards;
