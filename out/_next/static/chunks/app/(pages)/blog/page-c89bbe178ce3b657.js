(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[377],{69138:function(e,t,n){Promise.resolve().then(n.bind(n,88e3))},33145:function(e,t,n){"use strict";n.d(t,{default:function(){return l.a}});var r=n(48461),l=n.n(r)},55775:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return s}});let r=n(47043);n(57437),n(2265);let l=r._(n(15602));function s(e,t){var n;let r={loading:e=>{let{error:t,isLoading:n,pastDelay:r}=e;return null}};"function"==typeof e&&(r.loader=e);let s={...r,...t};return(0,l.default)({...s,modules:null==(n=s.loadableGenerated)?void 0:n.modules})}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},48461:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{default:function(){return a},getImageProps:function(){return u}});let r=n(47043),l=n(55346),s=n(65878),i=r._(n(5084));function u(e){let{props:t}=(0,l.getImgProps)(e,{defaultLoader:i.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/my_site/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0}});for(let[e,n]of Object.entries(t))void 0===n&&delete t[e];return{props:t}}let a=s.Image},81523:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"BailoutToCSR",{enumerable:!0,get:function(){return l}});let r=n(18993);function l(e){let{reason:t,children:n}=e;if("undefined"==typeof window)throw new r.BailoutToCSRError(t);return n}},15602:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return o}});let r=n(57437),l=n(2265),s=n(81523),i=n(70049);function u(e){return{default:e&&"default"in e?e.default:e}}let a={loader:()=>Promise.resolve(u(()=>null)),loading:null,ssr:!0},o=function(e){let t={...a,...e},n=(0,l.lazy)(()=>t.loader().then(u)),o=t.loading;function d(e){let u=o?(0,r.jsx)(o,{isLoading:!0,pastDelay:!0,error:null}):null,a=t.ssr?(0,r.jsxs)(r.Fragment,{children:["undefined"==typeof window?(0,r.jsx)(i.PreloadCss,{moduleIds:t.modules}):null,(0,r.jsx)(n,{...e})]}):(0,r.jsx)(s.BailoutToCSR,{reason:"next/dynamic",children:(0,r.jsx)(n,{...e})});return(0,r.jsx)(l.Suspense,{fallback:u,children:a})}return d.displayName="LoadableComponent",d}},70049:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"PreloadCss",{enumerable:!0,get:function(){return s}});let r=n(57437),l=n(20544);function s(e){let{moduleIds:t}=e;if("undefined"!=typeof window)return null;let n=(0,l.getExpectedRequestStore)("next/dynamic css"),s=[];if(n.reactLoadableManifest&&t){let e=n.reactLoadableManifest;for(let n of t){if(!e[n])continue;let t=e[n].files.filter(e=>e.endsWith(".css"));s.push(...t)}}return 0===s.length?null:(0,r.jsx)(r.Fragment,{children:s.map(e=>(0,r.jsx)("link",{precedence:"dynamic",rel:"stylesheet",href:n.assetPrefix+"/_next/"+encodeURI(e),as:"style"},e))})}},88e3:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return o}});var r=n(57437),l=(n(1066),n(90331),n(55775)),s=n.n(l),i=n(35680),u=n(8578);let a=i.Z.basePath||"";function o(){return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(u.Z,{title:"開発ブログ",imagePath:"".concat(a,"/images/cats/coming_soon.png")})})}s()(()=>Promise.all([n.e(308),n.e(240),n.e(699),n.e(956),n.e(113),n.e(737)]).then(n.bind(n,84737)),{loadableGenerated:{webpack:()=>[84737]},ssr:!1})},1066:function(e,t,n){"use strict";var r=n(57437),l=n(2265);t.Z=()=>{let e=(0,l.useRef)(null);return(0,l.useEffect)(()=>{let t=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target instanceof HTMLElement&&(e.target.classList.remove("w-0"),e.target.classList.add("w-full")),t.unobserve(e.target))})},{threshold:.1}),n=e.current;return n&&t.observe(n),()=>{n&&t.unobserve(n)}},[]),(0,r.jsx)("div",{ref:e,className:"my-6 h-0.5 w-0 bg-main-black transition-all duration-1000 ease-in-out"})}},90331:function(e,t,n){"use strict";var r=n(57437);n(2265),t.Z=e=>{let{title:t,subtitle:n,mainMessage:l}=e;return(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("div",{className:"md:flex",children:[(0,r.jsxs)("div",{className:"w-full md:w-1/2",children:[(0,r.jsx)("h1",{children:t}),(0,r.jsx)("h3",{className:"mt-5",children:n})]}),(0,r.jsx)("div",{className:"mt-10 flex w-full md:mt-0 md:w-1/2 md:justify-center",children:l})]})})}},8578:function(e,t,n){"use strict";var r=n(57437),l=n(33145);n(2265);var s=n(1066),i=n(90331);t.Z=e=>{let{title:t,imagePath:n}=e;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("section",{children:(0,r.jsx)(i.Z,{title:t,subtitle:"",mainMessage:(0,r.jsx)(r.Fragment,{})})}),(0,r.jsx)(s.Z,{}),(0,r.jsx)("section",{children:(0,r.jsx)("div",{className:"flex w-full justify-center",children:(0,r.jsx)(l.default,{src:n,alt:"coming soon",width:500,height:500,className:"rounded-2xl"})})})]})}},35680:function(e,t){"use strict";t.Z={output:"export",images:{unoptimized:!0},basePath:"/my_site",assetPrefix:"/my_site/",staticPageGenerationTimeout:60}}},function(e){e.O(0,[878,971,117,744],function(){return e(e.s=69138)}),_N_E=e.O()}]);