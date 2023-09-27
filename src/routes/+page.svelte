<script lang="ts">
  import {
    fileName,
    fileSelectTrigger,
    fileSize,
    jsonData,
    reviewList,
    reviewOfListing,
  } from "../lib/stores/file-store";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let isAtBottom = false;
  let selectedFile: File | null = null;
  let fileInput: HTMLInputElement;
  let page = 1;
  onMount(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  function handleScroll() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.scrollY;
    // Check if the user is near the bottom (within a threshold)
    const threshold = 100; // Adjust this threshold as needed
    isAtBottom = windowHeight + scrollPosition + threshold >= documentHeight;
  }

  $: {
    if (isAtBottom) {
      page++;
    }
  }

  fileSelectTrigger.subscribe((n) => {
    if (n == 1) {
      console.log(n);
      fileSelectTrigger.set(0);
      fileInput.click();
    }
  });

  function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      selectedFile = input.files[0];
      try {
        const fileContent = await readFile(selectedFile);
        console.log("yo");
        const data = JSON.parse(fileContent);
        jsonData.set(data);
      } catch (error) {
        alert("Error parsing JSON file");

        selectedFile = null;
        jsonData.set([]);
      }
    } else {
      selectedFile = null;
      fileSelectTrigger.set(0);
      fileSize.set(0);
      jsonData.set([]);
    }
    fileSize.set(selectedFile?.size ?? 0);
    fileName.set(selectedFile?.name ?? "");
  }

	function openLink(link: string | undefined){
    // goto(link, )
    window.open(link!.split('=w')[0], "_blank");

  }

  async function handleReviewNav(review: any[], reviewOf: string) {
    if (Array.isArray(review)) {
      if (review.length > 0) {
        if (reviewOf !== undefined) {
          // update state and navigate to review page
          reviewOfListing.set(reviewOf);
          reviewList.set(review);
          goto("/review");
        }
      }
    }
  }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="flex justify-center items-center mt-12">
  <input
    type="file"
    on:change={handleFileChange}
    accept=".json"
    class="hidden"
    bind:this={fileInput}
  />

  {#if $jsonData.length != 0}
    <div class="grid grid-cols-2 gap-20 p-4">
      {#each $jsonData.slice(0, 10 * page) as item, i}
        <div class="card bg-base-100 shadow-xl mb-12">
					
					{#if Array.from(item["imageUrls"]).length != 0}
          <div class="carousel h-80 carousel-vertical rounded-box">
            {#each item["imageUrls"] as r, i}
              <div class="carousel-item">
                <figure>
                  <img
										on:click={()=>openLink(r)}
                    class="object-cover h-[300px] w-[450px] cursor-ns-resize	"
                    src={r}
                    alt="Listing"
                  />
                </figure>
              </div>
            {/each}
          </div>
					{/if}

          <div class="card-body w-[450px]">
            <span class="text-xs text-gray-700"
              >({i + 1}/{$jsonData.length})</span
            >

            <a class="card-title" href={item["url"]} target="_blank"
              >{item["title"]}</a
            >

            
            <div class="flex items-center">
							<h4><b>{item["categoryName"]}</b></h4>
              <h4 class="ml-2">
                {item["totalScore"]} <span class="text-amber-400">★</span>
              </h4>
              <button
                on:click={() => handleReviewNav(item["reviews"], item["title"])}
                class="btn btn-xs ml-1 btn-outline"
                >({Array.from(item["reviews"]).length})</button
              >
            </div>
            {#if item["website"] != null}
              <h4 class="truncate">
                <b>Website</b>
                <a href={item["website"]} target="_blank">{item["website"]}</a>
              </h4>
            {/if}

            {#if item["phone"] != null}
              <h4 class=""><b>Phone</b> {item["phone"]}</h4>
            {/if}


						<div class="mt-2 collapse collapse-arrow border">
							<input type="checkbox" /> 
							<div class="collapse-title">
								<h4 class=""><b>Opening hours</b></h4>
							</div>
							<div class="collapse-content"> 
								{#if Array.from(item["openingHours"]).length > 0}
                  
                  <div class="flex flex-wrap">
                    {#each item["openingHours"] as i}
                      <div class="text-xs m-1 badge">
                        {i["day"].slice(0, 2)}
                        {i["hours"]}
                      </div>
                    {/each}
                  </div>
                {/if}
							</div>
						</div>

						<div class="collapse collapse-arrow border">
							<input type="checkbox" /> 
							<div class="collapse-title">
								<h4 class=""><b>Features</b></h4>
							</div>
							<div class="collapse-content"> 
								<div class="flex flex-wrap">
									{#each Object.keys(item["additionalInfo"]) as category}
										<div class="">
											{#each item["additionalInfo"][category] as chip}
												{#if chip[Object.keys(chip)[0]]}
													<span class="text-xs m-1 badge">
														{Object.keys(chip)[0]}
													</span>
												{/if}
											{/each}
										</div>
									{/each}
								</div>
							</div>
						</div>

					



  


          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>

<style>
</style>
