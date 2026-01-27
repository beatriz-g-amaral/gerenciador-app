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

- **`app/`**: Contém as rotas da aplicação e a lógica das páginas.
    - `layout.tsx`: Layout raiz definindo a estrutura global.
    - `page.tsx`: Ponto de entrada.
    - `login/` & `loginG3stor/`: Rotas de autenticação.
    - `grid/`: Visualização Kanban dos chats por assunto.
    - `config/`: Páginas de configuração para ajustes do sistema e integrações.
    - `user/`: Interfaces de gerenciamento de usuários.
    - `webhooks/`: Configuração de webhooks.

- **`components/`**: Componentes de UI reutilizáveis.
    - `chat/`: Componentes específicos para a interface de chat.
    - `g3stor/`: Componentes relacionados à integração com o sistema Gestor.
    - `subject/`, `user/`, `whatsapp/`: Componentes específicos de cada funcionalidade.
    - `ui/`: Elementos de UI compartilhados (Botões, Modais, Inputs).
    - `init-workflow/`: Componentes do assistente de configuração inicial.

- **`services/`**: A camada de interação com APIs. Parte crítica da arquitetura, abstraindo todas as chamadas externas.
    - `lhc-client/`: Cliente extensivo para a API do Live Helper Chat (LHC).
    - `g3stor-client/`: Cliente para a API de gestão do Gestor.
    - `client/`: Configuração base do gerenciador de API.

- **`hooks/`**: Hooks React personalizados para reutilização de lógica (ex: `use-fcm-token.ts` para notificações).

- **`lib/`**: Bibliotecas utilitárias e funções auxiliares (ex: `firebase.ts` para notificações push).

- **`contexts/`**: Provedores de Contexto React para estado global (ex: `AuthContext`).

## 3. Funcionalidades e Módulos Principais

### 3.1 Autenticação
O sistema emprega uma estratégia de autenticação dupla:
1.  **Login do Chat (`/login`)**: Autentica contra a API do LHC para habilitar recursos de chat.
2.  **Login do Gestor (`/loginG3stor`)**: Autentica contra a API do Gestor para funcionalidades administrativas e de ERP.

### 3.2 Sistema de Chat e Visualizações

#### Chat Layout (Visão Geral)
A estrutura principal de atendimento, composta por:
-   **Barra Lateral (Sidebar)**: Lista de conversas ativas e navegação entre departamentos.
-   **Janela de Chat (Chat Window)**: A interface direta de conversação.

#### Grid (`/grid`) - Kanban de Assuntos
Uma visualização especializada onde os chats são organizados em colunas baseadas em **Assuntos** (Subjects).
-   **Organização Visual**: Permite ver rapidamente quantos chats estão em cada assunto.
-   **Drag-and-Drop**: Permite mover chats entre assuntos arrastando os cards (`components/chat/grid/chat-grid.tsx`).

#### Funcionalidades Detalhadas do Chat:
-   **Envio de Arquivos**: Através do componente `FileUploader` (`components/chat/file/file-uploader.tsx`), usuários podem enviar arquivos e imagens diretamente na conversa. O upload é processado e enviado via `sendFileMessage`.
-   **Iniciar Atendimento**: É possível iniciar uma nova conversa com um contato existente. O modal `StartChatModal` (`components/chat/start-chat-modal.tsx`) permite selecionar o departamento desejado para iniciar o atendimento.
-   **Adicionar/Alterar Assunto**: Para categorizar atendimentos, o usuário pode vincular um assunto à conversa. O `AddSubjectModal` (`components/subject/add-subject-modal.tsx`) lista os assuntos disponíveis e permite a associação rápida.

### 3.3 Gerenciamento do Sistema
-   **Gerenciamento de Usuários (`/user`)**: Criar, editar e excluir usuários.
-   **Assuntos (`/subject`)**: Gerenciar tópicos/assuntos de chat para categorização.
-   **Webhooks (`/webhooks`)**: Configurar webhooks para integrações externas.

### 3.4 Integrações
-   **WhatsApp**: Configurações de integração disponíveis em `/whatsapp`.
-   **Google Calendar**: Configuração para sincronização de calendário em `/config/google-calendar`.

### 3.5 Assistente de Configuração do Sistema (Wizard)
Um fluxo passo-a-passo (`components/init-workflow`) permite que administradores personalizem a identidade do sistema:
-   **Logo**: Upload e definição do logotipo da aplicação.
-   **Notificações**: Configuração de sons de alerta personalizados.
-   **Favicon**: Definição do favicon do navegador.
Isso garante que a aplicação esteja alinhada com a marca da organização desde o início.

## 4. Detalhes da Camada de Serviço (`services/`)

A pasta `services/` é a ponte entre o frontend e as APIs de backend.

### `lhc-client` (Live Helper Chat)
Este cliente lida com todas as operações relacionadas ao chat. É modularizado em:
-   `auth.ts`: Tratamento de sessão.
-   `chat.ts`: Envio/recebimento de mensagens, busca de histórico e envio de arquivos.
-   `department.ts`: Gerenciamento de departamentos de chat.
-   `file.ts`: Manipulação de uploads e downloads de arquivos.
-   `user.ts`: Operações relacionadas a usuários.
-   `webhook.ts`: Operações CRUD de webhooks.

### `g3stor-client` (Gestor)
Lida com lógica de negócios e dados administrativos:
-   `g3stor-auth.ts`: Autenticação para o sistema Gestor.
-   `g3stor.ts`: Busca e manipulação de dados principais para objetos de negócio.

## 5. Mobile e Implantação

### Mobile (Capacitor)
O projeto está configurado para implantação móvel usando Capacitor.
-   `ios/`: Projeto nativo iOS.
-   `android/`: Projeto nativo Android.
-   `capacitor.config.ts`: Configuração do Capacitor.

### Notificações Push
Implementadas usando Firebase Cloud Messaging (FCM).
-   `hooks/use-fcm-token.ts`: Hook para recuperar e gerenciar o token FCM.
-   `lib/firebase.ts`: Inicialização do Firebase.

## 6. Como Iniciar

1.  **Instalação**:
    ```bash
    npm install
    ```

2.  **Desenvolvimento**:
    ```bash
    npm run dev
    ```

3.  **Build**:
    ```bash
    npm run build
    ```

4.  **Lint**:
    ```bash
    npm run lint
    ```
