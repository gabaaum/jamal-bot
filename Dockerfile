FROM node:22-slim

WORKDIR /app

# Instala dependências do sistema (git é útil, ca-certificates para HTTPS)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copia o manifesto e instala dependências
COPY package.json ./
RUN npm install

# Copia todo o resto (memórias, configs, skills)
COPY . .

# Cria pasta de memória caso não exista
RUN mkdir -p memory

# O comando de início
CMD ["npx", "clawdbot", "gateway", "--mode", "http"]
