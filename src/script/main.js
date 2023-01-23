const core = (() => {
  let msgCheckTimmer = null;
  let connectionCheckTimmer = null;
  let usersOnlineCheckTimmer = null;
  const user = (name) => ({ name });
  const msg = (from, text, to, type) => {
    if (to == null) to = "Todos";
    return { from, to, text, type };
  };
  const onlineNames = (name, to) => ({ name, to });

  const userMenu = () => {
    let msgTo = null;
    let msgType = "message";
    let usersOnline = [];
    function userOnline(playerList) {
      usersOnline.length = 0;
      playerList.forEach((item) => {
        if (item.name == msgTo) {
          usersOnline.push(onlineNames(item.name, 1));
        } else {
          // console.log(msgTo);
          // console.log(item.name);
          usersOnline.push(onlineNames(item.name, 0));
        }
      });
    }
    return { msgTo, msgType, usersOnline, userOnline };
  };
  let users = userMenu();

  const toAllOrPrivate = (value) => {
    users.msgType = value;
    usersOnline();
  };
  const someOneOrAll = (value) => {
    users.msgTo = value;
    usersOnline();
  };

  const newUserMsg = () => {
    const msgInput = document.getElementById("userMsgInput");
    const theMsg = msg(getUserName().name, msgInput.value, users.msgTo, users.msgType);
    console.log(theMsg);
    const newMsg = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", theMsg);
    newMsg.then((status) => {
      msgInput.value = "";
      requestMessages();
      consoleMsg("Mensagem enviada. Codigo:", status.status);
    });
    newMsg.catch((badReturn) => {
      const input = document.getElementById("userMsgInput");
      input.style.border = "solid 2px red";
      consoleMsg("Erro no envio da mensagem. Codigo:", badReturn.response.status);
    });
  };

  function resetRequestMessages() {
    if (msgCheckTimmer) {
      clearTimeout(msgCheckTimmer);
      msgCheckTimmer = null;
    }
    msgCheckTimmer = setTimeout(requestMessages, 3000);
  }
  function resetRequestConnection() {
    if (connectionCheckTimmer) {
      clearTimeout(connectionCheckTimmer);
      connectionCheckTimmer = null;
    }
    connectionCheckTimmer = setTimeout(userConnection, 5000);
  }
  function resetRequestUsersOnline() {
    if (usersOnlineCheckTimmer) {
      clearTimeout(usersOnlineCheckTimmer);
      usersOnlineCheckTimmer = null;
    }
    usersOnlineCheckTimmer = setTimeout(usersOnline, 10000);
  }

  function msgVisibilite(value) {
    const msgVisibilite = document.getElementById("msgTo");
    msgVisibilite.innerHTML = "";
    if (value == "message") {
      msgVisibilite.innerHTML = `
      <span id="message" data-test="public" onclick="msgType(this)">
        <ion-icon name="lock-open"></ion-icon>
        <span>Público</span>
        <ion-icon class="menuIconDisplay" name="checkmark-sharp" data-test="check"></ion-icon>
      </span>
      <span id="private_message" data-test="public" onclick="msgType(this)">
        <ion-icon name="lock-closed"></ion-icon>
        <span>Reservadamente</span>
        <ion-icon name="checkmark-sharp" data-test="check"></ion-icon>
      </span>
      `;
    } else if (value == "private_message") {
      msgVisibilite.innerHTML = `
      <span id="message" data-test="public" onclick="msgType(this)">
        <ion-icon name="lock-open"></ion-icon>
        <span>Público</span>
        <ion-icon name="checkmark-sharp" data-test="check"></ion-icon>
      </span>
      <span id="private_message" data-test="public" onclick="msgType(this)">
        <ion-icon name="lock-closed"></ion-icon>
        <span>Reservadamente</span>
        <ion-icon class="menuIconDisplay" name="checkmark-sharp" data-test="check"></ion-icon>
      </span>
      `;
    }
  }
  function usersRender(user) {
    const usersField = document.getElementById("usersOnline");
    usersField.innerHTML = "";
    console.log(user);
    if (!users.msgTo) {
      usersField.innerHTML = `
      <span id="forAll" data-test="all" onclick="msgTo(this)">
        <ion-icon name="people-sharp"></ion-icon>
        <span>Todos</span>
        <ion-icon class="menuIconDisplay" name="checkmark-sharp" data-test="check"></ion-icon>
      </span>`;
    } else {
      usersField.innerHTML = `
      <span id="forAll" data-test="all" onclick="msgTo(this)">
        <ion-icon name="people-sharp"></ion-icon>
        <span>Todos</span>
        <ion-icon name="checkmark-sharp" data-test="check"></ion-icon>
      </span>`;
    }
    user.usersOnline.forEach((fulano) => {
      console.log(fulano);
      if (fulano.name == user.msgTo) {
        usersField.innerHTML += `
          <span id="${fulano.name}" data-test="participant" onclick="msgTo(this)">
            <ion-icon name="person-circle"></ion-icon>
            <span>${fulano.name}</span>
            <ion-icon class="menuIconDisplay" name="checkmark-sharp" data-test="check"></ion-icon>
          </span>`;
      } else {
        usersField.innerHTML += `
          <span id="${fulano.name}" data-test="participant" onclick="msgTo(this)">
            <ion-icon name="person-circle"></ion-icon>
            <span>${fulano.name}</span>
            <ion-icon name="checkmark-sharp" data-test="check"></ion-icon>
          </span>`;
      }
    });
  }

  const usersOnline = () => {
    const allUsers = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    allUsers.then((status) => {
      users.userOnline(status.data);
      usersRender(users);
      msgVisibilite(users.msgType);
      resetRequestUsersOnline();
      consoleMsg("Total de usuarios. Codigo:", status.status);
    });
    allUsers.catch((badReturn) => {
      consoleMsg("Não foi possivel requisitar os usuarios online. Codigo:", badReturn.response.status);
    });
  };

  function getUserName() {
    const inputUserName = document.getElementById("userName").value;
    return user(inputUserName);
  }
  function consoleMsg(text, status) {
    console.log(text + " " + status);
  }

  const login = () => {
    const newUser = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", getUserName());
    newUser.then((succesReturn) => {
      document.getElementById("registerScreen").style.display = "none";
      userConnection();
      requestMessages();
      usersOnline();
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
      resetRequestConnection();
    });
    activeUser.catch((badReturn) => {
      consoleMsg("Usuario offline. Codigo:", badReturn.response.status);
      window.location.reload();
    });
  };
  const whisperTo = () => {
    if (users.msgTo != null) {
      const whisper = document.getElementById("whisperTo");
      whisper.value = `Enviando para ${msgTo}`;
    }
  };
  return { login, newUserMsg, userConnection, usersOnline, toAllOrPrivate, someOneOrAll, whisperTo };
})();
const newUser = document.getElementById("newUserName");
const formInput = document.getElementById("newMsg");
const inputTextMsg = document.getElementById("userMsgInput");
newUser.addEventListener("submit", (event) => {
  event.preventDefault();
  core.login();
});
formInput.addEventListener("submit", (event) => {
  event.preventDefault();
  core.newUserMsg();
  core.userConnection();
});
inputTextMsg.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    core.newUserMsg();
    core.userConnection();
  }
});
const showMenu = () => {
  document.getElementById("asideMenu").style.display = "flex";
  core.usersOnline();
};
const menuExit = () => {
  document.getElementById("asideMenu").style.display = "none";
  core.whisperTo();
};

function msgTo(element) {
  core.someOneOrAll(element.id);
}
function msgType(element) {
  core.toAllOrPrivate(element.id);
}
