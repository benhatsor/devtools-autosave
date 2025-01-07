# DevTools Autosave

Never lose any changes you make through DevTools to styles, HTML, or other page resources on reload. No more tears (tm).

<img width="485" alt="Screenshot 2025-01-07 at 3 39 26 AM" src="https://github.com/user-attachments/assets/030be62e-9f8c-41e2-a2f9-3dbc59edb451" />

## Usage
Edit some resources in DevTools, then check the Autosave panel (in the DevTools' top bar) to see a list of all the resources you've edited in the inspected page and their contents.  

This list is saved to your browser's local storage, meaning it persists between browser sessions. Just make sure to not clear your cookies.

## What resources are saved?
Any resource you modify through DevTools. This includes:
- CSS files, including `inspector-stylesheets`
- The inspected page's HTML
- JavaScript files
- And more

> [!NOTE]
> When you modify a resource through the Sources panel, it will only be saved once you've saved it in the editor window by pressing <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>S</kbd>.  
> You'll know it's been saved when the astrisk at the end of the resource's name (at the top of the editor window) is gone.
