# MeetingPulse PowerPoint Add-In

## Testing

You'll need to grab one of the manifests from the namesake directory.
Manifest differ in which remote assets they use and an endpoint key provided (if any).

- Different remote assets are used to test staged changes before updating those in production use.
- You can still access production application when using any add-in assets.

You might need to modify the manifest before sideloading it depending on your use case.

## Running locally

- Cook a manifest file that would:
    - Point to your local PPT assets by means of some static server;
    - Use the "local" endpoint query string.
    - Spoof your DNS if need be to point to localhost or local server or your network where PPT assets are;
- Have the local app version running on the default address (local.meet.ps:8443)
    - Ensure you have your CA cert that was generated during local app provisioning installed;
- Ensure said assets are available from the machine where you would run your Office suite;
- Sideload as usual.
