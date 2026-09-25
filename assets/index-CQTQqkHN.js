(function(){const _=document.createElement("link").relList;if(_&&_.supports&&_.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))f(s);new MutationObserver(s=>{for(const m of s)if(m.type==="childList")for(const E of m.addedNodes)E.tagName==="LINK"&&E.rel==="modulepreload"&&f(E)}).observe(document,{childList:!0,subtree:!0});function w(s){const m={};return s.integrity&&(m.integrity=s.integrity),s.referrerPolicy&&(m.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?m.credentials="include":s.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function f(s){if(s.ep)return;s.ep=!0;const m=w(s);fetch(s.href,m)}})();const be=`  <div class="card">
    <h2>Saved Quotes</h2>
    <p class="hint" id="quotes-schema-hint">Quotes never change stock.</p>
    <div class="filter-row" style="margin-bottom:0.5rem;">
      <div class="filter-row-label">Status</div>
      <div id="quote-status-filters" class="source-filters"></div>
    </div>
    <div id="quotes-list" style="overflow-x:auto;"></div>
    <div class="btn-group" style="margin-top:0.65rem;">
      <button type="button" onclick="startNewQuote()">New quote from cart</button>
      <button type="button" class="secondary" onclick="loadQuotesList()">Refresh list</button>
    </div>
  </div>

  <div class="card">
    <h2>Quote Builder <span id="quote-count-badge" style="font-weight:400;color:var(--muted);font-size:0.85rem;"></span></h2>
    <p class="hint">Add parts from Home or Scan.</p>
    <input type="hidden" id="quote-edit-id" value="">

    <div class="row">
      <div>
        <label>Quote #</label>
        <input type="text" id="quote-number" placeholder="Auto Q-YYYY-###" autocomplete="off">
      </div>
      <div>
        <label>Status</label>
        <select id="quote-status">
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="expired">Expired</option>
          <option value="void">Void</option>
        </select>
      </div>
      <div>
        <label>Date</label>
        <input type="date" id="quote-date">
      </div>
      <div>
        <label>Valid Until</label>
        <input type="date" id="quote-valid">
      </div>
    </div>
    <div class="row">
      <div>
        <label>Customer</label>
        <input type="text" id="quote-customer" list="customer-suggestions" placeholder="Customer name" onchange="onQuoteCustomerChange()">
        <datalist id="customer-suggestions"></datalist>
      </div>
      <div>
        <label>Project</label>
        <input type="text" id="quote-project" placeholder="Vessel, job, or project">
      </div>
    </div>
    <div class="row">
      <div>
        <label>RFQ #</label>
        <input type="text" id="quote-rfq" placeholder="Customer RFQ / request #">
      </div>
      <div>
        <label>Prepared By</label>
        <input type="text" id="quote-by" value="" readonly placeholder="Signed-in person">
      </div>
    </div>
    <label style="display:flex;align-items:center;gap:0.45rem;margin-bottom:0.7rem;font-size:0.85rem;color:var(--muted);">
      <input type="checkbox" id="quote-save-customer" style="width:auto;margin:0;">
      Also save this customer
    </label>
    <div class="row">
      <div>
        <label>FOB point</label>
        <select id="quote-fob-select" onchange="onComboSelect('fob')">
          <option value="">— Select —</option>
          <option value="Origin">Origin</option>
          <option value="Destination">Destination</option>
          <option value="__custom__">Other (type and save)…</option>
        </select>
        <input type="text" id="quote-fob" placeholder="Type a custom FOB point" style="display:none;margin-top:0.4rem;">
      </div>
      <div>
        <label>Payment terms</label>
        <select id="quote-terms-select" onchange="onComboSelect('terms')">
          <option value="">— Select —</option>
          <option value="Due on receipt">Due on receipt</option>
          <option value="Net 15">Net 15</option>
          <option value="Net 30">Net 30</option>
          <option value="Net 45">Net 45</option>
          <option value="Net 60">Net 60</option>
          <option value="__custom__">Other (type and save)…</option>
        </select>
        <input type="text" id="quote-terms" placeholder="Type terms — saved with the customer" style="display:none;margin-top:0.4rem;">
      </div>
    </div>
    <p class="hint">FOB and terms: pick a value or type Other to save a new one.</p>
    <div>
      <label>Lead time</label>
      <input type="text" id="quote-lead" placeholder="If ordered today, when to expect delivery">
    </div>
    <div>
      <label>Notes</label>
      <textarea id="quote-notes" rows="2" placeholder="Delivery or special notes..."></textarea>
    </div>
    <p class="hint">Quotes note a 3.5% fee if paid by card.</p>

    <div id="quote-lines" style="margin:1rem 0;"></div>

    <div class="btn-group">
      <button type="button" onclick="saveQuoteToDb()">Save quote</button>
      <button type="button" class="secondary" onclick="generateQuote()">Print quote</button>
      <button type="button" class="secondary" onclick="printPackingList()">Packing list</button>
      <button type="button" class="secondary" onclick="openInvoiceForm()">Invoice…</button>
      <button type="button" class="secondary" onclick="duplicateCurrentQuote()">Duplicate</button>
      <button type="button" class="secondary" onclick="voidCurrentQuote()">Void</button>
      <button type="button" class="secondary" onclick="clearQuote()">Clear cart</button>
    </div>

    <div id="invoice-box" class="order-box" style="display:none;margin-top:1rem;">
      <h2 style="font-size:0.95rem;">Invoice from this quote</h2>
      <p class="hint">Due date starts from the quote’s valid-until date.</p>
      <div class="row">
        <div>
          <label>Customer PO #</label>
          <input type="text" id="inv-po" placeholder="PO number">
        </div>
        <div>
          <label>Due date</label>
          <input type="date" id="inv-due">
        </div>
      </div>
      <label>Ship to address</label>
      <textarea id="inv-ship" rows="2" placeholder="Name, street, city, state, ZIP"></textarea>
      <div class="row">
        <div>
          <label>Shipping fee ($)</label>
          <input type="number" id="inv-shipfee" step="0.01" min="0" value="0">
        </div>
        <div>
          <label>Duty ($)</label>
          <input type="number" id="inv-duty" step="0.01" min="0" value="0">
        </div>
        <div>
          <label>Tariffs ($)</label>
          <input type="number" id="inv-tariffs" step="0.01" min="0" value="0">
        </div>
      </div>
      <label style="display:flex;align-items:center;gap:0.45rem;font-size:0.85rem;">
        <input type="checkbox" id="inv-cc" style="width:auto;margin:0;" onchange="updateInvoicePreview()">
        Customer paying by credit card (add 3.5% fee)
      </label>
      <p class="hint" id="inv-preview">Totals update when you print / save.</p>
      <div class="btn-group">
        <button type="button" onclick="saveAndPrintInvoice()">Save &amp; print invoice</button>
        <button type="button" class="secondary" onclick="document.getElementById('invoice-box').style.display='none'">Close</button>
      </div>
    </div>
  </div>`;function n(){const g=window.InmarShop;if(!g)throw new Error("Shop is not ready");return g}let te=!1;function ge(){if(te)return;te=!0;const g=document.getElementById("quote");g&&!g.dataset.installed&&(g.innerHTML=be,g.dataset.installed="1");let _=[],w="all",f=null,s=JSON.parse(localStorage.getItem("inv_quote")||"[]");function m(){localStorage.setItem("inv_quote",JSON.stringify(s)),B()}function E(e){const t=n().inventory.find(i=>i.id===e);if(!t)return;const o=s.find(i=>i.id===e||i.inventory_id&&i.inventory_id===e);o?o.qty=(o.qty||1)+1:s.push({id:t.id,inventory_id:t.id,part_number:t.part_number,name:t.name,qty:1,unit_price:t.sell_price!=null?Number(t.sell_price):0});const a=document.getElementById("quote-by");a&&!a.value&&n().currentUser()&&(a.value=n().currentUser()),m(),n().showStatus(`Added “${t.part_number}” to quote`,"success")}function ne(e,t,o){s[e]&&(t==="qty"&&(s[e].qty=Math.max(1,parseInt(o)||1)),t==="unit_price"&&(s[e].unit_price=parseFloat(o)||0),m())}function oe(e){s.splice(e,1),m()}function ae(){if(s.length&&!confirm("Clear the working cart? (Saved quotes in the database are kept.)"))return;s=[],f=null;const e=document.getElementById("quote-edit-id");e&&(e.value="");const t=document.getElementById("quote-status");t&&(t.value="draft");const o=document.getElementById("quote-number");o&&(o.value=""),m(),n().showStatus("Cart cleared","info")}function B(){const e=document.getElementById("quote-count-badge");e&&(e.textContent=s.length?`(${s.length} line${s.length>1?"s":""})`:"");const t=document.getElementById("quote-lines");if(!t)return;if(s.length===0){t.innerHTML='<p class="empty">No items yet — add from Home or Scan.</p>';return}let o=0;t.innerHTML=`
      <table>
        <thead><tr><th>Part</th><th>Qty</th><th>Unit $</th><th>Line</th><th></th></tr></thead>
        <tbody>
          ${s.map((a,i)=>{const r=(a.qty||1)*(a.unit_price||0);return o+=r,`<tr>
              <td><strong>${n().escapeHtml(a.name)}</strong><br><code style="font-size:0.75rem;color:var(--muted)">${n().escapeHtml(a.part_number)}</code></td>
              <td><input type="number" min="1" value="${a.qty}" style="width:70px;margin:0" onchange="updateQuoteLine(${i},'qty',this.value)"></td>
              <td><input type="number" min="0" step="0.01" value="${a.unit_price}" style="width:90px;margin:0" onchange="updateQuoteLine(${i},'unit_price',this.value)"></td>
              <td>${n().money(r)}</td>
              <td><button class="danger" onclick="removeQuoteLine(${i})">×</button></td>
            </tr>`}).join("")}
        </tbody>
      </table>
      <div style="text-align:right;font-weight:700;margin-top:0.75rem;font-size:1.1rem;">Total: ${n().money(o)}</div>
    `}function J(){return s.reduce((e,t)=>e+(t.qty||1)*(t.unit_price||0),0)}function I(e,t){const o=e?new Date(e+"T12:00:00"):new Date;return isNaN(o.getTime())?"":(o.setDate(o.getDate()+t),o.toISOString().slice(0,10))}function ie(){var t;const e=(t=document.getElementById("quote-date"))==null?void 0:t.value;return I(e||new Date().toISOString().slice(0,10),90)}function j(e){return"inv_lookups_"+e}function T(e){try{const t=JSON.parse(localStorage.getItem(j(e))||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function U(e,t){const o=String(t||"").trim();if(!o)return;const a=T(e);if(!a.some(i=>i.toLowerCase()===o.toLowerCase())){a.push(o);try{localStorage.setItem(j(e),JSON.stringify(a))}catch{}}n().supabaseClient&&n().supabaseClient.from("app_lookups").upsert({kind:e,value:o}).then(()=>{},()=>{})}function S(e){const t=document.getElementById("quote-"+e+"-select"),o=document.getElementById("quote-"+e);return t&&t.value&&t.value!=="__custom__"?t.value.trim():((o==null?void 0:o.value)||"").trim()}function q(e,t){const o=document.getElementById("quote-"+e+"-select"),a=document.getElementById("quote-"+e),i=String(t||"").trim();if(!o){a&&(a.value=i);return}[...o.options].some(u=>u.value===i&&u.value!==""&&u.value!=="__custom__")?(o.value=i,a&&(a.value=i,a.style.display="none")):i?(o.value="__custom__",a&&(a.value=i,a.style.display="")):(o.value="",a&&(a.value="",a.style.display="none"))}function se(e){const t=document.getElementById("quote-"+e+"-select"),o=document.getElementById("quote-"+e);!t||!o||(t.value==="__custom__"?(o.style.display="",o.value="",o.focus()):(o.value=t.value,o.style.display="none"))}async function M(e,t){const o=document.getElementById("quote-"+e+"-select");if(!o)return;const a=S(e),i=e==="fob"?"fob":"payment_terms",r=new Set(t||[]);if(T(i).forEach(l=>r.add(l)),n().supabaseClient)try{const{data:l}=await n().supabaseClient.from("app_lookups").select("value").eq("kind",i);(l||[]).forEach(d=>{d.value&&r.add(d.value)})}catch{}const u=['<option value="">— Select —</option>'];[...r].filter(Boolean).sort((l,d)=>l.localeCompare(d)).forEach(l=>{u.push(`<option value="${n().escapeHtml(l)}">${n().escapeHtml(l)}</option>`)}),u.push('<option value="__custom__">Other (type and save)…</option>'),o.innerHTML=u.join(""),q(e,a)}async function x(){await M("fob",["Origin","Destination"]);const e=["Due on receipt","Net 15","Net 30","Net 45","Net 60"];if(n().supabaseClient&&n().hasQuotesTables)try{const{data:t}=await n().supabaseClient.from("customers").select("payment_terms");(t||[]).forEach(o=>{o.payment_terms&&e.push(o.payment_terms)})}catch{}await M("terms",e)}async function F(e){if(!e||!n().supabaseClient||!n().hasQuotesTables)return null;try{const{data:t}=await n().supabaseClient.from("customers").select("id,payment_terms,name").ilike("name",e).limit(1);return t&&t[0]||null}catch{return null}}async function re(){var o;const e=(((o=document.getElementById("quote-customer"))==null?void 0:o.value)||"").trim();if(!e)return;const t=await F(e);t&&t.payment_terms&&q("terms",t.payment_terms)}async function $(e){const t=new Date().getFullYear(),o=e==="quote"?"Q":e==="order"?"SO":e==="invoice"?"INV":e==="packing_list"?"PL":"DOC";if(!n().supabaseClient||!n().hasQuotesTables)return`${o}-${t}-001`;try{const{data:i}=await n().supabaseClient.from("document_counters").select("last_value").eq("doc_type",e).eq("year",t).maybeSingle();let r=((i==null?void 0:i.last_value)||0)+1;return i?await n().supabaseClient.from("document_counters").update({last_value:r}).eq("doc_type",e).eq("year",t):await n().supabaseClient.from("document_counters").insert({doc_type:e,year:t,last_value:r}),`${o}-${t}-${String(r).padStart(3,"0")}`}catch(i){console.warn("counter failed",i)}const a=e==="invoice"?"invoices":e==="packing_list"?"packing_lists":"quotes";try{const{data:i}=await n().supabaseClient.from(a).select("number").like("number",`${o}-${t}-%`);let r=0;return(i||[]).forEach(u=>{const l=String(u.number||"").match(/-(\d+)$/);l&&(r=Math.max(r,parseInt(l[1],10)))}),`${o}-${t}-${String(r+1).padStart(3,"0")}`}catch{return`${o}-${t}-001`}}async function C(){if(!n().supabaseClient)return!1;if(n().hasQuotesTables)return!0;const e=await n().supabaseClient.from("quotes").select("id").limit(1);return n().hasQuotesTables=!e.error,n().hasQuotesTables}async function X(){const e=document.getElementById("customer-suggestions");if(!e||!n().supabaseClient||!n().hasQuotesTables)return;const{data:t}=await n().supabaseClient.from("customers").select("name,company").order("name").limit(200),o=new Set;(t||[]).forEach(a=>{a.name&&o.add(a.name),a.company&&o.add(a.company)}),e.innerHTML=[...o].sort().map(a=>`<option value="${n().escapeHtml(a)}">`).join("")}function A(){const e=document.getElementById("quote-status-filters");if(!e)return;const t=[{id:"all",label:"All"},{id:"draft",label:"Draft"},{id:"sent",label:"Sent"},{id:"accepted",label:"Accepted"},{id:"expired",label:"Expired"},{id:"void",label:"Void"}];e.innerHTML=t.map(o=>`<button type="button" class="filter-chip ${w===o.id?"active":""}" onclick="setQuoteStatusFilter('${o.id}')">${o.label}</button>`).join("")}function le(e){w=e,A(),z()}async function k(){const e=document.getElementById("quotes-schema-hint"),t=document.getElementById("quotes-list");if(A(),!n().supabaseClient)return;if(!await C()){e&&(e.textContent="Run Phase 1 SQL on More to save quotes."),t&&(t.innerHTML='<p class="empty">Install quotes SQL to save and list quotes.</p>');return}e&&(e.textContent="Saving a quote does not change stock.");const{data:a,error:i}=await n().supabaseClient.from("quotes").select("id,number,customer_name,status,quote_date,valid_until,prepared_by,updated_at").order("updated_at",{ascending:!1}).limit(200);if(i){t&&(t.innerHTML=`<p class="empty">Could not load quotes: ${n().escapeHtml(i.message)}</p>`);return}_=a||[],await X(),z()}function z(){const e=document.getElementById("quotes-list");if(!e)return;let t=_;if(w!=="all"&&(t=t.filter(o=>o.status===w)),!t.length){e.innerHTML='<p class="empty">No saved quotes for this filter.</p>';return}e.innerHTML=`
      <table>
        <thead><tr><th>Number</th><th>Customer</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>
          ${t.map(o=>`
            <tr>
              <td><code>${n().escapeHtml(o.number)}</code></td>
              <td>${n().escapeHtml(o.customer_name||"—")}</td>
              <td><span class="badge ${o.status==="void"?"needs-date":o.status==="accepted"?"open-order":"source-tag"}">${n().escapeHtml(o.status)}</span></td>
              <td style="font-size:0.8rem;color:var(--muted)">${n().escapeHtml(o.quote_date||"")}</td>
              <td class="actions">
                <button class="secondary" onclick="openQuote('${o.id}')">Open</button>
                <button class="secondary" onclick="duplicateQuoteById('${o.id}')">Dup</button>
                <button class="secondary" onclick="printQuoteById('${o.id}')">Print</button>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>`}async function ue(){f=null,document.getElementById("quote-edit-id").value="",document.getElementById("quote-status").value="draft",document.getElementById("quote-number").value="";const e=new Date().toISOString().slice(0,10);document.getElementById("quote-date").value=e,document.getElementById("quote-valid").value=I(e,90),document.getElementById("quote-by").value=n().currentUser()||"",document.getElementById("quote-project").value="",document.getElementById("quote-rfq").value="",document.getElementById("quote-lead").value="",document.getElementById("quote-notes").value="",document.getElementById("quote-customer").value="";const t=document.getElementById("invoice-box");t&&(t.style.display="none"),n().hasQuotesTables&&(document.getElementById("quote-number").value=await $("quote")),await x(),q("fob",""),q("terms",""),B(),n().showStatus("Builder ready — add lines then Save quote","info")}async function V(e){if(!await C()){n().showStatus("Quotes tables not installed","error");return}const{data:t,error:o}=await n().supabaseClient.from("quotes").select("*").eq("id",e).maybeSingle();if(o||!t){n().showStatus((o==null?void 0:o.message)||"Quote not found","error");return}const{data:a}=await n().supabaseClient.from("quote_lines").select("*").eq("quote_id",e).order("line_no");f=t.id,document.getElementById("quote-edit-id").value=t.id,document.getElementById("quote-number").value=t.number||"",document.getElementById("quote-status").value=t.status||"draft",document.getElementById("quote-date").value=t.quote_date||"",document.getElementById("quote-valid").value=t.valid_until||"",document.getElementById("quote-customer").value=t.customer_name||"";const i=document.getElementById("quote-project");i&&(i.value=t.project||"");const r=document.getElementById("quote-rfq");r&&(r.value=t.rfq_number||"");const u=document.getElementById("quote-lead");u&&(u.value=t.lead_time||""),document.getElementById("quote-by").value=t.prepared_by||n().currentUser()||"",document.getElementById("quote-notes").value=t.notes||"",await x(),q("fob",t.fob_point||""),q("terms",t.payment_terms||""),document.getElementById("quote-save-customer").checked=!1,s=(a||[]).map(l=>({id:l.inventory_id||l.id,inventory_id:l.inventory_id,part_number:l.part_number,name:l.name,qty:Number(l.qty)||1,unit_price:Number(l.unit_price)||0})),m(),n().showStatus(`Opened ${t.number}`,"success")}async function de(){var y,h,b,N,W,Z;if(!n().requireUser("saving quotes"))return;if(!await C()){n().showStatus("Run Phase 1 quotes SQL on the More tab first","error");return}if(s.length===0){n().showStatus("Add at least one line before saving","error");return}let e=(document.getElementById("quote-number").value||"").trim();e||(e=await $("quote"),document.getElementById("quote-number").value=e);const t=(document.getElementById("quote-customer").value||"").trim(),o=(((y=document.getElementById("quote-project"))==null?void 0:y.value)||"").trim(),a=(((h=document.getElementById("quote-rfq"))==null?void 0:h.value)||"").trim(),i=S("fob"),r=S("terms"),u=(((b=document.getElementById("quote-lead"))==null?void 0:b.value)||"").trim();i&&U("fob",i),r&&U("payment_terms",r);let l=null;if((N=document.getElementById("quote-save-customer"))!=null&&N.checked&&t){const p=await F(t);if(p!=null&&p.id)l=p.id,await n().supabaseClient.from("customers").update({payment_terms:r||null,updated_at:new Date().toISOString()}).eq("id",l);else{const{data:H,error:ee}=await n().supabaseClient.from("customers").insert({name:t,payment_terms:r||null}).select("id").maybeSingle();ee?console.warn(ee):l=H==null?void 0:H.id}}const d={number:e,customer_id:l,customer_name:t||null,project:o||null,rfq_number:a||null,fob_point:i||null,payment_terms:r||null,lead_time:u||null,status:document.getElementById("quote-status").value||"draft",quote_date:document.getElementById("quote-date").value||null,valid_until:document.getElementById("quote-valid").value||null,prepared_by:(document.getElementById("quote-by").value||"").trim()||n().currentUser()||null,notes:(document.getElementById("quote-notes").value||"").trim()||null,created_by:n().currentUser(),updated_at:new Date().toISOString()};let c=f||document.getElementById("quote-edit-id").value||null,v;if(c)({error:v}=await n().supabaseClient.from("quotes").update(d).eq("id",c)),v||await n().supabaseClient.from("quote_lines").delete().eq("quote_id",c);else{const p=await n().supabaseClient.from("quotes").insert(d).select("id").maybeSingle();v=p.error,c=(W=p.data)==null?void 0:W.id}if(v&&/project|rfq_number|fob_point|payment_terms|lead_time/i.test(v.message||""))if(delete d.project,delete d.rfq_number,delete d.fob_point,delete d.payment_terms,delete d.lead_time,c)({error:v}=await n().supabaseClient.from("quotes").update(d).eq("id",c)),v||await n().supabaseClient.from("quote_lines").delete().eq("quote_id",c);else{const p=await n().supabaseClient.from("quotes").insert(d).select("id").maybeSingle();v=p.error,c=(Z=p.data)==null?void 0:Z.id}if(v){n().showStatus("Save failed: "+v.message+" — run Phase 2 SQL on the More tab for new quote fields","error");return}const O=s.map((p,H)=>({quote_id:c,line_no:H+1,inventory_id:p.inventory_id||p.id||null,part_number:p.part_number||null,name:p.name||"Item",qty:p.qty||1,unit_price:p.unit_price||0})),{error:Q}=await n().supabaseClient.from("quote_lines").insert(O);if(Q){n().showStatus("Quote header saved but lines failed: "+Q.message,"error");return}f=c,document.getElementById("quote-edit-id").value=c,n().showStatus(`Quote ${e} saved (${n().currentUser()})`,"success"),await k()}async function ce(){if(!n().requireUser("voiding quotes"))return;const e=f||document.getElementById("quote-edit-id").value;if(!e){n().showStatus("Open a saved quote to void it","error");return}if(!confirm("Void this quote? It will be kept for history with status void."))return;const{error:t}=await n().supabaseClient.from("quotes").update({status:"void",updated_at:new Date().toISOString()}).eq("id",e);if(t){n().showStatus(t.message,"error");return}document.getElementById("quote-status").value="void",n().showStatus("Quote voided","success"),await k()}async function K(){if(!await C())return;if(!s.length){n().showStatus("Nothing to duplicate","error");return}f=null,document.getElementById("quote-edit-id").value="",document.getElementById("quote-status").value="draft",document.getElementById("quote-number").value=await $("quote");const e=new Date().toISOString().slice(0,10);document.getElementById("quote-date").value=e,document.getElementById("quote-valid").value=I(e,90);const t=document.getElementById("quote-by");t&&n().currentUser()&&(t.value=n().currentUser()),n().showStatus("Duplicated as new draft — click Save quote","info")}async function me(e){await V(e),await K()}async function pe(e){await V(e),G()}function P(){var e,t,o,a,i,r,u,l,d,c;return{number:((e=document.getElementById("quote-number"))==null?void 0:e.value)||"Q-XXXX",date:((t=document.getElementById("quote-date"))==null?void 0:t.value)||new Date().toISOString().slice(0,10),valid:((o=document.getElementById("quote-valid"))==null?void 0:o.value)||"",customer:((a=document.getElementById("quote-customer"))==null?void 0:a.value)||"",project:((i=document.getElementById("quote-project"))==null?void 0:i.value)||"",rfq:((r=document.getElementById("quote-rfq"))==null?void 0:r.value)||"",by:((u=document.getElementById("quote-by"))==null?void 0:u.value)||n().currentUser()||"",notes:((l=document.getElementById("quote-notes"))==null?void 0:l.value)||"",status:((d=document.getElementById("quote-status"))==null?void 0:d.value)||"draft",fob:S("fob"),terms:S("terms"),lead:((c=document.getElementById("quote-lead"))==null?void 0:c.value)||""}}function L(e,t){const o=`<!DOCTYPE html>
  <html><head><meta charset="UTF-8"><title>${n().escapeHtml(e)}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; margin: 0; padding: 24px; font-size: 13px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1e3a5f; padding-bottom: 16px; margin-bottom: 20px; }
    .logo { max-height: 56px; width: auto; }
    .doc-title { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; color: #1e3a5f; }
    .meta { text-align: right; font-size: 13px; line-height: 1.5; }
    .info { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; margin-bottom: 20px; }
    .info span { color: #64748b; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { background: #f1f5f9; text-align: left; padding: 8px; border: 1px solid #cbd5e1; font-size: 12px; }
    td { padding: 8px; border: 1px solid #cbd5e1; }
    .totals { margin-left: auto; width: 280px; }
    .totals div { display: flex; justify-content: space-between; padding: 3px 0; }
    .totals .grand { font-size: 16px; font-weight: 700; border-top: 2px solid #1e3a5f; margin-top: 6px; padding-top: 6px; }
    .notes { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-top: 16px; white-space: pre-wrap; }
    .legal { font-size: 11px; color: #475569; margin-top: 12px; }
    .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
    @media print { body { padding: 12px; } @page { margin: 0.6in; size: letter; } }
  </style></head><body>
  ${t}
  <script>window.onload=function(){ setTimeout(function(){ window.print(); }, 400); };<\/script>
  </body></html>`,a=window.open("","_blank");if(!a){n().showStatus("Pop-up blocked — allow pop-ups to print","error");return}a.document.write(o),a.document.close()}function D(){return`<img class="logo" src="inmar-logo.jpg" alt="In-Mar Systems & Solutions" onerror="this.style.display='none'">
    <div style="font-size:11px;color:#64748b;margin-top:4px;">3011 S. Ruby Ave, Gonzales, LA 70737<br>(225) 430-9111 • info@inmarsystems.com</div>`}function G(){if(s.length===0){n().showStatus("Add at least one part to the quote first","error");return}const e=P();e.by||(e.by=n().currentUser());let t=0;const o=s.map(a=>{const i=(a.qty||1)*(a.unit_price||0);return t+=i,`<tr>
        <td style="font-family:monospace;font-size:12px;">${n().escapeHtml(a.part_number)}</td>
        <td>${n().escapeHtml(a.name)}</td>
        <td style="text-align:center;">${a.qty}</td>
        <td style="text-align:right;">${n().money(a.unit_price)}</td>
        <td style="text-align:right;font-weight:600;">${n().money(i)}</td>
      </tr>`}).join("");L("In-Mar Quote "+e.number,`
    <div class="header">
  <div>${D()}</div>
  <div class="meta">
    <div class="doc-title">QUOTE</div>
    <div><strong>Quote #:</strong> ${n().escapeHtml(e.number)}</div>
    ${e.rfq?`<div><strong>RFQ #:</strong> ${n().escapeHtml(e.rfq)}</div>`:""}
    <div><strong>Status:</strong> ${n().escapeHtml(e.status)}</div>
    <div><strong>Date:</strong> ${n().escapeHtml(e.date)}</div>
    <div><strong>Valid Until:</strong> ${n().escapeHtml(e.valid)||"—"}</div>
  </div>
    </div>
    <div class="info">
  <div><span>Customer:</span> ${n().escapeHtml(e.customer)||"—"}</div>
  <div><span>Project:</span> ${n().escapeHtml(e.project)||"—"}</div>
  <div><span>Prepared By:</span> ${n().escapeHtml(e.by)||"—"}</div>
  <div><span>FOB:</span> ${n().escapeHtml(e.fob)||"—"}</div>
  <div><span>Payment terms:</span> ${n().escapeHtml(e.terms)||"—"}</div>
  <div><span>Lead time:</span> ${n().escapeHtml(e.lead)||"—"}</div>
    </div>
    <table>
  <thead><tr><th>Part #</th><th>Description</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Unit Price</th><th style="text-align:right;">Total</th></tr></thead>
  <tbody>${o}</tbody>
    </table>
    <div class="totals"><div class="grand"><span>Quoted total</span><span>${n().money(t)}</span></div></div>
    <p class="legal">3.5% fee if paid by credit card. Prices in USD. Valid until the date shown.</p>
    <div><div style="font-weight:500;color:#64748b;margin-bottom:4px;">Notes</div><div class="notes">${n().escapeHtml(e.notes)||"—"}</div></div>
    <div class="footer">Thank you for the opportunity to quote.<br>In-Mar Systems &amp; Solutions</div>`)}async function ve(){var i;if(s.length===0){n().showStatus("Add quote lines first","error");return}const e=P();let t="";try{t=await $("packing_list")}catch{t="PL-"+e.number}const o=f||((i=document.getElementById("quote-edit-id"))==null?void 0:i.value)||null;if(n().supabaseClient&&o)try{const{data:r,error:u}=await n().supabaseClient.from("packing_lists").insert({number:t,quote_id:o,customer_name:e.customer||null,project:e.project||null,pack_date:e.date,prepared_by:e.by||n().currentUser(),notes:null,created_by:n().currentUser()}).select("id").maybeSingle();!u&&(r!=null&&r.id)&&await n().supabaseClient.from("packing_list_lines").insert(s.map((l,d)=>({packing_list_id:r.id,line_no:d+1,inventory_id:l.inventory_id||l.id||null,part_number:l.part_number,name:l.name,qty:l.qty||1})))}catch{}const a=s.map(r=>`<tr>
      <td style="font-family:monospace;font-size:12px;">${n().escapeHtml(r.part_number)}</td>
      <td>${n().escapeHtml(r.name)}</td>
      <td style="text-align:center;font-weight:700;">${r.qty}</td>
    </tr>`).join("");L("In-Mar Packing List "+t,`
    <div class="header">
  <div>${D()}</div>
  <div class="meta">
    <div class="doc-title">PACKING LIST</div>
    <div><strong>Packing list #:</strong> ${n().escapeHtml(t)}</div>
    <div><strong>Quote #:</strong> ${n().escapeHtml(e.number)}</div>
    <div><strong>Date:</strong> ${n().escapeHtml(e.date)}</div>
  </div>
    </div>
    <div class="info">
  <div><span>Customer / consignee:</span> ${n().escapeHtml(e.customer)||"—"}</div>
  <div><span>Project:</span> ${n().escapeHtml(e.project)||"—"}</div>
  <div><span>Prepared By:</span> ${n().escapeHtml(e.by)||"—"}</div>
  <div><span>FOB / ship point:</span> ${n().escapeHtml(e.fob)||"—"}</div>
    </div>
    <p class="legal">Contents only — not a quote or invoice.</p>
    <table>
  <thead><tr><th>Part #</th><th>Description</th><th style="text-align:center;">Qty shipped</th></tr></thead>
  <tbody>${a}</tbody>
    </table>
    <div style="display:flex;gap:40px;margin-top:36px;">
  <div style="flex:1;border-top:1px solid #94a3b8;padding-top:6px;font-size:12px;color:#475569;">Packed by / date</div>
  <div style="flex:1;border-top:1px solid #94a3b8;padding-top:6px;font-size:12px;color:#475569;">Received by / date — contents checked</div>
    </div>
    <div class="footer">Check contents on receipt.<br>In-Mar Systems &amp; Solutions</div>`)}function R(){var l,d,c,v;const e=J(),t=parseFloat((l=document.getElementById("inv-shipfee"))==null?void 0:l.value)||0,o=parseFloat((d=document.getElementById("inv-duty"))==null?void 0:d.value)||0,a=parseFloat((c=document.getElementById("inv-tariffs"))==null?void 0:c.value)||0,i=e+t+o+a,r=(v=document.getElementById("inv-cc"))==null?void 0:v.checked,u=r?Math.round(i*.035*100)/100:0;return{subtotal:e,shipping:t,duty:o,tariffs:a,ccFee:u,cc:r,total:i+u}}function Y(){const e=document.getElementById("inv-preview");if(!e)return;const t=R();e.innerHTML=`Merchandise ${n().money(t.subtotal)} + shipping ${n().money(t.shipping)} + duty ${n().money(t.duty)} + tariffs ${n().money(t.tariffs)}${t.cc?" + CC 3.5% "+n().money(t.ccFee):""} = <strong>${n().money(t.total)}</strong> due`}function ye(){var a;if(s.length===0){n().showStatus("Add quote lines first","error");return}const e=document.getElementById("invoice-box");if(!e)return;const t=(a=document.getElementById("quote-valid"))==null?void 0:a.value,o=document.getElementById("inv-due");o&&!o.value&&(o.value=t||""),e.style.display="block",Y(),e.scrollIntoView({behavior:"smooth",block:"nearest"})}async function fe(){var c,v,O,Q;if(!n().requireUser("creating invoices"))return;if(s.length===0){n().showStatus("Add quote lines first","error");return}const e=P(),t=R(),o=(((c=document.getElementById("inv-po"))==null?void 0:c.value)||"").trim(),a=(((v=document.getElementById("inv-ship"))==null?void 0:v.value)||"").trim(),i=((O=document.getElementById("inv-due"))==null?void 0:O.value)||e.valid||"",r=new Date().toISOString().slice(0,10);let u=await $("invoice");const l=f||((Q=document.getElementById("quote-edit-id"))==null?void 0:Q.value)||null;if(n().supabaseClient)try{const{data:y,error:h}=await n().supabaseClient.from("invoices").insert({number:u,quote_id:l||null,customer_name:e.customer||null,project:e.project||null,po_number:o||null,ship_to:a||null,invoice_date:r,due_date:i||null,fob_point:e.fob||null,payment_terms:e.terms||null,cc_used:!!t.cc,cc_fee_rate:.035,cc_fee_amount:t.ccFee,shipping_fee:t.shipping,duty:t.duty,tariffs:t.tariffs,subtotal:t.subtotal,total:t.total,prepared_by:e.by||n().currentUser(),notes:e.notes||null,status:"draft",created_by:n().currentUser()}).select("id").maybeSingle();!h&&(y!=null&&y.id)?await n().supabaseClient.from("invoice_lines").insert(s.map((b,N)=>({invoice_id:y.id,line_no:N+1,inventory_id:b.inventory_id||b.id||null,part_number:b.part_number,name:b.name,qty:b.qty||1,unit_price:b.unit_price||0}))):h&&(console.warn(h),n().showStatus("Invoice printed locally. Run Phase 2 SQL to save invoices to the database.","info"))}catch(y){console.warn(y)}const d=s.map(y=>{const h=(y.qty||1)*(y.unit_price||0);return`<tr>
        <td style="font-family:monospace;font-size:12px;">${n().escapeHtml(y.part_number)}</td>
        <td>${n().escapeHtml(y.name)}</td>
        <td style="text-align:center;">${y.qty}</td>
        <td style="text-align:right;">${n().money(y.unit_price)}</td>
        <td style="text-align:right;font-weight:600;">${n().money(h)}</td>
      </tr>`}).join("");L("In-Mar Invoice "+u,`
    <div class="header">
  <div>${D()}</div>
  <div class="meta">
    <div class="doc-title">INVOICE</div>
    <div><strong>Invoice #:</strong> ${n().escapeHtml(u)}</div>
    <div><strong>Quote #:</strong> ${n().escapeHtml(e.number)}</div>
    ${o?`<div><strong>PO #:</strong> ${n().escapeHtml(o)}</div>`:""}
    ${e.rfq?`<div><strong>RFQ #:</strong> ${n().escapeHtml(e.rfq)}</div>`:""}
    <div><strong>Invoice date:</strong> ${n().escapeHtml(r)}</div>
    <div><strong>Due date:</strong> ${n().escapeHtml(i)||"—"}</div>
  </div>
    </div>
    <div class="info">
  <div><span>Bill to:</span> ${n().escapeHtml(e.customer)||"—"}</div>
  <div><span>Project:</span> ${n().escapeHtml(e.project)||"—"}</div>
  <div><span>Ship to:</span> ${n().escapeHtml(a)||"Same as bill to"}</div>
  <div><span>Prepared By:</span> ${n().escapeHtml(e.by)||"—"}</div>
  <div><span>FOB:</span> ${n().escapeHtml(e.fob)||"—"}</div>
  <div><span>Payment terms:</span> ${n().escapeHtml(e.terms)||"—"}</div>
    </div>
    <table>
  <thead><tr><th>Part #</th><th>Description</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Unit Price</th><th style="text-align:right;">Amount</th></tr></thead>
  <tbody>${d}</tbody>
    </table>
    <div class="totals">
  <div><span>Merchandise</span><span>${n().money(t.subtotal)}</span></div>
  <div><span>Shipping</span><span>${n().money(t.shipping)}</span></div>
  <div><span>Duty</span><span>${n().money(t.duty)}</span></div>
  <div><span>Tariffs</span><span>${n().money(t.tariffs)}</span></div>
  ${t.cc?`<div><span>Credit card fee (3.5%)</span><span>${n().money(t.ccFee)}</span></div>`:""}
  <div class="grand"><span>Amount due</span><span>${n().money(t.total)}</span></div>
    </div>
    <p class="legal">Please remit by the due date. Amounts in USD.${t.cc?" Includes 3.5% card fee.":" 3.5% fee if paid by card."}</p>
    <div><div style="font-weight:500;color:#64748b;margin-bottom:4px;">Notes</div><div class="notes">${n().escapeHtml(e.notes)||"—"}</div></div>
    <div class="footer">Please remit with invoice number ${n().escapeHtml(u)}.<br>In-Mar Systems &amp; Solutions</div>`)}Object.assign(window,{saveQuoteCart:m,addToQuote:E,updateQuoteLine:ne,removeQuoteLine:oe,clearQuote:ae,renderQuotePanel:B,quoteCartTotal:J,addDaysIso:I,defaultQuoteValid:ie,lookupStoreKey:j,localLookups:T,saveLocalLookup:U,comboValue:S,setComboValue:q,onComboSelect:se,fillComboSelect:M,refreshQuoteLookups:x,findCustomerByName:F,onQuoteCustomerChange:re,nextDocNumber:$,ensureQuotesTables:C,loadCustomerSuggestions:X,renderQuoteStatusFilters:A,setQuoteStatusFilter:le,loadQuotesList:k,renderQuotesList:z,startNewQuote:ue,openQuote:V,saveQuoteToDb:de,voidCurrentQuote:ce,duplicateCurrentQuote:K,duplicateQuoteById:me,printQuoteById:pe,collectQuoteHeader:P,printDocWindow:L,companyBlock:D,generateQuote:G,printPackingList:ve,invoiceMath:R,updateInvoicePreview:Y,openInvoiceForm:ye,saveAndPrintInvoice:fe}),(function(){const e=document.getElementById("quote-date"),t=new Date().toISOString().slice(0,10);e&&!e.value&&(e.value=t);const o=document.getElementById("quote-valid");o&&!o.value&&(o.value=I(t,90)),e&&e.addEventListener("change",()=>{const a=document.getElementById("quote-valid");a&&(a.value=I(e.value,90))}),["inv-shipfee","inv-duty","inv-tariffs"].forEach(a=>{const i=document.getElementById(a);i&&i.addEventListener("input",Y)}),B()})(),document.querySelectorAll(".tab").forEach(e=>{e.addEventListener("click",()=>{e.dataset.tab==="quote"&&(B(),k())})}),window.InmarShop&&typeof window.InmarShop.updateUserUI=="function"&&window.InmarShop.updateUserUI(),window.__shopEntered&&typeof x=="function"&&x()}ge();
