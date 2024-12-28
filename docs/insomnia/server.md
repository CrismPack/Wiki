<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const staff = [
  {
    avatar: 'https://crafthead.net/avatar/ff4cc31a46c84177930f39e523ee1de5',
    name: 'HaXr',
    title: 'Owner',
    links: [
      { icon: 'linktree', link: 'https://linktr.ee/haxr' },
    ]
  },
  {
    avatar: 'https://crafthead.net/avatar/afb9c3d5bb6c441b98b51eb1f956a34f',
    name: 'Shadow Demon',
    title: 'Head Admin',
    links: [
      { icon: '', link: '' },
    ]
  },
  {
    avatar: 'https://crafthead.net/avatar/ad42710c7a3a4f648eca4a2af90fa0d3',
    name: 'pkseahawks',
    title: 'Senior Admin',
    links: [
      { icon: '', link: '' },
    ]
  },
  {
    avatar: 'https://crafthead.net/avatar/f730594b1ae64c2a9169f837162c51e4',
    name: 'Soulreaper11',
    title: 'Admin',
    links: [
      { icon: '', link: '' },
    ]
  },
  {
    avatar: 'https://crafthead.net/avatar/b8703c8e6c10420e911a27d324eca6fb',
    name: 'C4Mk',
    title: 'Admin',
    links: [
      { icon: '', link: '' },
    ]
  }
]
</script>

# Official Server

## Staff

<!-- Say hello to our awesome team. -->

<VPTeamMembers size="small" :members="staff" />



