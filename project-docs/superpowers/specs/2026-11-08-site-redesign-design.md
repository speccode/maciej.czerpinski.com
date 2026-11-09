# Redesign maciej.czerpinski.com: projekt

Data: 2026-11-08. Autor decyzji: Maciej. Pisane do zbudowania przez kogoś, kto nie może go dopytać.

## 1. Po co

Strona jest dziś niedopracowana wizualnie i nie niesie pozycjonowania, którego Maciej chce: **Forward Deployed Engineer, trener i konsultant**. FDE rozumie tak: robi rozpoznanie, wpada tam, gdzie boli najbardziej, robi to, co trzeba, może na czas misji siedzieć w firmie klienta i wychodzi, zostawiając zespół samodzielny.

Czytelnik, o którego chodzi: sceptyczny CTO, VP Engineering lub lider techniczny (firma 20-200 osób), a dla jednej usługi także founder lub CEO bez CTO. Ma w pierwszych 10 sekundach pomyśleć: **to profesjonalista, któremu można zaufać, ktoś, kto był w okopach IT i potrafi poprowadzić zespół na lepszą ścieżkę.**

Ważny kontekst: Maciej nie ma sieci kontaktów wśród founderów. Strona jest głównie aktywem wiarygodności, które ma poprzeć jego działania na LinkedIn i po szkoleniach. Największy realny kapitał to **302 przeszkolone osoby**, 23 prawdziwe opinie i 15+ lat doświadczenia.

## 2. Cele, nie-cele, anty-cele

**Cele**
- Hero mówi w pierwszym ekranie: kim jest, co robi, dowód, jeden wyraźny krok (kalendarz).
- Wygląd "Studio": spokojny, jasny, drogi w odbiorze, w duchu Apple, ale z własnym głosem.
- Oferta sprzedawana przez **problem klienta**, nie przez nazwę procesu.
- Dowody (liczby i opinie) widoczne na stronie głównej, a nie tylko na stronie szkoleń.
- Nowa strona dla uczestników szkoleń, żeby zamieniać ich w kontakty na LinkedIn.

**Nie-cele (teraz)**
- Osobna podstrona fractional CTO. Najpierw karta na stronie głównej, podstrona po sygnale popytu.
- Zmiana treści blogu, nowe funkcje blogu (tagi, wyszukiwarka). Blog dostaje tylko nowy system wizualny.
- Cennik, studia przypadków, formularze z backendem.
- Pozycjonowanie pod konkretne frazy na podstawie wolumenów (dane SEMrush niedostępne, patrz sekcja 8).

**Anty-cele (to byłaby porażka, nawet gdyby działało)**
- Wygląda jak kolejny szablon "premium" albo kopia strony Apple.
- Militarny kostium (kamuflaż, naszywki, "Navy Seals" w grafice). "Navy Seals" ma być w sposobie pracy, nie w wyglądzie.
- Wzmianka o PHP w hero lub paskach liczb (Maciej: "PHP odstraszy").
- Wymyślone liczby, opinie, klienci. Tylko fakty z `_data/` i potwierdzone przez Macieja.
- Zepsucie istniejącego SEO i adresów (hreflang, sitemap, przekierowania, `llms.txt`).

## 3. Ograniczenia

- **Stack:** Eleventy 2, szablony Nunjucks, dwujęzyczność (EN w `/`, PL w `/pl/`), treści w `site/_data/copy.js`, opinie w `site/_data/testimonials.js`. Wyjście: `docs/`, publikowane (jest `CNAME`). Zmiany robić w `site/`, nie w `docs/`.
- Liczby szkoleń z jednego źródła: `TRAINING_STATS` w `copy.js`.
- Dostępność: kontrast tekstu min. 4.5:1, widoczny focus, obsługa `prefers-reduced-motion`, aktywne menu (`aria-current`).
- Responsywność: sprawdzić 1440, 1024, 768, 390 (oraz 320 bez poziomego przewijania).
- Zdjęcie: nowy plik `IMG_2496.jpg` (2316x3088, 3.2 MB, selfie z bliska, jasna ściana). Trzeba zrobić zoptymalizowane wersje (np. szerokość 1200 i 600, nowoczesny format plus jpg). Kadr ciasny i pionowy, nie panoramiczny.
- Fonty: makiety używały systemowego stosu (SF Pro na Apple). **SF Pro nie jest dostępny na stronie webowej poza urządzeniami Apple**, więc na Windows spadłoby do Arial. Builder wybiera licencjonowany font webowy o podobnym charakterze (neutralny grotesk). Decyzja builderu.

