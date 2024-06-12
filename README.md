# Mapa das Ruas de Braga
## Trabalho Prático Engenharia WEB
#### Fábio Jorge Almeida Cunha, a105089
#### Gabriel José Araújo, a102023
#### 9 de junho de 2024

## Descrição
Este projeto consiste no desenvolvimento de uma plataforma web para consulta de informações sobre as ruas de Braga.

## Arquitetura
Para o desenvolvimento da plataforma, resolvemos utilizar 3 serviços:
- Web Server:
  - Reponsável por disponibilizar toda a informação numa interface web.
- REST API:
  - Serviço que serve como ponte entre a base de dados e os pedidos feitos no website.
- MongoDB:
  - Armazena toda a informação disponível e criada.

\
![Diagrama de Arquitetura](./arq.png)

## Design e Implementação

### Web Server
Todas as rotas reencaminham os pedidos **HTTP** para a **Rest API** e, depois de receberem os dados pedidos, devolvem uma página HTML ao browser.\
As rotas existentes são as seguintes:
- **GET / :** breve introdução ao website.
- **/conta**
  - **GET /perfil :** apresenta o perfil do utilizador;
  - **GET /perfil/:id :** apresenta o perfil do utilizador correspondente ao `id`;
  - **GET /edit :** apresenta a página de edição do perfil de utilizador;
  - **POST /edit :** recebe o form de edição de perfil;
  - **GET /registo :** apresenta a página de registo de utilizador;
  - **POST /registo :** recebe o form de registo de utilizador;
  - **GET /login :** apresenta a página de login;
  - **POST /login :** recebe o form de login;
  - **GET /sair :** rota para término de sessão;
  - **POST /:id/change-level :** recebe o form para mudar o nível de acesso do utilizador correspondente ao `id`;
  - **POST /:id/delete :** recebe o form para eliminar o utilizador correspondente ao `id`.
- **GET /gestao :** apresenta menu de gestão do website;
  - **GET /utilizadores :** apresenta lista de utilizadores registados;
  - **GET /sugestoes :** apresenta lista de sugestões de utilizadores por rua;
  - **GET /rua/:id :** apresenta a página de edição do registo da rua respetiva ao `id` juntamente com as sugestões existentes;
  - **POST /rua/:id :** recebe o form de edição do registo de uma nova rua;
  - **GET /add :** apresenta página de adição de um novo registo de uma rua;
  - **POST /add/upload :** recebe o ficheiro de registo de uma nova rua.
- **GET /ruas :** apresenta lista de ruas;
  - **GET /:id :** apresenta a página de informação da rua correspondente ao `id`.
  - **POST /:id/comentario :** recebe o form de submissão de um comentário sobre a rua correspondente ao `id`;
  - **POST /:id/sugestao :** recebe o form de submissão de uma sugestão sobre a rua correspondente ao `id`.
- **GET /entidades :** apresenta lista de entidades;
  - **GET /:nome :** apresenta lista de ruas onde a entidade correspondente ao `nome` é mencionada.
- **GET /lugares :** apresenta lista de lugares;
  - **GET /:nome :** apresenta lista de ruas onde o lugar correspondente ao `nome` é mencionado.

### Rest API
As rotas recebem pedidos **HTTP** do **Web Server**, pedem os dados à **MongoDB** e devolvem-nos em formato **JSON**.\
As rotas existentes são as seguintes:
- **/user**
  - **GET / :** devolve uma lista de utilizadores;
  - **GET /:id :** devolve o utilizador correspondente ao `id`;
  - **POST /register :** regista um utilizador na base de dados;
  - **POST /login :** faz login a um utilizador e devolve um token de sessão;
  - **PUT /edit :** edita os dados de um utilizador;
  - **PUT /:id/change-level :** edita o nível de acesso do utilizador correspondente ao `id`;
  - **DELETE /:id :** elimina o utilizador correspondente ao `id`;
  - **PUT /:id/sugestao :** adiciona uma sugestão feita pelo utilizador correspondente ao `id`.
- **/rua** 
  - **GET / :** devolve uma lista de ruas;
  - **POST / :** insera uma nova rua na base de dados;
  - **GET /:id :** devolve a rua correspondente ao `id`;
  - **DELETE /:id :** elimina a rua correspondente ao `id`.
- **/inforua**
  - **GET /:id :** devolve informação sobre a rua correspondente ao `id`;
  - **POST / :** insere um novo registo de uma rua na base de dados;
  - **PUT /:id :** edita as informações da rua correspondente ao `id`;
  - **POST /comentario/:id :** adiciona um comentário à rua correspondente ao `id`;
  - **POST /sugestao/:id :** adiciona uma sugestão à rua correspondente ao `id`;
  - **DELETE /:id :** elimina a rua correspondente ao `id`.
- **/gestao**
  - **GET /sugestoes :** devolve uma lista de todas as sugestões;
  - **GET /sugestoes/:id :** devolve lista de sugestões da rua correspondente ao `id`;
  - **DELETE /sugestao/:sId/rua/:id :** elimina sugestão com id `sId` da rua correspondente ao `id`.
- **/entidade**
  - **GET / :** devolve uma lista de entidades;
  - **GET /:nome :** devolve entidade correspondente ao `nome`.
- **/lugar** 
  - **GET / :** devolve uma lista de lugares;
  - **GET /:nome :** devolve lugar correspondente ao `nome`.

