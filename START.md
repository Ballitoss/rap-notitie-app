# 🚀 Quick Start Guide

## Ontwikkelingsomgeving starten

```bash
# Start de development server
npm run dev
```

Open dan je browser op `http://localhost:5173`

## Eerste gebruik

1. **Klik op "Nieuw"** in de header
2. **Geef je project een naam** (bijv. "Mijn eerste rap")
3. **Begin te typen** in de editor
4. **Zie rijmsuggesties** verschijnen in de rechterkant
5. **Klik op een suggestie** om deze toe te voegen

## Voorbeeld workflow

```
Typ: "Ik loop door de straat"
→ Suggesties: [me, we, je, ze, laat]

Klik op "laat" → "Ik loop door de straat laat"

Enter → Nieuwe regel

Typ: "Voel me zo"
→ Suggesties: [go, zo, moo, bo, hoe]

etc...
```

## Feature Demo

### Slang toevoegen
Type een onbekend woord zoals "styllin" → Dialog verschijnt → Vul betekenis in

### Flow analyse
Type meerdere regels → Zie syllabe telling en BPM advies in de sidebar

### Feedback geven
Klik op 👍 of 👎 bij suggesties → App leert jouw stijl

### Project wisselen
Klik op menu icoon → Selecteer ander project → Switchen van context

### Export
Klik op download icoon → TXT bestand wordt gedownload

## Keyboard Shortcuts

- `Enter` - Nieuwe regel
- `Backspace` - Verwijder lege regel
- `↑` `↓` - Navigeer tussen regels (future)

## Troubleshooting

**Suggesties verschijnen niet?**
- Check of je tenminste 1 woord hebt getypt
- Check browser console voor errors

**App crash bij slang dialog?**
- Check localStorage permissions in browser
- Clear browser cache en reload

**Witte scherm?**
- Check terminal voor build errors
- Run `npm run dev` opnieuw

## Code aanpassen

**Meer woorden toevoegen aan rijm lijst:**
→ `src/services/rhymeEngine.ts` → `DUTCH_WORDS` array

**Slang woorden toevoegen:**
→ `src/services/slangDB.ts` → `DEFAULT_SLANG` array

**UI kleuren aanpassen:**
→ `src/index.css` → CSS variables

**Flow logica aanpassen:**
→ `src/services/phonetics.ts` → Syllabe/klemtoon functions

## Bouwen voor productie

```bash
npm run build
```

Output in `dist/` folder - deploy naar hosting van keuze.

---

**Ready to rap! 🎤**