## 4. Decyzje Macieja (zatwierdzone na makietach)

**Kierunek:** "Studio", jasny. Tło ok. `#fbfbfd`, tekst `#1d1d1f`, szarość drugorzędna `#6e6e73` (kontrast 4.9:1), cienkie linie `#e5e5ea`, przycisk w formie pigułki, ciemny. Wyraźna, ciasna typografia nagłówków (ujemny tracking), dużo oddechu.

**Hero (zatwierdzony):**
- Układ: tekst po lewej, portret po prawej (zaokrąglony prostokąt, pion 4:5), pasek liczb pod spodem.
- Nagłówek, dwa zdania tej samej wielkości: "Wchodzę tam, gdzie boli najbardziej." (kolor tekstu) oraz "Zostaję, aż zespół działa sam." (szare `#6e6e73`, ciemniejsze niż w pierwszej próbie `#86868b`).
- Podnagłówek, większy, z wyraźnym odstępem i cienką linią nad nim: "Forward Deployed Engineer, trener i konsultant. 15 lat w okopach IT."
- Przyciski: główny "Umów rozmowę" (kalendarz), drugi tekstowy "Zobacz szkolenia".
- Pasek liczb: 302 osoby przeszkolone, 664 godziny warsztatów, 43 szkolenia, 15+ lat w inżynierii oprogramowania (bez PHP).
- "W okopach" użyte raz, w podnagłówku. Metafora zostaje.
- Usunąć z hero linię z talentami Gallupa.

**Kolejność strony głównej:**
1. Hero
2. Oferta: cztery wejścia
3. Dowody: liczby i wybrane opinie, z naciskiem na praktykę
4. O mnie, krótko, z linkiem do pełnej strony
5. Blog: trzy ostatnie wpisy
6. Kontakt: jeden wyraźny przycisk do kalendarza

**Oferta, cztery wejścia** (każde zaczyna się od pytania klienta, potem wynik jako tytuł):

| Pytanie | Tytuł (wynik) | Kroki |
|---|---|---|
| Potrzebujesz przebudować legacy? | Zespół, który rozumie swój system i bezpiecznie go zmienia | Rozpoznanie, Działanie, Oddanie |
| Potrzebujesz wdrożyć AI SDLC? | AI, które generuje kod, który da się utrzymać | Rozpoznanie, Działanie, Oddanie |
| Potrzebujesz CTO na część etatu? | Techniczny lider, który wchodzi w kod, bez kosztu etatu CTO | Rozpoznanie, Kierunek i KPI, Prowadzenie w okopach |
| Potrzebujesz samego szkolenia? | Zespół, który wychodzi z umiejętnością, nie z notatkami | Oczekiwania, Program (na miarę), Warsztat (u klienta lub online) |

- Nagłówek sekcji: "Z czym do mnie przychodzą." plus szare "Cztery problemy, cztery sposoby wejścia."
- Układ 2x2, karty z grubą linią na górze, lista trzech kroków z cienkimi liniami, link na dole.
- Karta szkolenia zawiera prawdziwy cytat o praktyce z `testimonials.js` (np. "Dużo praktyki popartej realnymi przykładami.") oraz listę tematów: Event Storming, DDD, Clean Code, refaktoryzacja, SDLC z AI.
- Fraza "AI SDLC" w pytaniu karty AI jest zamierzona (znany termin rynkowy), wynik w tytule. Docelowo parowana ze Spec-Driven Development, który jest wyróżnikiem Macieja.
- Fractional CTO to czwarta karta, bez osobnej podstrony. Kupujący to inna osoba (founder, CEO), więc ton tej karty może się nieco różnić.

**Nowa strona dla uczestników szkoleń:**
- PL `/pl/po-szkoleniu/`, EN `/after-training/`, krótki alias pod kod QR (np. `/po`) dopisany do `_data/redirects.js`.
- Zawartość: materiały po szkoleniu, duży przycisk "Połącz się na LinkedIn", odnośnik do opinii. Cel: uczestnik skanuje QR z ostatniego slajdu i w 5 sekund ląduje na stronie.
- Indeksowanie w wyszukiwarkach tej strony nie jest potrzebne. Propozycja: `noindex`, ale builder może zdecydować inaczej.

