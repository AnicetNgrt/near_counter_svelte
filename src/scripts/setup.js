import "@babel/polyfill";
import App from "../app/App.svelte";

import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";

const nearConfig = {
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  contractName: "count.anicet.testnet",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
};

async function connect(nearConfig) {
  // Connects to NEAR and provides `near`, `walletAccount` and `contract` objects in `window` scope
  // Initializing connection to the NEAR node.
  window.near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    },
    ...nearConfig,
  });

  // Needed to access wallet login
  let walletConnection = new nearAPI.WalletConnection(window.near);

  // Initializing our contract APIs by contract name and configuration.
  let contract = await new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read-only – they don't modify the state, but usually return some value
      viewMethods: ["get_num"],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: ["increment", "decrement", "reset"],
      // Sender is the account ID to initialize transactions.
      // getAccountId() will return empty string if user is still unauthorized
      sender: walletConnection.getAccountId(),
    }
  );

  return { contract, walletConnection };
}

// function errorHelper(err) {
//   if (err.message.includes("Cannot deserialize the contract state")) {
//     console.warn(
//       "NEAR Warning: the contract/account seems to have state that is not (or no longer) compatible.\n" +
//         "This may require deleting and recreating the NEAR account as shown here:\n" +
//         "https://stackoverflow.com/a/60767144/711863"
//     );
//   }
//   if (err.message.includes("Cannot deserialize the contract state")) {
//     console.warn(
//       "NEAR Warning: the contract/account seems to have state that is not (or no longer) compatible.\n" +
//         "This may require deleting and recreating the NEAR account as shown here:\n" +
//         "https://stackoverflow.com/a/60767144/711863"
//     );
//   }
//   console.error(err);
// }

window.nearInitPromise = connect(nearConfig)
  .then(({ contract, walletConnection }) => {
    new App({
      target: document.getElementById("root"),
      props: {
        walletConnection,
        contract,
        nearConfig,
      },
    });
  })
  .catch(console.error);
