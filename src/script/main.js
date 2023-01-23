const core = (() => {
  const user = (name) => ({ name });
  const msg = (from, text, to = "Todos", type = "message") => ({ from, to, text, type });
  let msgCheckTimmer = null;

  function getUserName() {
    const inputUserName = document.getElementById("userName").value;
    return user(inputUserName);
  }
  function consoleMsg(text, status) {
    console.log(text + " " + status);
  }
  function resetRequestMessages() {
    if (msgCheckTimmer) {
      clearTimeout(msgCheckTimmer);
      msgCheckTimmer = null;
    }
    msgCheckTimmer = setTimeout(requestMessages, 3000);
  }
  const login = () => {
    const newUser = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", getUserName());

    newUser.then((succesReturn) => {
      document.getElementById("registerScreen").style.display = "none";
      userConnection();
      requestMessages();
      consoleMsg("Registro de novo usuario. Codigo:", succesReturn.status);
    });
    newUser.catch((badReturn) => {
      const input = document.getElementById("userName");
      input.style.border = "solid 2px red";
      if (badReturn.response.status == 400) {
        input.value = "";
        input.placeholder = "Nome já registrado.";
      }
      consoleMsg("Tivemos problema criando novo usuario. Codigo de erro:", badReturn.response.status);
    });
  };

  const newUserMsg = () => {
    const msgInput = document.getElementById("userMsgInput");
    const theMsg = msg(getUserName().name, msgInput.value);
    const newMsg = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", theMsg);

    newMsg.then((status) => {
      resetRequestMessages();
      consoleMsg("Mensagem enviada. Codigo:", status.status);
    });
    newMsg.catch((badReturn) => {
      const input = document.getElementById("userMsgInput");
      input.style.border = "solid 2px red";
      consoleMsg("Erro no envio da mensagem. Codigo:", badReturn.response.status);
    });
  };

  function msgRender(msg) {
    const ulField = document.getElementById("msgBody");
    ulField.innerHTML = "";
    msg.forEach((element) => {
      if (element.to != "Todos") {
        ulField.innerHTML += `
          <li class="privateMessage" data-test="message">
              <span class="info">(${element.time})</span>
              <span class="negrito">${element.from}</span>
              <span>reservadamente para</span>
              <span class="negrito">${element.to}:</span>
              <span>${element.text}</span>
          </li>`;
      } else if (element.type == "status") {
        ulField.innerHTML += `
          <li class="userStatus" data-test="message">
              <span class="info">(${element.time})</span>
              <span class="negrito">${element.from}</span>
              <span>${element.text}</span>
          </li>`;
      } else if (element.type == "message") {
        ulField.innerHTML += `
          <li class="userMessage" data-test="message">
              <span class="info">(${element.time})</span>
              <span class="negrito">${element.from}</span>
              <span>${element.text}</span>
          </li>`;
      }
    });
    const allMsgs = ulField.querySelectorAll(".userStatus");
    const lastMsg = allMsgs[allMsgs.length - 1];
    lastMsg.scrollIntoView();
  }

  function requestMessages() {
    const serverMsgs = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    serverMsgs.then((response) => {
      msgRender(response.data);
      resetRequestMessages();
      consoleMsg("Novas msg recebidas. Codigo:", response.status);
    });
    serverMsgs.catch((badReturn) => consoleMsg("Sem novas msg. Codigo:", badReturn.response.status));
  }

  const userConnection = () => {
    const activeUser = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", getUserName());

    activeUser.then((status) => {
      consoleMsg("Usuario online. Codigo:", status.status);
      setTimeout(userConnection, 5000);
    });
    activeUser.catch((badReturn) => {
      consoleMsg("Usuario offline. Codigo:", badReturn.response.status);
      window.location.reload();
    });
  };

  function usersRender(user) {
    const usersField = document.getElementById("usersOnline");
    user.forEach((user) => {
      usersField.innerHTML += `
      <span data-test="participant">
        <ion-icon name="person-circle"></ion-icon>
        <span>${user.name}</span>
        <ion-icon name="checkmark-sharp" data-test="check"></ion-icon>
      </span>
      `;
    });
  }

  const usersOnline = () => {
    const allUsers = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");

    allUsers.then((status) => {
      usersRender(status.data);
      consoleMsg("Total de usuarios. Codigo:", status.status);
    });
    allUsers.catch((badReturn) => {
      consoleMsg("Não foi possivel requisitar os usuarios online. Codigo:", badReturn.response.status);
    });
  };
  return { login, newUserMsg, userConnection, usersOnline };
})();

const newUser = document.getElementById("newUserName");
const inputMsg = document.getElementById("newMsg");
newUser.addEventListener("submit", (event) => {
  event.preventDefault();
  core.login();
});
inputMsg.addEventListener("submit", (event) => {
  event.preventDefault();
  core.newUserMsg();
  core.userConnection();
});
const showMenu = () => {
  document.getElementById("asideMenu").style.display = "flex";
  core.usersOnline();
};
const menuExit = () => (document.getElementById("asideMenu").style.display = "none");
