# Alarme App

Este é um aplicativo simples de alarme desenvolvido para fins educacionais. O app permite que o usuário crie alarmes personalizados, configure horários e escolha músicas para tocar ao alarme. 

## Funcionalidades

- **Criar Alarmes**: Defina um título e horário para o alarme.
- **Escolher Música**: Selecione entre algumas opções de músicas para tocar quando o alarme disparar.
- **Visualização de Hora Atual**: A hora do dispositivo é exibida em tempo real.
- **Despertadores Salvos**: Exibe a lista de alarmes definidos, onde é possível apagar ou ouvir os alarmes salvos.

## Funcionalidades Faltantes

Este aplicativo não possui funcionalidades como:
- **Funcionar em segundo plano**: O app não continua funcionando se for minimizado.
- **Persistência Avançada**: O app armazena os alarmes apenas na memória do dispositivo usando `AsyncStorage`. Não há suporte para bancos de dados.

## Tecnologias Usadas

- **React Native**: Para o desenvolvimento do aplicativo.
- **Expo-AV**: Para tocar os sons de alarme.
- **AsyncStorage**: Para armazenar os alarmes localmente no dispositivo.
- **@react-native-community/datetimepicker**: Para permitir que o usuário escolha o horário do alarme.

## Como Usar

1. **Criar um Alarme**:
   - Toque no botão **+** no canto inferior direito da tela para abrir o modal de criação de alarme.
   - Defina o título do alarme e escolha o horário.
   - Selecione uma música para o alarme ou escolha a opção "Sem Música".
   - Toque em **Salvar** para adicionar o alarme à lista.

2. **Ver Alarmes Ativos**:
   - Os alarmes salvos serão listados na tela inicial. Você pode ouvir ou apagar alarmes diretamente da lista.

3. **Tocar e Parar Música**:
   - Quando um alarme tocar, você pode clicar em **Parar Música** para interromper o som.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/usuario/repo.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o aplicativo:
   ```bash
   npm start
   ```

## Contribuições

Este projeto está sendo desenvolvido como parte de um estudo de React Native. Contribuições são bem-vindas para aprimorar as funcionalidades e corrigir eventuais problemas.

## Licença

Este projeto é de código aberto e está sob a licença MIT.

Link para Download:
https://drive.google.com/file/d/1dlO3Hgmi6OqIman02TctAYJ-sflXOm00/view?usp=sharing
