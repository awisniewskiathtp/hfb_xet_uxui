# XET Base UX/UI — prototyp motywów Odoo 20.0

## Cel

`hfb_xet_uxui` jest eksperymentalnym modułem (Proof of Concept) sprawdzającym możliwość wprowadzenia trzech motywów graficznych w całym backendzie Odoo 20.0:

- **Dark Blue** — granatowe powierzchnie i błękitny akcent; motyw domyślny.
- **Light** — jasne powierzchnie i niebieski akcent.
- **Graphite** — grafitowe powierzchnie i turkusowy akcent.
- **Zgodnie z systemem** — Light albo Dark Blue zależnie od ustawienia jasny/ciemny systemu operacyjnego.

To punkt wyjścia do dalszego rozwoju, a nie gotowy, produkcyjny system skórek.

## Zakres prototypu

- pole `xet_theme` na modelu `res.users` (`user_writeable`, edytowalne przez samego użytkownika),
- metoda RPC `set_xet_theme` zapisująca preferencję bieżącego użytkownika,
- przekazanie preferencji w `session_info` (bez dodatkowego RPC przy starcie),
- zastosowanie motywu w `<head>` przed pierwszym renderem (bez mignięcia domyślnych kolorów),
- wybór motywu w menu użytkownika (avatar) z natychmiastową zmianą,
- pole motywu w „Moje preferencje” oraz w formularzu użytkownika (administrator),
- zmienne CSS i początkowe reguły SCSS dla wspólnych obszarów backendu.

## Wymagania

- Odoo **20.0**,
- moduł `web`.

## Instalacja testowa

1. Umieść katalog `hfb_xet_uxui` w jednym z katalogów `addons_path`.
2. Zrestartuj usługę Odoo.
3. Zaktualizuj listę aplikacji.
4. Zainstaluj **XET Base UX/UI**.

Przykładowe polecenia (dostosuj nazwę usługi, ścieżki i konfigurację do środowiska):

```bash
sudo systemctl restart odoo
```

Aktualizacja modułu z CLI:

```bash
./odoo-bin -c /etc/odoo.conf -d NAZWA_BAZY -u hfb_xet_uxui --stop-after-init
```

## Używanie

Motyw wybiera się w menu użytkownika (avatar w prawym górnym rogu): pozycje „Theme: …”, aktywna oznaczona znakiem ✓. Zmiana działa od razu — aktualizuje atrybuty `data-xet-theme` (motyw efektywny) i `data-xet-theme-pref` (wybrana preferencja) na elemencie `html` — i zapisuje preferencję w `res.users`. Ten sam wybór jest dostępny w „Moje preferencje”; zmiana tam działa po przeładowaniu strony.

Administrator może ustawić motyw dowolnemu użytkownikowi w Ustawienia → Użytkownicy → zakładka Preferencje.

## Struktura

```text
hfb_xet_uxui/
├── __init__.py
├── __manifest__.py
├── models/
│   ├── __init__.py
│   ├── ir_http.py
│   └── res_users.py
├── views/
│   ├── res_users_views.xml
│   └── webclient_templates.xml
├── static/src/
│   ├── js/
│   │   ├── theme.js
│   │   └── user_menu_items.js
│   └── scss/
│       └── themes.scss
└── README.md
```

## Architektura

- **Python / ORM:** preferencja użytkownika jest przechowywana w `res.users`; `ir.http.session_info` przekazuje ją do klienta.
- **QWeb (`web.webclient_bootstrap`):** skrypt w `<head>` ustawia motyw przed pierwszym renderem.
- **JS (`theme.js`):** stan preferencji, rozwiązywanie „Zgodnie z systemem”, zapis przez RPC z wycofaniem przy błędzie.
- **Menu użytkownika (`user_menuitems`):** pozycje wyboru motywu.
- **SCSS / CSS variables:** definiuje palety i mapuje je na wybrane elementy backendu.
- **Asset bundle:** pliki są dołączane do `web.assets_backend`.

Moduł nie modyfikuje plików źródłowych Odoo i nie dodaje zależności od jQuery.

## Ograniczenia i punkty do weryfikacji

1. **Pokrycie CSS jest wstępne.** Odoo ma wiele komponentów, które wymagają osobnego dopasowania: dropdowny, dialogi, chatter, kalendarz, kanban, listy, pola relacyjne, selektory dat, powiadomienia i widoki aplikacji.
2. **Kompatybilność selektorów.** Klasy CSS i szczegóły systray należy zweryfikować na konkretnej kompilacji Odoo 20.0.
3. **Testy interfejsu.** Należy sprawdzić kontrast, stany hover/focus/disabled, walidację pól, komunikaty i czytelność wykresów.
4. **Preferencja atrybutu `required`.** Wartość domyślna jest ustawiona w modelu; przy wdrożeniu na bazie z istniejącymi użytkownikami należy potwierdzić zachowanie migracji pola.
5. **RPC i bezpieczeństwo.** Metoda operuje na `env.user`, a nie na identyfikatorze użytkownika przekazanym przez klienta. Przed produkcją należy dodać testy uprawnień i walidacji.
6. **Menu użytkownika.** Należy sprawdzić czytelność pozycji motywu przy wąskim oknie i w tłumaczeniach.

## Plan dalszego rozwoju

1. Uruchomić instalację i sprawdzić ładowanie assetów.
2. Zweryfikować działanie wyboru w menu użytkownika i trwałość preferencji po odświeżeniu / ponownym logowaniu.
3. Dopasować SCSS do rzeczywistych komponentów Odoo 20.0.
4. Dodać testy Python i testy frontendowe.
5. Domyślny motyw ustawiany przez administratora (Settings).
6. Dopiero po stabilizacji warstwy motywów rozpocząć dashboard XET.

## Status

**Prototyp koncepcyjny — nieprzeznaczony do wdrożenia produkcyjnego bez testów i dopracowania selektorów CSS.**
