# Spatial Canvas Pro — BNDR Stripe Wrapper

## Audit

- **Type:** Static SaaS landing wrapper around a locked single-file Spatial Canvas app.
- **1-sentence value:** Turn scattered ideas into connected cards, local saves, exports, and synthesis-ready notes.
- **Literal features surfaced:** New Card, Synthesis, draggable connections, local Save, Export, Undo, Reset, Legend, theme controls, mobile dock behavior, iframe demo.
- **User:** Prompt sellers, builders, operators, and BNDR buyers who need a visible thinking tool.
- **UX model:** Try the embedded canvas, open the full app, then support BNDR through Stripe.

## Design definition

**Tone:** artifact-foundry / tactical cognition  
**Technique:** CSS-generated orbit cards, topographic grid, radial mesh, locked iframe demo  
**Palette:** obsidian dominant with ember and moss accents  
**Layout:** broken-grid hero, offset feature cards, overlapped demo panel  
**Type:** Bricolage Grotesque display + IBM Plex Sans Condensed body

## Files

```text
/app.html      # locked copied source, unmodified
/index.html    # SaaS wrapper
/styles.css    # design system
/site.js       # Stripe modal, copy link, reveal motion
/README.md     # validation + deploy notes
/og-card.svg   # Open Graph image
```

## Stripe

The live support CTA uses:

```text
https://donate.stripe.com/28E28r1JN7cm5VW0Ag0oM04
```

The wrapper uses a local dialog and then sends the user to Stripe's hosted page. It does not iframe Stripe because hosted checkout/payment pages commonly block third-party framing for security.

## Gumroad diagnostic

No Gumroad product URL was provided in the uploaded material. To avoid a fake checkout, this build is Stripe-first as requested by the latest instruction: `STRIPE`.

## SHA-256 lock

Original uploaded source hash:

```text
1d490ac0805c5a4730f07ffa67ea1e3f931ea6399b8e0a00df0b92a7f4062de1
```

Packaged `/app.html` hash after copy:

```text
1d490ac0805c5a4730f07ffa67ea1e3f931ea6399b8e0a00df0b92a7f4062de1
```

## Validation gate

- [x] SHA-256 match confirmed.
- [x] `app.html` unmodified.
- [x] `Support BNDR` Stripe button integrated and connected.
- [x] Wrapper avoids banned font/framework tokens, stock imagery, and default SaaS layout.
- [x] Wrapper uses semantic HTML5 landmarks, visible focus states, skip link, dialog labeling, iframe title, and reduced-motion support.
- [x] Local 0-build deployable.

### Note on banned generic fallback

The locked uploaded `app.html` contains its original font stack. It was not altered because byte preservation is the higher-priority lock. The new wrapper files avoid generic/system font choices as primary design decisions.

## Deploy

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```
