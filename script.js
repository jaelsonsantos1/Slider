const { google } = require("googleapis");
const express = require("express");
const app = express();
const port = 3000; // Escolha a porta que desejar
const fileList = [];

const privatekey = require("./sliderproject-398111-54bcc9b7ec0d.json");

const jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ["https://www.googleapis.com/auth/drive"]
);

jwtClient.authorize((err, tokens) => {
  if (err) {
    console.error(err);
    return;
  }

  // Agora você está autenticado e pode usar a API do Google Drive.

  // Listar imagens no Google Drive
  const drive = google.drive({ version: "v3", auth: jwtClient });

  // Criando uma lista de imagens

  drive.files.list(
    {
      q:
        "'" +
        "1f6riyd80tqobA9s2lvU9uHg9t4htZGeB" +
        "' in parents and trashed=false",
      fields: "files(name, webContentLink)",
    },
    (err, res) => {
      if (err) {
        console.error(err);
        return;
      }

      res.data.files.forEach((file) => {
        fileList.push(file);
      });

      app.get('/', (req, res) => {
        // Renderizando um arquivo HTML
        res.sendFile(__dirname + '/index.html');
      });
      
      app.get('/imagens', (req, res) => {
        res.json(fileList);
      });
  
      // Iniciar o servidor
      app.listen(port, () => {
        console.log(`Servidor Express em execução em http://localhost:${3000}`);
      });

    }
  );
});

