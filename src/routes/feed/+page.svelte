<script lang="ts">
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();
</script>

<p>subscriptions</p>
<ul>
  {#each data.subscriptions as subscription}
    <li>{subscription.youtubeName}</li>
  {/each}
</ul>
