<script>
  import { resolve } from "$app/paths";
</script>

<main>
  <h1>Welcome to Subscriptions</h1>
  <p>
    Keep track of your favourite YouTube channels without needing a YouTube
    account.
  </p>

  <p>
    <a class="white" href={resolve("/auth/login")}
      ><button>Sign up/Log in</button></a
    >
  </p>

  <br />

  <p>
    This service can be useful if you enjoy using YouTube and staying up to date
    with your favourite creators, but don't want to sign up for a Google account
    (or can't because of a ban in your country).
  </p>

  <p>Created by <a href="https://samv.me">Sam V</a></p>
</main>

<style>
  main {
    text-align: center;
  }

  a.white {
    color: inherit;
  }
</style>
