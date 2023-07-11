import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import deckexpertLogo from '../assets/deckexpert-logo.png';

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(output.text);
    setIsGenerating(false);
    handleSpeak(output.text);
  };

  const handleSpeak = (text) => {
    let lines = text.split('\n');
    setIsSpeaking(true);

    lines.forEach((line) => {
      let msg = new SpeechSynthesisUtterance(line);
      msg.rate = 1.3;
      msg.onstart = () => {
        console.log("Speaking:", line);
      };
      msg.onend = () => {
        if (line === lines[lines.length - 1]) {
          setIsSpeaking(false);
        }
      };
      window.speechSynthesis.speak(msg);
    });
  };

  useEffect(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      handleSpeak(apiOutput);
    }
  }, [isSpeaking]);

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>DECK-EXPERT | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>"Deck-Expert: Mastering the Art of Deck Construction"</h1>
          </div>
          <div className="header-subtitle">
            <h2>"Unlocking Tips, Techniques, and Expertise for Stunning Decks"</h2>
          </div>
        </div>
        <div className="logo-container">
          <Image src={deckexpertLogo} alt="Your logo" />
        </div>
        <div className="prompt-container">
          <textarea
            className="prompt-box"
            placeholder="Hello, I am DECK-EXPERT. How can i assist you in your deck project?"
            value={userInput}
            onChange={onUserChangedText}
          />

          <div className="prompt-buttons">
            <a
              className={isGenerating ? 'generate-button loading' : 'generate-button'}
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>

          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Answer</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a href="https://buildspace.so/builds/ai-writer" target="_blank" rel="noreferrer">
          <div className="badge">
            <Image src={deckexpertLogo} className="balls" alt="Your logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
