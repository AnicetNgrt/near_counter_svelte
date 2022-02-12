<script>
    let classes
    export { classes as class }
</script>

<div class={classes + " bg-indigo-400/50 p-3 rounded-xl border-b-4 border-indigo-400/80 shadow-xl shadow-indigo-900/20 flex flex-col gap-2"}>
    <slot/>
</div>