"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

const ORCHESTRATOR_URL = "http://localhost:3001/"
var introductoryText = `I'm Nucleux, your personal assistant. I will guide you through the process of swapping, briding and exchanging your tokens. Let's get started!`;

export default function Animation({ messages, setMessages }) {
  const [chapter, setchapter] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [text, setText] = useState(introductoryText);

  const [bridgeMessages, setBridgeMessages] = useState([])
  const [swapMessages, setSwapMessages] = useState([])
  const [exchangeMessages, setExchangeMessages] = useState([])

  const [responses, setResponses] = useState([[], [], []]);


  const handleRequest = async (description) => {
    setDisplayText("");
    setText("   User says: " + "\n\n" + description);

    try {

      const response = await fetch(ORCHESTRATOR_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResponses(data.response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    let speed = 50;
    let i = 0;
    const interval = setInterval(() => {
      if (i < (text.length - 1)) {
        setDisplayText((prev) => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);

      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    let speed = 50;
    let i = 0;
    const msg = " " + responses[0].map(obj => obj.message).join(" ");
    const interval = setInterval(() => {
      if (i < (msg.length - 1)) {
        setBridgeMessages((prev) => prev + msg[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [responses]);

  useEffect(() => {
    let speed = 50;
    let i = 0;
    const msg = " " + responses[1].map(obj => obj.message).join(" ");
    const interval = setInterval(() => {
      if (i < (msg.length - 1)) {
        setSwapMessages((prev) => prev + msg[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [responses]);

  useEffect(() => {
    let speed = 50;
    let i = 0;
    const msg = " " + responses[2].map(obj => obj.message).join(" ");
    const interval = setInterval(() => {
      if (i < (msg.length - 1)) {
        setExchangeMessages((prev) => prev + msg[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [responses]);

  return (
    <div className="min-h-screen bg-purple-600 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="relative overflow-hidden h-max border-2 bg-pink-500 border-teal-500/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 items-center">
              {(chapter % 2) === 0 && <div className="relative">
                <img
                  src="/Moana.png"
                  className="w-full max-w-xs sm:max-w-2xl px-4"
                  alt="Hero image"
                />
                <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-4 shadow-lg max-w-xs">
                  <p className="text-sm font-medium text-teal-800">{messages.length > 0 ? messages.at(messages.length - 1) : "..."}</p>
                </div>
              </div>}
              {/* Mia's Section */}
              <div className="relative">
                <img
                  src="/Mia.png"
                  className="w-full max-w-xs sm:max-w-2xl px-4"
                  alt="Hero image"
                />
                <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-4 shadow-lg max-w-xs">
                  <p className="text-sm font-medium text-teal-800">{displayText}</p>
                </div>
              </div>

              {/* Agents Section */}
              {chapter % 2 === 1 && <div className="grid grid-cols-2 gap-4">

                {/* Bridge */}
                <div className="relative my-12">
                  {bridgeMessages && bridgeMessages.length > 0 && <div className="bg-white/90 rounded-lg p-4 shadow-lg max-w-xs mx-auto">
                    <p className="text-sm font-medium text-teal-800">{bridgeMessages}</p>
                  </div>}
                  <img
                    src="/Mike.png"
                    className="w-full max-w-xs sm:max-w-2xl px-4"
                    alt="Hero image"
                  />
                  <div className="text-center">
                    <p className="text-sm ">Nova - Bridge Guide</p>
                  </div>
                </div>

                {/* Swap */}
                <div className="relative my-12">
                  {swapMessages && swapMessages.length > 0 && <div className="bg-white/90 rounded-lg p-4 shadow-lg max-w-xs mx-auto">
                    <p className="text-sm font-medium text-teal-800">{swapMessages}</p>
                  </div>}
                  <img
                    src="/Tom.png"
                    className="w-full max-w-xs sm:max-w-2xl px-4"
                    alt="Hero image"
                  />
                  <div className="text-center">
                    <p className="text-sm ">Max - Swap Expert</p>
                  </div>
                </div>

                {/* Exchange */}
                <div className="relative col-span-2 px-32 my-12">
                  {exchangeMessages && exchangeMessages.length > 0 && <div className="bg-white/90 rounded-lg p-4 shadow-lg max-w-xs mx-auto">
                    <p className="text-sm font-medium text-teal-800">{exchangeMessages}</p>
                  </div>}
                  <img
                    src="/Jack.png"
                    className="w-full max-w-xs sm:max-w-2xl px-4"
                    alt="Hero image"
                  />
                  <div className="text-center">
                    <p className="text-sm ">Rami - Exchange Buddy</p>
                  </div>
                </div>
              </div>}
            </div>

            {/* Tutorial Navigation */}
            <div className="mt-8 flex justify-between items-center">
              <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => setchapter(chapter - 1)}>
                <ChevronLeft className="ml-2 h-4 w-4" />
                Previous Chapter
              </Button>
              <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => {
                setchapter(chapter + 1);
                handleRequest(messages.join("\n"))
              }}>
                Next Chapter
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

