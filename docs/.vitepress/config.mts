import { defineConfig } from 'vitepress'




import { readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';


// Utility function to capitalize the first letter
function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}


// Dynamically get sidebar pages (Custom function)
function getSidebarItems(folder: string, baseUrl: string): any[] {
  const folderPath = resolve(folder);
  const items = readdirSync(folderPath)
    .filter((file) => !file.startsWith('_') && !file.startsWith('.')) // Exclude hidden files or files starting with `_`
    .map((file) => {
      const fullPath = join(folderPath, file);
      const isDirectory = statSync(fullPath).isDirectory();
      const name = capitalizeFirstLetter(file.replace(/\.md$/, '')); // Remove `.md` extension

      if (isDirectory) {
        const formattedName = name.toLowerCase() === 'changelogs' ? 'CHANGELOGS' : name; // Make "changelogs" uppercase
        return {
          text: formattedName,
          collapsed: true,
          items: getSidebarItems(fullPath, `${baseUrl}/${name}`),
        };
      } else {
        return {
          text: name,
          link: `${baseUrl}/${name}`,
        };
      }
    })
    .sort((a, b) => {
      // Sorting in descending order based on `text` property
      if (a.text < b.text) return 1;
      if (a.text > b.text) return -1;
      return 0;
    });

  return items;
}


// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/Wiki',
  title: "Crism Modpacks",
  appearance: 'dark',

  ignoreDeadLinks: true,

  head: [[
    'link',
    {rel: 'icon', sizes: '32x32', href: '/Wiki/assets/logo.webp'},
  ]],

  //description: "Here you will find information about our modpacks and the changes we make to them throughout each version.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Breakneck', link: '/breakneck/introduction' },
      { text: 'Insomnia', link: '/insomnia/introduction' }
    ],
    logo: "/assets/logo.webp",

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
              items: getSidebarItems('./docs/breakneck/changelogs', '/breakneck/changelogs'),
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
              text: 'Performance Tips', 
              link: '/insomnia/performance' 
            },
            {
              text: 'Changelogs',
              items: getSidebarItems('./docs/insomnia/changelogs', '/insomnia/changelogs'),
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
      { icon: 'kofi', link: 'https://ko-fi.com/haxr_dev' }
    ],
  }
})
