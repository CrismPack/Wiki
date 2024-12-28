
<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const launchers = [
  {
    avatar: './assets/curseforge.png',
    name: 'CurseForge Launcher',
    title: '',
    links: [
      { icon: 'bisecthosting', link: 'https://www.bisecthosting.com/clients/index.php?rp=/knowledgebase/305/How-to-allocate-more-ram-in-the-CurseForge-launcher.html' },
    ]
  },
  {
    avatar: './assets/modrinth.avif',
    name: 'Modrinth Launcher',
    title: '',
    links: [
      { icon: 'bisecthosting', link: 'https://www.bisecthosting.com/clients/index.php?rp=/knowledgebase/573/How-to-allocate-more-ram-in-the-Modrinth-launcher.html' },
    ]
  },
  {
    avatar: './assets/atlauncher.png',
    name: 'ATLauncher',
    title: '',
    links: [
      { icon: 'bisecthosting', link: 'https://www.bisecthosting.com/clients/index.php?rp=/knowledgebase/307/How-to-allocate-more-ram-in-the-ATLauncher.html' },
    ]
  },
  {
    avatar: './assets/multimc.avif',
    name: 'MultiMC & Prism Launcher',
    title: '',
    links: [
      { icon: 'bisecthosting', link: 'https://www.bisecthosting.com/clients/index.php?rp=/knowledgebase/613/How-to-allocate-more-ram-in-the-MultiMC-launcher.html' },
    ]
  },
  {
    avatar: './assets/gdlauncher.avif',
    name: 'GDLauncher',
    title: '',
    links: [
      { icon: 'bisecthosting', link: 'https://www.bisecthosting.com/clients/index.php?rp=/knowledgebase/306/How-to-allocate-more-ram-within-GDLauncher.html' },
    ]
  }
]
</script>

# How to allocate more RAM

Check out a tutorial for your respective launcher:

<VPTeamMembers size="medium" :members="launchers" />


