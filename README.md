# Menu book engine (mobile first, no framework)

Reference build: https://itprior-innovations.github.io/alpha-hotel-3d-menu/ (repo itprior-innovations/alpha-hotel-3d-menu).
Static files only. Hosting claims here come from GitHub docs and were not newly verified. No deployment is authorised for RK Beach yet.

## What the customer sees
Book first: course tabs (Starters, Main course, Desserts, Drinks; only courses with dishes show), a veg / non-veg switch, and pages of dishes (one page on phones, two pages on wide screens). Tap a dish to open it full screen (3D if it has a renderer, otherwise its photo). Heart = "I want this", "My picks" shows the list for the waiter (no totals, no ordering, stored on the phone only). First-visit hint. Language select with search.

## Files
- `alpha.js`, `alpha.css`: the engine. `index.html`: entry point.
- `56-menu.json`: restaurant data (the file name is read from `window.MENU_URL`, default `56-menu.json`).
- `51-ui.json`, `ui2.json`: interface text for 12 languages.

## Optional parts (nothing loads unless you add it)
Fonts, model-viewer, the Alpha image map (`window.A`), and the Alpha base64 assets (`window.FISH_FILE`, `window.GLB_PARTS`) are all opt-in. The RK Beach `index.html` loads none of them. Without fonts the engine uses system fonts.

## Menu file
`name`, `brand` (header wordmark, defaults to `name`), optional `tagline` by language, `currency`, and `items`. Per item: `id`, `img` (key in `window.A`) or `imgUrl`, `cat` (`starters` stays Starters; `biryani`, `rice` and unknown values map to Main course; `dessert` and `drink` map to Desserts and Drinks), `veg` (1, 0 or null), `price` (number or null), `n` names by language, `d` descriptions by language, optional `renderer` (plugin name) or `glb` (model-viewer).
Unknown price: `null`, nothing shows, never a fake zero. Unknown diet: `null`, no veg mark, shown only under All.

## Safety and failure handling
Every menu string, id, UI string and image URL is HTML-escaped before display. Image URLs that start with `javascript:` or other `data:` types are dropped. Storage (picks, language, hint) and JSON loading are wrapped in try/catch: if the menu file cannot load the page says "Menu unavailable"; if storage is blocked everything still works for the visit.

## Mount and unmount
`window.MENU_MANUAL=true` before loading the script, then `MenuApp.mount(element)` and `MenuApp.unmount()`. Unmount removes every listener, closes the active renderer, frees the model URL and clears the element. Without the flag it mounts on the page body when the page is ready.

## Renderer plugin contract (for the food 3D component)
Register before mounting: `MenuApp.registerRenderer('name', factory)`. Set `"renderer":"name"` on a menu item.
- `factory({item, lang, rtl, t})` returns an object with `mount(el, {item, lang, rtl, spin})` and `unmount()`.
- The engine calls the factory each time the dish detail opens, gives `el` (a full-size empty div), and calls `unmount()` when the detail closes, the dish changes, the language changes or the app unmounts. `unmount()` must stop animation loops and free GPU memory.
- `t(key)` returns UI text in the active language (unescaped; escape it yourself if you put it in HTML).
- If `mount` throws, the engine shows the dish photo instead.
- Touch and drag inside `el` belongs to the renderer; swiping to the next dish is ignored there.
- Keep it light for phones (the Alpha biryani model is 325 KB). Avoid meshopt or Draco files: they failed in headless Chrome.
The engine does not contain a food renderer. RK Beach's WebGL rice and bowl comes from Sarswathi's side.

## Make a new restaurant
Copy the files, edit `56-menu.json` (only confirmed names, prices, photos), set brand colours at the top of `alpha.css`, test at 390x844. Do not publish until the owner authorises it.
