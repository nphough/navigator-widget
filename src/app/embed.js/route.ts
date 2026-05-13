import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get('k');

  if (!apiKey) {
    const errorScript = `
      console.error('Navigator Widget: API key is required. Please add ?k=YOUR_API_KEY to the script src.');
    `;
    
    return new NextResponse(errorScript, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }

  // Inline iframe-resizer parent code (minified version)
  const iframeResizerCode = `
    !function(e,t){"use strict";function n(){return window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver}function i(e){return Math.max(Math.max(e.body.scrollHeight,e.documentElement.scrollHeight),Math.max(e.body.offsetHeight,e.documentElement.offsetHeight),Math.max(e.body.clientHeight,e.documentElement.clientHeight))}function o(e){e.contentWindow.postMessage("getHeight","*")}function a(e,t){e.addEventListener("load",function(){o(e)});var i=n();i&&new i(function(){o(e)}).observe(e.contentDocument,{childList:!0,subtree:!0,attributes:!0})}function r(e){if(e.origin!==location.protocol+"//"+location.host)return;try{var t=JSON.parse(e.data);if(t.height&&t.iframe){var n=document.getElementById(t.iframe);n&&(n.style.height=t.height+"px")}}catch(e){}}window.iframeResizer={init:a,postMessage:o},window.addEventListener("message",r)}();
  `;

  const loaderScript = `
(function() {
  'use strict';
  
  ${iframeResizerCode}
  
  // Configuration
  const API_KEY = '${apiKey}';
  const WIDGET_URL = '${process.env.NODE_ENV === 'production' ? 'https://widget.afnavigator.com' : 'http://localhost:3000'}';
  
  // Find the target container
  let container = null;
  const script = document.currentScript || document.scripts[document.scripts.length - 1];
  
  // Look for preceding element with id="navigator-widget"
  let current = script.previousElementSibling;
  while (current) {
    if (current.id === 'navigator-widget') {
      container = current;
      break;
    }
    current = current.previousElementSibling;
  }
  
  // If not found, create one and insert before the script
  if (!container) {
    container = document.createElement('div');
    container.id = 'navigator-widget';
    script.parentNode.insertBefore(container, script);
  }
  
  // Create and configure the iframe
  const iframe = document.createElement('iframe');
  const iframeId = 'navigator-widget-' + Date.now();
  iframe.id = iframeId;
  iframe.src = WIDGET_URL + '/embed?k=' + API_KEY;
  iframe.style.width = '100%';
  iframe.style.border = '0';
  iframe.style.display = 'block';
  iframe.style.minHeight = '600px';
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('frameborder', '0');
  
  // Clear container and add iframe
  container.innerHTML = '';
  container.appendChild(iframe);
  
  // Initialize iframe resizer
  iframe.addEventListener('load', function() {
    window.iframeResizer.init(iframe);
  });
  
  // Handle height messages from iframe
  window.addEventListener('message', function(event) {
    if (event.origin !== WIDGET_URL.replace(/:\\/\\/.*/, '://') + WIDGET_URL.replace(/.*:\\/\\//, '').split('/')[0]) {
      return;
    }
    
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      
      if (data.type === 'navigator-widget-height' && data.iframeId === iframeId) {
        iframe.style.height = data.height + 'px';
      }
    } catch (e) {
      // Ignore invalid messages
    }
  });
  
})();`;

  return new NextResponse(loaderScript, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}