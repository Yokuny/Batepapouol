const inputMsg = document.getElementById("newMsg");
const newUser = document.getElementById("newUserName");

const user = (name) => ({ name });
let userName;
const msg = (from, text, to = "Todos", type = "message") => ({
  from,
  to,
  text,
  type,
});
// {
//     from: "nome do usuário",
//     to: "nome do destinatário (Todos se não for um específico)",
//     text: "mensagem digitada",
//     type: "message" // ou "private_message" para o bônus
// }

// newUser
const newServerUser = (user) => {
  const newUserToServer = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    user
  );
  newUserToServer.then((succesReturn) => {
    document.getElementById("registerScreen").style.display = "none";
    console.log(`Registro de novo usuario. Codigo: ${succesReturn.status}`);
  });
  newUserToServer.catch((badReturn) =>
    alert(
      `Tivemos problema criando novo usuario. Codigo de erro: ${badReturn.response.status}`
    )
  );
};
newUser.addEventListener("submit", (event) => {
  event.preventDefault();
  const userNameInput = document.getElementById("userName").value;
  userName = user(userNameInput);
  // new user in server
  newServerUser(userName);
});

// enviando msg
inputMsg.addEventListener("submit", (event) => {
  event.preventDefault();
  const msgInput = document.getElementById("userMsgInput");
  const newMsg = msg(userName.name, msgInput.value);
  const sendConfirmation = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    newMsg
  );
  sendConfirmation.then((status) => {
    msgInput.value = "";
    console.log(`> Mensagem enviada. Codigo: ${status.status}, ${newMsg.text}`);
  });
  sendConfirmation.catch((badReturn) => {
    // personalizar o input
    console.log(
      `> Erro no envio da mensagem. Codigo: ${badReturn.response.status}`
    );
  });
});

function render(msg) {
  console.log(msg);
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
}

// puxar msg
const newMsgCheck = () => {
  const serverMsgs = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  serverMsgs.then((response) => {
    render(response.data);
    console.log(`Novas msg recebidas. Codigo: ${response.status}`);
  });
  serverMsgs.catch((badReturn) =>
    console.log(`Sem novas msg. Codigo: ${badReturn.response.status}`)
  );
};

// verificando online
const userOnline = () => {
  const activeUser = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    userName
  );
  activeUser.then((status) => {
    console.log(`Ainda há usuarios online. Codigo: ${status.status}`);
    newMsgCheck();
    setTimeout(userOnline, 5000);
  });
  activeUser.catch((badReturn) => {
    console.log(`Sem usuarios online. Codigo: ${badReturn.response.status}`);
    setTimeout(userOnline, 5000);
  });
};
userOnline();

// menus
function showMenu() {
  document.getElementById("asideMenu").style.display = "flex";
}
function menuExit() {
  document.getElementById("asideMenu").style.display = "none";
}
