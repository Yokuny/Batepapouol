const inputMsg = document.getElementById("newMsg");

const user = (name) => ({ name });
const msg = (from , text, to = "todos", type = "message") => ({ from, to, text, type });
let userAmount;
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
let userName =  registerNewUser();
userAmount.push(userName);


// new user in server 
const newServerUser = (user) => {
    const newUserToServer = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user);
    newUserToServer.then((succesReturn) => console.log(`Registro de novo usuario. Codigo: ${succesReturn.status}`));
    newUserToServer.catch((badReturn) => alert(`Tivemos problema criando novo usuario. Codigo de erro: ${badReturn.status}`));
}
newServerUser(userName);

// enviando msg
inputMsg.addEventListener("submit", (e) => {
    e.preventDefault();
    let msgInput = document.getElementById("userMsgInput");
    const newMsg = msg(userName.name, msgInput.value);
    const sendConfirmation = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages", newMsg);
    sendConfirmation.then((status) => {
        msgInput.value = "";
        console.log(`> Mensagem enviada. Codigo: ${status.status}`)
    });
    sendConfirmation.catch((status) => {
        // personalizar o input
        console.log(`> Erro no envio da mensagem. Codigo: ${status.status}`);
    });
});


// verificando online
const onlineUsers = () => {
    const activeUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userAmount);
    activeUser.then((status) => {
        console.log(`Ainda há usuarios online. Codigo: ${status}`);
        setTimeout(hasUsers, 5000);
    });
    activeUser.catch((status) => {
        console.log(`Sem usuarios online. Codigo: ${status}`)
        setTimeout(hasUsers, 5000);
    });
}
onlineUsers();

// // puxar msg
// function getMsg(response){
//     console.log(`COM msg no server ${response}`);
//     setTimeout(hasUsers, 5000);
// }
// function noMsg(response){
//     console.log(`SEM msg no server ${response}`);
//     setTimeout(hasUsers, 5000);
// }
// const serverMsgs = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
// serverMsgs.then(getMsg);
// serverMsgs.catch(noMsg);
// Nos objetos, campo type identifica o tipo da mensagem. Existem os valores:
// `status`: mensagem de estado, 'quem entrou ou saiu da sala;
// `message`: mensagem pública;
// `private_message`: mensagem particular.

