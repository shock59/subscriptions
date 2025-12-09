<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageServerData } from "./$types";

  let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<div id="account-settings">
  <div class="form-row">
    <a href="/feed" class="link-style-button">Back to your feed</a>
  </div>
  <h2>Account settings</h2>

  <div class="form-row">
    Your user ID is {data.user.id}.
  </div>

  <form method="POST" action="?/changeUsername" use:enhance>
    <div class="form-row">
      <label for="username-input">Username</label>
      <input
        id="username-input"
        name="username"
        type="text"
        defaultValue={data.user.username}
      />
      <button>Update username</button>
    </div>
  </form>
  <form method="POST" action="?/changePassword" use:enhance>
    <div class="form-row">
      <label for="password-input">Password</label>
      <input id="password-input" name="password" type="password" />
      <button>Update password</button>
    </div>
  </form>

  <form method="POST" action="?/logout" use:enhance>
    <div class="form-row">
      <button>Sign out</button>
    </div>
  </form>

  <p style="color: red">{form?.message ?? ""}</p>

  <div class="spacer"></div>
</div>

<style>
  #account-settings {
    max-width: 45em;
    margin: 0 auto;
    margin-top: 1.2em;
  }

  form {
    padding-top: 0.6em;
  }

  .form-row {
    margin: 0;
  }

  .spacer {
    display: flex;
    height: 2.4em;
  }
</style>
