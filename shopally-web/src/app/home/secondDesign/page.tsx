"use client";

import { useEffect, useState } from "react";
import {Search} from "lucide-react";
import { Menu, Moon,MessageCircleMore, ArrowRight, HomeIcon, LightbulbIcon, Heart, BarChart, User, Languages } from "lucide-react";
import CardComponent from "../../components/HomePageCardComponent/HomePageCardComponent"

export default function Another() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("EN");
  const [message, setMessage] = useState<string[]>([]);
  const [input, setinput] = useState("");
  const [bottomSearch, setBottomSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // for mobile sidebar

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessage([...message, input]); // add message
    setinput(""); // clear input
  };

  
  useEffect(() => {
    const mes = localStorage.getItem("message");
    setMessage(mes ? JSON.parse(mes) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem("message", JSON.stringify(message));
  }, [message]);

  function hum() {
    setIsOpen(!isOpen);
    console.log(isOpen);
    
  } 



  return (
    <main>
        <div className=" bg-[#FFFFFF] flex lg:hidden  justify-between items-center relative pl-4 w-full h-[65px] "> <button onClick={() => hum()}><Menu size={24} /></button> <div className="absolute left-1/2 transform -translate-x-1/2">Shopally</div> </div>
    <div className="flex">
        <div className={`fixed top-0 left-0  w-[70%] bg-[#0D2A4B] flex flex-col gap-7 z-50 transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0 lg:static lg:w-[15%] lg:flex`}>
            <div className="justify-between flex items-center pr-4">
            <div className="flex px-4 mt-5 mb-7  gap-2 w-full">
                <div className="w-6 h-6 rounded-full bg-yellow-400">
                    <img src="/images/frame.png" alt="" />
                </div>
                <h6 className=" text-[#FFFFFF] ">Shoppally</h6>
            </div>
                <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}> ✕</button>
            </div>

            <span className="mx-6 h-[48px] flex items-center gap-2 pl-4  bg-[#10B981] text-center rounded-[8px] "> <HomeIcon size={16} fill="black"/> <div className="text-[#FFFFFF]">Home</div></span>
            <div className="mx-6 h-[48px] flex items-center gap-2 pl-4  bg-[#10B981] text-center rounded-[8px] "> <LightbulbIcon size={16} fill="black"/>How it works</div>
            <div className="mx-6 h-[48px] flex items-center gap-2 pl-4  bg-[#10B981] text-center rounded-[8px] "> <BarChart size={16} fill="black"/>Compare</div>
            <div className="mx-6 h-[48px] flex items-center gap-2 pl-4  bg-[#10B981] text-center rounded-[8px] "> <Heart size={16} fill="black"/>Saved Items</div>
            <div className="mx-6 h-[48px] flex items-center gap-2 pl-4  bg-[#10B981] text-center rounded-[8px] "> <User size={16} fill="black"/>Profile</div>
            <hr  className="mx-6  flex   pl-4  border-[1px]" />
            <div className="mx-6 h-[48px] flex items-center gap-2 pl-4  bg-[#10B981] text-center rounded-[8px] "> <Languages size={16} fill="black"/>Change To Amharic</div>

        </div>

        {/* Overlay when sidebar is open on mobile */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 lg:hidden"
          />
        )}

        <main
        className={`min-h-screen ${
            darkMode ? "bg-[#090C11]" : "bg-[#1E3A8A]"
        } flex flex-col lg:w-[85%] w-full  items-center pb-24`}
        >
        

        {/* Hero Section */}
        <section
            className={`max-w-3xl text-center mt-12 mb-4 px-4 ${
            darkMode ? "bg-[#090C11]" : "bg-[#1E3A8A]"
            }`}
        >
            <h1
            className={`text-2xl sm:text-3xl lg:text-4xl lg:w-[100%] mb-4 ${
                message.length === 0 ? "block" : "hidden"
            }  font-bold  ${darkMode ? "text-white" : "text-[#FFFFFF]"}`}
            >
            Your Smart AI Assistant for Alibaba Shopping
            </h1>
            <p
            className={` ${darkMode ? "text-[#FFF] " : "text-gray-400 "} ${
                message.length === 0 ? "block" : "hidden"
            } mb-12`}
            >
            Discover the perfect products on Alibaba with AI-powered
            recommendations tailored to your needs.
            </p>

            {/* Search Box */}
            <div
            className={`flex items-center ${
                message.length === 0 ? "hidden sm:flex" : "hidden"
            }  border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm ${
                darkMode
                ? "bg-[#262B32] text-[#999999] "
                : "bg-white text-[#999999] "
            } `}
            >
            <input
                type="text"
                placeholder="What do you need to buy today?"
                onChange={(e) => setinput(e.target.value)}
                value={input}
                className={` ${
                darkMode ? "bg-gray-800 text-white" : "text-black"
                } flex-1 px-4 py-3 text-sm sm:text-base focus:outline-none `}
            />
            <button
                onClick={handleSend}
                className="bg-yellow-400 rounded-xl p-3 mr-1 my-1  flex items-center justify-center"
            >
                <ArrowRight size={20} className="text-black" />
            </button>
            </div>
        </section>

        {/* {how ShopAlly works} */}
        

        {message.length === 0 ? (
            <section className="mt-10 px-4 max-w-3xl w-full">
            <h2
                className={` ${
                darkMode ? "text-gray-600" : "text-white"
                } text-lg font-semibold mb-4 text-center`}
            >
                Try asking:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                "What do I need to bake bread?",
                "Best kitchen appliances for small apartments",
                "Essential tools for home gardening",
                "What should I buy for a home office setup?",
                ].map((q, i) => (
                <button
                    key={i}
                    onClick={() => setMessage([...message, q])}
                    className={`flex items-center gap-2 border ${
                    darkMode
                        ? "border-gray-700 hover:bg-gray-700 text-[#FFFFFF]"
                        : "hover:bg-gray-50 border-gray-300 text-gray-400"
                    } rounded-lg px-3 py-2 text-sm text-left hover:bg-gray-50 transition`}
                >
                    <MessageCircleMore className="w-4 h-4 rounded-full text-white bg-black" />
                    <span>{q}</span>
                </button>
                ))}
            </div>
            </section>
        ) : (
            <div className="w-full max-w-3xl px-4 flex flex-col gap-2 mt-6">
            {message.map((msg, idx) => (
                <div key={idx} className="flex justify-end">
                <div
                    className={`max-w-1/2 break-words px-4 py-2 rounded-xl bg-yellow-400 text-black`}
                >
                    {msg}
                </div>
                </div>
            ))}
            </div>
        )}

        

        {/* {search bar if there is message} */}
        <section
            className={`max-w-3xl w-full fixed bottom-1 ${
            message.length === 0 ? "block sm:hidden" : "block"
            }   text-center mt-12  px-4 pb-2`}
        >
            <div
            className={`flex items-center border  border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm ${
                darkMode
                ? "bg-[#262B32] text-[#999999] "
                : "bg-white text-[#999999] "
            } `}
            >
            <input
                type="text"
                placeholder="Ask me anything about products you need..."
                onChange={(e) => setinput(e.target.value)}
                value={input}
                className={` ${
                darkMode ? "bg-gray-800 text-white" : "text-black"
                } flex-1 px-4 py-3 text-sm sm:text-base focus:outline-none `}
            />
            <button
                onClick={handleSend}
                className="bg-yellow-400 rounded-xl p-3 mr-1 my-1  flex items-center justify-center"
            >
                <ArrowRight size={20} className="text-black" />
            </button>
            </div>
        </section>
        </main>

    </div>
    </main>
  );
}
