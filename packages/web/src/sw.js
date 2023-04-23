// sw.js
import {NetworkFirst, CacheFirst} from 'workbox-strategies';
import {registerRoute, NavigationRoute, Route} from 'workbox-routing';

const navigationRoute = new NavigationRoute(new NetworkFirst({
  cacheName: 'navigations'
}));

const imageAssetRoute = new Route(({request}) => {
  return request.destination === 'image';
}, new CacheFirst({
  cacheName: 'image-assets'
}));

registerRoute(navigationRoute);
registerRoute(imageAssetRoute);
