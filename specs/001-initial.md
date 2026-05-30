Sistema de Jornal & Telão para Igreja Adventista
Plano Completo de Desenvolvimento
Objetivo

Desenvolver uma plataforma web estática para gerenciamento e exibição de anúncios da igreja, contendo:

Página de anúncios do dia
Página de histórico de anúncios
Modo telão fullscreen automático
Painel administrativo
Gerador visual de artes/templates
Sistema baseado em JSON
Hospedagem gratuita via CDN
Stack Tecnológica
Frontend
Vue 3
Vite
Vue Router
UI/Animações
Swiper.js (slides/telão)
Framer Motion ou Motion One
html2canvas (geração de imagens)
CMS/Admin
JSON local
Futuramente compatível com Decap CMS
Hospedagem
Cloudflare Pages
Estrutura do Projeto
church-media-system/
├── public/
│   ├── announcements.json
│   ├── generated/
│   ├── assets/
│   │   ├── images/
│   │   ├── videos/
│   │   └── logos/
│
├── src/
│   ├── components/
│   │   ├── AnnouncementCard.vue
│   │   ├── SlideAnnouncement.vue
│   │   ├── FullscreenButton.vue
│   │   ├── TemplateEditor.vue
│   │   ├── TemplatePreview.vue
│   │   └── VinhetaPlayer.vue
│   │
│   ├── templates/
│   │   ├── TemplateModern.vue
│   │   ├── TemplateClassic.vue
│   │   └── TemplateMinimal.vue
│   │
│   ├── pages/
│   │   ├── Home.vue
│   │   ├── Historico.vue
│   │   ├── Telao.vue
│   │   └── Admin.vue
│   │
│   ├── services/
│   │   ├── jsonService.js
│   │   ├── imageGenerator.js
│   │   └── fullscreen.js
│   │
│   ├── router/
│   │   └── index.js
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── App.vue
│   └── main.js
Funcionalidades
1. Página Inicial (Anúncios do Dia)
Objetivo

Exibir os anúncios ativos do dia em formato moderno.

Funcionalidades
Cards responsivos
Imagem 16:9
Título
Subtítulo
Data
Horário
Local
Categoria
Ordenação por horário
Filtros por categoria
Layout

Estilo:

minimalista
moderno
dark mode
inspirado em telões de conferência
2. Página Histórico
Objetivo

Listar todas as datas com anúncios cadastrados.

Funcionalidades
Lista de datas
Quantidade de anúncios
Pesquisa
Filtro por mês
Clique abre anúncios daquela data
Exemplo
30/05/2026 — 6 anúncios
23/05/2026 — 4 anúncios
16/05/2026 — 8 anúncios
3. Modo Telão (ESSENCIAL)
Objetivo

Modo fullscreen automático para:

TV
projetor
telão
transmissão
Fluxo
Abertura
Vinheta animada
Logo da igreja
Música opcional
Fade transition
Slides

Cada anúncio vira um slide fullscreen.

Funcionalidades
Fullscreen automático
Autoplay
Loop infinito
Fade transitions
Tempo configurável por slide
Navegação por teclado
Ocultar cursor após inatividade
Responsivo
Biblioteca

Swiper.js

Fullscreen API
document.documentElement.requestFullscreen()
4. Painel Admin
Objetivo

Permitir que pessoas sem conhecimento técnico cadastrem anúncios.

Funcionalidades
CRUD de anúncios
Upload de imagem
Seleção de template
Escolha de cores
Preview em tempo real
Exportação JSON
Exportação PNG
5. Gerador de Artes
Objetivo

Gerar automaticamente imagens prontas para:

telão
Instagram
divulgação
Tecnologia

html2canvas

Templates
Template 1 — Modern
Visual
gradiente
blur
glow
tipografia bold
imagem grande
Ideal para
jovens
podcast
eventos especiais
Template 2 — Classic
Visual
elegante
institucional
serif fonts
dourado/branco
Ideal para
Santa Ceia
programação oficial
semanas especiais
Template 3 — Minimal
Visual
clean
foco em legibilidade
fundo sólido
Ideal para
avisos rápidos
horários
reuniões
Campos Editáveis

Todos os templates devem permitir:

Título
Subtítulo
Data
Horário
Local
Cor principal
Imagem
Logo
Categoria
Estrutura do JSON
{
  "announcements": [
    {
      "id": "uuid",
      "template": "modern",
      "title": "Culto Jovem",
      "subtitle": "Uma noite especial",
      "date": "2026-06-05",
      "time": "19:30",
      "location": "IASD Amambaí",
      "category": "jovens",
      "color": "#2563eb",
      "image": "/generated/culto-jovem.png",
      "showOnScreen": true,
      "duration": 10,
      "createdAt": "2026-05-30T20:00:00"
    }
  ]
}
Responsividade
Deve funcionar em:
Desktop
Notebook
Celular
Tablet
Smart TV
Projetor
Requisitos Visuais
Estilo Geral

Inspirado em:

Apple Keynote
telões de conferências
mídia da Igreja Adventista
Características
Dark mode
Alto contraste
Tipografia limpa
Grandes espaços
Animações suaves
Imagens grandes 16:9
Recursos Extras (IMPORTANTE)
Duplicar anúncio

Permitir duplicar anúncios rapidamente.

Agendamento

Mostrar anúncio apenas entre datas específicas.

Exportações futuras

Preparar estrutura para:

16:9 TV
1:1 Instagram
9:16 Stories
Hospedagem
Cloudflare Pages

Deploy via GitHub.

Fluxo:

GitHub
  ↓
Cloudflare Pages
  ↓
CDN Global
Restrições Técnicas IMPORTANTES
NÃO usar:
Backend
Banco de dados
Node server
VPS
Deve funcionar:
totalmente estático
via CDN
sem custo
Objetivo Final

Criar um sistema profissional de mídia para igreja com:

painel simples
telão moderno
geração automática de artes
fácil manutenção
totalmente gratuito
altamente visual
preparado para expansão futura.
