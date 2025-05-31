FROM node:20

WORKDIR /app

# Instala pacotes adicionais e dependências de build
RUN apt-get update && \
    apt-get install -y \
    postgresql-client \
    make \
    g++ \
    python3 && \
    rm -rf /var/lib/apt/lists/*

# Copia apenas os arquivos de dependências primeiro
COPY package*.json ./

RUN rm -rf node_modules

# Instala as dependências e compila o bcrypt
RUN npm install --legacy-peer-deps && \
    npm rebuild bcrypt --build-from-source && \
    apt-get remove -y make g++ python3 && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copia o resto do código
COPY . .

# Expõe a porta da aplicação
EXPOSE 3000

# Comando padrão para iniciar o servidor
CMD ["npm", "run", "start:dev"]
