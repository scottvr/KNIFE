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

And then, maybe a few more clicks or taps or somesuch and you've got it doing this:


https://github.com/user-attachments/assets/7345c907-b3b4-42af-a8b5-1cfcd4a42e88

### more stuff

I've added tons of new features you can find by just exploring the interface, clicking or tapping on things; you won't break it, go ahead. As an example, here I have selected the Julia set, opened the info panel so you can see some details about zoom level, the fractal itself, etc while I play around with palettes and color cycling.


https://github.com/user-attachments/assets/f3a6a121-b2f4-423d-ade8-ce2f8760db31


Maybe it's best if you just see for yourself, and tell me what works or doesn't for you:

----


## the KNIFE online prototype

### play with it here:

https://blehg.paperclipmaximizer.ai/KNIFE/


## Some actual documentation

[A Quick Start Guide](QUICK_START.md) is available, but the "quickest" way to start is to just jump in. Look at the screen, and press the `?` key.
This will tell you how to do everything else. But, if you feel lost because you expect drop down menus with words and such on them, try reading the Quickstart first.

For those that find it easy to navigate your way around the app, you might be interested in learning about [more advanced topics](REFERENCE.md), but again - you can just explore by clikcing things and pressing keys; you will learn quickly that way.

If you want the full boxed-manual treatment, start here:

- [KNIFE Pilot Manual](MANUAL.md)

## Updates, now in 3D!

When I learned of the Mandelbulb, I knew we needed to support 3D fractals. It's taken a lot of time to get it to a state near all of the beautiful images I saw online, and it was getting rather disappointing that my prototype, even borrowing from lots of folks examples at shadertoy.com, just didn't look as nice. I had to rewire quite a bit of the UI, which had evolved organically from just supporting the 2D Mandelbrot, and broke from the keyboard-first approach a bit until I got it usable, then retrofitted keyboard controls. I also added the concept of "workspaces" to try to reign in the control clutter that followed from adding instrumentation for debugging and performance metrics in the process. This grew to a sort of bespoke window manager with virtual desktops, which still needs a good deal of work so is not really documented and mostly-hidden by default. (`shift+w` then `v` will get you to the `Volumetric` workspace, where the Mandelbulb is currently sequestered if you want to experiment with it. 

Here's some of the best bulbs (but not the best images; taken on my phone and re-compressed for file size (they're 10% of the size the were captured by my phone! sorry. It's' not really so pixelated.) of KNIFE's rendition of the mandelbulb:

### The bioluminescent bulb:



https://github.com/user-attachments/assets/7d5422e2-0ca4-4aa9-af03-eab4fe3f276f



## Colored lights can hypnotize:

I was very excited to finally have lighting working properly. (It would follow the bulb's rotation in geosynchronous orbit for the first several attempts) so once it was an actual working lightsource, I added colored lights and a bit of fog between the bulb and the light

### sparkle someone else's eyes:


https://github.com/user-attachments/assets/06084621-f903-4750-994a-b5d3a2662431


### This Mandelbulb contains a blazing inferno:


https://github.com/user-attachments/assets/59b95f4b-a19e-43cf-848e-2469912f3518


## latest 3D updates - 20260410

These are pretty low-quality, both in compression and the fact that I was pointing the phone at a laptop to take them (it's an x86-era macbook air; it doesn't handle realtime WebGL and videocapture simultaneously very well) but I wanted to show a couple of things. 
- This was when I added the ability to adjust the exponent from the standard (z^8 + x) to a range of -20 to +20 which can result in interesting variations on the shape, especially (to me) at lower powers, particularly fractional ones.
- Further I have tweaked it by replacing the trig functions used to convert between spherical and cartesian coordinates in ways I have little undertanding of what or why it is actually doing what it does (in fact I've even added a `randomize` button to choose, well, _random_ tweaks to the algorithm by swapping in and out different trigonometric functions, axes and exponents, because YOLO!) but to me the results are fascinating, and I spend far too much time watching 3D fractals animate these days. As such,  I am always adding new features out of curiosity and for the joy it brings me.

So the first thing I'll show cuz it's a little better quality than the video, is the first image I got where I felt like it truly resembled a figure completely made of a smooth, shiny metallic surface. (It is also blue, because since I was a kid, I've loved that polished blue metallic look, which may distract from the metallic intent I guess.)

![decent_chrome-look](https://github.com/user-attachments/assets/37f40f95-74cb-44a6-99f8-d54ff6901feb)

A short while later, I had a better "chrome" appearance, with the introduction of some environmental-ish look (I don't have reflective solid surface textures in the environment, so this was done with a slightly contrived palette and intense colored lighting at angles I arrived at by just trying different locations in 3D space until it looked pretty good, even if it's a bit unnatural wrt "sky" and "earth shades coming from the proper directions. It's not enough to feel uncanny to me. I don't recall with the power was set to for this one, and I was just starting to experiment with raising the bailout factor when tweaking the formula. Increasing the raymarcher's epsilon is also useful for "smoothing" out a surface that you want to appear "shiny". (This was I think the biggest issue with my first attempt from above where it looked *reflective* in some way (like small single-cut diamonds to me) but didn't really screm "chrome!"):


https://github.com/user-attachments/assets/09c17e3e-326c-49cc-9509-1db030738a08


So here's some video that shows a much better result from my "chrome" experiments, as well as a demonstration of the aforementioned random combinations of trig functions to find an interesting shape, then of lowering and raising the exponent in real-time, which gives some pretty neat effect as it "unfurls" and "recoils" itself in the process of exposing more "bulbs" (which have been flatted here by the short raymarching length and high epsilon):


https://github.com/user-attachments/assets/9ef1342b-e3f5-42cb-b87d-cebc22fa37bc


### And last but not least: The Fractal Fishtank!

Since I created those first images of the "bioluminescent bulbfish" in the traditional `power 8` shape of the Mandelbulb, I had a need to find a way to make even more "deep-sea fractals". This was before KNIFE had the ability to tweak the formula so extensively and easily so I wasn't quite sure *how* I was going to to it, aside from more GPU shader techniques (as with the "bioluminescent" and "infero" fractals seen earlier on this page) so I thought that one way to do this was by putting them in an aquarium, naturally. (I have since added configurable "murk" and "haze" to the water, refraction to its enclosing glass, better movement, save/add/remove individual bulbs, drop them in the tank, and so on) but the feature is not exposed on a menu because the controls are still a bit awkward even for just manipulating a single bulb in the center of view. Soon, though.)

Anyway, here's a couple videos of the aforementioned 3D fractals from the earlier 3D updates (ok, the bioluminescent one is a new stage of his lifecycle so he's shaped a little differently now; **Bulbfish in their prototype tank:**


https://github.com/user-attachments/assets/46f995da-a030-4220-b148-d935c1d37f0d



https://github.com/user-attachments/assets/f711a095-2734-41b9-a895-3d1243539094


