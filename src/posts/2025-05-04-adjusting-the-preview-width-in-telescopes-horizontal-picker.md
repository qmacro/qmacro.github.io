---
layout: post
title: Adjusting the preview width in Telescope's horizontal picker
date: 2025-05-04
tags:
  - telescope
  - neovim
  - lua
---
*Here's how I adjusted the width of the preview window in Telescope's horizontal picker.*

The [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim) plugin is pretty spectacular and has many features that I haven't had chance to explore yet. There are a set of building blocks from which the features are constructed, falling into various categories such as Pickers, Previewers, Sorters, Layouts and Themes.

I found that the defaults work pretty well for me and my simple needs, including the layouts. When there is enough horizontal space, the horizontal picker is used, which has a layout like this (see `:help telescope.layout.horizontal()`):

```text
┌──────────────────────────────────────────────────┐
│                                                  │
│    ┌───────────────────┐┌───────────────────┐    │
│    │                   ││                   │    │
│    │                   ││                   │    │
│    │                   ││                   │    │
│    │      Results      ││                   │    │
│    │                   ││      Preview      │    │
│    │                   ││                   │    │
│    │                   ││                   │    │
│    └───────────────────┘│                   │    │
│    ┌───────────────────┐│                   │    │
│    │      Prompt       ││                   │    │
│    └───────────────────┘└───────────────────┘    │
│                                                  │
└──────────────────────────────────────────────────┘
```

The only thing was that in some cases (depending on my current font and terminal size) the Preview was actually narrower than the Results and Prompt. This makes a lot of sense for those wanting to see more of the file paths, but I wanted to see more of the file contents, and therefore decided to force increase the size of the Preview width.

This is what it looked like out of the box:

![telescope horizontal layout with preview width at around 40%](/images/2025/05/telescope-preview-width-60-40.png)

With some [simple configuration](https://github.com/qmacro/dotfiles/commit/c8dbd4675790808e555d197e38ef67526860637e) in my `lua/config/plugins/telescope.lua` file:

```lua
return {
  {
    'nvim-telescope/telescope.nvim',
    ...
    config = function()
      require("telescope").setup {
        defaults = {
          layout_strategy = 'horizontal',
          layout_config = { preview_width = 0.6 }
        }
      }
    end
  },
}
```

I got what I was looking for, which was this:

![telescope horizontal layout with preview width at around 60%](/images/2025/05/telescope-preview-width-40-60.png)

Nice!
