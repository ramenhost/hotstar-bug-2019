# POC: Hotstar Security Vulnerability 2019
Proof of concept for hotstar.com improper authentication and access control vulnerability. This allows users to watch premium content without a subscription.

> [!IMPORTANT]  
> This vulnerability was responsibly disclosed to Hotstar in Jul 2019 and has been fixed. This repository has been made public after sufficiently long enough time. Hotstar doesn't provide any bounty for issues highlighted by the users.

## Install the extension

This requires you to turn on developer mode in chrome extensions. Navigate to `chrome://extensions/` and turn on developer mode.

1. You may consider using packed release version of this plugin. Download latest release from this repository. Drag the downloaded `.crx` file into the `chrome://extensions/` page.

2. For unpacked versions, select **load unpacked** and choose the `chrome_extension` directory of this repository.

## How to use
1. Go to hotstar and navigate to the desired premium content (Don't click on watch video button).
2. Click on the extension 'H' icon next to the address bar.
3. A message saying `Hotstar premium is debugging this browser` should appear on the top (Don't cancel until done watching).
4. Play your desired video.
5. Cancel the debugging once you're done watching.
6. You can change the email with which you want to login on the `chrome_extension/setcookie.js` script. (optional)

## Exploit
Hotstar authentication and access control for premium subscription are vulnerable to client state manipulation. This chrome extension demonstrates the following exploits.

### JWT tampering
Authentication endpoint does not validate JWT signature. By tampering the JWT data, one can login as any user without password.

### Premium subscription access control bypass
Following API endpoints check for JWT signature and their responses can be mocked in a MITM proxy. Mock responses can be found in `chrome_extension/background.js`.
- refresh-token
- entitlement/content (dummy cache key)
- entitlement/device  
  
Video playback needs a valid cache key to be sent in the header, and such key can only be obtained from actual `entitlement/content` API. However removing the cache key header completely from the request (can be done in a MITM proxy) allows streaming of the content.

### No subscription error
In case of encountering such a message from hotstar, stop the debugging and start it again by clicking on the extension 'H' icon. Reload the page.

## Disclaimer
This is made as a proof of concept for disclosing the bug in the streaming platform and not intended for any misuse.