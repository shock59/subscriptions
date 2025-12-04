<script lang="ts">
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();

  let allVideos: (Video & { channelName: string })[] = $state([]);

  onMount(() => {
    allVideos = data.subscriptions.flatMap((subscription) =>
      subscription.videos.map((video) => ({
        ...video,
        channelName: subscription.name,
      })),
    );
  });
</script>

<ul>
  {#each allVideos.toSorted((a, b) => (b.published?.getTime() ?? 0) - (a.published?.getTime() ?? 0)) as video}
    <li>
      <a href={video.link}>{video.title}</a> - {video.channelName} ({video.published?.toDateString()})
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
