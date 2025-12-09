<script lang="ts">
  import "./style.css";
  import faviconLight from "$lib/assets/favicon/light.png";
  import faviconDark from "$lib/assets/favicon/dark.png";

  let { children } = $props();
</script>

<svelte:head>
  <title>Subscriptions</title>
  <link rel="icon" href={faviconLight} type="image/x-icon" />
  <link
    rel="icon"
    href={faviconLight}
    type="image/x-icon"
    media="(prefers-color-scheme: light)"
  />
  <link
    rel="icon"
    href={faviconDark}
    type="image/x-icon"
    media="(prefers-color-scheme: dark)"
  />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{@render children()}
