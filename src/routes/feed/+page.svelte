<script lang="ts">
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();

  let allVideos: (Video & { channelName: string })[] = $state([]);

  function youtubeThumbnail(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  onMount(() => {
    allVideos = data.subscriptions.flatMap((subscription) =>
      subscription.videos.map((video) => ({
        ...video,
        channelName: subscription.name,
      })),
    );
  });
</script>

<div id="videos-container">
  {#each allVideos.toSorted((a, b) => (b.published?.getTime() ?? 0) - (a.published?.getTime() ?? 0)) as video}
    <a href={video.link} class="video">
      <img
        class="video-thumbnail"
        src={youtubeThumbnail(video.id)}
        alt="Video thumbnail"
      />
      <div class="video-text">
        <div class="video-title">{video.title}</div>
        <div class="video-description">
          {video.channelName} • {video.published?.toDateString()}
        </div>
      </div>
    </a>
  {/each}
</div>

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

<style>
  #videos-container {
    font-size: 16px;
    margin: 0 1.2rem;
  }

  .video {
    height: 10rem;
    margin: 0.6rem 0;
    display: flex;
    flex-direction: row;
    color: inherit;
    text-decoration: none;
  }

  .video-thumbnail {
    width: 17.8rem;
    height: 10rem;
    margin-right: 1.2rem;
  }

  .video-title {
    font-size: 24px;
    font-weight: bold;
  }

  .video-description {
    opacity: 0.65;
  }
</style>
