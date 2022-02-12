import "@babel/polyfill";
import App from "../app/App.svelte";

import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";
import getConfig from "./config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

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

function errorHelper(err) {
  // if there's a cryptic error, provide more helpful feedback and instructions here
  // TODO: as soon as we get the error codes propagating back, use those
  if (err.message.includes("Cannot deserialize the contract state")) {
    console.warn(
      "NEAR Warning: the contract/account seems to have state that is not (or no longer) compatible.\n" +
        "This may require deleting and recreating the NEAR account as shown here:\n" +
        "https://stackoverflow.com/a/60767144/711863"
    );
  }
  if (err.message.includes("Cannot deserialize the contract state")) {
    console.warn(
      "NEAR Warning: the contract/account seems to have state that is not (or no longer) compatible.\n" +
        "This may require deleting and recreating the NEAR account as shown here:\n" +
        "https://stackoverflow.com/a/60767144/711863"
    );
  }
  console.error(err);
}

// function updateUI() {
//   if (!window.walletConnection.getAccountId()) {
//     Array.from(document.querySelectorAll('.sign-in')).map(it => it.style = 'display: block;');
//   } else {
//     Array.from(document.querySelectorAll('.after-sign-in')).map(it => it.style = 'display: block;');

//     contract.get_num().then(count => {
//       console.log(count)
//     }).catch(err => errorHelper(err));
//   }
// }

// document.querySelector('#plus').addEventListener('click', () => {
//   document.querySelectorAll('button').forEach(button => button.disabled = true);
//   document.querySelector('#show').classList.replace('number','loader');
//   document.querySelector('#show').innerText = '';
//   contract.increment().then(updateUI);
// });
// document.querySelector('#minus').addEventListener('click', () => {
//   document.querySelectorAll('button').forEach(button => button.disabled = true);
//   document.querySelector('#show').classList.replace('number','loader');
//   document.querySelector('#show').innerText = '';
//   contract.decrement().then(updateUI);
// });
// document.querySelector('#a').addEventListener('click', () => {
//   document.querySelectorAll('button').forEach(button => button.disabled = true);
//   document.querySelector('#show').classList.replace('number','loader');
//   document.querySelector('#show').innerText = '';
//   contract.reset().then(updateUI);
// });
// document.querySelector('#c').addEventListener('click', () => {
//   document.querySelector('#left').classList.toggle('eye');
// });
// document.querySelector('#b').addEventListener('click', () => {
//   document.querySelector('#right').classList.toggle('eye');
// });
// document.querySelector('#d').addEventListener('click', () => {
//   document.querySelector('.dot').classList.toggle('on');
// });

// Log in user using NEAR Wallet on "Sign In" button click
// document.querySelector('.sign-in button').addEventListener('click', () => {
//   walletConnection.requestSignIn(nearConfig.contractName, 'Rust Counter Example');
// });

// document.querySelector('.sign-out button').addEventListener('click', () => {
//   walletConnection.signOut();
//   // TODO: Move redirect to .signOut() ^^^
//   window.location.replace(window.location.origin + window.location.pathname);
// });

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
