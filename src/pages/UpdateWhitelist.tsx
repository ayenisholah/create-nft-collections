import React, { ChangeEvent, useContext, useState } from "react";
import { CustomButton, FormField } from "src/components";
import { useLocation } from "react-router-dom";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { ABI, ADDRESS } from "src/contract";
import { Web3Context } from "src/context";
import { ethers } from "ethers";

const UpdateWhitelist = () => {
  const { userSigner, injectedProvider } = useContext<any>(Web3Context);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    addresses: "",
  });

  const { state } = useLocation();

  const handleFormFieldChange = (
    fieldName: string,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setForm({ ...form, [fieldName]: value });
  };

  const formattedAddresses = form.addresses
    .trim()
    .split(",")
    .map((address) => address.trim());
  async function handleSubmit(event: Event) {
    const myContract = new ethers.Contract(ADDRESS, ABI, userSigner);

    event.preventDefault();
    let gasEstimate =
      (await (await injectedProvider.getGasPrice()).toString()) / 10 ** 9;

    gasEstimate += 20;

    try {
      await myContract.addToWhitelist(
        Number(state.collectionIndex),
        formattedAddresses,
        {
          gasLimit: 3000000,
          gasPrice: ethers.utils.parseUnits(gasEstimate.toString(), "gwei"),
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
      <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 max-w-[75%] mx-auto">
        <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
            Configure whitelist
          </h1>
        </div>
        <FormField
          labelName="List of Address"
          inputType="text"
          isTextArea
          placeholder="
                    0x3B041c99bCB0785F6b065eefeDF1E1C658fB8Fa4,
                    0xb245DdCB458cEE77ecC5c1F12c9dE2B45e7B0e79,
                    0xb245DdCB458cEE77ecC5c1F12c9dE2B45e7B0e79,
                    0xb245DdCB458cEE77ecC5c1F12c9dE2B45e7B0e79"
          value={form.addresses}
          handleChange={(e) => handleFormFieldChange("addresses", e)}
        />
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
          title="Add to whitelist"
          styles="bg-[#1dc071] px-8"
          handleClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default UpdateWhitelist;
