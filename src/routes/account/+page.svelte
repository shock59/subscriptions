<div id="account-settings">
  <div class="form-row">
    <a href="/feed" class="link-style-button">Back to your feed</a>
  </div>
  <h2>Account settings</h2>

  <form>
    <div class="form-row">
      <label for="username-input">Username</label>
      <input id="username-input" type="text" />
      <button>Update username</button>
    </div>
  </form>
  <form>
    <div class="form-row">
      <label for="password-input">Password</label>
      <input id="password-input" type="password" />
      <button>Update password</button>
    </div>
  </form>

  <form>
    <div class="form-row">
      <button>Sign out</button>
    </div>
  </form>

  <div class="spacer"></div>

  <form>
    <div class="form-row">
      <button>Delete account</button>
    </div>
  </form>
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
