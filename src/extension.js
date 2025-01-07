
chrome.devtools.panels.create('Autosave', 'icon.png', 'panel.html', (panel) => {
  
  panel.onShown.addListener(() => {
    
    // re-render saved resources whenever the panel is shown (see panel.js)

    chrome.storage.local.set({ "tabChangePing": Date.now() });
    
  });
  
});




const resourceSaverScript = `

__DevToolsAutosaveResourceSaver__ = new class __DevToolsAutosaveResourceSaver__ {
  
  localStorageKey = '__devToolsAutosaveSavedResources__';
  
  pageHTMLKey = '__pageHTML__';
  
  
  getSavedResources() {
    
    const data = localStorage[this.localStorageKey];
    
    if (!data) return {};
    
    return JSON.parse(data);
    
  }
  
  saveSavedResources(data) {
    localStorage[this.localStorageKey] = JSON.stringify(data);
  }
  
  
  saveResource(resource) {
    
    let savedResources = this.getSavedResources();
    
    
    let key = resource.url;
    
    if (key === this.pageHTMLKey) key += '_';
    
    
    savedResources[key] = resource;
    
    this.saveSavedResources(savedResources);
    
  }
  
  savePageHTML(html) {
    
    let savedResources = this.getSavedResources();
    
    savedResources[this.pageHTMLKey] = html;
    
    this.saveSavedResources(savedResources);
    
  }
  
  
  Resource = class Resource {
    
    url;
    type;
    content;
    
    constructor({ url, type, content }) {
      this.url = url;
      this.type = type;
      this.content = content;
    }
    
  }
  
}

`;

chrome.devtools.inspectedWindow.eval(
  resourceSaverScript,
  function(result, isException) { }
);



// called when a page resource is modified 
// - stylesheet change including inspector-stylesheets, JS or document change.
// - does not get called when modifying a resource through the sources tab, you have to save (Ctrl/Cmd+S, removes the asterisk next to the resource's name) the resource for this to get called.

function onResourceContentCommitted(resource, content) {
      
  const encodedURL = resource.url.replaceAll('`', '%60');
  const encodedContent = encodeUnicode(content);
  
  const script = `
  (() => {
    
  const saver = __DevToolsAutosaveResourceSaver__;
  
  const resource = new saver.Resource({
    url: \`${ encodedURL }\`,
    type: \`${ resource.type }\`,
    content: \`${ encodedContent }\`
  });
  
  saver.saveResource(resource);
    
  })();
  `;
  
  chrome.devtools.inspectedWindow.eval(script);
  
}

chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener(
  onResourceContentCommitted
);



const htmlObserverScript = `
(() => {
  
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed:


// called when the page's HTML is modified
// - elements added/deleted, attribute changes including inline style changes, etc.

const callback = (mutationList, observer) => {
  
  const encodedHTML = encodeUnicode(
    document.documentElement.outerHTML
  );
  
  const saver = __DevToolsAutosaveResourceSaver__;
    
  saver.savePageHTML(encodedHTML);
  
};


// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(document, config);



// util
// base64 encode
let encodeUnicode = (str) => {

  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
  }));

}

})();
`;

chrome.devtools.inspectedWindow.eval(
  htmlObserverScript,
  function(result, isException) { }
);





// util

// base64 encode

let encodeUnicode = (str) => {

  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
  }));

}
