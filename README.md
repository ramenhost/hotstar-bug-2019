# hotstar-bug-poc
Proof of concept for Hotstar premium client state manipulation vulnerability.

## Load the extension
1. Go to `More tools -> Extensions` on chrome.
2. Turn on Developer tools on the top right.
3. Click Load unpacked button and select the `chrome_extension` folder from this repository.

## How to use
1. Go to hotstar and click on the extension 'H' icon next to the address bar.
2. A message saying `Hotstar premium is debugging this browser` should appear on the top (Don't cancel until done watching).
3. Play your desired video.
4. Cancel the debugging once you're done watching hotstar.

### Facing No subscription error
In case of encountering such a message from hotstar, stop the debugging and start it again by clicking on the extension 'H' icon. Reload the page.
