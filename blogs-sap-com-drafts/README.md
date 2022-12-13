# Notes

Write in Markdown, store images in `assets/`. Produce basic HTML like this:

```shell
pandoc -f markdown-smart -t html --ascii ./2022-12-12-managing-resources-on-sap-btp-what-tool-do-i-choose.md > draft.html
```

Optionally add style as appropriate, e.g. `margin-top: 1.25rem` for `li` elements to address the formatting on blogs.sap.com rendering.
