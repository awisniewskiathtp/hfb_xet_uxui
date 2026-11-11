# XET Base UX/UI — prototyp motywów Odoo 20.0

## Cel

`hfb_xet_uxui` jest eksperymentalnym modułem (Proof of Concept) sprawdzającym możliwość wprowadzenia trzech motywów graficznych w całym backendzie Odoo 20.0:

- **Dark Blue** — granatowe powierzchnie i błękitny akcent; motyw domyślny.
- **Light** — jasne powierzchnie i niebieski akcent.
- **Graphite** — grafitowe powierzchnie i turkusowy akcent.

To punkt wyjścia do dalszego rozwoju, a nie gotowy, produkcyjny system skórek.

## Zakres prototypu

- pole `xet_theme` na modelu `res.users`,
- metody RPC odczytu i zapisu preferencji bieżącego użytkownika,
- usługa frontendowa OWL `xet_theme`,
- selektor motywu w obszarze systray,
- zmienne CSS i początkowe reguły SCSS dla wspólnych obszarów backendu,
- zapamiętywanie wyboru na koncie użytkownika.

## Wymagania

- Odoo **20.0**,
- moduł `web`,
- moduł `hfb_xet_base` (deklarowana zależność).

## Instalacja testowa

1. Umieść katalog `hfb_xet_uxui` w jednym z katalogów `addons_path`.
2. Upewnij się, że `hfb_xet_base` jest dostępny i zainstalowany.
3. Zrestartuj usługę Odoo.
4. Zaktualizuj listę aplikacji.
5. Zainstaluj **XET Base UX/UI**.

Przykładowe polecenia (dostosuj nazwę usługi, ścieżki i konfigurację do środowiska):

```bash
sudo systemctl restart odoo
```

Aktualizacja modułu z CLI:

```bash
./odoo-bin -c /etc/odoo.conf -d NAZWA_BAZY -u hfb_xet_uxui --stop-after-init
```

## Używanie

Po zalogowaniu selektor powinien być widoczny w górnym pasku backendu. Zmiana wyboru aktualizuje atrybut `data-xet-theme` na elemencie `html` i zapisuje preferencję w `res.users`.

## Struktura

```text
hfb_xet_uxui/
├── __init__.py
├── __manifest__.py
├── models/
│   ├── __init__.py
│   └── res_users.py
├── static/src/
│   ├── js/
│   │   ├── theme_service.js
│   │   └── theme_selector.js
│   ├── scss/
│   │   └── themes.scss
│   └── xml/
│       └── theme_selector.xml
└── README.md
```

## Architektura

- **Python / ORM:** preferencja użytkownika jest przechowywana w `res.users`.
- **OWL service:** ładuje preferencję podczas uruchamiania klienta i udostępnia metodę zmiany motywu.
- **OWL systray component:** zapewnia prosty selektor.
- **SCSS / CSS variables:** definiuje palety i mapuje je na wybrane elementy backendu.
- **Asset bundle:** pliki są dołączane do `web.assets_backend`.

Moduł nie modyfikuje plików źródłowych Odoo i nie dodaje zależności od jQuery.

## Ograniczenia i punkty do weryfikacji

1. **Pokrycie CSS jest wstępne.** Odoo ma wiele komponentów, które wymagają osobnego dopasowania: dropdowny, dialogi, chatter, kalendarz, kanban, listy, pola relacyjne, selektory dat, powiadomienia i widoki aplikacji.
2. **Kompatybilność selektorów.** Klasy CSS i szczegóły systray należy zweryfikować na konkretnej kompilacji Odoo 20.0.
3. **Testy interfejsu.** Należy sprawdzić kontrast, stany hover/focus/disabled, walidację pól, komunikaty i czytelność wykresów.
4. **Preferencja atrybutu `required`.** Wartość domyślna jest ustawiona w modelu; przy wdrożeniu na bazie z istniejącymi użytkownikami należy potwierdzić zachowanie migracji pola.
5. **RPC i bezpieczeństwo.** Metody operują na `env.user`, a nie na identyfikatorze użytkownika przekazanym przez klienta. Przed produkcją należy dodać testy uprawnień i walidacji.
6. **Dostępność selektora.** Należy sprawdzić jego zachowanie przy wąskim oknie, różnych rozmiarach systray i tłumaczeniach.

## Plan dalszego rozwoju

1. Uruchomić instalację i sprawdzić ładowanie assetów.
2. Zweryfikować działanie selektora i trwałość preferencji po odświeżeniu / ponownym logowaniu.
3. Dopasować SCSS do rzeczywistych komponentów Odoo 20.0.
4. Dodać testy Python i testy frontendowe.
5. Rozważyć obsługę motywu systemowego i ustawień dostępności.
6. Dopiero po stabilizacji warstwy motywów rozpocząć dashboard XET.

## Status

**Prototyp koncepcyjny — nieprzeznaczony do wdrożenia produkcyjnego bez testów i dopracowania selektorów CSS.**
