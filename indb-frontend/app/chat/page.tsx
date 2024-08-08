'use client'
import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';


const Chat = () => {
  const [chatHistory, setChatHistory] = useState<Array<{ user?: string; bot?: string; sqlQuery?: string; sqlResult?: string; resultDescription?: string }>>([]);
  const [userMessage, setUserMessage] = useState('');


  const sendMessage = async () => {
    const modelSelection = (document.getElementById("model-selection") as HTMLSelectElement).value;
    const dbSelection = (document.getElementById("db-selection") as HTMLSelectElement).value;
    const agentSelection = (document.getElementById("agent-selection") as HTMLSelectElement).value;


    let message = userMessage;


    if (agentSelection === "agent1") {
      message = "#" + message;
    }


    if (agentSelection === "agent3") {
      message = "@" + message;
    }
    // axios.post("http://127.0.0.1:5000/api/v1/process_question/process_question",{});
    // axios.post("/process_question/process_question",{});
    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/process_question/process_question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_name: modelSelection,
          db_name: dbSelection,
          question: message,
        }),
      });


      const data = await response.json();
      const sqlQuery = data.Query + "\n" || "No SQL query generated";
      const sqlResult = data.Result + "\n" || "No SQL result available";
      const resultDescription = data.Description || "No description available";


      if (agentSelection !== "agent3") {
        setChatHistory((prevHistory) => [...prevHistory, { user: message, bot: sqlQuery }]);
      }


      if (agentSelection === "agent3") {
        const combinedResponse = `SQL Query:\n${sqlQuery}\n\nQuery Result:\n${sqlResult}\n\nDescription:\n${resultDescription}`;
        setChatHistory((prevHistory) => [...prevHistory, { bot: "Step by step text to SQL:", sqlQuery, sqlResult, resultDescription }]);
      }


      setUserMessage('');
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const updateModel = () => {
    const selectedModel = (document.getElementById("model-selection") as HTMLSelectElement).value;
    setChatHistory((prevHistory) => [...prevHistory, { bot: `Model updated to: ${selectedModel}` }]);
  };


  const updateDB = () => {
    const selectedDB = (document.getElementById("db-selection") as HTMLSelectElement).value;
    setChatHistory((prevHistory) => [...prevHistory, { bot: `Database updated using: ${selectedDB}` }]);
  };


  const showSQLQuery = (button: HTMLButtonElement, sqlQuery: string) => {
    button.parentNode?.replaceChild(document.createElement("div").appendChild(document.createTextNode(unescape(sqlQuery))), button);
  };


  const showSQLResult = (button: HTMLButtonElement, sqlResult: string) => {
    button.parentNode?.replaceChild(document.createElement("div").appendChild(document.createTextNode(unescape(sqlResult))), button);
  };


  const showSQLDescription = (button: HTMLButtonElement, sqlResult: string) => {
    button.parentNode?.replaceChild(document.createElement("div").appendChild(document.createTextNode(unescape(sqlResult))), button);
  };


  return (
    <div className="full-screen">
      <Head>
        <title>SQL AI Chat</title>
        {/* <link rel="stylesheet" href="../static/css/index.css" />
        <link rel="stylesheet" href="../static/css/chat.css" /> */}
      </Head>


      <div className="top-line"></div>


      <div className="sidebar">
        <div className="sidebar-box">
          <div className="menu-project">
            <div className="icons-box">
              <img className="icons" src="/static/images/icons/projects_icon.png" alt="" />
            </div>
            <div className="menu-text">Projects</div>
          </div>


          <div className="menu-tasks">
            <div className="icons-box">
              <img className="icons" src="/static/images/icons/tasks_icon.png" alt="" />
            </div>
            <div className="menu-text">Tasks</div>
          </div>


          <div className="menu-dashboard">
            <div className="icons-box">
              <a href="/home">
                <img className="icons" src="/static/images/icons/dashboard_icon.png" alt="" />
              </a>
            </div>
            <div className="menu-text">
              <a href="/home" style={{ textDecoration: 'none', color: 'inherit' }}>Dashboard</a>
            </div>
          </div>


          <div className="menu-users">
            <div className="icons-box">
              <a href="/chat" style={{ textDecoration: 'none' }}>
                <img className="icons" src="/static/images/icons/chattings_icons.png" alt="" />
              </a>
            </div>
            <a href="/chat" style={{ textDecoration: 'none' }}>
              <div className="menu-text">SQL Query</div>
            </a>
          </div>


          <div className="menu-settings">
            <div className="icons-box">
              <img className="icons" src="/static/images/icons/settings_icons.png" alt="" />
            </div>
            <div className="menu-text">Menu settings</div>
          </div>
        </div>
      </div>


      <div className="chat-box">
        <div className="chat-title">SQL AI Teaching Assistant</div>


        <div className="chat-content">
          <div>
            <label htmlFor="model-selection">Choose AI Model:</label>
            <select id="model-selection" onChange={updateModel}>
              <option value="gpt3">gpt3</option>
              <option value="gpt4">gpt4</option>
            </select>
          </div>


          <div>
            <label htmlFor="db-selection">Choose sample DB:</label>
            <select id="db-selection" onChange={updateDB}>
              <option value="Chinook">Chinook</option>
              <option value="nba_roster">nba_roster</option>
            </select>
          </div>


          <div>
            <label htmlFor="agent-selection">Choose Your Scenario:</label>
            <select id="agent-selection">
              <option value="agent2">Free Chat</option>
              <option value="agent3">Step by Step Text2Sql</option>
              <option value="agent1">Detailed Explanation</option>
            </select>
          </div>


          {chatHistory.map((chat, index) => (
            <div key={index}>
              {chat.user && <div className="message sent"><span className="text">{chat.user}</span></div>}
              {chat.bot && <div className="message received"><span className="text">{chat.bot}</span></div>}
              {chat.sqlQuery && (
                <div className="message received">
                  <button onClick={(e) => showSQLQuery(e.currentTarget as HTMLButtonElement, chat.sqlQuery!)}>Show SQL query.</button>
                </div>
              )}
              {chat.sqlResult && (
                <div className="message received">
                  <button onClick={(e) => showSQLResult(e.currentTarget as HTMLButtonElement, chat.sqlResult!)}>Run SQL query, show result.</button>
                </div>
              )}
              {chat.resultDescription && (
                <div className="message received">
                  <button onClick={(e) => showSQLDescription(e.currentTarget as HTMLButtonElement, chat.resultDescription!)}>Explain SQL result.</button>
                </div>
              )}
            </div>
          ))}
        </div>


        <div className="message-input">
          <input
            type="text"
            id="user-message"
            placeholder="Type a message..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>


      <div className="menu-title">
        <a href="/home" style={{ textDecoration: 'none', color: 'inherit' }}>inDB</a>
      </div>


      <div className="logo-box">
        <a href="/home">
          <img className="logo-img" src="../static/images/logo1-1.jpg" alt="" />
        </a>
      </div>


      <button className="button-sign-out">
        <a href="/login" style={{ textDecoration: 'none', color: '#ffffff' }}>Sign Out</a>
        </button>
      </div>
  );
};


export default Chat;