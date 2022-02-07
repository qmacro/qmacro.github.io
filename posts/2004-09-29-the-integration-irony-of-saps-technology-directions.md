---
layout: post
title: The integration irony of SAP's technology directions
tags:
- history
- integration
- sap
---


I’ve finally realised what it is that’s been bugging me about the new arena of SAP technology. I’ve felt slightly uneasy, or unbalanced, by something that I couldn’t quite put my finger on.

**From integration to de-integration**

But while attending a (rather poor, I have to say) training course at SAP UK last week, it finally struck me. SAP have been selling enterprise level software for a very long time. And one of the key selling points was that the data, and the business processes, were *integrated*. Indeed, for a good while, SAP’s slogan (at least here in the UK) was “Integrated Software. Worldwide”.

But funnily enough, that slogan disappeared, in favour of another, that didn’t focus on integration. I can’t remember what it was (it was certainly less memorable), and now it’s changed again (to “The best-run businesses run SAP”). Anyway, back to integration. The dream presented by SAP in the 80s and 90s showed companies that they could escape the headaches of separate systems and integrate their data and processes into one single system (R/2 and later R/3). This was indeed the reality too.

But what’s happening today? Every way you turn, there are SAP systems doing different things, managing different processes, and storing different data (sometimes sharing it with other SAP systems). Customer Relationship Management (CRM) systems handling sales-related activities; Supplier Relationship Management (SRM) systems handling supplier activities; there’s the IPC system for pricing and configuration, and the APO system for planning and optimisation activities. And data is moved to a business warehouse for reporting purposes. And so it goes on.

Data and process **de-integration**, anyone?

I don’t know whether the term should be ‘deintegration’ or ‘disintegration'; all I know is that it seems a different road that SAP is travelling down than they did before. On the course I attended last week, the reality of managing data between different SAP systems in one installation was rather worrying. Just as it was 20 years ago. Or so it seems. And right now, at least with CRM and BI, there doesn’t seem to be a set of uniform data exchange tools for managing the exchange – for example, while Bdocs are used to manage master data between a CRM system and an R/3 (‘legacy’ :-) system, they’re not used for the same purpose between a CRM system and a BI system. Perhaps I haven’t drunk enough kool-aid yet.

**A different rule for the client side**

So what was the purpose of this post? It wasn’t directly to point out the about-turn SAP seem to be making in this area. It was actually to point out the juxtaposition that SAP’s new de-integrated direction has with … their vision for front-ends. While de-integration is where it’s at on the server side, we have *total integration* on the client side. Enterprise Portal (EP) 6.0, WebDynpro, PeopleCentric design (don’t get me started on that) – every function that a user might need is lumped together in one homogenised “web” client. Email, discussion groups, graphics, reports, transactions, IM, and so on. All on one page in your browser. What happened to ‘best of breed’ on the desktop? I’m a great believer in the right tools for each job. That’s why I run a proper email client (for email and threaded forum-style discussions), a separate IM client, a separate newsreader, and a browser. Each one excels in its own domain. Trying to achieve everything in a browser window is doomed.

So if best of breed, focused application platforms is what SAP is aiming for at the server end, why go in the other direction at the client end? A single screen looking extremely busy with lots of little application windows, flashing lights, tables, graphics, and so on, is *great* for screenshots and brochures. But what about the real end user? I’m an end user as well as a developer, and can imagine productivity taking a huge dive if we were forced to use this.

Of course, the browser-based applications served from the EP are a lot different from what I imagine browser based applications to be. You know, ones that allow you to use your browser as, well, *a browser*, with old fashioned things like bookmarking, navigation, proper page titles, and so on. And ones that work *in browsers*, not just in a specific combination of Microsoft Windows and Internet Explorer – I’m having a nigh-on impossible time getting in to the [SAP Developer Network ](http://www.sdn.sap.com)site right now, because of recent changes that cause the site not to ‘work’ at my end with Firefox and / or Epiphany on Linux.

But that (‘browser abuse’, as also [noted in more general terms by Joe Gregorio](http://bitworking.org/news/3270_Redux)) is a story for another time ;-)


