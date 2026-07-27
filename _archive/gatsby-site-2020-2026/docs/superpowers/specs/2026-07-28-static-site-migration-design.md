# Migracja maciej.czerpinski.com: Gatsby → 11ty (statyczny HTML)

Data: 2026-07-28
Status: zatwierdzony przez Macieja, gotowy do implementacji

## Cel

Zastąpić Gatsby (`@lekoarts/gatsby-theme-minimal-blog`, React, ciężki build)
prostą statyczną stroną budowaną przez 11ty (Eleventy). Zero Reacta,
zero SPA overhead. Deploy zostaje na GitHub Pages (bez zmian w hostingu),
build robi GitHub Actions.

Hero i pozycjonowanie na stronie są dziś nieaktualne ("PHP Programmer,
DDD/CQRS/ES enthusiast, Value Objects lover" - hero z 2020). Migracja to
też okazja zaktualizować treść do aktualnego pozycjonowania z
`brand/achievements.md` i `content/drafts/linkedin-about.md` (Tech Lead /
AI-assisted development / trener).

## Stack

- **Eleventy (11ty)** - generator statyczny, markdown + Nunjucks templates.
- **CSS** - własny, prosty (bez frameworka). Typografia i kolor jak w
  obecnym motywie (IBM Plex Sans), bez zależności od theme-ui/Emotion.
- **Deploy** - GitHub Actions build → push do `gh-pages` / `docs/`
  (zachowujemy obecny mechanizm publikacji GitHub Pages, tylko zmieniamy
  co generuje output).
- Usuwamy: `gatsby`, `@lekoarts/gatsby-theme-minimal-blog`,
  `gatsby-plugin-*`, `react`/`react-dom`, `gatsby-plugin-intl`.

## Struktura strony

Strona główna (`/`) to one-pager z sekcjami (anchor nav), blog jako
osobne podstrony.

1. **Hero** - kim jestem, pozycjonowanie, talenty Gallupa (patrz niżej).
2. **About** - blend zawodowo + osobiście, z wplecioną JEDNĄ linią
   dowodową (bez liczb Cleeng, bez formy "CV"):
   *"Prowadzę zespoły przez projekty, które inni odkładają latami -
   i dowożę je end-to-end."*
   Brak osobnej sekcji "Proof/Selected work" - odrzucone, bo robiło
   z one-pagera resume zamiast rozmowy.
3. **Szkolenia** - własna oferta (Event Storming, DDD, Clean Code),
   CTA kieruje do Macieja (mail/DM), NIE do Sages/Altkom. Sages/Altkom
   pojawiają się co najwyżej jako jedno zdanie wiarygodności
   ("uczyłem m.in. w Sages i Altkom"), nie jako promowana marka.
   - **Testimoniale (placeholder):** sekcja zawiera 2-3 dummy opinie
     (imię, komentarz, nazwa szkolenia) jawnie oznaczone jako placeholder
     w kodzie:
     ```html
     <!-- TODO: PLACEHOLDER - podmień na prawdziwe opinie przed publikacją -->
     ```
     **Gate: strona NIE idzie na produkcję z dummy opiniami.** Maciej
     podmienia na prawdziwe przed publicznym udostępnieniem linka.
     Powód: fake testimoniale = wprowadzanie w błąd, koliduje z
     wartościami Honesty/Justice - ryzyko reputacyjne większe niż
     korzyść z "ładniejszej" sekcji.
4. **Blog** - lista najnowszych postów (teaser + link "wszystkie posty").
   Osobne strony `/blog/`, `/blog/<slug>/`, markdown → 11ty.
   Istniejący post "Remote Event Storming" migrowany 1:1 (treść, obrazki).
5. **Kontakt/Footer** - LinkedIn, GitHub, email, © rok. Bez stopki
   "Theme by LekoArts" (własny build, nie cudzy theme).

## Język (PL/EN)

- **Domyślny: EN.** PL jako dodatkowy, przełącznik języka.
- Dwujęzyczne: Hero, About, Szkolenia, nav (te same dane co dziś w
  `src/intl/en.json`, dodajemy `pl.json`, w 11ty jako proste pliki
  danych + template z przełącznikiem `/` ↔ `/pl/`).
- **Blog: tylko EN.** Posty nie są tłumaczone, żadnych podwójnych wersji
  per post (decyzja: szybkość publikacji > kompletność i18n).

## Treść Hero (v2, zatwierdzona)

```
Cześć, jestem Maciej.

Tech Lead, który sprawia że AI w developmencie naprawdę działa.
15+ lat w PHP/Laravel i systemach rozproszonych - prowadzę zespoły
tam, gdzie zderzają się legacy bez dokumentacji, presja biznesu
i nowe narzędzia AI.

Szkolę zespoły (Event Storming, DDD, Clean Code) oraz prowadzę
konsulting Spec-Driven Development i wdrażanie procesów SDLC -> speccode.com

Learner / Individualization / Strategic / Analytical / Maximizer
```

Wersja EN analogiczna, oparta na headline/about z
`content/drafts/linkedin-about.md` (sekcja EN).

## Migracja treści źródłowej

- `content/posts/remote-event-storming/index.mdx` → 11ty markdown post
  (front matter: title, date, tags, banner - zachować strukturę).
  Obrazki (`photo.jpg`, `bulkmode.gif`, itd.) kopiowane bez zmian.
- Hero/About/Szkolenia - nowa treść wg wyżej, NIE migracja starego
  `hero.mdx` (jest przestarzały, świadomie zastępowany).
- `bottom.mdx` - pusty, do pominięcia.
- Stopka theme'u LekoArts - usunięta, zastąpiona własną (patrz Kontakt).

## Poza zakresem (świadomie odrzucone)

- Sekcja "Proof/Selected work" jako osobny blok - odrzucona.
- Promowanie Sages/Altkom jako marek na stronie - odrzucone, to Twoja
  strona, Twoja oferta.
- Tłumaczenie postów bloga na PL - odrzucone, blog zostaje EN-only.
- Zmiana hostingu na shared hosting - odrzucona, zostajemy na GitHub
  Pages (prostsze, bez FTP, deploy = `git push`).

## Otwarte przed implementacją

- Prawdziwe testimoniale do Szkoleń - Maciej dostarczy przed
  publicznym udostępnieniem linka (blocker publikacji, nie blocker
  buildu).
