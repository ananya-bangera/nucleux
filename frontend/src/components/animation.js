"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useState } from "react"

export default function Animation({ messages, setMessages }) {
  const [chapter, setchapter] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400/20 to-teal-500/20 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Main Tutorial Section */}
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
                  <p className="text-sm font-medium text-teal-800">"Got it! I’ll find the most optimal way for you. Let me check the best route…"</p>
                </div>
              </div>

              {/* Students Section */}
              {chapter % 2 === 1 && <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <img
                    src="/Mike.png"
                    className="w-full max-w-xs sm:max-w-2xl px-4"
                    alt="Hero image"
                  />
                  <div className="text-center">

                    <p className="text-sm ">Mike - Bridge Guide</p>
                  </div>
                  {/* <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-4 shadow-lg max-w-xs">
                    <p className="text-sm font-medium text-teal-800">"Got it! I’ll find the most optimal way for you. Let me check the best route…"</p>
                  </div> */}
                </div>
                <div className="relative">
                  <img
                    src="/Tom.png"
                    className="w-full max-w-xs sm:max-w-2xl px-4"
                    alt="Hero image"
                  />
                  <div className="text-center">

                    <p className="text-sm ">Tom - Swap Expert</p>
                  </div>
                  {/* <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-4 shadow-lg max-w-xs">
                    <p className="text-sm font-medium text-teal-800">"Got it! I’ll find the most optimal way for you. Let me check the best route…"</p>
                  </div> */}
                </div>
                <div className="relative">
                  <img
                    src="/Jack.png"
                    className="w-full max-w-xs sm:max-w-2xl px-4"
                    alt="Hero image"
                  />
                  <div className="text-center">

                    <p className="text-sm ">Jack - Exchange Buddy</p>
                  </div>
                  {/* <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-4 shadow-lg max-w-xs">
                    <p className="text-sm font-medium text-teal-800">"Got it! I’ll find the most optimal way for you. Let me check the best route…"</p>
                  </div> */}
                </div>
              </div>}
            </div>

            {/* Tutorial Navigation */}
            <div className="mt-8 flex justify-between items-center">
              <Button variant="outline">Previous Chapter</Button>
              <div className="text-center">

                <p className="text-sm text-muted-foreground">Getting Started</p>
              </div>
              <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => setchapter(chapter + 1)}>
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

