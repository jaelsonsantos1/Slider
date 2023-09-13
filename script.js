const { google } = require("googleapis");
const express = require("express");
const app = express();
const port = 3000; // Escolha a porta que desejar
let fileList = []; // Inicialmente vazia

const privatekey = require("./sliderproject-398111-54bcc9b7ec0d.json");

const jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  ["https://www.googleapis.com/auth/drive"]
);

// Função para buscar as imagens e guardar na lista
function buscarImagens(callback) {
  jwtClient.authorize((err, tokens) => {
    if (err) {
      console.error(err);
      return;
    }

    const drive = google.drive({ version: "v3", auth: jwtClient });

    drive.files.list(
      {
        q: "'" + "1f6riyd80tqobA9s2lvU9uHg9t4htZGeB" + "' in parents and trashed=false",
        fields: "files(name, webContentLink)",
      },
      (err, res) => {
        if (err) {
          console.error(err);
          return;
        }

        const newFileList = [];

        res.data.files.forEach((file) => {
          newFileList.push(file);
        });

        fileList = newFileList; // Atualiza a lista global de imagens

        if (typeof callback === "function") {
          callback(fileList); // Chama a função de callback com a lista de imagens
        }
      }
    );
  });
}

// Função para atualizar a lista de imagens
function atualizarListaImagens(req, res) {
  buscarImagens((imagens) => {
    res.json(imagens);
  });
}

// Rota para buscar as imagens
app.get('/imagens', atualizarListaImagens);

app.get('/', (req, res) => {
  // Renderizar um arquivo HTML
  res.sendFile(__dirname + '/index.html');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor Express em execução em http://localhost:${port}`);
});

// Inicialmente, buscar as imagens e guardar na lista
buscarImagens();
