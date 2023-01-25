/* eslint-disable react/style-prop-object */
import { ChangeEvent, useContext, useState } from "react";
import { CustomButton, FormField } from "src/components";
import { useLocation } from "react-router-dom";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { ABI, ADDRESS } from "src/contract";
import { Web3Context } from "src/context";

const UpdateContractPage = () => {
  const { userSigner, address } = useContext<any>(Web3Context);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [toggle, setToggle] = useState(state.open);

  const [splitRatio, setSplitRatio] = useState(state.splitRatio);
  const [creatorFee, setCreatorFee] = useState(100 - state.splitRatio);
  const [form, setForm] = useState({
    mintFee: state.mintFee,
    maxPerWallet: state.maxPerWallet,
    maxPerMint: state.maxPerMint,
    splitAddress: state.splitAddress,
  });

  const handleFormFieldChange = (fieldName: string, e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    let value = target.value;

    if (fieldName === "symbol") value = target.value.replace(/[^a-z]/gi, "");
    if (fieldName === "maxPerWallet")
      value = target.value.replace(/[^0-9]/gi, "");
    if (fieldName === "maxPerMint")
      value = target.value.replace(/[^0-9]/gi, "");

    setForm({ ...form, [fieldName]: value });
  };
  const myContract = new ethers.Contract(ADDRESS, ABI, userSigner);

  const handleSplitChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let splitRatio = +e.target.value;
    if (splitRatio < 0) splitRatio = 0;
    if (splitRatio > 100) splitRatio = 100;

    const creatorFee = 100 - splitRatio;
    setSplitRatio(splitRatio);
    setCreatorFee(creatorFee);
  };

  const handleCreatorFeeChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let creatorFee = +e.target.value;
    if (creatorFee < 0) creatorFee = 0;
    if (creatorFee > 100) creatorFee = 100;
    const splitRatio = 100 - creatorFee;
    setSplitRatio(splitRatio);
    setCreatorFee(creatorFee);
  };

  async function handleSubmit(event: Event) {
    event.preventDefault();

    try {
      await myContract.updateCollection(
        Number(state.collectionIndex),
        ethers.utils.parseUnits(form.mintFee, "ether"),
        Number(form.maxPerWallet),
        Number(form.maxPerMint),
        form.splitAddress,
        Number(splitRatio),
        toggle,
        {
          gasLimit: 3000000,
          gasPrice: ethers.utils.parseUnits("10", "gwei"),
        }
      );
      notification.success({
        message: "changes saved",
        style: { backgroundColor: "#20C070", color: "#fff" },
        description: "contract updated successfully",
        placement: "topRight",
      });
    } catch (error) {
      console.log(error);
    } finally {
      navigate("../");
    }
  }

  async function goBack() {
    navigate(`../collections/${state.collectionAddress}`, { state: state });
  }

  return (
    <div>
      <div className="bg-[#1c1c24]  rounded-[10px] sm:p-10 p-4 max-w-[90%] mx-auto">
        <div className="flex justify-center items-center p-[16px] max-w-[300px] mx-auto mb-10 bg-[#3a3a43] rounded-[10px]">
          <h1 className="font-epilogue font-bold sm:text-[25px]  text-[18px] leading-[38px] text-white">
            Configure Contract
          </h1>
        </div>

        <div className="flex flex-col mb-8">
          <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
            Sale Open/Close
          </span>
          <label className="relative inline-flex justify-start cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={toggle}
              onClick={() => setToggle(!toggle)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
          </label>
        </div>
        <FormField
          labelName="Mint Fee"
          inputType="text"
          value={form.mintFee}
          handleChange={(
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => handleFormFieldChange("mintFee", e)}
        />
        <FormField
          labelName="Max Mint Per Wallet"
          value={form.maxPerWallet}
          handleChange={(
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => handleFormFieldChange("maxPerWallet", e)}
        />
        <FormField
          labelName="Max Per Mint"
          value={form.maxPerMint}
          handleChange={(
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => handleFormFieldChange("maxPerMint", e)}
        />
        <p className="text-[14px] text-white mb-5">
          How to split mint fee (if split address is empty, 100% of mint fee
          goes to the creator's wallet)
        </p>
        <div className="w-full flex items-center justify-between">
          <FormField
            disabled
            labelName="Creator's Address*"
            placeholder={address}
            value={address}
            handleChange={(
              e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => handleFormFieldChange("splitAddress", e)}
            style="mr-8"
          />
          <FormField
            labelName="Creator's Percentage (%) * (by default the creator address gets 100%)"
            placeholder="100"
            value={creatorFee}
            handleChange={handleCreatorFeeChange}
            style="ml-8"
          />
        </div>

        <div className="w-full flex items-center justify-between">
          <FormField
            labelName="Split Address*"
            value={form.splitAddress}
            placeholder="0x0000000000000000000000000000000000000000"
            handleChange={(
              e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => handleFormFieldChange("splitAddress", e)}
            style="mr-8"
          />
          <FormField
            labelName="Split Percentage (%) * (by default the split address gets 0%)"
            placeholder="0"
            value={splitRatio}
            handleChange={handleSplitChange}
            style="ml-8"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-[40px] max-w-[75%] mx-auto">
        <CustomButton
          btnType="submit"
          title="Back"
          styles="bg-[#8c6dfd] px-8"
          handleClick={goBack}
        />
        <CustomButton
          btnType="submit"
          title="Save"
          styles="bg-[#1dc071] px-8"
          handleClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default UpdateContractPage;