## 5. Moje założenia (do potwierdzenia przez Macieja, nie jego słowa)

- Wording opisów kart (legacy, AI, fractional CTO; karta szkolenia jest oparta na jego słowach i prawdziwych opiniach) to mój szkic. Maciej nie potwierdził go wprost. Krok środkowy w kartach legacy i AI nazywa się finalnie "Działanie". Słowo "Operacja" z wcześniejszej wersji makiety nie jest używane.
- Opis i kroki karty **fractional CTO** to mój szkic. Model współpracy nie jest znany.
- Angielskie wersje hero i ofert nie zostały zatwierdzone. Propozycja tłumaczenia hero: "I go in where it hurts most. I stay until the team runs on its own."
- (Rozstrzygnięte: oba motywy, patrz sekcja 9.)
- Pole "co zabierasz ze szkolenia" na stronie po szkoleniu pomijam w pierwszej wersji (brak backendu formularzy, hosting statyczny). Zamiast tego link do opinii (mail lub LinkedIn).
- "15 lat" w hero i "15+" w pasku liczb: ujednolicić do jednego sformułowania (propozycja: "15+").

## 6. Co zostawiam builderowi

- Dobór fontu webowego, skala typografii, dokładne odstępy i promienie.
- Dokładne wartości kolorów ciemnego motywu (punkt wyjścia w sekcji 9).
- Wygląd sekcji 3-6 strony głównej oraz stron wewnętrznych (O mnie, Szkolenia, Kontakt, Blog, wpis): ten sam system co hero i oferta.
- Animacja: co najwyżej jedno wejście hero przy ładowaniu i delikatne reakcje na hover. Bez scroll-jackingu, bez efektów pojawiania się na scroll.
- Przygotowanie obrazu udostępniania (og:image) z nowego zdjęcia. Obecnie używany jest mały `maciej.jpg`.
- Sprawdzenie, które drobiazgi z krytyki z 2026-07-30 nadal obowiązują (favicon, tagi OG, aktywny stan nawigacji, wpis bloga bez ślepego zaułka), i naprawienie ich w ramach redesignu. Krytyka leży w `.impeccable/critique/` katalogu nadrzędnego.

## 7. Jak poznać, że działa

- Na 1440 i 390 pierwszy ekran bez przewijania pokazuje: nagłówek, podnagłówek, przycisk do kalendarza, twarz.
- Sceptyczny CTO rozumie w 10 sekund: kim jest, co robi, dowód.
- Wszystkie istniejące adresy działają, `hreflang` i `sitemap` poprawne, build przechodzi.
- Kontrast tekstu spełnia 4.5:1 w obu motywach, jeśli oba zostają.
- Strony PL i EN mają ten sam układ.

## 8. Znane braki informacji

- Wolumeny wyszukiwań fraz ("AI SDLC", "spec-driven development", "fractional CTO") nie zostały zmierzone: konto SEMrush nie ma API units. Decyzje SEO są założeniem.
- Materiały po szkoleniu (checklista lub cheat sheet) jeszcze nie istnieją. Maciej musi je dostarczyć.
- Lista kontaktów uczestników szkoleń należy do organizatorów (Sages, Altkom), nie do Macieja. Strona po szkoleniu działa bez niej.
- Zdjęcie: selfie. Docelowo warto zrobić profesjonalne.

## 9. Rozstrzygnięcia po przeglądzie (moje decyzje, do sprawdzenia przez Macieja)

- **Kalendarz:** stały link z `CALENDLY` w `site/_data/copy.js`, zwykły link otwierany w nowej karcie, bez embedu. Dotyczy hero, kart oferty i sekcji kontaktu.
- **LinkedIn:** https://www.linkedin.com/in/maciejczerpinski/
- **Języki:** wszystkie strony i nowe sekcje w PL i EN. Angielskie teksty to szkic asystenta, oznaczony do przeglądu. W `testimonials.js` jest po 23 opinie w PL i EN.
- **Opinie na stronie głównej:** builder wybiera 3 do 4 opinii o praktyce z `testimonials.js`. Zostają anonimowe, jak w pliku (rola lub nazwa szkolenia, bez nazwisk i firm). Liczby "23 opinie" nie wyświetlamy w pasku liczb.
- **Font:** darmowy z licencją OFL (Inter lub Geist), hostowany lokalnie. Obecne ładowanie Archivo i JetBrains Mono z Google Fonts wychodzi (prędkość i RODO dla odwiedzających z UE).
- **"15+":** wszędzie "15+", także w podnagłówku hero: "15+ lat w okopach IT".
- **Strona po szkoleniu, wersja 1:** podziękowanie, duży przycisk LinkedIn, link do opinii (mailto). Blok materiałów dodajemy, gdy Maciej je dostarczy. `noindex`, poza `sitemap.xml` i `llms.txt`.
- **Publikacja:** budujemy na szkicach tekstów, ale nic z nieoficjalnie zatwierdzonymi opisami nie idzie na produkcję, dopóki Maciej nie zaakceptuje ich w podglądzie.

