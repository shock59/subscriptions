<script lang="ts">
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import type { PageServerData } from "./$types";

  let { data }: { data: PageServerData } = $props();

  let addSubscriptionDialog: HTMLDialogElement;

  let subscriptions: SubscriptionData[] = $state([]);
  let allVideos: (Video & { channelName: string })[] = $state([]);
  let addSubscriptionFormError: string = $state("");

  function youtubeThumbnail(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  function updateAllVideos() {
    allVideos = subscriptions.flatMap((subscription) =>
      subscription.videos.map((video) => ({
        ...video,
        channelName: subscription.name,
      })),
    );
  }

  onMount(() => {
    subscriptions = data.subscriptions;
    updateAllVideos();
  });
</script>

<div id="header">
  <div id="header-content">
    <b>Your feed</b>

    <button
      class="link-style-button"
      onclick={() => addSubscriptionDialog.showModal()}
      >Manage subscriptions</button
    >
  </div>
</div>

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

<dialog id="add-subscription-dialog" bind:this={addSubscriptionDialog}>
  <div class="dialog-header">
    <b>Add Subscription</b>
    <button
      class="link-style-button"
      onclick={() => addSubscriptionDialog.close()}>Close</button
    >
  </div>

  <form
    method="post"
    action="?/addSubscription"
    use:enhance={() => {
      return async ({ result }) => {
        if (result.type == "failure") {
          addSubscriptionFormError =
            (result.data?.message as string) ?? `Error ${result.status}`;
        } else if (result.type == "success") {
          subscriptions =
            (result.data?.subscriptions as SubscriptionData[]) ?? [];
          updateAllVideos();
          addSubscriptionDialog.close();
        }
      };
    }}
  >
    <div class="form-row">
      <label for="youtube-url-input">YouTube Channel URL</label>
      <input id="youtube-url-input" name="youtube-url" type="text" />
    </div>

    <div class="form-row">
      <button type="submit">Submit</button>

      <span class="error">{addSubscriptionFormError}</span>
    </div>
  </form>

  <div class="dialog-header">
    <b>Current subscriptions</b>
  </div>

  {#each subscriptions.toSorted( (a, b) => a.name.localeCompare(b.name), ) as subscription}
    <div class="form-row">{subscription.name}</div>
  {/each}
</dialog>

<style>
  #header {
    width: calc(100%);
    background: #202020;
  }

  #header-content {
    max-width: 62.6em;
    padding: 0.6em 1.2em;
    display: flex;
  }

  .link-style-button {
    margin: 0;
    margin-left: auto;
    padding: 0;
    background: none;
    border: none;
    outline: none;
    color: inherit;
    font: inherit;
  }

  .link-style-button:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  #videos-container {
    max-width: 65em;
  }
  #header-content,
  #videos-container {
    margin: 0 auto;
  }

  .video {
    height: 10rem;
    margin: 0.6em 1.2em;
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
    font-family: var(--serif);
    font-size: 24px;
    font-weight: 700;
  }

  .video-description {
    opacity: 0.65;
  }

  dialog {
    width: 45em;
    padding: 0;
    border: none;
    background: #101010;
    color: inherit;
  }

  dialog::backdrop {
    background: rgb(0, 0, 0, 0.65);
  }

  .dialog-header {
    width: calc(100% - 2.4em);
    padding: 0.6em 1.2em;
    display: flex;
    background: #202020;
  }

  .form-row {
    display: flex;
    align-items: center;
    margin: 0.6em 1.2em;
  }

  .form-row label {
    margin-right: 0.6em;
  }

  .form-row input {
    flex-grow: 1;
  }

  input,
  button {
    padding: 0.6em 1.2em;
    background: #202020;
    border: none;
    outline: none;
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  .form-row .error {
    margin-left: 0.6em;
    color: #ff5454;
  }
</style>
