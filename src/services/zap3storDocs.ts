export const zap3storDocs = `
# Documentação do Projeto Zap3stor

## 1. Introdução

O Zap3stor é uma aplicação de chat web moderna e rica em recursos, construída com Next.js 16, React 19 e TypeScript. Foi projetada para facilitar a comunicação em tempo real entre usuários e clientes, oferecendo também robustas capacidades administrativas através da integração com sistemas de gestão externos.

A aplicação suporta tanto plataformas web quanto móveis (via Capacitor) e inclui recursos como modo claro/escuro, compartilhamento de arquivos e gerenciamento abrangente de usuários.

### Tecnologias Chave
- **Framework**: Next.js 16 (App Router)
- **Biblioteca de UI**: React 19
- **Estilização**: Tailwind CSS
- **Runtime Mobile**: Capacitor (iOS & Android)
- **Ícones**: Lucide React
- **Gerenciamento de Estado**: React Context & Hooks

## 2. Arquitetura e Estrutura de Diretórios

O projeto segue a estrutura padrão do Next.js App Router, organizada para escalabilidade e manutenção.

### Diretórios Principais

- **\`app/\`**: Contém as rotas da aplicação e a lógica das páginas.
    - \`layout.tsx\`: Layout raiz definindo a estrutura global.
    - \`page.tsx\`: Ponto de entrada.
    - \`login/\` & \`loginG3stor/\`: Rotas de autenticação.
    - \`grid/\`: Visualização Kanban dos chats por assunto.
    - \`config/\`: Páginas de configuração para ajustes do sistema e integrações.
    - \`user/\`: Interfaces de gerenciamento de usuários.
    - \`webhooks/\`: Configuração de webhooks.

- **\`components/\`**: Componentes de UI reutilizáveis.
    - \`chat/\`: Componentes específicos para a interface de chat.
    - \`g3stor/\`: Componentes relacionados à integração com o sistema Gestor.
    - \`subject/\`, \`user/\`, \`whatsapp/\`: Componentes específicos de cada funcionalidade.
    - \`ui/\`: Elementos de UI compartilhados (Botões, Modais, Inputs).
    - \`init-workflow/\`: Componentes do assistente de configuração inicial.

- **\`services/\`**: A camada de interação com APIs. Parte crítica da arquitetura, abstraindo todas as chamadas externas.
    - \`lhc-client/\`: Cliente extensivo para a API do Live Helper Chat (LHC).
    - \`g3stor-client/\`: Cliente para a API de gestão do Gestor.
    - \`client/\`: Configuração base do gerenciador de API.

- **\`hooks/\`**: Hooks React personalizados para reutilização de lógica (ex: \`use-fcm-token.ts\` para notificações).

- **\`lib/\`**: Bibliotecas utilitárias e funções auxiliares (ex: \`firebase.ts\` para notificações push).

- **\`contexts/\`**: Provedores de Contexto React para estado global (ex: \`AuthContext\`).

## 3. Funcionalidades e Módulos Principais

### 3.1 Autenticação
O sistema emprega uma estratégia de autenticação dupla:
1.  **Login do Chat (\`/login\`)**: Autentica contra a API do LHC para habilitar recursos de chat.
2.  **Login do Gestor (\`/loginG3stor\`)**: Autentica contra a API do Gestor para funcionalidades administrativas e de ERP.

### 3.2 Sistema de Chat e Visualizações

#### Chat Layout (Visão Geral)
A estrutura principal de atendimento, composta por:
-   **Barra Lateral (Sidebar)**: Lista de conversas ativas e navegação entre departamentos.
-   **Janela de Chat (Chat Window)**: A interface direta de conversação.

#### Grid (\`/grid\`) - Kanban de Assuntos
Uma visualização especializada onde os chats são organizados em colunas baseadas em **Assuntos** (Subjects).
-   **Organização Visual**: Permite ver rapidamente quantos chats estão em cada assunto.
-   **Drag-and-Drop**: Permite mover chats entre assuntos arrastando os cards (\`components/chat/grid/chat-grid.tsx\`).

#### Funcionalidades Detalhadas do Chat:
-   **Envio de Arquivos**: Através do componente \`FileUploader\` (\`components/chat/file/file-uploader.tsx\`), usuários podem enviar arquivos e imagens diretamente na conversa. O upload é processado e enviado via \`sendFileMessage\`.
-   **Iniciar Atendimento**: É possível iniciar uma nova conversa com um contato existente. O modal \`StartChatModal\` (\`components/chat/start-chat-modal.tsx\`) permite selecionar o departamento desejado para iniciar o atendimento.
-   **Adicionar/Alterar Assunto**: Para categorizar atendimentos, o usuário pode vincular um assunto à conversa. O \`AddSubjectModal\` (\`components/subject/add-subject-modal.tsx\`) lista os assuntos disponíveis e permite a associação rápida.

### 3.3 Gerenciamento do Sistema
-   **Gerenciamento de Usuários (\`/user\`)**: Criar, editar e excluir usuários.
-   **Assuntos (\`/subject\`)**: Gerenciar tópicos/assuntos de chat para categorização.
-   **Webhooks (\`/webhooks\`)**: Configurar webhooks para integrações externas.

### 3.4 Integrações
-   **WhatsApp**: Configurações de integração disponíveis em \`/whatsapp\`.
-   **Google Calendar**: Configuração para sincronização de calendário em \`/config/google-calendar\`.

### 3.5 Assistente de Configuração do Sistema (Wizard)
Um fluxo passo-a-passo (\`components/init-workflow\`) permite que administradores personalizem a identidade do sistema:
-   **Logo**: Upload e definição do logotipo da aplicação.
-   **Notificações**: Configuração de sons de alerta personalizados.
-   **Favicon**: Definição do favicon do navegador.
Isso garante que a aplicação esteja alinhada com a marca da organização desde o início.

## 4. Detalhes da Camada de Serviço (\`services/\`)

A pasta \`services/\` é a ponte entre o frontend e as APIs de backend.

### \`lhc-client\` (Live Helper Chat)
Este cliente lida com todas as operações relacionadas ao chat. É modularizado em:
-   \`auth.ts\`: Tratamento de sessão.
-   \`chat.ts\`: Envio/recebimento de mensagens, busca de histórico e envio de arquivos.
-   \`department.ts\`: Gerenciamento de departamentos de chat.
-   \`file.ts\`: Manipulação de uploads e downloads de arquivos.
-   \`user.ts\`: Operações relacionadas a usuários.
-   \`webhook.ts\`: Operações CRUD de webhooks.

### \`g3stor-client\` (Gestor)
Lida com lógica de negócios e dados administrativos:
-   \`g3stor-auth.ts\`: Autenticação para o sistema Gestor.
-   \`g3stor.ts\`: Busca e manipulação de dados principais para objetos de negócio.

## 5. Mobile e Implantação

### Mobile (Capacitor)
O projeto está configurado para implantação móvel usando Capacitor.
-   \`ios/\`: Projeto nativo iOS.
-   \`android/\`: Projeto nativo Android.
-   \`capacitor.config.ts\`: Configuração do Capacitor.

### Notificações Push
Implementadas usando Firebase Cloud Messaging (FCM).
-   \`hooks/use-fcm-token.ts\`: Hook para recuperar e gerenciar o token FCM.
-   \`lib/firebase.ts\`: Inicialização do Firebase.

## 6. Como Iniciar

1.  **Instalação**:
    \`\`\`bash
    npm install
    \`\`\`

2.  **Desenvolvimento**:
    \`\`\`bash
    npm run dev
    \`\`\`

3.  **Build**:
    \`\`\`bash
    npm run build
    \`\`\`

4.  **Lint**:
    \`\`\`bash
    npm run lint
    \`\`\`

## 7. Manual do Usuário (Extraído de suporte.webplanet.com.br)

### Primeiros Passos: Atendimento Eficiente no Zap3STOR
Nesta seção, você aprenderá a dar os primeiros passos para um atendimento eficiente e a usar as funcionalidades básicas do Zap3STOR.
Primeiramente, após a configuração inicial e com o sistema apto a receber mensagens, é essencial entender a **Tela Principal**. Assim que você fizer o login, será redirecionado a ela — este é o seu painel de controle principal.

#### 1. Ícones e Funções do Lado Esquerdo
A barra lateral esquerda contém ícones essenciais para gerenciar seu status, configurações e acesso rápido.
*   **Ícone de Saída (Seta)**: Utilizado para **deslogar** do sistema e encerrar sua sessão.
*   **Ícone de Ponto de Interrogação (?)**: Oferece acesso rápido à nossa **Central de Ajuda** e tutoriais.
*   **Ícone de Olho com Risco**: Define seu status como **Ausente**. (Você não receberá novos chamados).
*   **Ícone de Olho Aberto**: Define seu status como **Online**. (Você estará apto a receber novos chamados).
*   **Ícone de Três Pontos Verticais (⋮)**: Leva à **Tela de Configurações** do sistema.

#### 2. Funções da Barra Principal
*   **Input de Pesquisa ("Pesquise um Contato")**: Digite o nome do contato e pressione \`Enter\` para realizar uma pesquisa dentro da aba de chamados.
*   **Ícone de Três Quadrados (Blocos)**: Acessa a visualização em **GRID**, permitindo que você veja e gerencie chamados classificados de forma estruturada.
*   **Ícone de E-mail (Se Ativado)**: Aparece apenas se a integração de e-mail estiver ativa. Serve para o **gerenciamento de e-mails** e chamados relacionados.
*   **Ícone de Filtro (Funil)**: Serve para **filtrar os chamados** que você está visualizando na tela, por exemplo, filtrando por funcionário responsável.

#### 3. Abas de Atendimento e Gerenciamento
(Lista detalhada de abas como Abertos, Pendente, Contatos, Operadores...)

Gerenciamento de Chamados e Visualização GRID
Nesta seção, você aprenderá a usar a funcionalidade de classificação de chamados e como realizar o gerenciamento eficiente dessas solicitações.

Para garantir que a classificação funcione corretamente, o primeiro passo é criar os Assuntos (Categorias) que serão usados.

Passo 1: Configurar os Assuntos de Classificação
Para começar a classificar, você deve primeiro configurar os assuntos na tela de Configurações do sistema.

Na Tela Principal, localize o ícone de três pontos verticais (⋮) posicionado ao lado do ícone de olho.

Imagem1.png
Clique no ícone (⋮). Você será redirecionado para a Tela de Configurações.

Imagem2.png
Na Tela de Configurações, clique na opção Gerenciamento de Assuntos.

image.png
Agora você pode criar um novo Assunto.

Passo 2: Classificar um Chamado Existente
Após configurar os assuntos, você pode aplicá-los aos chamados.

Na lista de chamados, selecione o chamado que deseja classificar.

Localize e clique no ícone de três pontos verticais (⋮) ao lado do ícone "I" (Informações), conforme a imagem abaixo.

Imagem3.png

No menu que se abrir, selecione a opção Classificar Chamado.

Imagem4.png
Será exibida uma lista. Selecione o Assunto para o qual deseja classificar o chamado.

Imagem5.png
Passo 3: Acessar o GRID para Visualização
O GRID oferece uma visão completa e organizada de todos os seus chamados.

Acesse a Página Principal do sistema.

Localize e clique no botão que possui o ícone de três blocos (ou três retângulos empilhados), conforme a imagem abaixo.

Imagem6.png

Ao clicar, você será direcionado para o GRID de Chamados, onde poderá visualizar, filtrar e gerenciar todas as informações.
Imagem7.png
Como Acessar o G3STOR e Utilizar suas Funcionalidades Principais
Esta seção irá guiá-lo pelo processo de login no sistema G3STOR e apresentará as principais ações que você pode executar imediatamente após o acesso.

Passo 1: Acessar a Tela de Login do G3STOR
Para começar, localize a opção de login dentro das configurações:

Na Tela Principal do sistema, localize o ícone de três pontos verticais (⋮), posicionado ao lado do ícone de olho.

Imagem1.png
Clique no ícone (⋮). Você será direcionado para a Tela de Configurações.

Imagem8.png
Na Tela de Configurações, clique na opção Logar no G3STOR. 

Passo 2: Realizar o Login
Insira suas credenciais (usuário e senha) e efetue o login no G3STOR.

Imagem9.png
Após o login bem-sucedido, você será automaticamente redirecionado para a Tela Principal.

Imagem10.png
Passo 3: Utilizar as Novas Funcionalidades
Com o G3STOR logado, o sistema libera novas funcionalidades para a gestão de clientes e dados.

As ações abaixo devem ser realizadas com um chamado aberto para garantir que as novas informações sejam vinculadas corretamente:

1. Criar Ficha (Registro Detalhado)
Ação: Use o atalho Ctrl + D. 

Detalhe: Este comando abre o modal para criação de uma nova ficha detalhada, vinculando automaticamente o chamado que você tem aberto. Preencha todas as informações necessárias.

ImagemCRIARFICHA.png

2. Criar Cliente
Ação: Clique no ícone de Pessoa/Carinha no chamado.

ImagemNovoContato.png
Detalhe: Ao abrir o modal, insira as informações para adicionar um novo cliente à sua base de dados, associando-o ao chamado atual.

ImagemCRIARCONTATP.png
3. Criar Ficha Rápida (Registro Ágil)
Ação: Use o atalho Ctrl + F.

Detalhe: Este é um método ágil para criar um novo registro. O chamado atual será vinculado automaticamente à ficha. Preencha apenas os dados essenciais.

ImagemCRIARFICHArrapida.png

4. Adicionar Observações
Ação: Clique no ícone de Mais (+) no chamado.

ImagemOBSFICHA.png
Detalhe: O modal de observações será aberto. Insira o texto da anotação. Esta ação registra a observação na ficha vinculada, usando o chamado atual como contexto.

ImagemCRIARobs.png
5. Ver Mais Informações do Cliente
Ação: Clique no ícone 'I' (Informações) no chamado.

ImagemINFO.png
Detalhe: Ao abrir o modal, você poderá visualizar todos os dados e o histórico completo do cliente que está associado ao chamado atual.

ImagemInfoCont.png
Utilização do Chat Interno entre Operadores
O chat interno permite a comunicação em tempo real com outros operadores logados no sistema.

Passo 1: Acessar a Lista de Operadores
Na Tela Principal do sistema, localize e clique no botão Operadores.

Imagem11.png

Será exibida a Lista de Operadores que estão online no momento.

Imagem12.png
Passo 2: Iniciar uma Conversa
Clique no nome do operador com quem você deseja conversar.

Imagem12.png
Ao clicar, será aberto um Modal (janela pop-up) com o histórico e o campo de texto para a conversa.

Imagem13.png
Notificações de Mensagens
O sistema avisa sobre novas mensagens de duas formas:

Notificação Visual: Um número (1) aparecerá ao lado do nome do operador ou do ícone de chat, indicando uma nova mensagem não lida.

Notificação Sonora: Um som tocará para alertá-lo sobre a chegada de uma nova mensagem no chat.

Funcionalidade Extra: Criar Reunião
Você pode iniciar uma reunião (ou agendamento de chamada) diretamente do chat interno clicando no botão específico (ícone de calendário) dentro do modal da conversa.

Imagem14.png
Primeiros Passos: Atendimento Eficiente no Zap3STOR
Nesta seção, você aprenderá a dar os primeiros passos para um atendimento eficiente e a usar as funcionalidades básicas do Zap3STOR.

Primeiramente, após a configuração inicial e com o sistema apto a receber mensagens, é essencial entender a Tela Principal. Assim que você fizer o login, será redirecionado a ela — este é o seu painel de controle principal.

image.png



1. Ícones e Funções do Lado Esquerdo
A barra lateral esquerda contém ícones essenciais para gerenciar seu status, configurações e acesso rápido.

Ícone de Saída (Seta): Utilizado para deslogar do sistema e encerrar sua sessão.

Ícone de Ponto de Interrogação (?): Oferece acesso rápido à nossa Central de Ajuda e tutoriais.

Ícone de Olho com Risco: Define seu status como Ausente. (Você não receberá novos chamados).

Ícone de Olho Aberto: Define seu status como Online. (Você estará apto a receber novos chamados).

Ícone de Três Pontos Verticais (⋮): Leva à Tela de Configurações do sistema.

2. Funções da Barra Principal
Os seguintes elementos e ícones na barra principal oferecem acesso a ferramentas de pesquisa, visualização e gestão:

Input de Pesquisa ("Pesquise um Contato"):

Digite o nome do contato e pressione Enter para realizar uma pesquisa dentro da aba de chamados (as abas serão explicadas adiante).

Ícone de Três Quadrados (Blocos):

Acessa a visualização em GRID, permitindo que você veja e gerencie chamados classificados de forma estruturada.

Ícone de E-mail (Se Ativado):

Aparece apenas se a integração de e-mail estiver ativa. Serve para o gerenciamento de e-mails e chamados relacionados.

Ícone de Filtro (Funil):

Serve para filtrar os chamados que você está visualizando na tela, por exemplo, filtrando por funcionário responsável.



3. Abas de Atendimento e Gerenciamento (Lista Detalhada)
image.png

Aba de Abertos
Função: Mostra todos os chamados que estão atualmente em atendimento para você. Se não houver filtros aplicados, ela exibe todos os chamados abertos do sistema.

Ação: Clicar em um chamado abre a conversa e permite a interação imediata.

Aba de Pendentes
Função: Contém os chamados que ainda não têm um operador definido ou atribuído.
Ação: Ao clicar em um chamado pendente, você automaticamente o aceita, e ele passa a ser um chamado na sua responsabilidade.
Aba de Contatos
Função: Utilizada para iniciar uma conversa com um cliente (conversa outbound).
Ação: Para pesquisar um cliente específico, você deve estar com esta aba aberta e utilizar o campo de pesquisa, conforme explicado na seção anterior.
Aba de Operadores
Função: Utilizada para comunicação interna e coordenação entre os membros da equipe.

Ação: Clicar no nome de um operador abre o chat interno para conversas.

4. Dashboard (Visão Geral)
O Dashboard fornece uma visão geral rápida e essencial do status do seu atendimento e da conexão do sistema.

image.png

O que o Dashboard exibe:
Visão Geral: Um panorama instantâneo das métricas chave do atendimento.

Mensagens Pendentes: O número de chamados que ainda precisam de um operador (os mesmos vistos na aba "Pendentes").

Mensagens Ativas: O número de chamados que estão sendo atendidos no momento (os mesmos vistos na aba "Abertos").

Status do seu WhatsApp: Indica o estado da conexão do seu número (online, offline, ou com erro).

Ações Rápidas no Status do WhatsApp:
Ao clicar no indicador de Status do WhatsApp, você tem acesso a duas funcionalidades importantes:

Ver Logs: Acessa informações mais técnicas e detalhadas sobre a conexão do seu WhatsApp. Útil para diagnóstico de problemas.

Iniciar (Se Necessário): Se a sua conexão estiver inativa ou sem preenchimento ("nuvem"), você pode clicar aqui para iniciar o serviço e tentar restabelecer a comunicação.

5. O Chat e Suas Funcionalidades
Ao abrir uma conversa (o que acontece quando você clica em um chamado nas abas), você verá a interface de chat. Para utilizá-la eficientemente, é crucial entender o cabeçalho da conversa.

image.png

Cabeçalho da Conversa
O cabeçalho exibe o nome do cliente com quem você está conversando e apresenta cinco ícones de ação rápida:

Ícone de Relógio (Histórico):

Função: Permite que você visualize o histórico completo de chamados desse cliente.

Ação: Ao clicar, abre-se um modal com o chamado mais recente. Se você continuar clicando, o sistema irá buscar os chamados mais antigos sequencialmente.

Ícone de Carinha Sorridente e Ícone de Mais (+):

Função: Estes ícones estão relacionados à integração com o módulo G3STOR.

Detalhe: As funcionalidades específicas destes ícones (como Criar Cliente e Adicionar Observação) estão detalhadas na documentação separada sobre o G3STOR.

Ícone "I" (Informações):

Função: Acessa rapidamente as informações detalhadas do cliente (dados cadastrais, etc.).

Ícone de Três Pontos Verticais (⋮):

Função: Este é o menu de Ações do Chamado, onde você encontra comandos cruciais (como transferir, finalizar, etc.).

A Conversa em Si: Envio de Mensagens e Mídia
A área central do chat é onde a comunicação acontece. Você tem diversas ferramentas para interagir com o cliente:


image.png

1. Envio de Texto

Digitar e Enviar: Você pode escrever sua mensagem no campo de input e enviá-la de duas formas:

Pressionando a tecla Enter no seu teclado.

Clicando no botão de Envio (geralmente um ícone de seta ou avião de papel) ao lado do campo de texto.

2. Adicionar Conteúdo à Mensagem

Emojis: Clique no ícone de Emoji (um rosto sorridente) para abrir a biblioteca e inserir emojis na sua mensagem.

Anexar Arquivos: Clique no ícone de Clipe/Arquivo para selecionar e enviar documentos, imagens ou outros tipos de arquivos para o cliente.

3. Interações com Mensagens Enviadas/Recebidas

Responder (Citar): Para responder a uma mensagem específica (criando uma citação), clique e segure a própria mensagem que deseja citar. Uma opção de "Responder" aparecerá.

Encaminhar: Para mover uma mensagem para outro chat ou contato, utilize o botão de Encaminhar que aparece ao lado da mensagem (um ícone de seta curvada).

6. Tela de Configuração
A Tela de Configuração é o painel onde você gerencia suas informações pessoais, ajusta preferências e acessa ferramentas administrativas.

image.png

Ao acessar esta tela (clicando no Ícone de Três Pontos Verticais (⋮) na barra lateral), você encontra as seguintes opções de gerenciamento:

Editar Perfil: Permite que você modifique seu nome (a forma como ele aparece para os colegas) e altere sua senha de acesso ao sistema.

Gerenciar Assuntos: Acessa a ferramenta para criar, editar e organizar as categorias de classificação de chamados (conforme detalhado na seção específica sobre Classificação de Chamados).

Controle de Plantão (Se Configurado): Caso você tenha essa funcionalidade, esta opção permite que você ative ou desative o plantão.

Excluir Conta: Permite a exclusão definitiva do seu cadastro.

⚠️ Cuidado: Esta é uma ação irreversível. Excluir a conta removerá permanentemente seu acesso e dados associados.

Deslogar: Um botão de acesso rápido para encerrar sua sessão no sistema.

 Configuração e Gerenciamento do WhatsApp (Container)
Este guia orienta como gerenciar o container do WhatsApp, realizar a leitura do QR Code e reiniciar o serviço em caso de queda.

1. Acessando o Painel
No menu de configurações, acesse a opção WhatsApp. Nesta tela, você visualizará as opções para:

Criar um novo container.

Gerenciar o container ativo.

Monitorar o status da conexão.

Reiniciar o serviço, caso esteja offline.

2. Procedimento para Pareamento (Leitura de QR Code)
Caso o sistema solicite uma nova conexão ou o serviço tenha sido iniciado recentemente, siga estes passos para conectar seu aparelho:

Visualizar Log: Clique no botão Ver Logs dentro do painel do WhatsApp.

Localizar o QR Code: Role a tela de logs para baixo até que o código QR seja gerado e exibido no terminal.

No Celular: * Abra o WhatsApp no seu smartphone.

Vá em Configurações > Aparelhos Conectados.

Toque em Conectar um Aparelho.

Escaneamento: Aponte a câmera do celular para o QR Code exibido na tela do computador.

Sincronização: Após a leitura, aguarde aproximadamente 30 segundos. O sistema processará a conexão e o status mudará para "Ativo".

💡 Dicas de Suporte
https://suporte.webplanet.com.br/link/46#bkmrk-servi%C3%A7o-offline%3A-se-

 
Serviço Offline: Se a conexão cair, utilize a opção Reiniciar Container antes de tentar ler o QR Code novamente.

Tempo de Resposta: A sincronização inicial pode variar dependendo do volume de mensagens da conta; evite fechar a tela durante os 30 segundos iniciais.
`;
