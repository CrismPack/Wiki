<script setup>
import { VPTeamMembers } from 'vitepress/theme'


const linktreeSvg = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Linktree</title><path d="m13.73635 5.85251 4.00467-4.11665 2.3248 2.3808-4.20064 4.00466h5.9085v3.30473h-5.9365l4.22865 4.10766-2.3248 2.3338L12.0005 12.099l-5.74052 5.76852-2.3248-2.3248 4.22864-4.10766h-5.9375V8.12132h5.9085L3.93417 4.11666l2.3248-2.3808 4.00468 4.11665V0h3.4727zm-3.4727 10.30614h3.4727V24h-3.4727z"/></svg>'

const twitchSvg = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitch</title><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>'

const staff = [
  {
    avatar: 'https://crafthead.net/avatar/ff4cc31a46c84177930f39e523ee1de5',
    name: 'HaXr',
    title: 'Owner',
    links: [
      { icon: {svg: linktreeSvg}, link: 'https://linktr.ee/haxr' },
    ]
  },
  {
    avatar: 'https://crafthead.net/avatar/afb9c3d5bb6c441b98b51eb1f956a34f',
    name: 'Shadow Demon',
    title: 'Head Admin',
    links: [
    ]
  },
  {
    avatar: 'https://crafthead.net/avatar/ad42710c7a3a4f648eca4a2af90fa0d3',
    name: 'pkseahawks',
    title: 'Senior Admin',
    links: [
      { icon: {svg: twitchSvg}, link: 'https://www.twitch.tv/pkseahawkss' },
    ]
  },
  {
    avatar: 'https://crafthead.net/avatar/f730594b1ae64c2a9169f837162c51e4',
    name: 'Soulreaper11',
    title: 'Admin',
    links: [
    ]
  },
  {
    avatar: 'https://crafthead.net/avatar/b8703c8e6c10420e911a27d324eca6fb',
    name: 'C4Mk',
    title: 'Admin',
    links: [
    ]
  }
]
</script>

# Official Server

## Server status
<!-- https://mcstatus.io/docs -->
![Status Widget](https://api.mcstatus.io/v2/widget/java/insomnia.crismpack.net)


## Staff

<VPTeamMembers size="small" :members="staff" />



