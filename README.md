# hotstar-bug-poc
Proof of concept for Hotstar premium client state manipulation vulnerability.

## Install the plugin

This requires you to turn on developer mode in chrome extensions. Navigate to `chrome://extensions/` and turn on developer mode.

1. You may consider using packed release version of this plugin. Download latest release from [here](https://github.com/realramkumar/hotstar-bug-poc/releases) and ignore any warnings. Drag the downloaded `.crx` file into the `chrome://extensions/` page.

2. For unpacked versions, select **load unpacked** and choose the `chrome_extension` directory of this repository.

## How to use
1. Go to hotstar and navigate to the desired premium content (Don't click on watch video button).
2. Click on the extension 'H' icon next to the address bar.
3. A message saying `Hotstar premium is debugging this browser` should appear on the top (Don't cancel until done watching).
4. Play your desired video.
5. Cancel the debugging once you're done watching.
6. You can change the email with which you want to login on the `chrome_extension/setcookie.js` script. (optional)

### Facing No subscription error
In case of encountering such a message from hotstar, stop the debugging and start it again by clicking on the extension 'H' icon. Reload the page.

## Disclaimer
This is made as a proof of concept for disclosing the bug in the streaming platform and not intended for any misuse.