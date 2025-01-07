# DevTools Autosave

No more tears (tm).

Edit some resources in DevTools, then check the Autosave panel (in the DevTools' top bar) to see a list of all the resources you've edited in the inspected page and their contents.  
This list is saved to your browser's local storage, meaning it persists between browser sessions. Just make sure to not clear your cookies.

## What resources are saved?
Any resource you modify through DevTools. This includes:
- CSS files, including `inspector-stylesheets`
- The inspected page's HTML
- JavaScript files
- And more

> [!NOTE]
> When you modify a resource through the Sources panel, it will only be autosaved once you've saved it in the editor window by pressing <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>S</kbd>.  
> You'll know it's been autosaved once the astrisk at the end of the resource's name (at the top of the editor window) disappears.
