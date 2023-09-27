<script lang="ts">
  import { goto } from "$app/navigation";
  import { reviewList, reviewOfListing } from "$lib/stores/file-store";

  function openLink(link: string | undefined){
    // goto(link, )
    window.open(link!.split('=w')[0], "_blank");

  }
</script>

<svelte:head>
  <title>Review</title>
  <meta name="description" content="Review" />
</svelte:head>

<div class="p-4">
  <div class="text-sm breadcrumbs  ml-[18%]">
    <ul>
      <li><a href="/">Listings</a></li> 
      <li>Reviews</li> 
      <li>{$reviewOfListing} ({$reviewList.length})</li>
    </ul>
  </div>
  <!-- <h1 class="mb-4 ml-[18%] text-lg"><b>{$reviewOfListing} ({$reviewList.length})</b></h1> -->
  <div class="grid grid-cols-1 place-items-center		">
    {#each $reviewList as item, i}
      <div class="card w-[65%] m-4 bg-base-100 shadow-xl mb-4">
        <div class="card-body">
          <div class="flex items-center"><h2 class="card-title text-sm text-gray-500">{item["name"]}</h2><p class="ml-2 text-xs text-gray-400">( {i+1}/{$reviewList.length} )</p></div>
          <h4 class="flex items-center">
            <div class="rating rating-sm rating-half">
              {#each new Array(item["stars"]) as _, starIndex}
                <input
                  disabled
                  type="radio"
                  name={`rating-${i}`}
                  class="bg-orange-400 mask mask-star-2 mask-half-1"
                />
                <input
                  disabled
                  type="radio"
                  name={`rating-${i}`}
                  class="bg-orange-400 mask mask-star-2 mask-half-2"
                />
              {/each}
              {#each new Array(5 - item["stars"]) as _, emptyStarIndex}
                <input
                  disabled
                  type="radio"
                  name={`rating-${i}`}
                  class="bg-orange-200 mask mask-star-2 mask-half-1"
                />
                <input
                  disabled
                  type="radio"
                  name={`rating-${i}`}
                  class="bg-orange-200 mask mask-star-2 mask-half-2"
                />
              {/each}
            </div>
            <p class="ml-2 text-sm text-gray-500">{item["stars"]} out of 5</p>
          </h4>
          {#if item["text"] != null}
            <p>{item["text"]}</p>
          {/if}
        </div>
        {#if item["reviewImageUrls"].length>0}
        <div class="grid grid-cols-4 p-8 gap-2">
          {#each item["reviewImageUrls"] as r, i}
            <figure>
              <img on:click={()=>openLink(r)} class="object w-full cursor-zoom-in" src={r} alt="Review"/>
            </figure>
          {/each}
        </div>
        {/if}
        {#if item["responseFromOwnerText"] != null}
        <span class="ml-8 mb-4"><b class="text-sm">Owner Reply</b> {item["responseFromOwnerText"]}</span>
        {/if}
      </div>
      
    {/each}
  </div>
</div>
