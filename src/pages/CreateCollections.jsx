/* eslint-disable react/style-prop-object */
import { ethers } from "ethers";
import { useCallback, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loader } from "../assets";
import {
  CustomButton,
  FormField,
  UploadImagesForm,
  UploadMetadataForm,
} from "../components";
import { useMultiStepForm } from "../hooks";
import { useDropzone } from "react-dropzone";
import { IpfsContext, Web3Context } from "../context";
import { retrieve, store } from "../utils/UploadToIpfs";
import mergeImagesCidWithTokenUri from "../utils/MergeImagesCidWithTokenUri";
import { ABI, ADDRESS } from "../contract/index";
import { notification } from "antd";

const CreateCollections = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setImageRootCid, data, setTokenUri } = useContext(IpfsContext);
  const [metadataCount, setMetadataCount] = useState([]);

  const metadata = useRef([]);
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        if (currentStepIndex === 1) {
          const reader = new FileReader();
          metadata.current = [];

          reader.onabort = () => console.log("file reading was aborted");
          reader.onerror = () => console.log("file reading has failed");
          reader.onload = async () => {
            // Do something with files
            const binaryStr = reader.result;
            setMetadataCount(metadataCount.push(binaryStr));
            metadata.current.push(JSON.parse(binaryStr));
          };
          reader.readAsText(file);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
  });

  async function uploadImage() {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      return alert("No files selected");
    }

    try {
      setIsLoading(true);
      const imageRootCid = await store(acceptedFiles);
      setIsLoading(false);
      setImageRootCid(imageRootCid);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  async function submitMetadata() {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      return alert("No files selected");
    }
    const { imageRootCid } = data;

    if (imageRootCid) {
      setIsLoading(true);
      let imageCids = await retrieve(imageRootCid);
      const sortedMetadata = metadata.current.sort((a, b) =>
        a.image > b.image ? 1 : a.image < b.image ? -1 : 0
      );
      setIsLoading(false);

      // merge image cid with token uri
      const metadataWithImagesCid = mergeImagesCidWithTokenUri(
        sortedMetadata,
        imageCids
      );
      const tokenArray = [];
      for (const item of metadataWithImagesCid) {
        const file = new File([JSON.stringify(item)], `${item.name}.json`);
        tokenArray.push(file);
      }
      try {
        const tokenUriArray = await store(tokenArray);
        // await pinHashToIpfs(tokenUriArray)

        setTokenUri(tokenUriArray);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  }

  const { currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultiStepForm([
      <UploadImagesForm
        acceptedFiles={acceptedFiles}
        getInputProps={getInputProps}
      />,
      <UploadMetadataForm
        acceptedFiles={metadataCount}
        getInputProps={getInputProps}
      />,
      <CollectionDetailsForm acceptedFiles={acceptedFiles} />,
    ]);

  console.log({ acceptedFiles });

  return (
    <>
      {isLoading ? (
        <img src={loader} alt="loader" className="h-[300px] mx-auto mt-20" />
      ) : (
        <>
          {currentStepIndex === 2 ? (
            <form className="w-full mt-[65px] flex flex-col gap-[30px]">
              {step}
            </form>
          ) : (
            <form
              {...getRootProps({ className: "dropzone" })}
              className="w-full mt-[65px] flex flex-col gap-[30px]"
            >
              {step}
            </form>
          )}
          <div>
            {!isFirstStep && (
              <CustomButton
                btnType="button"
                title="Back"
                styles="bg-[#8c6dfd] mt-5 min-h-[36px] float-left"
                handleClick={() => {
                  back();
                }}
              />
            )}
            {!isLastStep && (
              <CustomButton
                btnType="button"
                title="Next"
                styles="bg-[#8c6dfd] mt-5 min-h-[36px] float-right"
                handleClick={() => {
                  if (currentStepIndex === 0) {
                    uploadImage();
                  } else if (currentStepIndex === 1) {
                    submitMetadata();
                  }
                  next();
                }}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

function CollectionDetailsForm({ acceptedFiles }) {
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    mintFee: "",
    maxPerWallet: "",
    maxPerMint: "",
    splitAddress: "",
  });

  const [toggle, setToggle] = useState(true);

  const [splitRatio, setSplitRatio] = useState(0);
  const [creatorFee, setCreatorFee] = useState(100);

  const { userSigner, address, injectedProvider } = useContext(Web3Context);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useContext(IpfsContext);

  const handleFormFieldChange = (fieldName, e) => {
    let value = e.target.value;

    if (fieldName === "symbol") value = e.target.value.replace(/[^a-z]/gi, "");
    if (fieldName === "maxPerWallet")
      value = e.target.value.replace(/[^0-9]/gi, "");
    if (fieldName === "maxPerMint")
      value = e.target.value.replace(/[^0-9]/gi, "");

    setForm({ ...form, [fieldName]: value });
  };

  const handleSplitChange = (e) => {
    let splitRatio = e.target.value;
    if (splitRatio < 0) splitRatio = 0;
    if (splitRatio > 100) splitRatio = 100;

    const creatorFee = 100 - splitRatio;
    setSplitRatio(splitRatio);
    setCreatorFee(creatorFee);
  };

  const handleCreatorFeeChange = (e) => {
    let creatorFee = e.target.value;
    if (creatorFee < 0) creatorFee = 0;
    if (creatorFee > 100) creatorFee = 100;
    const splitRatio = 100 - creatorFee;
    setSplitRatio(splitRatio);
    setCreatorFee(creatorFee);
  };

  const { tokenUri } = data;
  const { name, symbol, mintFee, maxPerWallet, maxPerMint } = form;

  let { splitAddress } = form;
  const myContract = new ethers.Contract(ADDRESS, ABI, userSigner);

  const handleSubmit = async (event) => {
    console.log({ tokenUri });
    event.preventDefault();
    if (tokenUri && name && symbol && mintFee) {
      setIsLoading(true);

      try {
        let gasEstimate =
          (await (await injectedProvider.getGasPrice()).toString()) / 10 ** 9;
        if (splitAddress === "") {
          splitAddress = "0x3B041c99bCB0785F6b065eefeDF1E1C658fB8Fa4";
        }

        gasEstimate += 20;
        await myContract.createNft(
          name,
          symbol,
          ethers.utils.parseUnits(mintFee, "ether"), //* mintAmount,
          Number(maxPerWallet),
          Number(maxPerMint),
          acceptedFiles.length,
          splitAddress,
          Number(splitRatio),
          tokenUri,
          toggle,
          {
            gasLimit: 3000000,
            gasPrice: ethers.utils.parseUnits(gasEstimate.toString(), "gwei"),
          }
        );
        notification.success({
          message: "submitted",
          style: { backgroundColor: "#20C070", color: "#fff" },
          description: "collection submitted",
          placement: "topRight",
        });
      } catch (error) {
        alert(JSON.stringify(error));
      }

      setIsLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="bg-[#1c1c24]  justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && (
        <img src={loader} alt="loader" className="h-[300px] mx-auto mt-20" />
      )}
      <div className="flex justify-center items-center p-[16px] max-w-[300px] mx-auto mb-10 bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px]  text-[18px] leading-[38px] text-white">
          Configure Contract
        </h1>
      </div>

      <FormField
        labelName="Collection Name *"
        placeholder="Crazy Bunnies (if name is taken, opensea adds an automatic extension)"
        inputType="text"
        value={form.name}
        handleChange={(e) => handleFormFieldChange("name", e)}
      />
      <FormField
        labelName="Collection Symbol *"
        placeholder="CRZYB"
        inputType="text"
        value={form.symbol}
        handleChange={(e) => handleFormFieldChange("symbol", e)}
      />
      <FormField
        labelName="Mint Fee *"
        placeholder="0.05"
        value={form.mintFee}
        handleChange={(e) => handleFormFieldChange("mintFee", e)}
      />
      <div className="flex flex-col mb-8">
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
          Sale Open/Close
        </span>
        <label class="relative inline-flex justify-start cursor-pointer">
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

      <div className="w-full flex items-center justify-between">
        <FormField
          labelName="Max Mint Per Wallet*"
          placeholder="30"
          value={form.maxPerWallet}
          handleChange={(e) => handleFormFieldChange("maxPerWallet", e)}
          style="mr-8"
        />
        <FormField
          labelName="Mint Per Mint *"
          placeholder="10"
          value={form.maxPerMint}
          handleChange={(e) => handleFormFieldChange("maxPerMint", e)}
          style="ml-8"
        />
      </div>

      <p className="text-[14px] text-white mb-5">How to split mint fee</p>

      <div className="w-full flex items-center justify-between">
        <FormField
          disabled
          labelName="Creator's Address*"
          placeholder={address}
          // value={address}
          handleChange={(e) => handleFormFieldChange("splitAddress", e)}
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
          handleChange={(e) => handleFormFieldChange("splitAddress", e)}
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
      <div className="flex justify-center items-center mt-[40px]">
        <CustomButton
          btnType="submit"
          title="Deploy Contract"
          styles="bg-[#1dc071]"
          handleClick={handleSubmit}
        />
      </div>
    </div>
  );
}

export default CreateCollections;
