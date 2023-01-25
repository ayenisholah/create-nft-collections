import React, { ChangeEvent, useEffect, useState } from "react";
import { CustomButton, FormField } from "src/components";
import { useLocation } from "react-router-dom";
import { supabase } from "src/lib/api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

const UpdateMintPage = () => {
  const navigate = useNavigate();

  const [prevState, setPrevState] = useState({
    content: "",
    twitter: "",
    discord: "",
    opensea: "",
    website: "",
  });
  const { state } = useLocation();

  useEffect(() => {
    async function getCollection() {
      try {
        const { data, error }: { data: any[] | null; error: any } =
          await supabase
            .from("collections")
            .select("*")
            .eq("collectionAddress", state.collectionAddress);

        if (data?.length) setPrevState(data[0]);
        if (error) console.log(error);
      } catch (error) {
        console.log(error);
      }
    }
    getCollection();
  }, [state.collectionAddress]);

  const handleFormFieldChange = (
    fieldName: string,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPrevState({ ...prevState, [fieldName]: e.target.value });
  };

  async function handleSubmit(event: Event) {
    event.preventDefault();

    try {
      let { data } = await supabase
        .from("collections")
        .upsert({ collectionAddress: state.collectionAddress, ...prevState })
        // .eq('collectionAddress', state.collectionAddress)
        .select();

      if (data) {
        notification.success({
          message: "changes saved",
          style: { backgroundColor: "#20C070", color: "#fff" },
          // description: "changes updated successfully",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      navigate(`../collections/${state.collectionAddress}`, { state: state });
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
            Configure mint website
          </h1>
        </div>
        <FormField
          labelName="Content"
          placeholder="Project Description"
          inputType="text"
          isTextArea
          value={prevState.content}
          handleChange={(e) => handleFormFieldChange("content", e)}
        />
        <FormField
          labelName="Twitter Account"
          placeholder="https://twitter.com/ayenisholah"
          value={prevState.twitter}
          handleChange={(e) => handleFormFieldChange("twitter", e)}
        />
        <FormField
          labelName="Discord url"
          placeholder="https://discord.com/channels/@me"
          value={prevState.discord}
          handleChange={(e) => handleFormFieldChange("discord", e)}
        />
        <FormField
          labelName="Opensea page url"
          placeholder="https://opensea.io/collection/lilpudgys"
          value={prevState.opensea}
          handleChange={(e) => handleFormFieldChange("opensea", e)}
        />
        <FormField
          labelName="Website url"
          placeholder="https://boredapeyachtclub.com/"
          value={prevState.website}
          handleChange={(e) => handleFormFieldChange("website", e)}
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
          title="Save"
          styles="bg-[#1dc071] px-8"
          handleClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default UpdateMintPage;
