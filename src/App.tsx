import { Web3ContextProvider, IpfsContextProvider } from "./context";
import {
  Home,
  CreateCollections,
  Profile,
  MintPage,
  UpdateMintPage,
  UpdateContractPage,
  UpdateWhitelist,
} from "./pages";
import { Sidebar, Navbar } from "./components";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Web3ContextProvider>
      <IpfsContextProvider>
        <div className="App relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
          <div className="sm:flex hidden mr-10 relative">
            <Sidebar />
          </div>

          <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/create-collection"
                element={<CreateCollections />}
              />
              <Route path="/collections/:id" element={<MintPage />} />

              <Route
                path="update/collection/:id"
                element={<UpdateMintPage />}
              />
              <Route
                path="update/contract/:id"
                element={<UpdateContractPage />}
              />
              <Route
                path="update/whitelist/:id"
                element={<UpdateWhitelist />}
              />
            </Routes>
          </div>
        </div>
      </IpfsContextProvider>
    </Web3ContextProvider>
  );
}

export default App;
