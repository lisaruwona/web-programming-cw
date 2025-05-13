# Race Time - by up2243503

## Key feature 1 - Flagging A Lap
This was one of the frequent problems that I noticed in most race apps, that there was no ability to re-modify a lap if the user was to mistakenly add a lap that wasn't intended to be there in the first place. So my solution to resolving common mistakes that user admins can make is to develop a flagging feature on each lap, so that if the user admin was to mistakenly press the finisher button, they can just flag the lap so that the lap doesn't get included in the final results submission of the race. 

I have made this flagging feature easy to find by making it a red button feature fully visible for the user to see. Once flagged, the lap is then visibly higlighted to show that the chosen lap is now a discarded entry for submission. If the user were to also flag a lap by accident, they can just unflag the lap without any inconvenience in the way.


### Key Feature 2 - Bib-Lap Input
As ways of trying to figure out how to identify which runner ran in X position after finishing the race, I found that the bib-lap input feature was a quick and efficient way of allowing the admin to input the identity of the runner who acquired the race position before subimitting the results to the server. This way, it is much easier for the results to be send straight to the runners as they no longer have to wait for the admins to go over the race results again and rearrange the runners bib number again.

This feature requires the runner admin to register the runners beforehand so that when they lap each runner in the race, the option input will populate the users admin's choice with the registered bib numbers they entered. This also prevents the admin from inputting a bib number that aren't registered in the race. 


### Key Another 3 - CSV Download

CSV download allows the admin to have the option of downloading the race results in CSV formatting as a method of exporting race results to a speadsheet. 

After the admin goes throught the user journey of correctly registering runners, lapping and submiting results to the server they will be redirected to a "current" results view page where the results can be displayed. This comes along with a green button that displays a "export as CSV" feature below. The admin simply has to click this button and the results get exported in CSV format straight away.  

### Key Feature 4 - Race History

Race admins may want to have a stored history of their results in a certain area within the lap for statistical reasonings perhaps. So I came up with a results-history view that stores all the admins' recorded race results in one place.

In order for at least one recorded race to appear, the user admin has to follow thrpugh each step of registering bib numbers, timing races, and submitting results. After the results are submitted, the results view is updated with a new recorded history just after the admin completes the full user journey.


## AI STATEMENT 
Replace this with DETAIL about your use of AI, listing of the prompts you used, and whether the results formed or inspired part of your final submission and where we can see this (and if not, why not?). You may wish to group prompts into headings/sections - use markdown in any way that it helps you communicate your use of AI.  Tell us about what went right,  what went horribly wrong and what you learned from it.

### Prompts to help develop "lap + runner" data handling

This a prompt that I used to develop this feature:

>"I need each lap entry ro know which runner (by bib) ran it. How can I structure my JS so that every list element carries it's runners bib number, and then I can pull that out when I upload"

AI's recommendation was to keep a parallel array of lap objects. e.g.

const laps = [];
laps.push({ position, bib: selectedBib, time, flagged:false })

and to embed a <select> OR <input> inside each <li> so the user picks the bib immediately on lap creation. At first, I tried storing the bibs as a data- attribute on the <li>, but the AI pointed out that syncing the UI state back into JS is simpler if you read it directly from the <select> on upload.

You will be able to see this piece of code in my prepareLapListener() function. After creating the <li> element I populate the bib <select> from my runners[] array. In my upload handler, I loop over each .lap-li, grab the li.querySelector('.lap-bib).value, and push it into my resultsToUpload array alongside position and time.

### Prompts to implement the "flag feature" and skip validation when flagged

As I initally have an invalid bib error for when an admin tries to submit a lap without inputting a bib number, I had conflicts with this issue if the lap was UNFLAGGED. So I insisted on AI's help to resolve this conflict in my code

Prompt:

> "When I flag a lap, I want to ignore the "invalid bib" error for that lap. How can I modify my validation loop?"

AI's suggestion:

for (const li of lapRows) {
    if (li.classList.contains('flagged')) continue;
    //then require bib
}

this solution helped without any more conflicts to the flagging feature. This can be found in my uploadBtn handler.

### Prompts to build and re-use the bib-population feature

Prompt:

"Rather than hard-coding bib option in each lap element, how can I dynammicallt feed in the list of refgistered runners so every new lap <select> shows exactly the bibs I've entered?"

AI's solution: 

1. Maintain a global runners = [] that I push into whenever the admin registers a runner.

2. Expose a helper function updateBibList() that can regenerate a <datalist> OR fill a <select>

3. Call updateBibList() both after registering a runner and inside my lap-creation logic.

This solution resulted in a single source of truth for bibs, so any new lap dropdown always stays up to date.

Eventually I came up with the solution of: 

function updateBibList() {
    bibSelect.innerHTML = `option disabled selected> -- </option>` +
        runners.map(r => `option value="${r.bibNumber}">`).join('');
}

How this logic cascaded to other features:

Because I adopted the same approach - a JS array as the amster data store + UI generation fromt hat arrat + reading Ui back into JS on action -- i was able to: 

- Flag Laps: toggle a flagged property on the same laps[index] object.
- Race history cards: replay each saved race with its entries array of {postition, bib, time} by iterating the same structure and building uniform cards.


Reflection

What went right: AI helpled me recognize that treating my data arrays (runners, laps, raceHistory) as the crucial source made my UI logic trivial: "render from data" and "read back to data" everywhere.

What went wrong: I initially mixed up which index in laps matched which <li> after filtering out flagged entried; AI reminded me to always compute the index via Array.from(lapData.children).indexOf(li).

Key Takeaway: Once a pattern is recognised - data array + render + read-back - it composes beautifully across features (dropdowns, modals, offline cache, history views), and the use of AI was instrumental in reinforcing and refining that pattern when I got stuck.