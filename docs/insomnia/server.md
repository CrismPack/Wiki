<script setup>
import { VPTeamMembers } from 'vitepress/theme'


const linktreeSvg = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Linktree</title><path d="m13.73635 5.85251 4.00467-4.11665 2.3248 2.3808-4.20064 4.00466h5.9085v3.30473h-5.9365l4.22865 4.10766-2.3248 2.3338L12.0005 12.099l-5.74052 5.76852-2.3248-2.3248 4.22864-4.10766h-5.9375V8.12132h5.9085L3.93417 4.11666l2.3248-2.3808 4.00468 4.11665V0h3.4727zm-3.4727 10.30614h3.4727V24h-3.4727z"/></svg>'


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

<img id="refreshable-image" src="https://api.mcstatus.io/v2/widget/java/insomnia.crismpack.net" alt="Auto-refreshing image" />


<script>
  function refreshImage() {
    const img = document.getElementById('refreshable-image');
    if (img) {
      const url = new URL(img.src, window.location.origin);
      url.searchParams.set('_t', Date.now()); // Add or update the `_t` query parameter with the current timestamp
      
      // Create a new Image object to preload the updated image
      const newImg = new Image();
      newImg.src = url.toString();

      // Once the new image is loaded, update the `src` of the current image
      newImg.onload = () => {
        img.src = newImg.src;
      };
    }
  }

  // Refresh the image every 5 seconds
  setInterval(refreshImage, 10000);
</script>


## Staff

<VPTeamMembers size="small" :members="staff" />



