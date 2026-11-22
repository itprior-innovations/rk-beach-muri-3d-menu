# RK Beach Muri Mixture: mobile-first 3D menu (DEMO, unconfirmed vendor data)

Live reference: https://itprior-innovations.github.io/alpha-hotel-3d-menu/
Repo: https://github.com/itprior-innovations/alpha-hotel-3d-menu

Static site. No build step, no backend, no framework. Host on GitHub Pages.

## Entry point
`index.html` loads fonts, `alpha.css`, the model-viewer script (CDN), defines `window.A`, then runs `alpha.js`.
`alpha.js` replaces `document.body` with the whole UI (header, dish stage, thumbnail rail, language sheet, search sheet).

## Files
- `alpha.js`, `alpha.css`: the engine (about 15 KB together).
- `56-menu.json` (starter RK Beach file): restaurant name, place, currency, categories, items.
- `51-ui.json` + `ui2.json`: UI strings per language (12 languages). Add a language by adding a key to both.
- `window.A` in `index.html`: map from item `img` name to image file name.
- `fish.b64.txt`, `dish.b64.1.txt`, `dish.b64.2.txt`: optional base64 data. See "Model loading".

## Menu schema
Per item: `id`, `img` (key into `window.A`), `glb` (non-empty = item has a 3D model, empty = photo card with "3D scan coming soon"), `cat` (one of `cats`), `veg` (1 or 0), `price` (number), `n` (names by language code), `d` (descriptions by language code). Missing language falls back to `en`.
Right-to-left: only `ar` is flagged in `RTL` at the top of `alpha.js`.
URL options: `?lang=hi` picks a language, `?open=<item id>` opens a dish.

## Integration steps for a new restaurant
1. Copy `engine/` to a new repo root. Edit `56-menu.json` (the name `alpha.js` fetches).
2. Edit `menu.json` with vendor-confirmed names, prices, categories.
3. Put dish photos (webp, under 100 KB each) in the repo and list them in `window.A` in `index.html`.
4. Replace the header wordmark (`ALPHA HOTEL` text in `alpha.js`) and the CSS colour variables at the top of `alpha.css` with the vendor brand.
5. Add 3D models (below), set `glb` on that item.
6. Turn on GitHub Pages (branch main, root). Test at 390x844.

## Model loading constraints (learned the hard way)
- Format: binary glTF (.glb). Keep each under about 400 KB. Alpha biryani is 325 KB.
- Use quantize + 1024px webp textures + simplify (gltf-transform: `optimize --compress quantize --texture-compress webp --texture-size 1024 --simplify-ratio 0.6`).
- Do NOT use meshopt or Draco compression: it failed to load in headless Chrome and adds decoder downloads.
- Current engine loads one glb, from base64 text chunks (each file under 256 KB, because the GitHub web editor limits pasted text). Direct `.glb` upload via the web editor is unreliable; with git push you can serve the `.glb` directly and set `src` to its URL in `alpha.js` (look for `<model-viewer src=`). Generalising to one glb per item is a small edit.
- GitHub Pages limits: 1 GB site, 100 GB/month, 10 builds/hour, no commercial transactions.
- Procedural 3D component from Sarswathi's side: if it is a self-contained web component or three.js module, load it in `alpha.js` in place of the `<model-viewer>` string for that item.

## Making 3D models for free
Image to 3D from a clean photo with HuggingFace Spaces (TRELLIS gave the best result). Anonymous ZeroGPU quota is small (a few runs per day). Photos here are AI-made, so results are illustrative.
