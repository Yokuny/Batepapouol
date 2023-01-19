
const user = (name) => {
    return {name};
}
let userName = user(prompt("digite seu nome:"));
// new user
function niceServerReturn(succesReturn){
    console.log(succesReturn.status);
}
function badServerReturn(badReturn){
    console.log(badReturn);
}
const newUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userName);
newUser.then(niceServerReturn);
newUser.catch(badServerReturn);
// enviando msg
const sendConfirm = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    {
        from: "nome do usuário",
        to: "nome do destinatário (Todos se não for um específico)",
        text: "mensagem digitada",
        type: "message" // ou "private_message" para o bônus
    }
);
// verificando online
function userOnline(response){
    console.log("response COM usuarios online")
    console.log(response);
    setTimeout(hasUsers, 5000);
}
function noOnline(response){
    console.log("response SEM usuarios online")
    console.log(response);
    setTimeout(hasUsers, 5000);
}
function hasUsers(){
    const activeUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userName);
    activeUser.then(userOnline);
    activeUser.catch(noOnline);
}
hasUsers();
// puxar msg
const serverMsgs = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
// Nos objetos, campo type identifica o tipo da mensagem. Existem os valores:
// `status`: mensagem de estado, 'quem entrou ou saiu da sala;
// `message`: mensagem pública;
// `private_message`: mensagem particular.

