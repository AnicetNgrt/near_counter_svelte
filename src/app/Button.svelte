<script>
    export let label
    export let onClick
    let classes
    export { classes as class }
    export let disabled
    export let negative
    export let positive
</script>

<button class={`${classes} transition-all duration-75 ease-out bg-indigo-300/50 border-b-4 border-b-indigo-300/30 hover:scale-105 hover:-translate-y-0.5 hover:shadow-xl shadow-lg active:scale-95 shadow-indigo-900/20 justify-center flex px-3 py-1.5 rounded-xl` + (disabled ? " opacity-20 cursor-not-allowed pointer-events-none" : " cursor-pointer") + (positive && " bg-green-300/50 border-b-4 border-b-green-300/30 text-green-700/80 ") + (negative && " bg-red-300/50 border-b-4 border-b-red-300/30 text-red-700/80 ")} on:click={onClick}>
    {label}
</button>