### MongoDB
Em seguida, enumeramos as coleções usadas na base de dados e os respetivos modelos:
  - **users**
  ```javascript
  var userSchema = new mongoose.Schema({
  username: String, // Nome de utilizador - utilizado para o login
  password: String, // Palavra-passe - utilizada para o login
  name: String, // Nome do utilizador
  foto: String, // Caminho onde fica guardada o foto de perfil
  email: String, // E-mail do utilizador
  level: String, // Nível de acesso do utilizador (Administrador, Produtor ou Consumidor)
  lastAccess: String, // Data do último acesso ao website
  registrationDate: String, // Data de registo no website
  sugestoesAceites: Number, // Número de sugestões aceites pelos Administradores/Produtores
  _id: String, // Como decidimos que o username é único, o _id guarda o username. Também temos que ter um campo denominado username porque o uso do módulo passport assim o obriga
  });
  userSchema.plugin(passportLocalMongoose);
  ```
  - **inforuas**
  ```javascript
  const figuraSchema = new mongoose.Schema({
      foto_id: String,
      path: String,
      legenda: String
  }, {_id: false})

  const casaSchema = new mongoose.Schema({
      numero: String,
      enfiteuta: String,
      desc: [String],
      foro: String
  }, {_id: false})

  const comentarioSchema = new mongoose.Schema({
      user: String, // Username do utilizador por quem foi feito o comentário
      comment: String, // Comentário
      timestamp: String // Data em que o comentário foi feito
  })

  var infoRuaSchema = new mongoose.Schema({
      _id: Number, // Número da rua, visto que é único
      nome: String, // Nome da rua
      desc: [String],
      figuras: [figuraSchema],
      casas: [casaSchema],
      comentarios: [comentarioSchema] // Lista de comentários respetivos à rua
  })
  ```
  - **ruas**
  ```javascript
  var ruaSchema = new mongoose.Schema({
    _id: Number, // Número da rua
    nome: String // Nome da rua
  })
  // Optámos por usar esta coleção para não termos que pedir o registo inteiro das ruas sempre que quisermos o nome ou número das mesmas
  ```
  - **sugestoes**
  ```javascript
  var sugestaoSchema = new mongoose.Schema({
    username: String, // Username do utilizador por quem foi feita a sugestão
    sugestao: String, // Sugestão
    creationDate: String, // Data em que a sugestão foi feita
  });

  var sugestoesRuaSchema = new mongoose.Schema({
    rua: Number, // Número da rua a que a sugestão pertence
    nome: String, // Nome da rua a que a sugestão pertence
    sugestoes: [sugestaoSchema] // Lista de sugestões respetivas à rua
  }, {_id: false});
  ```
  - **entidades**
    ```javascript
    var entidadeSchema = new mongoose.Schema({
        _id: Number, // ID da entidade
        nome: String, // Nome da entidade
        rua: String, // Nome da rua em que é referida
    })
    ```
  - **lugares**
    ```javascript
    var lugarSchema = new mongoose.Schema({
        _id: String, // ID do lugar
        nome: String, // Nome do lugar
        rua: String // Nome da rua em que é referido
    })
    ```

### Autenticação e Autorização
As rotas que, pela sua natureza, exigem proteção, estão devidamente protegidas. Para aceder a essas rotas, é necessário que o utilizador tenha efetuado login e possua o nível de acesso adequado. O login é realizado com o auxílio do módulo ***Passport.js***.

Durante o processo de login, é atribuído um ***JSON Web Token (JWT)*** ao utilizador. Para a autorização, verificamos a validade desse token e comparamos o nível de acesso do utilizador com o nível de acesso necessário para a rota específica. Os níveis de acesso estão definidos da seguinte forma:

  - **Sem login efetuado:** tem acesso apenas à informação disponibilizada sobre as ruas;
  - **Consumidor:** pode fazer comentários, sugerir alterações a páginas de ruas, editar o próprio perfil e visualizar perfis de outros utilizadores;
  - **Produtor:** pode adicionar novos registos de ruas, editar ruas e aceitar/recusar sugestões de alteração de outros utilizadores;
  - **Administrador:** pode alterar o nível de acesso de outros utilizadores, assim como eliminá-los.

### Adição de novos registos
blablala

### Docker
Para configurar o projeto para funcionar com Docker, temos um Dockerfile para o Web Server e outro para a Rest API e um docker-compose que, além de criar os containers do Web Server e da Rest API, cria também um container MongoDB e liga-os todos entre si.

## Instruções de uso
A primeira vez que se corre a aplicação, temos que usar o seguinte comando:
```bash
docker compose up --build -d
```
A opção `--build` é necessária para construir os containers.\
Em seguida, é necessário fazer o import dos dados para a MongoDB com o script ***import.sh***. Para isso, usamos o seguinte comando:
```bash
./import.sh
```
Com isto, temos a aplicação a correr.\
Para reiniciar a aplicação, corremos o script ***restart.sh*** com o seguinte comando:
```bash
./restart.sh
```
É necessário usar este script pois assegura que fotos de perfil de utilizador sejam mantidas.
#### Backup
Para fazer o backup de dados da MongoDB, corremos o script ***backup.sh*** com o seguinte comando:
```bash
./backup.sh
```
Para importar os dados de backup para MongoDB, corremos o script ***import_backup.sh*** com o seguinte comando:
```bash
./import_backup.sh
```