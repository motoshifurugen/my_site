(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[160],{2051:function(e,t,n){Promise.resolve().then(n.bind(n,8709))},6648:function(e,t,n){"use strict";n.d(t,{default:function(){return r.a}});var s=n(5601),r=n.n(s)},5601:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{default:function(){return l},getImageProps:function(){return u}});let s=n(9920),r=n(497),i=n(8173),a=s._(n(1241));function u(e){let{props:t}=(0,r.getImgProps)(e,{defaultLoader:a.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/my_site/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0}});for(let[e,n]of Object.entries(t))void 0===n&&delete t[e];return{props:t}}let l=i.Image},4793:function(e,t,n){"use strict";var s=n(7437),r=n(2265);t.Z=()=>{let e=(0,r.useRef)(null);return(0,r.useEffect)(()=>{let t=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target instanceof HTMLElement&&(e.target.classList.remove("w-0"),e.target.classList.add("w-full")),t.unobserve(e.target))})},{threshold:.1}),n=e.current;return n&&t.observe(n),()=>{n&&t.unobserve(n)}},[]),(0,s.jsx)("div",{ref:e,className:"my-6 h-0.5 w-0 bg-main-black transition-all duration-1000 ease-in-out"})}},3440:function(e,t,n){"use strict";var s=n(7437);n(2265),t.Z=e=>{let{title:t,subtitle:n,mainMessage:r}=e;return(0,s.jsx)(s.Fragment,{children:(0,s.jsxs)("div",{className:"md:flex",children:[(0,s.jsxs)("div",{className:"w-full md:w-1/2",children:[(0,s.jsx)("h1",{children:t}),(0,s.jsx)("h3",{className:"mt-5",children:n})]}),(0,s.jsx)("div",{className:"mt-10 flex w-full md:mt-0 md:w-1/2 md:justify-center",children:r})]})})}},2413:function(e,t,n){"use strict";var s=n(7437),r=n(6648);n(2265);var i=n(4793),a=n(3440);t.Z=e=>{let{title:t,imagePath:n}=e;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("section",{children:(0,s.jsx)(a.Z,{title:t,subtitle:"",mainMessage:(0,s.jsx)(s.Fragment,{})})}),(0,s.jsx)(i.Z,{}),(0,s.jsx)("section",{children:(0,s.jsx)("div",{className:"flex w-full justify-center",children:(0,s.jsx)(r.default,{src:n,alt:"coming soon",width:500,height:500,className:"rounded-2xl"})})})]})}},8709:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return l},metadata:function(){return u}});var s=n(7437),r=n(4298),i=n(2413);let a=r.Z.basePath||"",u={title:"notfound - ページが見つかりません"};function l(){return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)(i.Z,{title:"404",imagePath:"".concat(a,"/images/cats/page_not_found.png")})})}},4298:function(e,t){"use strict";t.Z={images:{unoptimized:!0},output:"export",basePath:"/my_site",assetPrefix:"/my_site/",staticPageGenerationTimeout:60}}},function(e){e.O(0,[173,971,23,744],function(){return e(e.s=2051)}),_N_E=e.O()}]);