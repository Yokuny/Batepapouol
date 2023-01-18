// Para entrar. enviar ao servidor o nome do usuário
// envie uma requisição `POST` para a URL:
// https://mock-api.driven.com.br/api/v6/uol[/participants](https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants) 
    
// Enviando um objeto no formato:
// {
//     name: "João"
// }
// status 400 se já houver um usuário online com esse nome.
// Se for o caso, pedir um novo nome até status 200.

// Saber que o usuário continua online. enviar uma requisição `POST` para a URL:
// https://mock-api.driven.com.br/api/v6/uol/status
// Enviando objeto  nome do usuário que foi pedido ao entrar
//     {
//       name: "João"
//     }
// a cada cinco segundos.