// ...existing code...
import { createContext, useEffect, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

  const [input, setinput] = useState("");
  const [recentprompt, setrecentprompt] = useState("");
  const [previousprompt, setpreviousprompt] = useState([]);
  const [showresult, setshowresult] = useState(false);
  const [loading, setloading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextword) => {
    // adding typing effect
    setTimeout(function () {
      setResultData((prev) => prev + nextword);
    }, 75 * index);
  };

  // condition when on clicking new chat
  const newchat =()=>{
    
    setloading(false);
    setshowresult(false);
  }

  const callGemini = async (prompt,isHistory = false) => {
    setResultData("");
    setloading(true);
    setshowresult(true);

    try {
      let response;

      if (prompt !== undefined) {
        if (!isHistory) {
          setpreviousprompt((prev) => [...prev, prompt]); 
        }
        setrecentprompt(prompt);
        response = await runChat(prompt);
      } else {
        setpreviousprompt((prev) => [...prev, input]);
        setrecentprompt(input);
        response = await runChat(input);
      }

      // removing two stars and adding bold text
      let responseArray = response.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i == 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }
      // removing single star and adding new line
      let newResponse2 = newResponse.split("*").join("</br>");

      // adding typing effect
      let newResponseArray = newResponse2.split(" ");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextword = newResponseArray[i];
        delayPara(i, nextword + " ");
      }
    } catch (error) {
      console.error("Error generating response:", error);
      setResultData("An error occurred: " + (error?.message || "Please try again."));
    } finally {
      setloading(false);
      setinput("");
    }
  };
  const contextValue = {
    previousprompt,
    setpreviousprompt,
    callGemini,
    setrecentprompt,
    recentprompt,
    showresult,
    loading,
    resultData,
    setinput,
    input,
    newchat,
  };
  return (
    
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
export default ContextProvider;
