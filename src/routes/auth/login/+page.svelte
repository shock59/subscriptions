<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  let { form }: { form: ActionData } = $props();
</script>

<main>
  <h1>Login/Register</h1>
  <form method="post" action="?/login" use:enhance>
    <p>
      <label>
        Username
        <input name="username" />
      </label>
    </p>

    <p>
      <label>
        Password
        <input type="password" name="password" />
      </label>
    </p>

    <p>
      <button>Login</button>
      <button formaction="?/register">Register</button>
    </p>
  </form>
  <p style="color: red">{form?.message ?? ""}</p>
</main>

<style>
  main {
    text-align: center;
  }
</style>
