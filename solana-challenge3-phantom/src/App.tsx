import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {useEffect , useState } from "react";

type DisplayEncoding = "utf8" | "hex";

type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

/**
 * @description gets Phantom provider, if it exists
 */
 const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    // @ts-ignore
    const provider = window.solana as any;
    if (provider.isPhantom) return provider as PhantomProvider;
  }
};

function App() {
  // create state variable for the provider
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );

  const [walletKey, setWalletKey] = useState<PhantomProvider | undefined>(
  undefined
  );
 

  useEffect(() => {
	  const provider = getProvider();

	  if (provider) setProvider(provider);
	  else setProvider(undefined);
  }, []);

  /**
   * @description prompts user to connect wallet if it exists.
	 * This function is called when the connect wallet button is clicked
   */
  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

		// checks if phantom wallet exists
    if (solana) {
      try {
				// connects wallet and returns response which includes the wallet public key
        const response = await solana.connect();
		const { walletadd } = response.publicKey.toString();
        console.log('wallet account ', response.publicKey.toString());
				// update walletKey to be the public key
        setWalletKey(response.publicKey.toString());
      } catch (err) {
      // { code: 4001, message: 'User rejected the request.' }
      }
    }
  };
  
  const disconnectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

		// checks if phantom wallet exists
    if (solana) {
      try {
        const response = await solana.disconnect();
        console.log('Disconnected');
        setWalletKey(undefined);
      } catch (err) {
      }
    }
  };

  return (
    <div className="App">
		<div className="Top-header">
				{provider && walletKey && 
				(<button
					style={{
					  fontSize: "16px",
					  padding: "15px",
					  fontWeight: "bold",
					  borderRadius: "5px",
					}}
					onClick={disconnectWallet}
				  >
					Disconnect Wallet
				  </button>
			)}
		</div>
      <header className="App-header">
		  
        {provider && !walletKey && 
			<h2>Connect to Phantom Wallet</h2>
		}
		
		{provider && !walletKey && (
          <button
            style={{
              fontSize: "16px",
              padding: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
		
		{provider && walletKey && 
			(<span><h2>Connected wallet</h2> Wallet Address: <>{walletKey}</> </span>
		)}
		
        
		
        {!provider && (
          <p>
            No provider found. Install{" "}
            <a href="https://phantom.app/">Phantom Browser extension</a>
          </p>
        )}
      </header>
      
    </div>
  );
}

export default App;