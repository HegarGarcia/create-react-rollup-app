export async function register() {
  await navigator.serviceWorker.register("/sw.js");
}