## 10. Rozstrzygnięcia Macieja po przeglądzie

- **Motywy: oba** (Maciej sam pracuje w ciemnym i chce, żeby strona dopasowywała się do preferencji). Domyślnie wg `prefers-color-scheme`, z ręcznym przełącznikiem jak dziś (`theme.js`, `localStorage`, bez migania przy ładowaniu). Ciemny wariant zatwierdzony wizualnie na makiecie. Punkt wyjścia ciemnych tokenów: tło `#0b0b0d`, tekst `#f5f5f7`, szarość drugiego zdania `#8e8e93`, tekst pomocniczy `#a1a1a6`, linie `#2c2c2e`, przycisk odwrócony (jasna pigułka `#f5f5f7`, tekst `#1d1d1f`). Jasny: jak w sekcji 4. Wszystko jako tokeny, jeden układ.
- **Fractional CTO** (jego słowa, treść kroków do dopracowania wspólnie): rozpoznanie (poznanie celów), pomoc w zdefiniowaniu wizji i realnych, ale ambitnych KPI, wsparcie zespołu w osiąganiu celów, z udziałem w pracy: "w okopach, nie w wieży z kości słoniowej". Do czasu wspólnego dopracowania procesu karta ma wersję minimalną: pytanie, tytuł, trzy kroki wysokiego poziomu (Rozpoznanie, Kierunek i KPI, Prowadzenie w okopach), przycisk do kalendarza. Szczegółowego procesu i obietnic ponad ten zakres nie wpisujemy.

## 11. Zatwierdzenie i dodatki (2026-11-09)

Maciej zatwierdził dokument. Link do LinkedIn potwierdzony. Dodany zakres:

- **FAQ, dwie części:**
  1. **Skrócone FAQ na dole strony głównej** (4 do 6 pytań), pod sekcją kontaktu lub tuż nad nią, z linkiem "Zobacz wszystkie pytania".
  2. **Osobna podstrona FAQ**: EN `/faq/`, PL `/pl/faq/`. Cel: pozycjonowanie i czytelność dla modeli językowych.
- Dane strukturalne `FAQPage` (JSON-LD) na obu miejscach, wpis w `sitemap.xml` i opis w `llms.txt`. **Nie obiecujemy rozszerzonych wyników w Google** (Google mocno ograniczył FAQ rich results dla zwykłych stron). Wartość to treść odpowiadająca na pytania i łatwa do cytowania przez LLM-y.
- Pytania zaczynają od faktów, które Maciej już podał, np.: czym jest Forward Deployed Engineer; czym fractional CTO różni się od etatowego CTO; czy szkolenia są u klienta czy online (u klienta lub online); jak wygląda przebieg współpracy (rozpoznanie, działanie, oddanie). **Odpowiedzi to szkic, publikacja po akceptacji Macieja.** Pytań wymagających danych, których nie ma (czas trwania, ceny, dostępność), nie piszemy, dopóki Maciej ich nie poda.
- **Decyzja Macieja: kontakt = Calendly.** Główny przycisk "Umów rozmowę" prowadzi do Calendly (`CALENDLY` w `copy.js`). Pod nim drugorzędny link "Wolisz napisać? Mail" (mailto, bez backendu; mój pomysł, Maciej zgodził się na całość). Bez formularza.
- **Poza kodem, do zrobienia przez Macieja w Calendly:** ograniczyć widoczne sloty (kilka okien w tygodniu, minimalny czas z wyprzedzeniem, limit spotkań dziennie), żeby kalendarz nie wyglądał na pusty. Adres mailowy do linku mailto poda Maciej (nie zgaduję).
