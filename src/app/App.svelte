<script>
    import Panel from "./Panel.svelte"
    import Button from "./Button.svelte"

    export let walletConnection
    export let contract
    export let nearConfig

    let loading = false
    let connected = false
    let accountId = ""

    let counter = 0

    async function updateUI() {
        accountId = walletConnection.getAccountId()
        connected = !!accountId

        if (connected) {
            counter = await contract.get_num()
        }
    }

    async function signIn() {
        await walletConnection.requestSignIn(
        nearConfig.contractName,
        "Rust Counter Example"
        )
        updateUI()
    }

    function signOut() {
        walletConnection.signOut()
        updateUI()
    }

    async function increment() {
        loading = true
        await contract.increment()
        await updateUI()
        loading = false
    }

    async function decrement() {
        loading = true
        await contract.decrement()
        await updateUI()
        loading = false
    }

    updateUI()
</script>

<div class="absolute w-full h-full bg-gradient-to-t from-indigo-400 via-indigo-500 to-indigo-600 flex items-center justify-between px-3 py-1.5 pb-24">
    <div class="flex flex-col">
        <h1 class="font-bold text-6xl text-indigo-300/20">
            NEAR-SDK-RS
        </h1>
        <h1 class="font-bold text-6xl text-indigo-300/20">
            COUNTER DAPP
        </h1>
    </div>
    <div class="flex flex-col items-end">
        <h1 class="font-bold text-6xl text-indigo-300/20">
            SVELTE + TW v3
        </h1>
        <a class="font-bold underline text-6xl text-indigo-300/20 z-20" href="https://github.com/AnicetNgrt/near_counter_svelte">
            CODE ON GITHUB
        </a>
    </div>
</div>
<div class="absolute w-full h-full flex flex-col gap-4 p-4 items-center justify-center z-10">
    <Panel class="w-60 mb-16 mt-auto">
        {#if connected}
        <div class={"bg-indigo-300/50 text-indigo-900 h-12 justify-center items-center flex px-3 py-1.5 rounded-xl w-full" + (counter != 0 && (counter > 0 ? " bg-green-300/50 text-green-700/80 " : " bg-red-300/50 text-red-700/80 "))}>
            {#if loading}
                <h1 class="text-xl">
                    loading...
                </h1>
            {:else}
                <h1 class="text-3xl font-bold">
                    {counter}
                </h1>
            {/if}
        </div>
        <div class="flex gap-2">
            <Button disabled={loading} negative class="w-1/2 text-3xl font-bold" label="--" onClick={decrement}/>
            <Button disabled={loading} positive class="w-1/2 text-3xl font-bold" label="++" onClick={increment}/>
        </div>
        {/if}
        {#if connected}
            <Button class="text-indigo-900" label="Sign out" onClick={signOut}/>
        {:else}
            <h1 class="px-1 text-xl mb-2 text-indigo-900">
                You must be signed in before using the smart contract
            </h1>
            <Button class="text-indigo-900" label="Sign in" onClick={signIn}/>
        {/if}
    </Panel>
    <div class=" mt-auto font-bold text-indigo-300/90">
        Made for NEAR x Encode Hackathon february 2022
    </div>
</div>