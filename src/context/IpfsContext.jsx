import { createContext, useState } from "react";

const initialState = {
  imageRootCid: null,
  tokenUri: null,
  loading: false,
};

export const IpfsContext = createContext(initialState);

const IpfsContextProvider = ({ children }) => {
  const [data, setData] = useState({
    ...initialState,
  });

  const setTokenUri = (cid) => {
    setData((prev) => ({ ...prev, tokenUri: cid }));
  };

  const setImageRootCid = (cid) => {
    setData((prev) => ({ ...prev, imageRootCid: cid }));
  };

  const setLoading = (state) => {
    setData((prev) => ({ ...prev, loading: state }));
  };

  const valuesObject = {
    data,
    setTokenUri,
    setImageRootCid,
    setLoading,
  };

  return (
    <IpfsContext.Provider value={valuesObject}>{children}</IpfsContext.Provider>
  );
};

export default IpfsContextProvider;
