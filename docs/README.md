# KNIFE

## Kapaw and Nico's Incredible Fractal Engine

Or maybe it's:

### Kool Nico's Infinite Fractal Exploration

Or perhaps:

### Kid's Never Ignore Fractal Entertainment.

We're not sure. But we know it looks like this when you start it:

<img width="1410" height="633" alt="KNIFE-1" src="https://github.com/user-attachments/assets/28833570-042f-4de7-a9dd-2c591b997c59" />


And that it only takes a moment of self-guided exploration to figure out how to get it to look like this:

<img width="1406" height="648" alt="KNIFE-2" src="https://github.com/user-attachments/assets/f01b5133-1b38-44a0-950e-12b2c63db9e2" />

And then, maybe a few more clicks or taps or somesuch amd you've got it doing this:



https://github.com/user-attachments/assets/35a32122-0923-4736-95ac-8f74666605e1

Or this:




https://github.com/user-attachments/assets/7345c907-b3b4-42af-a8b5-1cfcd4a42e88


I've added tons of new features you can find by just exploring the interface, clicking or tapping on things; you won't break it, go ahead. As an example, here I have selected the Julia set, opened the info panel so you can see some details about zoom level, the fractal itself, etc while I play around with palettes and color cycling.



https://github.com/user-attachments/assets/f3a6a121-b2f4-423d-ade8-ce2f8760db31



Maybe it's best if you just see for yourself, and tell me what works or doesn't for you:

----



### the KNIFE online prototype

### play it here:

https://blehg.paperclipmaximizer.ai/KNIFE/


### Some actual documentation

[A Quick Start Guide](QUICK_START.md) is available, but the "quickest" way to start is to just jump in. Look at the screen, and press the `?` key.
This will tell you how to do everything else. But, if you feel lost because you expect drop down menus with words and such on them, try reading the Quisckstart first.

For those that find it easy to navigate your way around the app, you might be interested in learning about [more advanced topics](REFERENCE.md), but again - you can just explore by clikcing things and pressing keys; you will learn quicklly that way.

If you want the full boxed-manual treatment, start here:

- [KNIFE Pilot Manual](MANUAL.md)

## Updates, now in 3D!

When I learned of the Mandelbulb, I knew we needed to support 3D fractals. It's taken a lot of time to get it to a state near all of the beautiful images I saw online, and it was getting rather disappointing that my prototype, even borrowing from lots of folks examples at shadertoy.com, just didn't look as nice. I had to rewire quite a bit of the UI, which had evolved organically from just supporting the 2D Mandelbrot, and broke from the keyboard-first approach a bit until I got it usable, then retrofitted keyboard controls. I also added the concept of "workspaces" to try to reign in the control clutter that followed from adding instrumentation for debugging and performance metrics in the process. This grew to a sort of bespoke window manager with virtual desktops, which still needs a good deal of work so is not really documented and mostly-hidden by default. (`shift+w` then `v` will get you to the `Volumetric` workspace, where the Mandelbulb is currently sequestered if you want to experiment with it. 

Here's some of the best bulbs (but not the best images; taken on my phone and re-compressed for file size (they're 10% of the size the were captured by my phone! sorry. It's' not really so pixelated.) of KNIFE's rendition of the mandelbulb:


The bioluminescent bulb:



https://github.com/user-attachments/assets/d1520fad-3404-4cc8-ba6d-b54afde2ba51



I was very excited to finally have lighting working properly. (It would follow the bulb's rotation in geosynchronous orbit for the first several attempts) so once it was an actual working lightsource, I added colored lights and a bit of fog between the bulb and the light:


https://github.com/user-attachments/assets/d85d88c2-3014-4f8c-8ac9-77a4f3ef4494


This Mandelbulb contains a blazing inferno:

https://github.com/user-attachments/assets/ef3d0ed7-f6d9-45f2-a788-e4f6d29c6eab

This is a work in progress I've been trying to make a chrome bulb. This is the best so far, and it kinda looks like titanium with diamonds or soemething, but it almost works



https://github.com/user-attachments/assets/08711f64-be92-4ffb-8d4c-171790638063




