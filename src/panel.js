
DevToolsAutosaveSavedResourceReader = new class DevToolsAutosaveSavedResourceReader {
  
  localStorageKey = '__devToolsAutosaveSavedResources__';
  
  pageHTMLKey = '__pageHTML__';
  
  
  getSavedResources() {
    
    return new Promise(resolve => {
    
      const script = `localStorage[\`${this.localStorageKey}\`]`;
      
      chrome.devtools.inspectedWindow.eval(
        script,
        function(result, isException) {
          
          const data = result;
          
          if (!data) {
            
            resolve({});
            
          } else {
          
            resolve(JSON.parse(data));
            
          }
          
        }
      );
      
    });
    
  }
  
}





const resourcesEl = document.querySelector('.resources');

async function renderSavedResources() {
  
  const savedResourceReader = DevToolsAutosaveSavedResourceReader;
  
  const savedResources = await savedResourceReader.getSavedResources();
  
  
  let outHTML = '';
  
  for (let key in savedResources) {
    
    const resource = savedResources[key];
    
    
    if (key === savedResourceReader.pageHTMLKey) {
      
      let resourceContent = decodeUnicode(resource);
      resourceContent = escapeHTML(resourceContent);
      
      outHTML += `
      <div class="resource">
        <div class="header">
          <div class="title">Page HTML</div>
          <div class="subtitle">document</div>
          ${arrowIcon}
        </div>
        <div class="content">${resourceContent}</div>
      </div>
      `;
      
      continue;
      
    }
    
    
    let resourceUrl = decodeURIComponent(resource.url);
    resourceUrl = escapeHTML(resourceUrl);
    
    let resourceContent = decodeUnicode(resource.content);
    resourceContent = escapeHTML(resourceContent);
    
    
    let resourceType = resource.type;
    
    if (resource.url.startsWith('inspector://')) {
      
      resourceType = 'inspector-' + resourceType;
      
    }
    
    
    outHTML += `
    <div class="resource">
      <div class="header">
        <div class="title">${resourceUrl}</div>
        <div class="subtitle">${resourceType}</div>
        ${arrowIcon}
      </div>
      <div class="content">${resourceContent}</div>
    </div>
    `;
    
  }
  
  if (outHTML === '') {
    
    outHTML = '<div class="empty">No saved resources. To save a resource, edit it in DevTools.</div>';
    
  }
  
  
  resourcesEl.innerHTML = outHTML;
  
  
  resourcesEl.querySelectorAll('.resource').forEach(resourceEl => {
    
    const headerEl = resourceEl.querySelector('.header');
    
    headerEl.addEventListener('click', () => {
      
      resourceEl.classList.toggle('expanded');
      
    });
    
  });
  
}


// re-render saved resources whenever the panel is shown (see extension.js)

chrome.storage.local.onChanged.addListener(
  renderSavedResources
);




function checkTheme() {

  if (chrome.devtools.panels.themeName === 'dark') {
    
    document.body.classList.add('dark');
    
  }
  
}

checkTheme();





// util

// base64 decode

let decodeUnicode = (str) => {

  // going backwards: from bytestream, to percent-encoding, to original string
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

}


// escape HTML
let escapeHTML = (str) => {
  
  const p = document.createElement('p');
  p.appendChild(document.createTextNode(str));
  
  let resp = p.innerHTML;
  resp = resp.replaceAll(/"/g, "&quot;").replaceAll(/'/g, "&#039;");
  
  return resp;
  
}




const arrowIcon = `<svg class="arrow" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg>`;
