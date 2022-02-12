<script>
  export let walletConnection;
  export let contract;
  export let nearConfig;

  let connected = false;
  let accountId = "";

  let counter = 0;

  async function updateUI() {
    accountId = walletConnection.getAccountId();
    connected = !!accountId;

    if (connected) {
      counter = await contract.get_num();
    }
  }

  async function signIn() {
    await walletConnection.requestSignIn(
      nearConfig.contractName,
      "Rust Counter Example"
    );
    updateUI();
  }

  function signOut() {
    walletConnection.signOut();
    updateUI();
  }

  updateUI();
</script>

<div class="">
  <h1>This is just a counter, but this time on blockchain!</h1>

  {#if connected}
    <h1>Counter: {counter}</h1>
    <button on:click={signOut}>Sign Out</button>
  {:else}
    <p>You'll need to sign in to call contract methods:</p>
    <button on:click={signIn}>Sign In</button>
  {/if}
</div>
