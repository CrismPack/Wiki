import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/GitBook/',
  title: "Crism Modpacks",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Wiki', link: '/markdown-examples' }
    ],

    sidebar: [
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' }
      //   ]
      // },
      {
        text: 'Insomnia: Hardcore',
        link: '/insomnia/introduction.md',
        items: [
          {
            text: 'Changelogs',
            items: [   
              { text: '1.20.1', link: '/insomnia/changelogs/1.20' },
              { text: '1.18.2', link: '/insomnia/changelogs/1.18' }
            ]
          },
          { 
            text: 'Modlist', 
            link: '/breakneck/modlist' 
          }
        ]
      },
      {
        text: 'Breakneck: Optimized',
        items: [
          {
            text: 'Changelogs',
            items: [   
              { text: '1.21', link: '/breakneck/changelogs/1.21' },
              { text: '1.20', link: '/breakneck/changelogs/1.20' },
              { text: '1.19', link: '/breakneck/changelogs/1.19' },
              { text: '1.18', link: '/breakneck/changelogs/1.18' }
            ]
          },
          { 
            text: 'Modlist', 
            link: '/breakneck/modlist' 
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
  }
})
