# Murilo Pneus — CRM

CRM de oficina para a Murilo Pneus Auto Center. React + Vite.
Cadastro de clientes/veículos, histórico de serviços, radar de retorno,
orçamentos e disparo de mensagem pronta no WhatsApp (via link `wa.me`).

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Onde os dados ficam

No navegador (`localStorage`). Cada dispositivo/navegador guarda os seus.
Para acesso compartilhado entre vários atendentes e aparelhos, o próximo
passo é trocar a camada de storage por Supabase (o código já está isolado
no objeto `store` dentro de `src/MuriloCRM.jsx`).

## Subir para o GitHub

```bash
git init
git add .
git commit -m "CRM Murilo Pneus"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/murilo-crm.git
git push -u origin main
```

## Deploy na Vercel

1. Em vercel.com → New Project → importe o repositório.
2. A Vercel detecta o preset **Vite** sozinha:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy. Pronto.
