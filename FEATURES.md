# Smart Search — Feature Overview

A prototype of an AI-powered search experience designed as the front door of a healthcare website homepage. Built to demo how intelligent search can replace traditional navigation and help patients find care without ever leaving the page.

**Live demo:** https://ryankmccarty.github.io/SmartSearch/

---

## Core Experience

### Inline results — no page navigation
Searching triggers results to load directly on the homepage. The page never navigates away. Patients find what they need from where they started.

### Hero compression transition
When a search is submitted, the hero section smoothly compresses, the headline exits, and results animate in below. The search bar remains the stable anchor throughout — it never moves or disappears.

### Gold shimmer loading indicator
While results are fetching, a gold shimmer sweeps across the search bar to signal activity without jarring the user with a spinner.

### Rotating placeholder text
The search field cycles through eight patient-intent examples every three seconds ("Chest pain and shortness of breath", "Pediatrician near me with availability today", etc.), prompting users with what's possible before they type.

### Voice input icon
A microphone icon sits inside the search field, signaling that natural language and voice input are part of the experience.

---

## Search Results

### Quick Assist (AI answer)
For common clinical queries, an AI-generated answer appears at the top of results — providing immediate context before the user scans through links. Sourced from indexed content with citations shown.

### Tabbed result filtering
Results are organized into tabs: All, Doctors, Locations, Services, and Articles. Tab counts update live based on what matched the query.

### Provider cards
Matched doctors surface with photo, name, specialty, star rating, accepting-new-patients status, and next available appointment slot. A one-tap Schedule button is always visible.

### Location cards
Matched care locations show name, address, estimated distance, current open/closed status, and estimated wait time. A Directions button links out directly.

### Related conditions
When a query maps to a clinical condition, matched conditions appear with a direct link to learn more or find relevant care.

---

## Continuation & Discovery

### "Try also" chips
After a search, a row of related chips appears below the search bar. These are derived from the result's context and the query itself — keeping the user in a discovery loop without requiring them to type again.

### Common searches (pre-search)
Before a user types anything, a row of high-intent chips (Urgent care wait times, Find a primary care doctor, Book a same-day appointment, etc.) provides immediate entry points.

### "← Home" reset
A single click returns the page to its default expanded state, with the headline and pre-search chips restored.

---

## Personalized (Logged-In) Experience

### Personal homepage strip
When signed in, a contextual strip slides in below the hero showing a warm greeting, the user's upcoming appointment, and their recent searches as quick-launch chips.

### Personalized context strip (post-search)
After searching, the strip above the search bar shifts from generic result counts to a personalized summary: "Good afternoon, Ryan · 2 providers matched to your care history."

### Care team in the right rail
The right rail surfaces the user's primary care doctor with a direct schedule button, their upcoming appointment with reschedule options, and the health topics they follow.

### My doctor surfaces first
When a search is relevant to the user's care team, their own doctor appears at the top of provider results — reinforcing continuity of care.

---

## Demo Walkthrough

A suggested sequence for presenting this experience:

1. **Default state (logged out)** — show the rotating placeholder, Common Searches chips, and care category grid
2. **Search "chest pain"** — trigger the hero compression, Quick Assist answer, and inline results
3. **Click a "Try also" chip** — demonstrate the discovery loop
4. **Click "← Home"** — show the clean reset back to the starting state
5. **Sign in** — the personalized homepage strip slides in with appointment and recent searches
6. **Click "urgent care wait times" from recent searches** — the post-search context strip reads "matched to your care history"
7. **Scroll to the right rail** — show the care dashboard with upcoming appointment and care team
8. **Search "find a primary care doctor"** — the user's own doctor surfaces first
