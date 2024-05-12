document.addEventListener("DOMContentLoaded", function() {
    const chatWindow = document.getElementById("chat-window");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
    const inviteBtn = document.getElementById("invite-btn");
    const inviteInput = document.getElementById("invite-input");
  
    const stompClient = Stomp.over(new SockJS('/chat'));
  
    stompClient.connect({}, function () {
      console.log("Conectado ao servidor WebSocket");
    });
  
    sendBtn.addEventListener("click", function() {
      sendMessage();
    });
  
    messageInput.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
  
    inviteBtn.addEventListener("click", function() {
      sendInvite();
    });
  
    function sendMessage() {
      const messageText = messageInput.value.trim();
      if (messageText !== "") {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = messageText;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Rolagem automática para a última mensagem
        messageInput.value = "";
      }
    }
  
    function sendInvite() {
      const invitedUser = inviteInput.value.trim();
      if (invitedUser !== "") {
        stompClient.send("/app/chat.invite", {}, JSON.stringify({ invitedUser: invitedUser }));
        console.log("Convite enviado para:", invitedUser);
        inviteInput.value = ""; // Limpa o campo de entrada após o convite ser enviado
      }
    }
  
    stompClient.subscribe('/user/queue/invitations', function (invitation) {
      // Processar convite recebido
      console.log("Convite recebido:", invitation);
    });
  });