# 3D Wristband Plate Designer

Live Three.js demo for a curved wristband plate with editable front and back typography, silver/gold material presets, rounded corners, bend controls, and shareable URL state.

## Live Demo

The project is published on GitHub Pages at:

https://astrixgame.github.io/wristband-creator

## Features

- Mouse-driven orbit controls for inspecting the plate
- Live plate controls for material preset, color, shininess, width, height, thickness, bend angle, and corner rounding
- Separate front and back text settings for font, font size, weight, style, transform, letter spacing, and margins
- URL-synced state so the current design can be shared and restored
- Google Fonts loading for the selected typeface

## Run It

Open `index.html` in a browser that supports ES modules and WebGL.

If you are using the published site, open the GitHub Pages URL above instead of a local file.

## Project Files

- `index.html` - page markup, SEO metadata, and the app mount point
- `style.css` - layout and control panel styling
- `script.js` - Three.js scene setup, rendering, controls, and URL state sync

## URL Parameters

The app reads and writes its state from query parameters. Plate settings use the `p_` prefix, while front and back text settings use `f_` and `b_` prefixes.

Plate params:

- `p_mat` - plate material preset. `silver`, `gold`, or `custom`
- `p_col` - plate base color as a hex value
- `p_sh` - shininess from `0` to `100`
- `p_w` - plate width
- `p_h` - plate height
- `p_d` - plate thickness
- `p_ba` - bend angle in degrees
- `p_cr` - corner radius
- `p_cm` - corner mode. `none`, `all`, `top`, `bottom`, `left`, `right`, `top-left`, `top-right`, `bottom-left`, or `bottom-right`

Front text params:

- `f_text` - text shown on the front side
- `f_font` - font family name
- `f_fs` - font size
- `f_ls` - letter spacing
- `f_fw` - font weight
- `f_fst` - font style. `normal` or `italic`
- `f_tt` - text transform. `none`, `uppercase`, `lowercase`, or `capitalize`
- `f_mt` - top margin
- `f_mr` - right margin
- `f_mb` - bottom margin
- `f_ml` - left margin

Back text params:

- `b_text` - text shown on the back side
- `b_font` - font family name
- `b_fs` - font size
- `b_ls` - letter spacing
- `b_fw` - font weight
- `b_fst` - font style. `normal` or `italic`
- `b_tt` - text transform. `none`, `uppercase`, `lowercase`, or `capitalize`
- `b_mt` - top margin
- `b_mr` - right margin
- `b_mb` - bottom margin
- `b_ml` - left margin

## Notes

- The demo loads Three.js, OrbitControls, and the RoomEnvironment helper from CDN URLs.
- Material presets automatically switch the plate color between silver and gold, while custom color keeps the selected hex value.
