---
title: color/color-named
description: Disallows named colors.
keywords:
  - stylelint
  - color
  - color rules
---

import RulePreamble from '../_preamble.md';
import RulePostamble from '../_postamble.md';

# {frontmatter.title}

<Lede>{frontmatter.description}</Lede>

<RulePreamble category="color" />

```diff
// Do
+ color: var(--p-color-text);
+ fill: var(--p-color-icon)
// Don't
- color: black;
- fill: dimgray;
```

<RulePostamble />
