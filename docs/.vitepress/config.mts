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


const kofiSvg = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Ko-fi</title><path d="M11.351 2.715c-2.7 0-4.986.025-6.83.26C2.078 3.285 0 5.154 0 8.61c0 3.506.182 6.13 1.585 8.493 1.584 2.701 4.233 4.182 7.662 4.182h.83c4.209 0 6.494-2.234 7.637-4a9.5 9.5 0 0 0 1.091-2.338C21.792 14.688 24 12.22 24 9.208v-.415c0-3.247-2.13-5.507-5.792-5.87-1.558-.156-2.65-.208-6.857-.208m0 1.947c4.208 0 5.09.052 6.571.182 2.624.311 4.13 1.584 4.13 4v.39c0 2.156-1.792 3.844-3.87 3.844h-.935l-.156.649c-.208 1.013-.597 1.818-1.039 2.546-.909 1.428-2.545 3.064-5.922 3.064h-.805c-2.571 0-4.831-.883-6.078-3.195-1.09-2-1.298-4.155-1.298-7.506 0-2.181.857-3.402 3.012-3.714 1.533-.233 3.559-.26 6.39-.26m6.547 2.287c-.416 0-.65.234-.65.546v2.935c0 .311.234.545.65.545 1.324 0 2.051-.754 2.051-2s-.727-2.026-2.052-2.026m-10.39.182c-1.818 0-3.013 1.48-3.013 3.142 0 1.533.858 2.857 1.949 3.897.727.701 1.87 1.429 2.649 1.896a1.47 1.47 0 0 0 1.507 0c.78-.467 1.922-1.195 2.623-1.896 1.117-1.039 1.974-2.364 1.974-3.897 0-1.662-1.247-3.142-3.039-3.142-1.065 0-1.792.545-2.338 1.298-.493-.753-1.246-1.298-2.312-1.298"/></svg>'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  title: "Crism Modpacks",
  appearance: 'dark',
  
  ignoreDeadLinks: true,

  head: [[
    'link',
    {rel: 'icon', sizes: '32x32', href: '/Wiki/assets/logo.webp'},
  ]],

  description: "Here you will find information about our modpacks and the changes we make to them throughout each version.",
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { 
        text: 'Breakneck', 
        link: '/breakneck/introduction',
        activeMatch: '/breakneck/'
      },
      { 
        text: 'Insomnia', 
        link: '/insomnia/introduction',
        activeMatch: '/insomnia/'
      }
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
              text: 'Official Server', 
              link: '/insomnia/server' 
            },
            {
              text: 'Changelogs',
              items: getSidebarItems('./docs/insomnia/changelogs', '/insomnia/changelogs'),
            },
            { 
              text: 'Modlist', 
              link: '/insomnia/modlist' 
            },
            { 
              text: 'Trello Board', 
              link: 'https://trello.com/b/DTmlSKCi/insomnia-hardcore-1201' 
            }
          ]
        },
      ]
    },

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/Kss5gBgeDA' },
      { 
        icon: {svg: kofiSvg}, 
        link: 'https://ko-fi.com/haxr_dev' 
      }
    ]
  }
})