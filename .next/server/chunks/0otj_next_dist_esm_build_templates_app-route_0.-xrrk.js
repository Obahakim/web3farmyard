module.exports=[21991,e=>{"use strict";var t=e.i(14400),a=e.i(46296),r=e.i(66810),o=e.i(73699),n=e.i(42469),i=e.i(35377),s=e.i(14590),l=e.i(21354),d=e.i(45039),p=e.i(50245),c=e.i(88714),u=e.i(20161),g=e.i(8762),h=e.i(19611),m=e.i(32343),f=e.i(93695);e.i(80476);var y=e.i(45812);let v=new(e.i(96930)).Resend(process.env.RESEND_API_KEY);async function w(e){try{var t;let{email:a,farmerName:r}=await e.json();if(!a||!r)return Response.json({error:"Email and farmer name are required"},{status:400});let o=await v.emails.send({from:"Web3Farmyard <onboarding@web3farmyard.com>",to:a,subject:`Welcome to Web3Farmyard, ${r}! 🌾 Your Airdrop Farming Begins Now`,html:(t=r,`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 650px; margin: 0 auto; background: #f9f9f9; padding: 0; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #1a6b00 0%, #0f4600 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 10px 0 0 0; opacity: 0.95; font-size: 16px; }
        .content { padding: 40px 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #1a6b00; margin: 0 0 15px 0; font-size: 20px; font-weight: 600; }
        .section p { margin: 0 0 10px 0; color: #555; }
        .page-card { background: white; border: 2px solid #e8f0e0; border-radius: 8px; padding: 18px; margin-bottom: 12px; }
        .page-card h3 { color: #1a6b00; margin: 0 0 8px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .page-card p { margin: 0; color: #666; font-size: 14px; }
        .icon { font-size: 20px; }
        .funnel { background: #f0f8e8; border-left: 4px solid #1a6b00; padding: 18px; border-radius: 6px; margin: 20px 0; }
        .funnel h3 { color: #1a6b00; margin: 0 0 12px 0; }
        .step { display: flex; gap: 12px; margin-bottom: 12px; font-size: 14px; }
        .step-num { background: #1a6b00; color: white; width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .step-text { flex: 1; color: #555; }
        .cta-button { display: inline-block; background: #1a6b00; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .cta-button:hover { background: #0f4600; }
        .highlight { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .highlight strong { color: #856404; }
        .footer { background: #f5f5f5; padding: 30px; text-align: center; font-size: 13px; color: #888; border-top: 1px solid #ddd; }
        .footer a { color: #1a6b00; text-decoration: none; }
        .divider { height: 1px; background: #e0e0e0; margin: 25px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        
        <!-- Header -->
        <div class="header">
          <h1>🌾 Welcome to Web3Farmyard, ${t}!</h1>
          <p>You've just joined the fastest path to profitable airdrop farming</p>
        </div>

        <!-- Main Content -->
        <div class="content">
          
          <div class="section">
            <p style="font-size: 16px; color: #333;">
              <strong>You're about to discover something most crypto beginners never find:</strong> A structured ecosystem where learning, task farming, and airdrops aren't separate activities—they're one continuous journey.
            </p>
          </div>

          <!-- The Ecosystem -->
          <div class="section">
            <h2>🗺️ Your Web3Farmyard Ecosystem</h2>
            <p style="margin-bottom: 20px; color: #666;">
              Web3Farmyard isn't just a website. It's a complete ecosystem designed to take you from zero Web3 knowledge to profitable airdrop farmer in 7 days. Here's what you're now part of:
            </p>

            <!-- 7-Day Onboarding -->
            <div class="page-card">
              <h3><span class="icon">📚</span> 7-Day Structured Onboarding</h3>
              <p><strong>/onboarding</strong> — Your step-by-step path:</p>
              <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #666; font-size: 14px;">
                <li><strong>Day 1:</strong> Create your first wallet, claim testnet ETH (no real money)</li>
                <li><strong>Day 2:</strong> Execute real swaps, bridges, and lending transactions</li>
                <li><strong>Day 3:</strong> Join TaskOn and start farming rewards (XP + tokens)</li>
                <li><strong>Day 4:</strong> Complete Zealy quests to build on-chain reputation</li>
                <li><strong>Day 5:</strong> Get Galxe credentials and network on Web3 socials</li>
                <li><strong>Day 6:</strong> Practice advanced strategies and deepen your knowledge</li>
                <li><strong>Day 7:</strong> Graduate and claim your first real airdrop</li>
              </ul>
            </div>

            <!-- Live Airdrops -->
            <div class="page-card">
              <h3><span class="icon">🎁</span> Live Airdrop Tracker</h3>
              <p><strong>/airdrops</strong> — Real-time opportunities, risk-rated:</p>
              <p>After Day 7, you'll use this page constantly. We track active airdrops, verify legitimacy, flag scams, and show you exactly what tasks to complete. No guessing. No wasted time on dead projects.</p>
            </div>

            <!-- DeFi Showroom -->
            <div class="page-card">
              <h3><span class="icon">📊</span> Live DeFi Chain Rankings</h3>
              <p><strong>/showroom</strong> — Real-time metrics for 191+ blockchains:</p>
              <p>Track TVL, protocol counts, 24h changes. Understand which chains are growing (good airdrop opportunities) vs declining (avoid). This is professional-grade data most beginners never see.</p>
            </div>

            <!-- Web3 Toolkit -->
            <div class="page-card">
              <h3><span class="icon">🛠️</span> Complete Web3 Toolkit</h3>
              <p><strong>/toolkit</strong> — 30+ essential tools for farmers:</p>
              <p>MetaMask, OKX Web3, Zerion, Galxe, Zealy, TaskOn, Uniswap, Aave, and more. Each tool links to its setup guide. No trial-and-error. Just go through your checklist.</p>
            </div>

            <!-- Educational Blog -->
            <div class="page-card">
              <h3><span class="icon">📖</span> Educational Blog</h3>
              <p><strong>/blog</strong> — Deep dives on crypto security and airdrop strategy:</p>
              <p>Articles on wallet security, identifying scams, understanding smart contracts, and airdrop farming tactics. Read while you eat breakfast. Become an expert while others are still confused.</p>
            </div>

            <!-- Crypto Graveyard -->
            <div class="page-card">
              <h3><span class="icon">☠️</span> The Crypto Graveyard</h3>
              <p><strong>/junkyard</strong> — Learn from 70+ major crypto failures:</p>
              <p>Luna, FTX, BitConnect, Celsius... We document every major rug pull and collapse. Learn what went wrong, how to spot the warning signs, and never lose money to obvious scams again.</p>
            </div>
          </div>

          <!-- The Funnel -->
          <div class="funnel">
            <h3>🎯 Your 7-Day Learning Funnel</h3>
            <div class="step">
              <div class="step-num">1</div>
              <div class="step-text"><strong>Day 1:</strong> Set up wallet, understand blockchain basics (testnet practice)</div>
            </div>
            <div class="step">
              <div class="step-num">2</div>
              <div class="step-text"><strong>Days 2-6:</strong> Complete on-chain transactions (swaps, bridges, lending) + task farming on TaskOn, Zealy, Galxe</div>
            </div>
            <div class="step">
              <div class="step-num">3</div>
              <div class="step-text"><strong>Day 7:</strong> You now have a real on-chain footprint + reputation. Ready for airdrops.</div>
            </div>
            <div class="step">
              <div class="step-num">4</div>
              <div class="step-text"><strong>Week 2+:</strong> Claim verified airdrops from /airdrops page. Keep building. Scale up.</div>
            </div>
          </div>

          <!-- Key Advantage -->
          <div class="highlight">
            <strong>🔑 The Real Advantage:</strong> Most people jump straight to airdrop hunting. They get rugged. They panic. We make you do 7 days of real work first so you understand what you're doing and have actual on-chain credentials. That's why our farmers succeed.
          </div>

          <!-- How to Navigate -->
          <div class="section">
            <h2>📍 How to Navigate Web3Farmyard</h2>
            <p><strong>Start here (you are at step 1):</strong></p>
            <ol style="color: #666; margin: 12px 0;">
              <li>Click "Start Day 1" to begin your onboarding journey</li>
              <li>Complete all 7 days (should take 2-3 hours per day max)</li>
              <li>Once Day 7 is done, your profile automatically unlocks access to the /airdrops page</li>
              <li>Start claiming. Keep learning. Scale up.</li>
            </ol>
            <p style="color: #999; font-size: 14px; margin-top: 15px;">
              💡 <strong>Tip:</strong> Join our Discord and Twitter (@web3farmyard) to ask questions, share wins, and stay updated on new airdrops and strategies.
            </p>
          </div>

          <!-- Call to Action -->
          <div style="text-align: center;">
            <a href="https://www.web3farmyard.com/onboarding/day-1" class="cta-button">Start Day 1 Now →</a>
          </div>

          <!-- What's Coming -->
          <div class="section">
            <h2>📬 What You'll Get From Us</h2>
            <p>Every week, you'll receive curated updates including:</p>
            <ul style="color: #666; margin: 12px 0;">
              <li>✓ New verified airdrops (with risk ratings)</li>
              <li>✓ Advanced farming strategies (for experienced farmers)</li>
              <li>✓ Scam alerts (we catch and flag them before you fall for them)</li>
              <li>✓ Tool updates and integrations</li>
              <li>✓ Community wins and shared experiences</li>
            </ul>
          </div>

          <!-- Final Message -->
          <div class="section">
            <p style="color: #1a6b00; font-weight: 600; font-size: 16px;">
              One more thing: You're joining a community of builders and farmers who've committed to doing this the right way. No shortcuts. No FUD. Just solid execution.
            </p>
            <p style="color: #666; margin-top: 12px;">
              We're excited to have you here. Let's farm.
            </p>
            <p style="color: #999; font-size: 14px; margin-top: 20px;">
              — The Web3Farmyard Team 🌾
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin-bottom: 15px;">
            <a href="https://www.web3farmyard.com">Web3Farmyard.com</a> | 
            <a href="https://twitter.com/web3farmyard">Twitter (@web3farmyard)</a> | 
            <a href="https://discord.gg/web3farmyard">Discord</a> | 
            <a href="https://t.me/web3farmyard">Telegram</a>
          </p>
          <p style="margin: 15px 0;">
            You're receiving this because you signed up at Web3Farmyard.
          </p>
          <p style="color: #ccc; margin: 0;">
            \xa9 2024 Web3Farmyard. Not financial advice. Always DYOR.
          </p>
        </div>

      </div>
    </body>
    </html>
  `)});if(o.error)return console.error("Resend error:",o.error),Response.json({error:"Failed to send email",details:o.error},{status:500});return Response.json({success:!0,message:"Welcome email sent successfully"},{status:200})}catch(e){return console.error("Resend error:",e),Response.json({error:"Failed to send email",details:String(e)},{status:500})}}e.s(["POST",0,w],22516);var x=e.i(22516);let b=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/send-welcome-email/route",pathname:"/api/send-welcome-email",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/Documents/web3farmyard/w3f-next/app/api/send-welcome-email/route.ts",nextConfigOutput:"",userland:x,...{}}),{workAsyncStorage:R,workUnitAsyncStorage:k,serverHooks:C}=b;async function E(e,t,r){r.requestMeta&&(0,o.setRequestMeta)(e,r.requestMeta),b.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/send-welcome-email/route";v=v.replace(/\/index$/,"")||"/";let w=await b.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:x,params:R,nextConfig:k,parsedUrl:C,isDraftMode:E,prerenderManifest:T,routerServerContext:A,isOnDemandRevalidate:D,revalidateOnlyGenerated:N,resolvedPathname:S,clientReferenceManifest:F,serverActionsManifest:O}=w,P=(0,s.normalizeAppPath)(v),W=!!(T.dynamicRoutes[P]||T.routes[S]),j=async()=>((null==A?void 0:A.render404)?await A.render404(e,t,C,!1):t.end("This page could not be found"),null);if(W&&!E){let e=!!T.routes[S],t=T.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(k.adapterPath)return await j();throw new f.NoFallbackError}}let _=null;!W||b.isDev||E||(_="/index"===(_=S)?"/":_);let H=!0===b.isDev||!W,U=W&&!H;O&&F&&(0,i.setManifestsSingleton)({page:v,clientReferenceManifest:F,serverActionsManifest:O});let q=e.method||"GET",M=(0,n.getTracer)(),I=M.getActiveScopeSpan(),z=!!(null==A?void 0:A.isWrappedByNextServer),L=!!(0,o.getRequestMeta)(e,"minimalMode"),K=(0,o.getRequestMeta)(e,"incrementalCache")||await b.getIncrementalCache(e,k,T,L);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let Y={params:R,previewProps:T.preview,renderOpts:{experimental:{authInterrupts:!!k.experimental.authInterrupts},cacheComponents:!!k.cacheComponents,supportsDynamicResponse:H,incrementalCache:K,cacheLifeProfiles:k.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,o)=>b.onRequestError(e,t,r,o,A)},sharedContext:{buildId:x}},B=new l.NodeNextRequest(e),G=new l.NodeNextResponse(t),$=d.NextRequestAdapter.fromNodeNextRequest(B,(0,d.signalFromNodeResponse)(t));try{let o,i=async e=>b.handle($,Y).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=M.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${q} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),o&&o!==e&&(o.setAttribute("http.route",r),o.updateName(t))}else e.updateName(`${q} ${v}`)}),s=async o=>{var n,s;let l=async({previousCacheEntry:a})=>{try{if(!L&&D&&N&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=Y.renderOpts.fetchMetrics;let s=Y.renderOpts.pendingWaitUntil;s&&r.waitUntil&&(r.waitUntil(s),s=void 0);let l=Y.renderOpts.collectedTags;if(!W)return await (0,u.sendResponse)(B,G,n,Y.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[m.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==Y.renderOpts.collectedRevalidate&&!(Y.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&Y.renderOpts.collectedRevalidate,r=void 0===Y.renderOpts.collectedExpire||Y.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:Y.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await b.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:D})},!1,A),t}},d=await b.handleResponse({req:e,nextConfig:k,cacheKey:_,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:D,revalidateOnlyGenerated:N,responseGenerator:l,waitUntil:r.waitUntil,isMinimalMode:L});if(!W)return null;if((null==d||null==(n=d.value)?void 0:n.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(s=d.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});L||t.setHeader("x-nextjs-cache",D?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),E&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,g.fromNodeOutgoingHttpHeaders)(d.value.headers);return L&&W||p.delete(m.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,h.getCacheControlHeader)(d.cacheControl)),await (0,u.sendResponse)(B,G,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};z&&I?await s(I):(o=M.getActiveScopeSpan(),await M.withPropagatedContext(e.headers,()=>M.trace(p.BaseServerSpan.handleRequest,{spanName:`${q} ${v}`,kind:n.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},s),void 0,!z))}catch(t){if(t instanceof f.NoFallbackError||await b.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:D})},!1,A),W)throw t;return await (0,u.sendResponse)(B,G,new Response(null,{status:500})),null}}e.s(["handler",0,E,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:R,workUnitAsyncStorage:k})},"routeModule",0,b,"serverHooks",0,C,"workAsyncStorage",0,R,"workUnitAsyncStorage",0,k],21991)}];

//# sourceMappingURL=0otj_next_dist_esm_build_templates_app-route_0.-xrrk.js.map