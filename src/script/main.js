const inputMsg = document.getElementById("newMsg");

const user = (name) => ({ name });
const msg = (from, text, to = "Todos", type = "message") => ({
  from,
  to,
  text,
  type,
});
let userAmount = [];
// {
//     from: "nome do usuário",
//     to: "nome do destinatário (Todos se não for um específico)",
//     text: "mensagem digitada",
//     type: "message" // ou "private_message" para o bônus
// }
const registerNewUser = () => {
  // falta tratamento de dados para \/ a na aquisição ou após
  return user(prompt("digite seu nome:"));
};
let userName = registerNewUser();
userAmount.push(userName);

// new user in server
const newServerUser = (user) => {
  const newUserToServer = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    user
  );
  newUserToServer.then((succesReturn) =>
    console.log(`Registro de novo usuario. Codigo: ${succesReturn.status}`)
  );
  newUserToServer.catch((badReturn) =>
    alert(
      `Tivemos problema criando novo usuario. Codigo de erro: ${badReturn.status}`
    )
  );
};
newServerUser(userName);

// enviando msg
inputMsg.addEventListener("submit", (e) => {
  e.preventDefault();
  let msgInput = document.getElementById("userMsgInput");
  const newMsg = msg(userName.name, msgInput.value);
  console.log(newMsg);
  const sendConfirmation = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    newMsg
  );
  sendConfirmation.then((status) => {
    msgInput.value = "";
    console.log(
      `> Mensagem enviada. Codigo: ${status.status}, ${newMsg.status}`
    );
  });
  sendConfirmation.catch((status) => {
    // personalizar o input
    console.log(`> Erro no envio da mensagem. Codigo: ${status.status}`);
  });
});

function render(msg) {
  console.log(msg);
  const ulField = document.getElementById("msgBody");
  ulField.innerHTML = "";
  msg.forEach((element) => {
    if (element.to != "Todos") {
      ulField.innerHTML += `<li class="privateMessage">
                <span class="info">(${element.time})</span>
                <span class="negrito">${element.from}</span>
                <span>reservadamente para</span>
                <span class="negrito">${element.to}:</span>
                <span>${element.text}</span>
            </li>`;
    } else if (element.type == "status") {
      ulField.innerHTML += `<li class="userStatus">
                <span class="info">(${element.time})</span>
                <span class="negrito">${element.from}</span>
                <span>${element.text}</span>
            </li>`;
    } else if (element.type == "message") {
      ulField.innerHTML += `<li class="userMessage">
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
  serverMsgs.catch((response) =>
    console.log(`Sem novas msg. Codigo: ${response.status}`)
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
  activeUser.catch((status) => {
    console.log(`Sem usuarios online. Codigo: ${status.status}`);
    setTimeout(userOnline, 5000);
  });
};
userOnline();

// Nos objetos, campo type identifica o tipo da mensagem. Existem os valores:
// `status`: mensagem de estado, 'quem entrou ou saiu da sala;
// `message`: mensagem pública;
// `private_message`: mensagem particular.
