const core = (() => {
  const user = (name) => ({ name });
  const msg = (from, text, to = "Todos", type = "message") => ({ from, to, text, type });

  function getUserName() {
    const inputUserName = document.getElementById("userName").value;
    return user(inputUserName);
  }

  function consoleMsg(text, status) {
    console.log(text + " " + status);
  }

  const newServerUser = () => {
    const newUser = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", getUserName());

    newUser.then((succesReturn) => {
      document.getElementById("registerScreen").style.display = "none";
      consoleMsg("Registro de novo usuario. Codigo:", succesReturn.status);
    });
    newUser.catch((badReturn) => {
      const input = document.getElementById("userName");
      input.style.border = "solid 2px red";
      consoleMsg("Tivemos problema criando novo usuario. Codigo de erro:", badReturn.response.status);
    });
  };

  const newUserMsg = () => {
    const msgInput = document.getElementById("userMsgInput");
    const theMsg = msg(getUserName().name, msgInput.value);
    const newMsg = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", theMsg);

    newMsg.then((status) => {
      msgInput.value = "";
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
          <li class="privateMessage">
              <span class="info">(${element.time})</span>
              <span class="negrito">${element.from}</span>
              <span>reservadamente para</span>
              <span class="negrito">${element.to}:</span>
              <span>${element.text}</span>
          </li>`;
      } else if (element.type == "status") {
        ulField.innerHTML += `
          <li class="userStatus">
              <span class="info">(${element.time})</span>
              <span class="negrito">${element.from}</span>
              <span>${element.text}</span>
          </li>`;
      } else if (element.type == "message") {
        ulField.innerHTML += `
          <li class="userMessage">
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

  const msgsRequire = () => {
    const serverMsgs = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    serverMsgs.then((response) => {
      msgRender(response.data);
      consoleMsg("Novas msg recebidas. Codigo:", response.status);
    });
    serverMsgs.catch((badReturn) => consoleMsg("Sem novas msg. Codigo:", badReturn.response.status));
  };

  const userConnection = () => {
    const activeUser = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", getUserName());

    activeUser.then((status) => {
      consoleMsg("Usuario online. Codigo:", status.status);
      msgsRequire();
      setTimeout(userConnection, 3000);
    });
    activeUser.catch((badReturn) => {
      msgsRequire("Usuario offline. Codigo:", badReturn.response.status);
      window.location.reload();
    });
  };

  function usersRender(user) {
    const usersField = document.getElementById("usersOnline");
    user.forEach((user) => {
      usersField.innerHTML += `
      <span>
        <ion-icon name="person-circle"></ion-icon>
        <span>${user.name}</span>
        <ion-icon name="checkmark-sharp"></ion-icon>
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
      msgsRequire("Não foi possivel requisitar os usuarios online. Codigo:", badReturn.response.status);
    });
  };
  return { newServerUser, newUserMsg, userConnection, msgsRequire, usersOnline };
})();

const newUser = document.getElementById("newUserName");
const inputMsg = document.getElementById("newMsg");
newUser.addEventListener("submit", (event) => {
  event.preventDefault();
  core.newServerUser();
  core.userConnection();
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
