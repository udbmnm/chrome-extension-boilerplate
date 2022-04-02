export async function waitForSelector(selector: string, opts: any = {}) {
  return new Promise(resolve => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    const mutObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        const nodes: any = [...mutation.addedNodes];
        for (const node of nodes) {
          if (node.matches && node.matches(selector)) {
            mutObserver.disconnect();
            resolve(node);
            return;
          }
        }
      }
    });
    mutObserver.observe(document.documentElement, { childList: true, subtree: true });
    if (opts.timeout) {
      setTimeout(() => {
        mutObserver.disconnect();
        if (opts.optional) {
          resolve(null);
        } else {
          resolve(null);
          // reject(
          //     new Error(`Timeout exceeded while waiting for selector ("${selector}").`),
          // );
        }
      }, opts.timeout);
    }
  });
}
export function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });
}

export async function copyStringToClipboard(str: string) {
  // Create new element
  const el = document.createElement('textarea');
  // Set value (string to be copied)
  el.value = str;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '');
  // @ts-ignore
  el.style = { position: 'absolute', left: '-9999px' };
  document.body.append(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  el.remove();
}
