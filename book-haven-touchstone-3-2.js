<!-- If using Option B (inline), paste this whole block (without the outer <script src>) -->
<script>
/* Book Haven - Touchstone 3.2: Web Storage (sessionStorage + localStorage)
   - Cart items are stored in sessionStorage (per-tab) under CART_KEY.
   - View Cart reads from sessionStorage to render items.
   - Clear Cart and Process Order wipe sessionStorage cart.
   - Contact form saves "custom order" details to localStorage.
   - Keeps all alerts/UX from 3.1.
*/
(function(){
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const isGallery = /gallery\.html$/i.test(location.pathname) || document.title.toLowerCase().includes("gallery");
  const isContact = /about\.html$/i.test(location.pathname) || document.title.toLowerCase().includes("about");

  // ---- Web Storage helpers ----
  const CART_KEY = "bh.cart";
  const ORDERS_KEY = "bh.customOrders";

  function getCart(){
    try { return JSON.parse(sessionStorage.getItem(CART_KEY) || "[]"); }
    catch { return []; }
  }
  function setCart(items){
    try { sessionStorage.setItem(CART_KEY, JSON.stringify(items)); }
    catch {}
  }
  function clearCartStorage(){
    try { sessionStorage.removeItem(CART_KEY); } catch {}
  }

  function getOrders(){
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); }
    catch { return []; }
  }
  function pushOrder(order){
    const all = getOrders();
    all.push(order);
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify(all)); } catch {}
  }

  // ---- Subscribe (all pages) ----
  (function wireSubscribe(){
    const footer = document.querySelector("footer");
    if (!footer) return;
    let form = footer.querySelector("#subscribe-form") || footer.querySelector("form");
    let email = form?.querySelector("#subscribe-email") || form?.querySelector('input[type="email"]');
    let button = form?.querySelector("#subscribe-btn") || form?.querySelector('button, input[type="submit"]');

    function handleSubscribe(e){
      if (e) e.preventDefault();
      const value = (email?.value || "").trim();
      if (!value){ alert("Please enter your email."); return; }
      if (!emailRegex.test(value)){ alert("Please enter a valid email address."); return; }
      alert("Thank you for subscribing");
    }

    if (form){
      form.addEventListener("submit", handleSubscribe);
      if (button) button.addEventListener("click", handleSubscribe);
    }
  })();

  // ---- Gallery: Cart (sessionStorage) ----
  let cartBadge, modal, modalList;

  function ensureCartToolbar(){
    if (!isGallery) return;
    let toolbar = document.querySelector("#cart-toolbar");
    if (!toolbar){
      toolbar = document.createElement("div");
      toolbar.id = "cart-toolbar";
      toolbar.style.cssText = "display:flex;gap:.5rem;align-items:center;justify-content:flex-end;margin:1rem 0;";
      toolbar.innerHTML = `
        <button id="btn-view-cart" class="btn">View Cart <span id="cart-badge" aria-live="polite" style="margin-left:.35rem;font-weight:600;">(0)</span></button>
        <button id="btn-clear-cart" class="btn">Clear Cart</button>
        <button id="btn-process-order" class="btn">Process Order</button>
      `;
      const main = document.querySelector("main") || document.body;
      main.insertBefore(toolbar, main.firstChild);
    }
    cartBadge = document.querySelector("#cart-badge");
    modal = document.querySelector("#cart-modal");
    if (!modal){
      modal = document.createElement("div");
      modal.id = "cart-modal";
      modal.setAttribute("role","dialog");
      modal.setAttribute("aria-modal","true");
      modal.setAttribute("aria-labelledby","cart-modal-title");
      modal.style.cssText = "position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.55);z-index:9999;";
      modal.innerHTML = `
        <div style="background:#fff;max-width:640px;width:92%;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.2);">
          <div style="padding:1rem 1.25rem;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:center;">
            <h2 id="cart-modal-title" style="margin:0;font-size:1.25rem;">Your Cart</h2>
            <button id="cart-modal-close" aria-label="Close">✕</button>
          </div>
          <div style="padding:1rem 1.25rem;">
            <ul id="cart-items" style="margin:0;padding-left:1.25rem;"></ul>
            <p id="cart-empty" style="margin:.5rem 0 0 .25rem;color:#555;">Your cart is empty.</p>
          </div>
          <div style="padding:1rem 1.25rem;border-top:1px solid #ddd;display:flex;gap:.5rem;justify-content:flex-end;">
            <button id="cart-modal-close2">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modalList = modal.querySelector("#cart-items");

    document.querySelector("#btn-view-cart").addEventListener("click", openCartModal);
    document.querySelector("#btn-clear-cart").addEventListener("click", clearCartAction);
    document.querySelector("#btn-process-order").addEventListener("click", processOrderAction);
    modal.querySelector("#cart-modal-close").addEventListener("click", closeCartModal);
    modal.querySelector("#cart-modal-close2").addEventListener("click", closeCartModal);
    modal.addEventListener("click", (e)=>{ if (e.target === modal) closeCartModal(); });

    updateBadgeFromStorage();
  }

  function updateBadgeFromStorage(){
    const len = getCart().length;
    if (cartBadge) cartBadge.textContent = `(${len})`;
  }

  function addToCart(title, price){
    const items = getCart();
    items.push({ title, price, ts: Date.now() });
    setCart(items);
    alert("Item added to the cart");
    updateBadgeFromStorage();
  }

  function clearCartAction(){
    const items = getCart();
    if (items.length === 0){ alert("No items to clear."); return; }
    clearCartStorage();
    alert("Cart cleared");
    updateBadgeFromStorage();
    renderCart();
  }

  function processOrderAction(){
    const items = getCart();
    if (items.length === 0){ alert("Cart is empty."); return; }
    alert("Thank you for your order");
    clearCartStorage();
    updateBadgeFromStorage();
    renderCart();
  }

  function renderCart(){
    if (!modalList) return;
    const items = getCart();
    modalList.innerHTML = "";
    const empty = modal.querySelector("#cart-empty");
    if (items.length === 0){
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";
    items.forEach((item, i)=>{
      const li = document.createElement("li");
      const priceText = item.price ? ` — ${item.price}` : "";
      li.textContent = `${i+1}. ${item.title}${priceText}`;
      modalList.appendChild(li);
    });
  }
  function openCartModal(){ renderCart(); modal.style.display = "flex"; }
  function closeCartModal(){ modal.style.display = "none"; }

  function wireAddToCartButtons(){
    // Support both Gallery table rows and Home featured articles
    $$("button, a").forEach((btn)=>{
      const label = (btn.textContent || "").trim().toLowerCase();
      if (label === "add to cart"){
        btn.addEventListener("click", (e)=>{
          e.preventDefault();
          const fromRow = btn.closest("tr");
          const fromArticle = btn.closest("article");
          let title = "Book", price = "";
          if (fromRow){
            title = (fromRow.querySelector("td:nth-child(2)")?.textContent || title).trim();
            price = (fromRow.querySelector("td:nth-child(4)")?.textContent || "").trim();
          } else if (fromArticle){
            title = (fromArticle.querySelector("h3")?.textContent || title).trim();
            // try to find a price in the article body (like "$18.99")
            const priceMatch = (fromArticle.textContent || "").match(/\$\s?\d+(\.\d{2})?/);
            price = priceMatch ? priceMatch[0] : "";
          }
          addToCart(title, price);
        });
      }
    });
  }

  // ---- Contact: save custom order to localStorage ----
  function wireContactForm(){
    if (!isContact) return;
    const form = document.querySelector("form");
    if (!form) return;
    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const message = form.querySelector("#message");
    const submit = form.querySelector('button[type="submit"], button, input[type="submit"]');

    function handleSubmit(e){
      if (e) e.preventDefault();
      const vName = (name?.value || "").trim();
      const vEmail = (email?.value || "").trim();
      const vMsg = (message?.value || "").trim();
      if (!vName){ alert("Please enter your name."); return; }
      if (!vEmail){ alert("Please enter your email."); return; }
      if (!emailRegex.test(vEmail)){ alert("Please enter a valid email address."); return; }
      if (!vMsg){ alert("Please enter a message."); return; }

      // Save to localStorage as a "custom order"
      const order = {
        name: vName,
        email: vEmail,
        customOrder: vMsg,
        submittedAt: new Date().toISOString()
      };
      pushOrder(order);

      alert("Thank you for your message");
      // form.reset(); // optional
    }

    form.addEventListener("submit", handleSubmit);
    if (submit) submit.addEventListener("click", handleSubmit);
  }

  // ---- Init ----
  ensureCartToolbar();
  wireAddToCartButtons();
  wireContactForm();
})();
</script>
