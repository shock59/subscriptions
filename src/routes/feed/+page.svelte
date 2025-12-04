<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();
</script>

<h2>Your subscriptions</h2>
<ul>
  {#each data.subscriptions as subscription}
    <li>
      {subscription.name}
      <ul>
        {#each subscription.videos as video}
          <li><a href={video.link}>{video.title}</a></li>{/each}
      </ul>
    </li>
  {/each}
</ul>

<h2>Add a subscription</h2>
<form method="post" action="?/addSubscription" use:enhance>
  <p>
    <label for="youtube-url-input">YouTube Channel URL</label>
    <input id="youtube-url-input" name="youtube-url" type="text" />
  </p>

  <p>
    <button type="submit">Submit</button>
  </p>
</form>
