---
title: motion/at-rule-disallowed-list
description: Disallows use of CSS @keyframes.
keywords:
  - stylelint
  - motion
  - motion rules
---

import RulePreamble from '../_preamble.md';
import RulePostamble from '../_postamble.md';

# {frontmatter.title}

<Lede>{frontmatter.description}</Lede>

<RulePreamble category="motion" />

```diff
// Do
+ animation: var(--p-motion-keyframes-spin) var(--p-motion-duration-500) linear infinite;
// Don't
- @keyframes spin {
-  from {
-    transform: rotate(0deg);
-  }

-  to {
-    transform: rotate(360deg);
-  }
-}
```

<RulePostamble />
