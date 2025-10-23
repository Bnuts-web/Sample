# campus-images.js

Small helper script used by `branches.html` to convert multiple `<img>` elements inside a `.branch-image` container
into a responsive, lazy-loading slideshow with captions, controls and autoplay.

Features
- Converts multiple images into a simple slideshow (prev/next, dots)
- Uses `loading="lazy"` for images when not already present
- Extracts captions from the `alt` attribute and overlays them
- Autoplays with pause-on-hover and keyboard navigation (arrow keys)
- Minimal CSS is injected automatically; no external dependencies

How to include

Place the script tag before `</body>` in any page that contains `.branch-image` elements:

```html
<script src="js/campus-images.js"></script>
```

Notes & customization
- If a `.branch-image` container has a single `<img>`, the script will simply display it (no controls).
- To customize appearance, override the generated CSS selectors (e.g. `.bnuts-gallery`, `.bnuts-caption`) from your main stylesheet.
- For better performance on slow networks, consider generating and using appropriately sized images (`srcset`) or using modern formats (WebP).

Testing locally

Start a simple HTTP server from the project root and open `branches.html` in a browser:

PowerShell example:

```powershell
# from c:\Users\Michael\OneDrive\Desktop\BNUTS
python -m http.server 8000
# then open http://localhost:8000/branches.html in a browser
```

Accessibility
- Controls use buttons and labels; gallery is focusable and supports arrow key navigation.
- Captions are taken from `alt` attributes — keep them descriptive for screen readers.

Troubleshooting
- If images don't appear, confirm paths in the `src` attributes are correct and files exist in the `campuses/` folder.
- If you prefer not to inject CSS, remove or modify the style block in the script and add your own styles.

License: MIT (feel free to adapt)