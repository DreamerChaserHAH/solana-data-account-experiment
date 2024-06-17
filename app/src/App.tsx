import WalletContextProvider from "./components/WalletContextProvider";
import { AnchorCall } from "./components/anchor/AnchorCall";

function App() {
 
  return (
    <div>
      <WalletContextProvider>
        <AnchorCall></AnchorCall>
      </WalletContextProvider>
    </div>
  );
}
 
export default App;