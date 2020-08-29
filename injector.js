function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    s.setAttribute('type', "module")
    th.appendChild(s);
}
injectScript( chrome.extension.getURL('xeduler.js'), 'body');