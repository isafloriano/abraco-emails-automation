# Automação de Emails para o Abraço Cultural

Este script foi criado para auxiliar o **Abraço Cultural** a enviar os emails transacionais dos processos de inscrição 
e avaliação de níveis das turmas de SP e RJ.

> **Warning**  
> É importante que todos os passos da Instalação e Envio sejam feitos usado a conta de emails que será utilizada como
> remetente dos emails  

## ⬇️ Como Instalar o Script  

1. Copie o código [aqui](https://raw.githubusercontent.com/isafloriano/abraco-emails-automation/main/main.js)
2. Abra a planilha onde estão os dados a serem usados nos envios dos emails. (No caso das incrições, isso poderá ser feito tanto na planilha Resumo, como nas planilhas individuais de cada turma)
3. Clique no menu **Extensões > Apps Script**
4. No editor que se abriu, cole o código copiado
5. Salve (clicando no botão 💾)
6. Pronto! Script instalado! Para conferir se funcionou, abra novamente a planilha e um novo botão terá aparecido no menu: 
**Mail Merge**

## ⚙️ Como Configurar a Automação

1. Clique no botão **Mail Merge > Criar Página Email Config**. Isto irá criar a página de configuração com todos os campo necessários

> **Note**  
> Na primeira vez que o botão for clicado em uma nova planilha, uma mensagem de autorização do Google será aberta. Siga os passos abaixo para autorizar o script a editar a sua planilha:  
> 1. Clique em **Continuar**  
> 2. Escolha a conta que irá enviar os emails  
> 3. Clique em **Permitir**  

2. Preencha as colunas conforme indicação abaixo:  
    a. **Nome da Página:** Nome da página onde estão as configurações do email a ser enviado  
    b. **Email:** Nome da coluna onde se encontram os endereços de emails dos destinatários  
    c. **Coluna Condicional:** Nome da coluna onde está a **Condição** de envio  
    d. **Condição:** Texto das células da **Coluna Condicional** que indicam que um email deve ser enviado (Importante que 
    estejam escritas idênticas na página de configuração e na página com os dados)  
    e. **Assunto do Email:** Assunto do email dos rascunhos que será usado para o envio  
    f. **Cc:** Nome da coluna onde está o endereço de email a ser colocado em cópia  
    g. **Coluna Marcação Envio:** Nome da coluna onde o carimbo de hora será incluído indicando quando o email foi enviado  

> **Warning**  
> É importante que não haja células vazias no meio das configurações para não ter erros  

## 📤 Como Enviar os Emails

1. Clique no botão **Mail Merge > Enviar emails**. Isso irá fazer com que todos os emails que satisfaçam as condições e
ainda não foram enviados, sejam enviados.  

