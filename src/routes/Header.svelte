<script lang="ts">
  import {
    fileName,
    fileSelectTrigger,
    fileSize,
    jsonData,
  } from "$lib/stores/file-store";
  function selectFile() {
    fileSelectTrigger.set(1);
  }
	function sortData(order: number) {
  const data = $jsonData;

  data.sort((a: { title: string; }, b: { title: string; }) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    
    return order * (titleA.localeCompare(titleB));
  });

  jsonData.set(data);
}

  function handleSelectChange(event: any) {
    // Get the selected option value
    const selectedOption = event.target.value;

    // Perform actions based on the selected option
    if (selectedOption === "Title ASC") {
      // Sort by title
      sortData(1);
    } else if (selectedOption === "Title DESC") {
      sortData(-1);
    }
  }
</script>

<header>
  <div class="navbar bg-base-100 px-24">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost normal-case text-xl">Data Viewer</a>

      {#if $fileName != ""}
        <button class="btn btn-sm mr-2" on:click={selectFile}>
          {$fileName}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      {:else}
        <button class="btn btn-sm mr-2" on:click={selectFile}>
          Select File
        </button>
      {/if}
    </div>
    <div class="flex-none" />
    {#if $fileSize != 0}
      Entries: {$jsonData.length} | Size: {($fileSize / 1024 / 1024).toFixed(2)}
      MB
      <div class="flex ml-2 items-center">
        <span> | Sort By</span>
        <ul class="ml-4">
          <select
            class="select select-bordered w-full text-s"
            on:change={handleSelectChange}
          >
            <option disabled selected>Default</option>
            <option>Title ASC</option>
            <option>Title DESC</option>
          </select>
        </ul>
      </div>
    {/if}
  </div>
</header>

<style>
</style>
