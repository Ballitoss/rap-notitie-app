# 🎤 Rap Notitie & Rijm App

Een AI-powered schrijfhulp voor rapteksten met live rijmsuggesties, flow-analyse, en slang detectie.

## 🚀 Features (MVP)

- **Live Rijmsuggesties**: Automatische perfect, assonantie, alliteratie, en multi-syllabisch rijm
- **Flow Analyse**: Syllabe telling, BPM alignement, en flow-advies
- **Slang Detector**: Detecteert onbekende straattaal en vraagt om uitleg
- **Persoonlijke Stijl**: Leert van jouw feedback en past suggesties aan
- **Project Management**: Organiseer meerdere teksten in projecten
- **Export**: Download als TXT (PDF komt in v1.0)

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: CSS Variables (Dark Mode)
- **Icons**: Lucide React

## 📦 Installatie

```bash
# Installeer dependencies
npm install

# Start development server
npm run dev

# Build voor productie
npm run build
```

## 🎯 Gebruik

1. **Nieuw Project**: Klik op "Nieuw" in de header om een nieuw project te maken
2. **Type je regel**: Begin met typen in de editor
3. **Rijmsuggesties**: Zie live suggesties in de rechter sidebar
4. **Accepteer suggestie**: Klik op een suggestie om toe te voegen aan je regel
5. **Feedback**: Geef 👍 of 👎 om je stijl aan te leren
6. **Slang toevoegen**: Als onbekende woorden worden gedetecteerd, voeg de betekenis toe
7. **Export**: Download je tekst als TXT bestand

## ⌨️ Keyboard Shortcuts

- `Enter`: Nieuwe regel toevoegen
- `Backspace`: Verwijder lege regel
- `↑` `↓`: Navigeer tussen regels

## 📁 Project Structuur

```
src/
├── components/      # UI componenten
│   ├── Editor.tsx           # Hoofd editor
│   ├── SuggestionPanel.tsx  # AI suggesties sidebar
│   ├── SlangDialog.tsx      # Slang leer dialoog
│   └── ProjectList.tsx      # Project overzicht
├── services/       # Core logica
│   ├── phonetics.ts        # Nederlandse fonetische parser
│   ├── rhymeEngine.ts      # Rijm generator
│   └── slangDB.ts          # Slang database
├── store/          # State management
│   └── appStore.ts
└── types.ts        # TypeScript definities
```

## 🧠 Nederlandse Fonetiek

De app gebruikt een vereenvoudigde fonetische engine voor NL rijm:

- **Klinkers**: ui→œy, ij→ɛi, oe→u, etc.
- **Consonanten**: sch→sx, ch→x, ng→ŋ
- **Syllabe telling**: Heuristiek op basis van klinkers
- **Klemtoon**: Vereenvoudigde patterns

Voor v1.0: Upgrade naar full IPA/phonemizer library.

## 🎨 Styling

- **Theme**: Dark mode with CSS variables
- **Responsive**: Works on desktop, tablet, mobile
- **Colors**: Gradient accents (blue → purple)

## 📊 Roadmap

### Week 1-4 (MVP) ✅
- [x] Editor skeleton
- [x] Basis rijm engine
- [x] Flow meter
- [x] Slang detector
- [x] Project management

### Week 5-8 (v1.0)
- [ ] Hook/chorus generator
- [ ] Rhyme scheme templates (AABB, ABAB)
- [ ] BPM beat sync
- [ ] PDF export
- [ ] Taalmix (NL-EN fonetisch)

### v1.1+
- [ ] Punchline subscriptoon
- [ ] Advanced wordplay
- [ ] Metaforen expander
- [ ] Cloud sync
- [ ] Mobile apps

## 🤝 Bijdragen

Contributions zijn welkom! Open een issue of pull request.

## 📝 Licentie

MIT

---

**Made with 💜 for Dutch rap artists**

