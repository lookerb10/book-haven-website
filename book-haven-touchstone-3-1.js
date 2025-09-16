
/* Book Haven - Touchstone 3.1 dynamic features
   Works with your existing HTML. It will:
   - Ensure a footer "Subscribe" form exists on every page (auto-inject if missing).
   - Show required alerts for Subscribe.
   - On Gallery page, add Add-to-Cart alerts, plus View Cart modal, Clear Cart, Process Order.
   - On About/Contact page, validate and show "Thank you for your message" on submit.
*/

(function(){
  // Basic helpers
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const isGallery = /gallery\.html$/i.test(location.pathname) || document.title.toLowerCase().includes("gallery");
  const isContact = /about\.html$/i.test(location.pathname) || document.title.toLowerCase().includes("about");

  // ---------- 1) Subscribe (all pages) ----------
  function ensureSubscribeForm(){
    const footer = document.querySelector("footer");
    if (!footer) return null;

    // Look for an existing form with an email input in the footer
    let form = footer.querySelector("form");
    let email = form?.querySelector('input[type="email"]');
    let button = form?.querySelector('button, input[type="submit"]');

    // If not present, inject a minimal form
    if (!form || !email || !button){
      footer.insertAdjacentHTML("beforeend", `
        <form id="subscribe-form" data-subscribe-form style="margin-top:1rem;display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap">
          <input id="subscribe-email" type="email" placeholder="Enter your email" aria-label="Email address" required
                 style="padding:.55rem .75rem;border-radius:6px;border:1px solid #cbd5e0;min-width:220px">
          <button id="subscribe-btn" type="submit" style="padding:.55rem .9rem;border-radius:6px;border:none;font-weight:700;cursor:pointer">
            Subscribe
          </button>
        </form>
      `);
      form = footer.querySelector("#subscribe-form");
      email = form.querySelector("#subscribe-email");
      button = form.querySelector("#subscribe-btn");
    }
    return {form, email, button};
  }

  function wireSubscribe(){
    const refs = ensureSubscribeForm();
    if (!refs) return;
    const {form, email, button} = refs;

    function handleSubscribe(e){
      if (e) e.preventDefault();
      const value = (email.value || "").trim();
      if (!value){
        alert("Please enter your email.");
        return;
      }
      if (!emailRegex.test(value)){
        alert("Please enter a valid email address.");
        return;
      }
      alert("Thank you for subscribing");
      // form.reset(); // optional
    }

    form.addEventListener("submit", handleSubscribe);
    if (button) button.addEventListener("click", handleSubscribe);
  }

  // ---------- 2) Gallery page cart features ----------
  const cart = [];
  let cartBadge, modal, modalList;

  function ensureCartToolbar(){
    // Only add toolbar on gallery page
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
    // Modal
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

    // Wire toolbar buttons
    document.querySelector("#btn-view-cart").addEventListener("click", openCartModal);
    document.querySelector("#btn-clear-cart").addEventListener("click", clearCart);
    document.querySelector("#btn-process-order").addEventListener("click", processOrder);
    modal.querySelector("#cart-modal-close").addEventListener("click", closeCartModal);
    modal.querySelector("#cart-modal-close2").addEventListener("click", closeCartModal);
    modal.addEventListener("click", (e)=>{ if (e.target === modal) closeCartModal(); });
  }

  function updateBadge(){
    if (cartBadge) cartBadge.textContent = `(${cart.length})`;
  }
  function renderCart(){
    if (!modalList) return;
    modalList.innerHTML = "";
    const empty = modal.querySelector("#cart-empty");
    if (cart.length === 0){
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";
    cart.forEach((t,i)=>{
      const li = document.createElement("li");
      li.textContent = `${i+1}. ${t}`;
      modalList.appendChild(li);
    });
  }
  function openCartModal(){ renderCart(); modal.style.display = "flex"; }
  function closeCartModal(){ modal.style.display = "none"; }

  function addToCart(title){
    cart.push(title);
    alert("Item added to the cart");
    updateBadge();
  }
  function clearCart(){
    if (cart.length === 0){ alert("No items to clear."); return; }
    cart.length = 0;
    alert("Cart cleared");
    updateBadge();
    renderCart();
  }
  function processOrder(){
    if (cart.length === 0){ alert("Cart is empty."); return; }
    alert("Thank you for your order");
    cart.length = 0;
    updateBadge();
    renderCart();
  }

  function wireAddToCartButtons(){
    // Featured cards (index) and tables (gallery) — we support both
    $$("button, a").forEach((btn)=>{
      const label = (btn.textContent || "").trim().toLowerCase();
      if (label === "add to cart"){
        btn.addEventListener("click", (e)=>{
          e.preventDefault();
          const fromRow = btn.closest("tr");
          const fromArticle = btn.closest("article");
          let title = "Book";
          if (fromRow){
            // try "Title" column (2nd col)
            const cell = fromRow.querySelector("td:nth-child(2)");
            title = (cell?.textContent || title).trim();
          } else if (fromArticle){
            title = (fromArticle.querySelector("h3")?.textContent || title).trim();
          }
          addToCart(title);
        });
      }
    });
  }

  // ---------- 3) About/Contact form ----------
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

      alert("Thank you for your message");
      // form.reset(); // optional
    }

    form.addEventListener("submit", handleSubmit);
    if (submit) submit.addEventListener("click", handleSubmit);
  }

  // Init
  wireSubscribe();
  ensureCartToolbar();
  wireAddToCartButtons();
  wireContactForm();
})();
