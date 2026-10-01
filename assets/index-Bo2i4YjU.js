(function(){const I=document.createElement("link").relList;if(I&&I.supports&&I.supports("modulepreload"))return;for(const p of document.querySelectorAll('link[rel="modulepreload"]'))g(p);new MutationObserver(p=>{for(const b of p)if(b.type==="childList")for(const l of b.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&g(l)}).observe(document,{childList:!0,subtree:!0});function H(p){const b={};return p.integrity&&(b.integrity=p.integrity),p.referrerPolicy&&(b.referrerPolicy=p.referrerPolicy),p.crossOrigin==="use-credentials"?b.credentials="include":p.crossOrigin==="anonymous"?b.credentials="omit":b.credentials="same-origin",b}function g(p){if(p.ep)return;p.ep=!0;const b=H(p);fetch(p.href,b)}})();const Pe=`  <div class="card">
    <h2>Saved Quotes</h2>
    <p class="hint" id="quotes-schema-hint">Open hides voided and expired.</p>
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
          <option value="void">Void quote</option>
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

    <p class="hint" id="quote-sale-note" style="display:none;"></p>
    <div id="quote-invoices"></div>

    <div class="btn-group">
      <button type="button" onclick="saveQuoteToDb()">Save quote</button>
      <button type="button" class="secondary" onclick="generateQuote()">Print quote</button>
      <button type="button" class="secondary" onclick="printPackingList()">Packing list</button>
      <button type="button" class="secondary" id="quote-invoice-btn" onclick="openInvoiceForm()">Invoice…</button>
      <button type="button" class="secondary" onclick="duplicateCurrentQuote()">Duplicate</button>
      <button type="button" class="secondary" onclick="clearQuote()">Clear cart</button>
    </div>
    <div class="btn-group">
      <button type="button" class="secondary" onclick="voidCurrentQuote()">Void quote</button>
    </div>

    <div id="invoice-box" class="order-box" style="display:none;margin-top:1rem;">
      <h2 style="font-size:0.95rem;">Invoice from this quote</h2>
      <p class="hint">Due date starts from the quote’s valid-until. Approve takes parts off the shelf.</p>
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
  </div>`;function n(){const _=window.InmarShop;if(!_)throw new Error("Shop is not ready");return _}let fe=!1;function Te(){if(fe)return;fe=!0;const _=document.getElementById("quote");_&&!_.dataset.installed&&(_.innerHTML=Pe,_.dataset.installed="1");let I=[],H="open",g=null,p=[],b=!1,l=JSON.parse(localStorage.getItem("inv_quote")||"[]");function B(){localStorage.setItem("inv_quote",JSON.stringify(l)),D()}function ye(e){const t=n().inventory.find(a=>a.id===e);if(!t)return;const i=l.find(a=>a.id===e||a.inventory_id&&a.inventory_id===e);i?i.qty=(i.qty||1)+1:l.push({id:t.id,inventory_id:t.id,part_number:t.part_number,name:t.name,qty:1,unit_price:t.sell_price!=null?Number(t.sell_price):0});const o=document.getElementById("quote-by");o&&!o.value&&n().currentUser()&&(o.value=n().currentUser()),B(),n().showStatus(`Added “${t.part_number}” to quote`,"success")}function be(e,t,i){l[e]&&(t==="qty"&&(l[e].qty=Math.max(1,parseInt(i)||1)),t==="unit_price"&&(l[e].unit_price=parseFloat(i)||0),B())}function ge(e){l.splice(e,1),B()}function he(){if(l.length&&!confirm("Clear the working cart? (Saved quotes in the database are kept.)"))return;l=[],g=null;const e=document.getElementById("quote-edit-id");e&&(e.value=""),F();const t=document.getElementById("quote-status");t&&(t.value="draft");const i=document.getElementById("quote-number");i&&(i.value=""),B(),n().showStatus("Cart cleared","info")}function qe(e){const t=e&&(e.inventory_id||e.id);if(!t)return null;const i=(n().inventory||[]).find(a=>a.id===t);if(!i||i.qty==null||i.qty==="")return null;const o=Number(i.qty);return Number.isFinite(o)?o:null}function D(){const e=document.getElementById("quote-count-badge");e&&(e.textContent=l.length?`(${l.length} line${l.length>1?"s":""})`:"");const t=document.getElementById("quote-lines");if(!t)return;if(l.length===0){t.innerHTML='<p class="empty">No items yet — add from Home or Scan.</p>';return}let i=0;t.innerHTML=`
      <table>
        <thead><tr><th>Part</th><th>Qty</th><th>Unit $</th><th>Line</th><th></th></tr></thead>
        <tbody>
          ${l.map((o,a)=>{const r=(o.qty||1)*(o.unit_price||0);i+=r;const u=Number(o.qty)||0,s=qe(o),d=s!=null&&u>s?`<div style="font-size:0.75rem;color:var(--warning);margin-top:0.2rem;">wants ${u} / shelf ${s}</div>`:"";return`<tr>
              <td><strong>${n().escapeHtml(o.name)}</strong><br><code style="font-size:0.75rem;color:var(--muted)">${n().escapeHtml(o.part_number)}</code></td>
              <td><input type="number" min="1" value="${o.qty}" style="width:70px;margin:0" onchange="updateQuoteLine(${a},'qty',this.value)">${d}</td>
              <td><input type="number" min="0" step="0.01" value="${o.unit_price}" style="width:90px;margin:0" onchange="updateQuoteLine(${a},'unit_price',this.value)"></td>
              <td>${n().money(r)}</td>
              <td><button class="danger" onclick="removeQuoteLine(${a})">×</button></td>
            </tr>`}).join("")}
        </tbody>
      </table>
      <div style="text-align:right;font-weight:700;margin-top:0.75rem;font-size:1.1rem;">Total: ${n().money(i)}</div>
    `}function ie(){return l.reduce((e,t)=>e+(t.qty||1)*(t.unit_price||0),0)}function $(e,t){const i=e?new Date(e+"T12:00:00"):new Date;return isNaN(i.getTime())?"":(i.setDate(i.getDate()+t),i.toISOString().slice(0,10))}function we(){var t;const e=(t=document.getElementById("quote-date"))==null?void 0:t.value;return $(e||new Date().toISOString().slice(0,10),90)}function R(e){return"inv_lookups_"+e}function V(e){try{const t=JSON.parse(localStorage.getItem(R(e))||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function Y(e,t){const i=String(t||"").trim();if(!i)return;const o=V(e);if(!o.some(a=>a.toLowerCase()===i.toLowerCase())){o.push(i);try{localStorage.setItem(R(e),JSON.stringify(o))}catch{}}n().supabaseClient&&n().supabaseClient.from("app_lookups").upsert({kind:e,value:i}).then(()=>{},()=>{})}function x(e){const t=document.getElementById("quote-"+e+"-select"),i=document.getElementById("quote-"+e);return t&&t.value&&t.value!=="__custom__"?t.value.trim():((i==null?void 0:i.value)||"").trim()}function S(e,t){const i=document.getElementById("quote-"+e+"-select"),o=document.getElementById("quote-"+e),a=String(t||"").trim();if(!i){o&&(o.value=a);return}[...i.options].some(u=>u.value===a&&u.value!==""&&u.value!=="__custom__")?(i.value=a,o&&(o.value=a,o.style.display="none")):a?(i.value="__custom__",o&&(o.value=a,o.style.display="")):(i.value="",o&&(o.value="",o.style.display="none"))}function _e(e){const t=document.getElementById("quote-"+e+"-select"),i=document.getElementById("quote-"+e);!t||!i||(t.value==="__custom__"?(i.style.display="",i.value="",i.focus()):(i.value=t.value,i.style.display="none"))}async function J(e,t){const i=document.getElementById("quote-"+e+"-select");if(!i)return;const o=x(e),a=e==="fob"?"fob":"payment_terms",r=new Set(t||[]);if(V(a).forEach(s=>r.add(s)),n().supabaseClient)try{const{data:s}=await n().supabaseClient.from("app_lookups").select("value").eq("kind",a);(s||[]).forEach(d=>{d.value&&r.add(d.value)})}catch{}const u=['<option value="">— Select —</option>'];[...r].filter(Boolean).sort((s,d)=>s.localeCompare(d)).forEach(s=>{u.push(`<option value="${n().escapeHtml(s)}">${n().escapeHtml(s)}</option>`)}),u.push('<option value="__custom__">Other (type and save)…</option>'),i.innerHTML=u.join(""),S(e,o)}async function L(){await J("fob",["Origin","Destination"]);const e=["Due on receipt","Net 15","Net 30","Net 45","Net 60"];if(n().supabaseClient&&n().hasQuotesTables)try{const{data:t}=await n().supabaseClient.from("customers").select("payment_terms");(t||[]).forEach(i=>{i.payment_terms&&e.push(i.payment_terms)})}catch{}await J("terms",e)}async function X(e){if(!e||!n().supabaseClient||!n().hasQuotesTables)return null;try{const{data:t}=await n().supabaseClient.from("customers").select("id,payment_terms,name").ilike("name",e).limit(1);return t&&t[0]||null}catch{return null}}async function Ie(){var i;const e=(((i=document.getElementById("quote-customer"))==null?void 0:i.value)||"").trim();if(!e)return;const t=await X(e);t&&t.payment_terms&&S("terms",t.payment_terms)}async function C(e){const t=n().supabaseClient;if(!t)throw n().showStatus("Couldn't assign a document number — try again","error"),new Error("Not connected");const{data:i,error:o}=await t.rpc("shop_next_doc_number",{doc_type:e});if(o||i==null||i==="")throw console.warn("shop_next_doc_number",o),n().showStatus("Couldn't assign a document number — try again","error"),o||new Error("no number");return i}async function O(){if(!n().supabaseClient)return!1;if(n().hasQuotesTables)return!0;const e=await n().supabaseClient.from("quotes").select("id").limit(1);return n().hasQuotesTables=!e.error,n().hasQuotesTables}async function ae(){const e=document.getElementById("customer-suggestions");if(!e||!n().supabaseClient||!n().hasQuotesTables)return;const{data:t}=await n().supabaseClient.from("customers").select("name,company").order("name").limit(200),i=new Set;(t||[]).forEach(o=>{o.name&&i.add(o.name),o.company&&i.add(o.company)}),e.innerHTML=[...i].sort().map(o=>`<option value="${n().escapeHtml(o)}">`).join("")}function K(){const e=document.getElementById("quote-status-filters");if(!e)return;const t=[{id:"open",label:"Open"},{id:"archive",label:"Archive"}];e.innerHTML=t.map(i=>`<button type="button" class="filter-chip ${H===i.id?"active":""}" onclick="setQuoteStatusFilter('${i.id}')">${i.label}</button>`).join("")}function G(e){return e==="void"||e==="expired"}function Se(e){return e==="void"?"Voided":e==="expired"?"Expired":e==="sent"?"Sent":e==="accepted"?"Accepted":e==="draft"||!e?"Draft":e}function Ee(e){H=e,K(),W()}async function P(){const e=document.getElementById("quotes-schema-hint"),t=document.getElementById("quotes-list");if(K(),!n().supabaseClient)return;if(!await O()){e&&(e.textContent="Run Phase 1 SQL on More to save quotes."),t&&(t.innerHTML='<p class="empty">Install quotes SQL to save and list quotes.</p>');return}e&&(e.textContent="Open hides voided and expired.");const{data:o,error:a}=await n().supabaseClient.from("quotes").select("id,number,customer_name,status,quote_date,valid_until,prepared_by,updated_at").order("updated_at",{ascending:!1}).limit(200);if(a){t&&(t.innerHTML=`<p class="empty">Could not load quotes: ${n().escapeHtml(a.message)}</p>`);return}I=o||[],await ae(),W()}function W(){const e=document.getElementById("quotes-list");if(!e)return;const t=H==="archive",i=I.filter(o=>t?G(o.status):!G(o.status));if(!i.length){e.innerHTML=`<p class="empty">${t?"No archived quotes.":"No open quotes."}</p>`;return}e.innerHTML=`
      <table>
        <thead><tr><th>Number</th><th>Customer</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>
          ${i.map(o=>`
            <tr>
              <td><code>${n().escapeHtml(o.number)}</code></td>
              <td>${n().escapeHtml(o.customer_name||"—")}</td>
              <td><span class="badge ${G(o.status)?"needs-date":o.status==="accepted"?"open-order":"source-tag"}">${n().escapeHtml(Se(o.status))}</span></td>
              <td style="font-size:0.8rem;color:var(--muted)">${n().escapeHtml(o.quote_date||"")}</td>
              <td class="actions">
                <button type="button" class="secondary" onclick="openQuote('${o.id}')">Open</button>
                <button type="button" class="secondary" onclick="printQuoteById('${o.id}')">Print</button>
                <button type="button" class="secondary" onclick="duplicateQuoteById('${o.id}')">Dup</button>
                <button type="button" class="secondary" onclick="voidQuoteById('${o.id}')">Void quote</button>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>`}async function Be(){g=null,document.getElementById("quote-edit-id").value="",F(),document.getElementById("quote-status").value="draft",document.getElementById("quote-number").value="";const e=new Date().toISOString().slice(0,10);document.getElementById("quote-date").value=e,document.getElementById("quote-valid").value=$(e,90),document.getElementById("quote-by").value=n().currentUser()||"",document.getElementById("quote-project").value="",document.getElementById("quote-rfq").value="",document.getElementById("quote-lead").value="",document.getElementById("quote-notes").value="",document.getElementById("quote-customer").value="";const t=document.getElementById("invoice-box");t&&(t.style.display="none"),await y(),n().hasQuotesTables&&(document.getElementById("quote-number").value=await C("quote")),await L(),S("fob",""),S("terms",""),D(),n().showStatus("Builder ready — add lines then Save quote","info")}async function Z(e){if(String(e||"")!==q()&&F(),!await O()){n().showStatus("Quotes tables not installed","error"),await y();return}const{data:t,error:i}=await n().supabaseClient.from("quotes").select("*").eq("id",e).maybeSingle();if(i||!t){n().showStatus((i==null?void 0:i.message)||"Quote not found","error"),await y();return}const{data:o}=await n().supabaseClient.from("quote_lines").select("*").eq("quote_id",e).order("line_no");g=t.id,document.getElementById("quote-edit-id").value=t.id,document.getElementById("quote-number").value=t.number||"",document.getElementById("quote-status").value=t.status||"draft",document.getElementById("quote-date").value=t.quote_date||"",document.getElementById("quote-valid").value=t.valid_until||"",document.getElementById("quote-customer").value=t.customer_name||"";const a=document.getElementById("quote-project");a&&(a.value=t.project||"");const r=document.getElementById("quote-rfq");r&&(r.value=t.rfq_number||"");const u=document.getElementById("quote-lead");u&&(u.value=t.lead_time||""),document.getElementById("quote-by").value=t.prepared_by||n().currentUser()||"",document.getElementById("quote-notes").value=t.notes||"",await L(),S("fob",t.fob_point||""),S("terms",t.payment_terms||""),document.getElementById("quote-save-customer").checked=!1,l=(o||[]).map(s=>({id:s.inventory_id||s.id,inventory_id:s.inventory_id,part_number:s.part_number,name:s.name,qty:Number(s.qty)||1,unit_price:Number(s.unit_price)||0})),B(),await y(),n().showStatus(`Opened ${t.number}`,"success")}async function se(){var z,m,w,Q,E,k;if(!n().requireUser("saving quotes"))return!1;if(!await O())return n().showStatus("Run Phase 1 quotes SQL on the More tab first","error"),!1;if(l.length===0)return n().showStatus("Add at least one line before saving","error"),!1;let e=(document.getElementById("quote-number").value||"").trim();e||(e=await C("quote"),document.getElementById("quote-number").value=e);const t=(document.getElementById("quote-customer").value||"").trim(),i=(((z=document.getElementById("quote-project"))==null?void 0:z.value)||"").trim(),o=(((m=document.getElementById("quote-rfq"))==null?void 0:m.value)||"").trim(),a=x("fob"),r=x("terms"),u=(((w=document.getElementById("quote-lead"))==null?void 0:w.value)||"").trim();a&&Y("fob",a),r&&Y("payment_terms",r);let s=null;if((Q=document.getElementById("quote-save-customer"))!=null&&Q.checked&&t){const f=await X(t);if(f!=null&&f.id)s=f.id,await n().supabaseClient.from("customers").update({payment_terms:r||null,updated_at:new Date().toISOString()}).eq("id",s);else{const{data:N,error:ve}=await n().supabaseClient.from("customers").insert({name:t,payment_terms:r||null}).select("id").maybeSingle();ve?console.warn(ve):s=N==null?void 0:N.id}}const d={number:e,customer_id:s,customer_name:t||null,project:i||null,rfq_number:o||null,fob_point:a||null,payment_terms:r||null,lead_time:u||null,status:document.getElementById("quote-status").value||"draft",quote_date:document.getElementById("quote-date").value||null,valid_until:document.getElementById("quote-valid").value||null,prepared_by:(document.getElementById("quote-by").value||"").trim()||n().currentUser()||null,notes:(document.getElementById("quote-notes").value||"").trim()||null,created_by:n().currentUser(),updated_at:new Date().toISOString()};let c=g||document.getElementById("quote-edit-id").value||null,v;if(c)({error:v}=await n().supabaseClient.from("quotes").update(d).eq("id",c)),v||await n().supabaseClient.from("quote_lines").delete().eq("quote_id",c);else{const f=await n().supabaseClient.from("quotes").insert(d).select("id").maybeSingle();v=f.error,c=(E=f.data)==null?void 0:E.id}if(v&&/project|rfq_number|fob_point|payment_terms|lead_time/i.test(v.message||""))if(delete d.project,delete d.rfq_number,delete d.fob_point,delete d.payment_terms,delete d.lead_time,c)({error:v}=await n().supabaseClient.from("quotes").update(d).eq("id",c)),v||await n().supabaseClient.from("quote_lines").delete().eq("quote_id",c);else{const f=await n().supabaseClient.from("quotes").insert(d).select("id").maybeSingle();v=f.error,c=(k=f.data)==null?void 0:k.id}if(v)return n().showStatus("Save failed: "+v.message+" — run Phase 2 SQL on the More tab for new quote fields","error"),!1;const M=l.map((f,N)=>({quote_id:c,line_no:N+1,inventory_id:f.inventory_id||f.id||null,part_number:f.part_number||null,name:f.name||"Item",qty:f.qty||1,unit_price:f.unit_price||0})),{error:h}=await n().supabaseClient.from("quote_lines").insert(M);return h?(n().showStatus("Quote header saved but lines failed: "+h.message,"error"),!1):c?(g=c,document.getElementById("quote-edit-id").value=c,n().showStatus(`Quote ${e} saved (${n().currentUser()})`,"success"),await y(),await P(),!!q()):(n().showStatus("Couldn't save the quote — invoice was not created","error"),!1)}async function re(e){var r,u;if(!n().requireUser("voiding quotes"))return;if(!e){n().showStatus("Open a saved quote to void it","error");return}const t=I.find(s=>s.id===e),i=(t==null?void 0:t.number)||((r=document.getElementById("quote-number"))==null?void 0:r.value)||"this quote";if(!confirm(`Void ${i}? The number stays. Stock is not put back.`))return;const{error:o}=await n().supabaseClient.from("quotes").update({status:"void",updated_at:new Date().toISOString()}).eq("id",e);if(o){n().showStatus(o.message,"error");return}if((g||((u=document.getElementById("quote-edit-id"))==null?void 0:u.value))===e){const s=document.getElementById("quote-status");s&&(s.value="void")}n().showStatus(`${i} voided. Stock unchanged.`,"success"),await P()}async function $e(){var t;const e=g||((t=document.getElementById("quote-edit-id"))==null?void 0:t.value);if(!e){n().showStatus("Open a saved quote to void it","error");return}await re(e)}async function ue(){if(!l.length){n().showStatus("Nothing to duplicate","error");return}if(g=null,document.getElementById("quote-edit-id").value="",document.getElementById("quote-status").value="draft",F(),!await O())return;document.getElementById("quote-number").value=await C("quote");const e=new Date().toISOString().slice(0,10);document.getElementById("quote-date").value=e,document.getElementById("quote-valid").value=$(e,90);const t=document.getElementById("quote-by");t&&n().currentUser()&&(t.value=n().currentUser()),await y(),n().showStatus("Duplicated as new draft — click Save quote","info")}async function xe(e){await Z(e),await ue()}async function Ce(e){await Z(e),le()}function j(){var e,t,i,o,a,r,u,s,d,c;return{number:((e=document.getElementById("quote-number"))==null?void 0:e.value)||"Q-XXXX",date:((t=document.getElementById("quote-date"))==null?void 0:t.value)||new Date().toISOString().slice(0,10),valid:((i=document.getElementById("quote-valid"))==null?void 0:i.value)||"",customer:((o=document.getElementById("quote-customer"))==null?void 0:o.value)||"",project:((a=document.getElementById("quote-project"))==null?void 0:a.value)||"",rfq:((r=document.getElementById("quote-rfq"))==null?void 0:r.value)||"",by:((u=document.getElementById("quote-by"))==null?void 0:u.value)||n().currentUser()||"",notes:((s=document.getElementById("quote-notes"))==null?void 0:s.value)||"",status:((d=document.getElementById("quote-status"))==null?void 0:d.value)||"draft",fob:x("fob"),terms:x("terms"),lead:((c=document.getElementById("quote-lead"))==null?void 0:c.value)||""}}function A(e,t){const i=`<!DOCTYPE html>
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
  </body></html>`,o=window.open("","_blank");if(!o){n().showStatus("Pop-up blocked — allow pop-ups to print","error");return}o.document.write(i),o.document.close()}function U(){return`<img class="logo" src="inmar-logo.jpg" alt="In-Mar Systems & Solutions" onerror="this.style.display='none'">
    <div style="font-size:11px;color:#64748b;margin-top:4px;">3011 S. Ruby Ave, Gonzales, LA 70737<br>(225) 430-9111 • info@inmarsystems.com</div>`}function le(){if(l.length===0){n().showStatus("Add at least one part to the quote first","error");return}const e=j();e.by||(e.by=n().currentUser());let t=0;const i=l.map(o=>{const a=(o.qty||1)*(o.unit_price||0);return t+=a,`<tr>
        <td style="font-family:monospace;font-size:12px;">${n().escapeHtml(o.part_number)}</td>
        <td>${n().escapeHtml(o.name)}</td>
        <td style="text-align:center;">${o.qty}</td>
        <td style="text-align:right;">${n().money(o.unit_price)}</td>
        <td style="text-align:right;font-weight:600;">${n().money(a)}</td>
      </tr>`}).join("");A("In-Mar Quote "+e.number,`
    <div class="header">
  <div>${U()}</div>
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
  <tbody>${i}</tbody>
    </table>
    <div class="totals"><div class="grand"><span>Quoted total</span><span>${n().money(t)}</span></div></div>
    <p class="legal">3.5% fee if paid by credit card. Prices in USD. Valid until the date shown.</p>
    <div><div style="font-weight:500;color:#64748b;margin-bottom:4px;">Notes</div><div class="notes">${n().escapeHtml(e.notes)||"—"}</div></div>
    <div class="footer">Thank you for the opportunity to quote.<br>In-Mar Systems &amp; Solutions</div>`)}async function Qe(){var a;if(l.length===0){n().showStatus("Add quote lines first","error");return}const e=j();let t="";try{t=await C("packing_list")}catch{return}const i=g||((a=document.getElementById("quote-edit-id"))==null?void 0:a.value)||null;if(n().supabaseClient&&i)try{const{data:r,error:u}=await n().supabaseClient.from("packing_lists").insert({number:t,quote_id:i,customer_name:e.customer||null,project:e.project||null,pack_date:e.date,prepared_by:e.by||n().currentUser(),notes:null,created_by:n().currentUser()}).select("id").maybeSingle();!u&&(r!=null&&r.id)&&await n().supabaseClient.from("packing_list_lines").insert(l.map((s,d)=>({packing_list_id:r.id,line_no:d+1,inventory_id:s.inventory_id||s.id||null,part_number:s.part_number,name:s.name,qty:s.qty||1})))}catch{}const o=l.map(r=>`<tr>
      <td style="font-family:monospace;font-size:12px;">${n().escapeHtml(r.part_number)}</td>
      <td>${n().escapeHtml(r.name)}</td>
      <td style="text-align:center;font-weight:700;">${r.qty}</td>
    </tr>`).join("");A("In-Mar Packing List "+t,`
    <div class="header">
  <div>${U()}</div>
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
  <tbody>${o}</tbody>
    </table>
    <div style="display:flex;gap:40px;margin-top:36px;">
  <div style="flex:1;border-top:1px solid #94a3b8;padding-top:6px;font-size:12px;color:#475569;">Packed by / date</div>
  <div style="flex:1;border-top:1px solid #94a3b8;padding-top:6px;font-size:12px;color:#475569;">Received by / date — contents checked</div>
    </div>
    <div class="footer">Check contents on receipt.<br>In-Mar Systems &amp; Solutions</div>`)}function ee(){var s,d,c,v;const e=ie(),t=parseFloat((s=document.getElementById("inv-shipfee"))==null?void 0:s.value)||0,i=parseFloat((d=document.getElementById("inv-duty"))==null?void 0:d.value)||0,o=parseFloat((c=document.getElementById("inv-tariffs"))==null?void 0:c.value)||0,a=e+t+i+o,r=(v=document.getElementById("inv-cc"))==null?void 0:v.checked,u=r?Math.round(a*.035*100)/100:0;return{subtotal:e,shipping:t,duty:i,tariffs:o,ccFee:u,cc:r,total:a+u}}function te(){const e=document.getElementById("inv-preview");if(!e)return;const t=ee();e.innerHTML=`Merchandise ${n().money(t.subtotal)} + shipping ${n().money(t.shipping)} + duty ${n().money(t.duty)} + tariffs ${n().money(t.tariffs)}${t.cc?" + CC 3.5% "+n().money(t.ccFee):""} = <strong>${n().money(t.total)}</strong> due`}function q(){var e;return String(g||((e=document.getElementById("quote-edit-id"))==null?void 0:e.value)||"").trim()}function ne(){return q()?p.some(e=>e&&e.status==="approved"):!1}function ke(){const e=p.filter(t=>t&&t.id&&t.status!=="approved");return e.sort((t,i)=>String(t.created_at||"").localeCompare(String(i.created_at||""))),e.length?e[e.length-1]:null}function F(){p=[],T([])}async function de(){if(q())return!0;if(!l.length)return!1;try{return await se()===!0&&!!q()}catch{return!1}}async function He(){var o;if(l.length===0){n().showStatus("Add quote lines first","error");return}if(!await de())return;if(await y(),ne()){n().showStatus("This quote already has an approved invoice.","error");return}const e=document.getElementById("invoice-box");if(!e)return;const t=(o=document.getElementById("quote-valid"))==null?void 0:o.value,i=document.getElementById("inv-due");i&&!i.value&&(i.value=t||""),e.style.display="block",te(),e.scrollIntoView({behavior:"smooth",block:"nearest"})}function T(e,t){const i=!t||t.linked!==!1;i&&(p=e||[]);const o=ne(),a=document.getElementById("quote-invoice-btn");a&&(a.disabled=o,a.style.opacity=o?"0.45":"");const r=i?p:e||[],u=document.getElementById("quote-sale-note"),s=document.getElementById("quote-invoices");if(u&&(i&&o?(u.style.display="block",u.textContent="This quote already has an approved invoice."):r.length?(u.style.display="block",u.textContent="Drafts do not change stock. Approve does."):(u.style.display="none",u.textContent="")),!!s){if(!r.length){s.innerHTML="";return}s.innerHTML=r.map(d=>{const c=d.status==="approved";return`<div class="btn-group" style="align-items:center;">
        <code>${n().escapeHtml(d.number||"")}</code>
        <span class="badge ${c?"open-order":"source-tag"}">${c?"Approved":"Draft"}</span>
        <button type="button" onclick="approveInvoice('${d.id}')">Approve</button>
      </div>`}).join("")}}async function y(){const e=q();if(!e||!n().supabaseClient){p=[],T([]);return}const{data:t,error:i}=await n().supabaseClient.from("invoices").select("id,number,status,total,created_at").eq("quote_id",e).order("created_at",{ascending:!0});if(q()===e){if(i){console.warn(i);return}T(t||[])}}function oe(e){n().showStatus(e,"error");const t=document.getElementById("status");if(!(!t||typeof t.scrollIntoView!="function"))try{t.scrollIntoView({block:"nearest",inline:"nearest"})}catch{try{t.scrollIntoView(!0)}catch{}}}function ce(e){const t=[e&&e.message,e&&e.details,e&&e.hint].filter(a=>a!=null&&String(a).trim()).map(a=>String(a)).join(`
`);if(/shop_approve_invoice/i.test(t)&&/schema cache|could not find the function|does not exist/i.test(t))return"Couldn't approve — run the invoice SQL after every phone has been refreshed.";const i=t.split(`
`).map(a=>a.replace(/^ERROR:\s*/i,"").trim()).filter(Boolean);return i.find(a=>/not enough|shelf part|approved invoice|stayed a draft|missing part|whole number/i.test(a))||i[0]||"Couldn't approve — try again"}async function De(e){if(!n().requireUser("approving invoices"))return;if(!e||!n().supabaseClient){oe("Couldn't approve — try again");return}const{data:t,error:i}=await n().supabaseClient.rpc("shop_approve_invoice",{p_invoice_id:e}),o=q();if(i){oe(ce(i)),o&&await y();return}const a=t&&typeof t=="object"?t:{};if(a.already_approved)n().showStatus(`Already approved — ${a.number||"this invoice"}. Shelf unchanged.`,"info");else if(a.ok){if(n().showStatus(`Approved ${a.number||"invoice"}. Parts left the shelf.`,"success"),o){const r=document.getElementById("quote-status");r&&(r.value="accepted")}}else{oe(ce(a)),o&&await y();return}o?await y():T([{id:e,number:a.number||"",status:"approved"}],{linked:!1}),await P()}function Le(e,t,i,o,a,r){return{customer_name:e.customer||null,project:e.project||null,po_number:i||null,ship_to:o||null,invoice_date:r,due_date:a||null,fob_point:e.fob||null,payment_terms:e.terms||null,cc_used:!!t.cc,cc_fee_rate:.035,cc_fee_amount:t.ccFee,shipping_fee:t.shipping,duty:t.duty,tariffs:t.tariffs,subtotal:t.subtotal,total:t.total,prepared_by:e.by||n().currentUser(),notes:e.notes||null,status:"draft"}}function pe(e){return l.map((t,i)=>({invoice_id:e,line_no:i+1,inventory_id:t.inventory_id||null,part_number:t.part_number||null,name:t.name||"Item",qty:t.qty||1,unit_price:t.unit_price||0}))}function me(e){const t=[e&&e.message,e&&e.details,e&&e.hint].filter(o=>o!=null&&String(o).trim()).map(o=>String(o)).join(`
`),i=t.split(`
`).map(o=>o.replace(/^ERROR:\s*/i,"").trim()).filter(Boolean)[0]||"";return{raw:t,clean:i}}async function Oe(){var e,t,i;if(!b&&n().requireUser("creating invoices")){if(l.length===0){n().showStatus("Add quote lines first","error");return}b=!0;try{if(!q()&&(!await de()||!q()))return;if(await y(),ne()){n().showStatus("This quote already has an approved invoice.","error");return}const o=j(),a=ee(),r=(((e=document.getElementById("inv-po"))==null?void 0:e.value)||"").trim(),u=(((t=document.getElementById("inv-ship"))==null?void 0:t.value)||"").trim(),s=((i=document.getElementById("inv-due"))==null?void 0:i.value)||o.valid||"",d=new Date().toISOString().slice(0,10),c=q()||null;if(!c){n().showStatus("Couldn't save the quote — invoice was not created","error");return}const v=c?ke():null,M=Le(o,a,r,u,s,d);let h="";if(!n().supabaseClient)return;if(v){const{error:m}=await n().supabaseClient.from("invoices").update(M).eq("id",v.id);if(m){console.warn(m);const{raw:E,clean:k}=me(m);/already has an approved invoice/i.test(E)?(await y(),n().showStatus("This quote already has an approved invoice.","error")):n().showStatus(k||"Couldn't save the invoice — try again","error");return}const{error:w}=await n().supabaseClient.from("invoice_lines").delete().eq("invoice_id",v.id);if(w){n().showStatus("Couldn't update the draft invoice lines.","error");return}const{error:Q}=await n().supabaseClient.from("invoice_lines").insert(pe(v.id));if(Q){n().showStatus("Couldn't update the draft invoice lines.","error");return}h=v.number||"",c&&await y(),n().showStatus(`Draft ${h} updated. Stock unchanged until you Approve.`,"success")}else{try{h=await C("invoice")}catch{return}const{data:m,error:w}=await n().supabaseClient.from("invoices").insert({number:h,quote_id:c||null,...M,created_by:n().currentUser()}).select("id").maybeSingle();if(w||!(m!=null&&m.id)){console.warn(w);const{raw:E,clean:k}=me(w);/already has an approved invoice/i.test(E)?(await y(),n().showStatus("This quote already has an approved invoice.","error")):n().showStatus(k||"Couldn't save the invoice — try again","error");return}const{error:Q}=await n().supabaseClient.from("invoice_lines").insert(pe(m.id));if(Q){await n().supabaseClient.from("invoices").delete().eq("id",m.id),n().showStatus("Couldn't save the invoice lines. Draft was not kept.","error");return}c?await y():T([{id:m.id,number:h,status:"draft",created_at:d}],{linked:!1}),n().showStatus(`Draft ${h} saved. Stock unchanged until you Approve.`,"success")}const z=l.map(m=>{const w=(m.qty||1)*(m.unit_price||0);return`<tr>
        <td style="font-family:monospace;font-size:12px;">${n().escapeHtml(m.part_number)}</td>
        <td>${n().escapeHtml(m.name)}</td>
        <td style="text-align:center;">${m.qty}</td>
        <td style="text-align:right;">${n().money(m.unit_price)}</td>
        <td style="text-align:right;font-weight:600;">${n().money(w)}</td>
      </tr>`}).join("");A("In-Mar Invoice "+h,`
    <div class="header">
  <div>${U()}</div>
  <div class="meta">
    <div class="doc-title">INVOICE</div>
    <div><strong>Invoice #:</strong> ${n().escapeHtml(h)}</div>
    <div><strong>Quote #:</strong> ${n().escapeHtml(o.number)}</div>
    ${r?`<div><strong>PO #:</strong> ${n().escapeHtml(r)}</div>`:""}
    ${o.rfq?`<div><strong>RFQ #:</strong> ${n().escapeHtml(o.rfq)}</div>`:""}
    <div><strong>Invoice date:</strong> ${n().escapeHtml(d)}</div>
    <div><strong>Due date:</strong> ${n().escapeHtml(s)||"—"}</div>
  </div>
    </div>
    <div class="info">
  <div><span>Bill to:</span> ${n().escapeHtml(o.customer)||"—"}</div>
  <div><span>Project:</span> ${n().escapeHtml(o.project)||"—"}</div>
  <div><span>Ship to:</span> ${n().escapeHtml(u)||"Same as bill to"}</div>
  <div><span>Prepared By:</span> ${n().escapeHtml(o.by)||"—"}</div>
  <div><span>FOB:</span> ${n().escapeHtml(o.fob)||"—"}</div>
  <div><span>Payment terms:</span> ${n().escapeHtml(o.terms)||"—"}</div>
    </div>
    <table>
  <thead><tr><th>Part #</th><th>Description</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Unit Price</th><th style="text-align:right;">Amount</th></tr></thead>
  <tbody>${z}</tbody>
    </table>
    <div class="totals">
  <div><span>Merchandise</span><span>${n().money(a.subtotal)}</span></div>
  <div><span>Shipping</span><span>${n().money(a.shipping)}</span></div>
  <div><span>Duty</span><span>${n().money(a.duty)}</span></div>
  <div><span>Tariffs</span><span>${n().money(a.tariffs)}</span></div>
  ${a.cc?`<div><span>Credit card fee (3.5%)</span><span>${n().money(a.ccFee)}</span></div>`:""}
  <div class="grand"><span>Amount due</span><span>${n().money(a.total)}</span></div>
    </div>
    <p class="legal">Please remit by the due date. Amounts in USD.${a.cc?" Includes 3.5% card fee.":" 3.5% fee if paid by card."}</p>
    <div><div style="font-weight:500;color:#64748b;margin-bottom:4px;">Notes</div><div class="notes">${n().escapeHtml(o.notes)||"—"}</div></div>
    <div class="footer">Please remit with invoice number ${n().escapeHtml(h)}.<br>In-Mar Systems &amp; Solutions</div>`)}finally{b=!1}}}Object.assign(window,{saveQuoteCart:B,addToQuote:ye,updateQuoteLine:be,removeQuoteLine:ge,clearQuote:he,renderQuotePanel:D,quoteCartTotal:ie,addDaysIso:$,defaultQuoteValid:we,lookupStoreKey:R,localLookups:V,saveLocalLookup:Y,comboValue:x,setComboValue:S,onComboSelect:_e,fillComboSelect:J,refreshQuoteLookups:L,findCustomerByName:X,onQuoteCustomerChange:Ie,nextDocNumber:C,ensureQuotesTables:O,loadCustomerSuggestions:ae,renderQuoteStatusFilters:K,setQuoteStatusFilter:Ee,loadQuotesList:P,renderQuotesList:W,startNewQuote:Be,openQuote:Z,saveQuoteToDb:se,voidCurrentQuote:$e,voidQuoteById:re,duplicateCurrentQuote:ue,duplicateQuoteById:xe,printQuoteById:Ce,collectQuoteHeader:j,printDocWindow:A,companyBlock:U,generateQuote:le,printPackingList:Qe,invoiceMath:ee,updateInvoicePreview:te,openInvoiceForm:He,saveAndPrintInvoice:Oe,refreshQuoteInvoices:y,approveInvoice:De}),(function(){const e=document.getElementById("quote-date"),t=new Date().toISOString().slice(0,10);e&&!e.value&&(e.value=t);const i=document.getElementById("quote-valid");i&&!i.value&&(i.value=$(t,90)),e&&e.addEventListener("change",()=>{const o=document.getElementById("quote-valid");o&&(o.value=$(e.value,90))}),["inv-shipfee","inv-duty","inv-tariffs"].forEach(o=>{const a=document.getElementById(o);a&&a.addEventListener("input",te)}),D()})(),document.querySelectorAll(".tab").forEach(e=>{e.addEventListener("click",()=>{e.dataset.tab==="quote"&&(D(),P())})}),window.InmarShop&&typeof window.InmarShop.updateUserUI=="function"&&window.InmarShop.updateUserUI(),window.__shopEntered&&typeof L=="function"&&L()}Te();
