chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'get-page-content') {
    cacheKey = 'pageContent:' + request.url
    var cached = localStorage[cacheKey];

    if (cached) {
      sendResponse({ content: cached });
    } else {
      sendResponse({});
    }
  }

  if (request.action === 'set-page-content') {
    cacheKey = 'pageContent:' + request.url
    localStorage[cacheKey] = request.content;
    sendResponse({});
  }
});
