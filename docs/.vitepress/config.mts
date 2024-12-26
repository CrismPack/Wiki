import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/Wiki',
  title: "Crism Modpacks",

  //description: "Here you will find information about our modpacks and the changes we make to them throughout each version.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Breakneck', link: '/breakneck/introduction' },
      { text: 'Insomnia', link: '/insomnia/introduction' }
    ],
    logo: "/assets/logo-small.png",

    sidebar: {
      '/breakneck/': [
        {
          text: 'Breakneck: Optimized',
          //link: '/breakneck/introduction',
          items: [
            { 
              text: 'Introduction', 
              link: '/breakneck/introduction' 
            },
            {
              text: 'Changelogs',
              // collapsed: true,
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

      '/insomnia/': [
        {
          text: 'Insomnia: Hardcore',
          //link: '/insomnia/introduction',
          items: [
            { 
              text: 'Introduction', 
              link: '/insomnia/introduction' 
            },
            {
              text: 'Changelogs',
              items: [   
                { text: '1.20.1', link: '/insomnia/changelogs/1.20' },
                { text: '1.18.2', link: '/insomnia/changelogs/1.18' }
              ]
            },
            { 
              text: 'Modlist', 
              link: '/insomnia/modlist' 
            }
          ]
        },
      ]
    },


    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/Kss5gBgeDA' },
      { icon: 'kofi', link: 'https://ko-fi.com/haxr_dev' },
    ],
  }
})
