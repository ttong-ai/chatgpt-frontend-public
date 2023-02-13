let context = [];
let metadata = {
  "agentName": "Agent",
  "userName": "User",
};

// Create a toggle button element for the chatbot
const toggleButton = document.createElement("button");
toggleButton.innerText = "Assistant";
toggleButton.classList.add("toggle-button");
document.body.appendChild(toggleButton);

// Create a container element for the chatbot
const chatContainer = document.createElement("div");
chatContainer.classList.add("chat-container");
chatContainer.style.display = "none";

// Create a message container element
const messagesContainer = document.createElement("div");
messagesContainer.classList.add("messages-container");
chatContainer.appendChild(messagesContainer);

// Create an input element for the user to type messages
const inputElement = document.createElement("input");
inputElement.classList.add("chat-input");
inputElement.setAttribute("type", "text");
inputElement.setAttribute("placeholder", "Type your message...");
chatContainer.appendChild(inputElement);

// Create a button element to send messages
const buttonElement = document.createElement("button");
buttonElement.innerText = "Send";
buttonElement.classList.add("send-button");
chatContainer.appendChild(buttonElement);

// Add the chatbot to the page
document.body.appendChild(chatContainer);

// Function to toggle the visibility of the chatbot
function toggleChatbot() {
  if (chatContainer.style.display === "none") {
    chatContainer.style.display = "flex";
  } else {
    chatContainer.style.display = "none";
  }
}

// Function to add a message to the chat interface
function addMessage(message, isUserMessage) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("chat-message");
  if (isUserMessage) {
    messageElement.classList.add("user-message");
  } else {
    messageElement.classList.add("bot-message");
  }
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to send a message to the chatbot
async function sendMessage(message) {
  const userMessage = "User: " + message;
  console.log(userMessage);
  context.push(userMessage);
  addMessage(message, true); // Add the user message to the chat interface

  // Implementation of the getChatbotResponse function should be overwritten
  const botResponse = await getChatbotResponse(userMessage);
  console.log(botResponse);
  context.push(botResponse);
  addMessage(botResponse, false); // Add the chatbot's response to the chat interface
}

// Send a message when the user clicks the "Send" button
buttonElement.addEventListener("click", () => {
  const message = inputElement.value;
  inputElement.value = "";
  sendMessage(message);
});

// Send a message when the user presses the "Enter" key
inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const message = inputElement.value;
    inputElement.value = "";
    sendMessage(message);
  }
});

// Toggle the chatbot when the user clicks the toggle button
toggleButton.addEventListener("click", toggleChatbot);

// Implementation of the getChatbotResponse function
async function getChatbotResponse(message) {
  // Fetch the response from a chatbot server running on https://chatgpt-backend.ttong.repl.co/chat with POST method
  // const response = await fetch("http://localhost:8000/chat", {
 const response = await fetch("https://chatgpt-backend.ttong.repl.co/chat", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
      context: context.join("\n"),
      metadata: metadata,
    }),
  });
  let data = await response.json();
  console.log(data);
  metadata = data.metadata;
  if (data.response.startsWith("Agent: ") && metadata.agentName != "Agent") {
    data.response = data.response.replace("Agent: ", metadata.agentName + ": ")
  } else if (data.response.startsWith(metadata.agentName + ":")) {
    // Do nothing
  } else {
    data.response = metadata.agentName + ": " + data.response;
  }
  return data.response;
}
