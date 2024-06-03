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

### Docker
-----
### Web Server
Todas as rotas reencaminham os pedidos **HTTP** para a **Rest API** e, depois de receberem os dados pedidos, devolvem uma página HTML ao browser.\
As rotas existentes são as seguintes:
- **GET / :** Breve introdução ao website;
- **/conta**
  - **GET /perfil :** Apresenta o perfil do utilizador;
  - **GET /perfil/:id :** Apresenta o perfil do utilizador correspondente ao `id`;
  - **GET /edit :** Apresenta a página de edição do perfil de utilizador;
  - **POST /edit :** Recebe o form de edição de perfil;
  - **GET /registo :** Apresenta a página de registo de utilizador;
  - **POST /registo :** Recebe o form de registo de utilizador;
  - **GET /login :** Apresenta a página de login;
  - **POST /login :** Recebe o form de login;
  - **GET /sair :** Rota para término de sessão;
  - **POST /:id/change-level :** Recebe o form para mudar o nível de acesso do utilizador correspondente ao `id`;
  - **POST /:id/delete :** Recebe o form para eliminar o utilizador correspondente ao `id`;
- **GET /gestao :** Apresenta menu de gestão do website;
  - **GET /utilizadores :** Apresenta lista de utilizadores registados;
  - **GET /sugestoes :** Apresenta lista de sugestões de utilizadores por rua;
  - **GET /rua/:id :** Apresenta a página de edição do registo da rua respetiva ao `id` juntamente com as sugestões existentes;
  - **POST /rua/:id :** Recebe o form de edição do registo de uma nova rua;
  - **GET /add :** Apresenta página de adição de um novo registo de uma rua;
  - **POST /add/upload :** Recebe o ficheiro de registo de uma nova rua;
- **GET /ruas :** Apresenta lista de ruas;
  - **GET /:id :** Apresenta a página de informação da rua correspondente ao `id`.
  - **POST /:id/comentario :** Recebe o form de submissão de um comentário sobre a rua correspondente ao `id`;
  - **POST /:id/sugestao :** Recebe o form de submissão de uma sugestão sobre a rua correspondente ao `id`;
- **GET /entidades :** Apresenta lista de entidades;
  - **GET /:nome :** Apresenta lista de ruas onde a entidade correspondente ao `nome` é mencionada;
- **GET /lugares :** Apresenta lista de lugares;
  - **GET /:nome :** Apresenta lista de ruas onde o lugar correspondente ao `nome` é mencionado;

### Rest API
As rotas recebem pedidos **HTTP** do **Web Server**, vão à **MongoDB** buscar os dados e devolvem-nos em formato **JSON**.\
As rotas existentes são as seguintes:
- **/user**
  - **GET / :** 
  - **GET /:id :** 
  - **POST /register :** 
  - **POST /login :** 
  - **PUT /edit :** 
  - **PUT /:id/change-level :** 
  - **DELETE /:id :** 
  - **PUT /:id/sugestao :**
- **/rua** 
  - **GET / :** 
  - **POST / :**
  - **GET /:id :** 
  - **DELETE /:id :** 
- **/inforua**
  - **GET / :** 
  - **POST / :**
  - **GET /:id :** 
  - **PUT /:id :**
  - **POST /comentario/:id :** 
  - **POST /sugestao/:id :**
  - **DELETE /:id :** 
- **/gestao**
  - **GET /sugestoes :**
  - **GET /sugestoes/:id :**
  - **DELETE /sugestao/:sId/rua/:id :**
- **/entidade**
  - **GET / :** 
  - **GET /:nome :** 
- **/lugar** 
  - **GET / :** 
  - **GET /:nome :** 

### MongoDB

### Autenticação
As rotas que, pelo sua natureza assim o obrigam, encontram-se protegidas. Para aceder a essas rotas, é necessário ter login efetuado e ter o nível de acesso correto.


## Interações Possíveis


## Instruções de uso
