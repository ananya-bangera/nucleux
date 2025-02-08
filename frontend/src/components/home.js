import React, { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";
import Chat from "./chat";
import Animation from "./animation";



const Home = ({ chainid, betid, contractAddress }) => {

  const [betAmount, setBetAmount] = useState("");
  const [email, setEmail] = useState("");
  const [twitter, setTwitter] = useState("");
  const [txHash, setTxHash] = useState("");
  const [messages, setMessages] = useState([
    // {
    //   id: 1,
    //   user: "Moana",
    // content:
    //  "I want to buy USDC on Gnosis using UPI.",
    // timestamp: new Date("2023-05-01T20:00:00"),
    // avatar: "/Moana.png?height=40&width=40",
    // }
  ]);

  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();

  if (
    isConnected &&
    chainid !== undefined &&
    currentChainId.toString() !== chainid
  ) {
    return (
      <div className="pt-12">
        <div className="px-4 sm:px-16">
          <div className="bg-purple-600 rounded-xl border-4 border-black shadow-custom p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">
                Wrong Network
              </h2>
              <p className="text-white mb-6 font-mono">
                Please switch to the correct network to continue
              </p>
              <ConnectButton.Custom>
                {({ openChainModal }) => (
                  <Button
                    onClick={openChainModal}
                    className="border-2 border-black bg-pink-500 text-white hover:bg-pink-600"
                  >
                    Switch Network
                  </Button>
                )}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Wallet connection check render
  if (!isConnected) {
    return (
      <div className="pt-12">
        <div className="px-4 sm:px-16">
          <div className="bg-purple-600 rounded-xl border-4 border-black shadow-custom p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">
                Connect Your Wallet
              </h2>
              <p className="text-white mb-6 font-mono">
                Please connect your wallet to start playing
              </p>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button
                    onClick={openConnectModal}
                    className="border-2 border-black bg-pink-500 text-white hover:bg-pink-600"
                  >
                    Connect Wallet
                  </Button>
                )}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12">
      <div className="px-4 sm:px-16">
        <div className="bg-purple-600 rounded-xl border-4 border-black shadow-custom">
          <div className="grid grid-cols-3 justify-items-center gap-4">
            <div className="col-span-1">
              <Chat messages={messages} setMessages={setMessages} />
            </div>
            <div className="col-span-2">
              <Animation messages={messages} setMessages={setMessages} />
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default Home;
