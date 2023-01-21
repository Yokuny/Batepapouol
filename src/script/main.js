const user = (name) => ({ name });
const registerNewUser = () => {
    // falta tratamento de dados para \/ a na aquisição ou após
    return user(prompt("digite seu nome:"));
};
let userName =  registerNewUser();
/*  */

// new user in server 

const newServerUser = (user) => {
    const newUserToServer = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user);
    newUserToServer.then((succesReturn) => {
        console.log(`Registro de novo usuario. Codigo: ${succesReturn.status}`);
    });
    newUserToServer.catch((badReturn) => {
        alert(`Tivemos problema criando novo usuario. Codigo de erro: ${badReturn.status}`);
    });
}
newServerUser(userName);

const newMsg = ()

// enviando msg
// function msgDelivery(status){
//     console.log(`> msg ${status.status}`);
// }
// function msgFailure(status){
//     console.log(`> msg ${status.status}`);
// }
// const sendConfirm = axios.get(
//     "https://mock-api.driven.com.br/api/v6/uol/messages",
//     {
//         from: "nome do usuário",
//         to: "nome do destinatário (Todos se não for um específico)",
//         text: "mensagem digitada",
//         type: "message" // ou "private_message" para o bônus
//     }
// );
// sendConfirm.then(msgDelivery);
// sendConfirm.catch(msgFailure);
// // verificando online
// function userOnline(response){
//     console.log(`COM usuarios online ${response}`)
//     setTimeout(hasUsers, 5000);
// }
// function noOnline(response){
//     console.log(`SEM usuarios online ${response}`)
//     setTimeout(hasUsers, 5000);
// }
// function hasUsers(){
//     const activeUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userName);
//     activeUser.then(userOnline);
//     activeUser.catch(noOnline);
// }
// hasUsers();
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

