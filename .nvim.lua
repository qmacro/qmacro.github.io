-- Create a 'description: ...' line to the frontmatter of a post
vim.keymap.set('n', '<leader>dc', 'gg/^---$<cr>Odescription: ')

-- Make a 'description: ...' line from the first sentence
vim.keymap.set('n', '<leader>dm', 'gg/^---$<cr>/\\. <cr>lr<cr>kIdescription: <esc>dd?^---$<cr>P')
