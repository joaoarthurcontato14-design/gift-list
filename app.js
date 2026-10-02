(() => {
  const cfg = window.GIFT_CONFIG || {};
  const hasSupabaseConfig =
    cfg.SUPABASE_URL &&
    cfg.SUPABASE_ANON_KEY &&
    !cfg.SUPABASE_URL.includes("COLE_AQUI") &&
    !cfg.SUPABASE_ANON_KEY.includes("COLE_AQUI");

  let supabase = null;
  if (hasSupabaseConfig && window.supabase) {
    supabase = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  }

  const $ = (s) => document.querySelector(s);
  const categoriesGrid = $("#categories-grid");
  const adminPanel = $("#admin-panel");
  const site = $("#app");

  // ---------- Loader: exactly 5 seconds ----------
  const loaderStart = performance.now();
  const loaderBar = $("#loader-bar");
  const loaderPercent = $("#loader-percent");
  const floating = $("#floating-gifts");
  const symbols = ["🎁","🎀","✦","✧","🎁","♡","✦","🎀"];

  function spawnGift() {
    const el = document.createElement("span");
    el.className = "gift-float";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.setProperty("--drift", (Math.random() * 220 - 110) + "px");
    el.style.setProperty("--dur", (3.2 + Math.random() * 3.4) + "s");
    el.style.animationDelay = (-Math.random() * 2.5) + "s";
    floating.appendChild(el);
    setTimeout(() => el.remove(), 7000);
  }
  for (let i = 0; i < 22; i++) spawnGift();
  const giftTimer = setInterval(spawnGift, 260);

  function finishLoader() {
    const elapsed = performance.now() - loaderStart;
    const remaining = Math.max(0, 5000 - elapsed);
    setTimeout(() => {
      clearInterval(giftTimer);
      loaderBar.style.width = "100%";
      loaderPercent.textContent = "100%";
      $("#loader").style.transition = "opacity .6s ease";
      $("#loader").style.opacity = "0";
      setTimeout(() => {
        $("#loader").remove();
        site.classList.remove("hidden");
      }, 650);
    }, remaining);
  }

  function animateProgress() {
    const elapsed = performance.now() - loaderStart;
    const pct = Math.min(100, Math.round((elapsed / 5000) * 100));
    loaderBar.style.width = pct + "%";
    loaderPercent.textContent = pct + "%";
    if (pct < 100) requestAnimationFrame(animateProgress);
  }
  requestAnimationFrame(animateProgress);

  // ---------- Modals ----------
  function openModal(id) {
    $(id).classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
  function closeModals() {
    document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
    document.body.style.overflow = "";
  }
  document.querySelectorAll("[data-close-modal], .modal-backdrop").forEach(el => {
    el.addEventListener("click", closeModals);
  });

  $("#pix-card").addEventListener("click", () => openModal("#pix-modal"));
  $("#admin-link").addEventListener("click", async () => {
    if (!supabase) {
      openModal("#login-modal");
      $("#login-error").textContent = "O Supabase ainda não foi configurado. Veja o passo a passo do arquivo LEIA-ME.";
      return;
    }
    const { data } = await supabase.auth.getSession();
    if (data.session) showAdmin();
    else openModal("#login-modal");
  });

  $("#copy-pix").addEventListener("click", async () => {
    const key = cfg.PIX_KEY || "81985387719";
    try {
      await navigator.clipboard.writeText(key);
      $("#copy-status").textContent = "Chave copiada! ✦";
    } catch {
      $("#copy-status").textContent = "Não foi possível copiar automaticamente. Selecione a chave manualmente.";
    }
  });

  // ---------- Public data ----------
  const fallbackCategories = [
    {name:"Faculdade",description:"Materiais, ferramentas e itens para o curso.",image_url:"",amazon_url:"https://www.amazon.com.br/"},
    {name:"Vestuário",description:"Roupas, acessórios e peças que combinam comigo.",image_url:"",amazon_url:"https://www.amazon.com.br/"},
    {name:"Casa",description:"Pequenos itens para meu cantinho.",image_url:"",amazon_url:"https://www.amazon.com.br/"},
    {name:"Tecnologia",description:"Acessórios e equipamentos para criar e estudar.",image_url:"",amazon_url:"https://www.amazon.com.br/"},
    {name:"Livros",description:"Livros e referências para a vida e para a faculdade.",image_url:"",amazon_url:"https://www.amazon.com.br/"}
  ];

  function renderCategories(categories) {
    categoriesGrid.innerHTML = "";
    if (!categories.length) {
      categoriesGrid.innerHTML = '<div class="loading-card">Nenhuma categoria cadastrada ainda.</div>';
      return;
    }
    categories.forEach(c => {
      const card = document.createElement("button");
      card.className = "category-card";
      card.type = "button";
      card.addEventListener("click", () => {
        if (c.amazon_url) window.open(c.amazon_url, "_blank", "noopener,noreferrer");
      });

      const image = document.createElement("div");
      image.className = "category-image";
      if (c.image_url) image.style.backgroundImage = `url("${c.image_url.replace(/"/g, '\\"')}")`;

      const overlay = document.createElement("div");
      overlay.className = "category-overlay";

      const arrow = document.createElement("div");
      arrow.className = "category-arrow";
      arrow.textContent = "↗";

      const content = document.createElement("div");
      content.className = "category-content";
      const h3 = document.createElement("h3");
      h3.textContent = c.name;
      const p = document.createElement("p");
      p.textContent = c.description;
      content.append(h3,p);

      card.append(image, overlay, arrow, content);
      categoriesGrid.appendChild(card);
    });
  }

  async function loadPublicData() {
    if (!supabase) {
      renderCategories(fallbackCategories);
      $("#delivery-address").textContent = cfg.FALLBACK_ADDRESS || "Configure seu endereço.";
      $("#delivery-info").textContent = cfg.FALLBACK_INFO || "Configure suas informações.";
      finishLoader();
      return;
    }

    const [catRes, settingsRes] = await Promise.all([
      supabase.from("categories").select("*").order("created_at", {ascending:true}),
      supabase.from("site_settings").select("*").eq("id",1).maybeSingle()
    ]);

    if (catRes.error) {
      console.error(catRes.error);
      renderCategories(fallbackCategories);
    } else {
      renderCategories(catRes.data || []);
    }

    if (!settingsRes.error && settingsRes.data) {
      $("#delivery-address").textContent = settingsRes.data.delivery_address;
      $("#delivery-info").textContent = settingsRes.data.delivery_info;
    } else {
      $("#delivery-address").textContent = cfg.FALLBACK_ADDRESS;
      $("#delivery-info").textContent = cfg.FALLBACK_INFO;
    }
    finishLoader();
  }

  // ---------- Auth ----------
  $("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("#login-error").textContent = "";

    if (!supabase) {
      $("#login-error").textContent = "Configure o Supabase primeiro.";
      return;
    }

    const name = $("#login-name").value.trim();
    const password = $("#login-password").value;

    if (name.toLowerCase() !== (cfg.ADMIN_DISPLAY_NAME || "João Arthur").toLowerCase()) {
      $("#login-error").textContent = "Nome de administrador inválido.";
      return;
    }

    // This internal email is NOT the password and can be public.
    const internalEmail = "joao.arthur@giftlist.admin";
    const { error } = await supabase.auth.signInWithPassword({
      email: internalEmail,
      password
    });

    if (error) {
      $("#login-error").textContent = "Não foi possível entrar. Confira o nome e a senha.";
      return;
    }
    closeModals();
    showAdmin();
  });

  async function showAdmin() {
    site.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    await loadAdminData();
    window.scrollTo(0,0);
  }

  $("#logout-btn").addEventListener("click", async () => {
    if (supabase) await supabase.auth.signOut();
    adminPanel.classList.add("hidden");
    site.classList.remove("hidden");
    window.scrollTo(0,0);
  });

  // ---------- Admin categories ----------
  let editingId = null;

  function clearCategoryForm() {
    editingId = null;
    $("#category-id").value = "";
    $("#cat-name").value = "";
    $("#cat-description").value = "";
    $("#cat-image").value = "";
    $("#cat-url").value = "";
    $("#form-title").textContent = "Nova categoria";
    $("#save-category").textContent = "Adicionar categoria";
    $("#cancel-edit").classList.add("hidden");
  }

  function renderAdminCategories(categories) {
    const box = $("#admin-categories");
    box.innerHTML = "";
    if (!categories.length) {
      box.innerHTML = '<div class="empty-admin">Nenhuma categoria cadastrada.</div>';
      return;
    }
    categories.forEach(c => {
      const item = document.createElement("div");
      item.className = "admin-item";
      const info = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = c.name;
      const small = document.createElement("small");
      small.textContent = c.description;
      info.append(strong,small);

      const actions = document.createElement("div");
      actions.className = "admin-actions";

      const edit = document.createElement("button");
      edit.textContent = "Editar";
      edit.onclick = () => {
        editingId = c.id;
        $("#category-id").value = c.id;
        $("#cat-name").value = c.name;
        $("#cat-description").value = c.description;
        $("#cat-image").value = c.image_url || "";
        $("#cat-url").value = c.amazon_url;
        $("#form-title").textContent = "Editar categoria";
        $("#save-category").textContent = "Salvar alterações";
        $("#cancel-edit").classList.remove("hidden");
        window.scrollTo({top:0,behavior:"smooth"});
      };

      const del = document.createElement("button");
      del.textContent = "Excluir";
      del.onclick = async () => {
        if (!confirm(`Excluir "${c.name}"?`)) return;
        const { error } = await supabase.from("categories").delete().eq("id",c.id);
        if (error) {
          alert("Não foi possível excluir. " + error.message);
          return;
        }
        await loadAdminData();
      };
      actions.append(edit,del);
      item.append(info,actions);
      box.appendChild(item);
    });
  }

  $("#cancel-edit").addEventListener("click", clearCategoryForm);

  $("#category-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!supabase) return;
    const payload = {
      name: $("#cat-name").value.trim(),
      description: $("#cat-description").value.trim(),
      image_url: $("#cat-image").value.trim(),
      amazon_url: $("#cat-url").value.trim()
    };
    $("#category-status").textContent = "Salvando…";

    const result = editingId
      ? await supabase.from("categories").update(payload).eq("id", editingId)
      : await supabase.from("categories").insert(payload);

    if (result.error) {
      $("#category-status").textContent = "Erro: " + result.error.message;
      return;
    }
    $("#category-status").textContent = "Salvo com sucesso.";
    clearCategoryForm();
    await loadAdminData();
  });

  async function loadAdminData() {
    const { data: categories, error } = await supabase.from("categories").select("*").order("created_at",{ascending:true});
    if (!error) renderAdminCategories(categories || []);

    const { data: settings } = await supabase.from("site_settings").select("*").eq("id",1).maybeSingle();
    if (settings) {
      $("#setting-address").value = settings.delivery_address;
      $("#setting-info").value = settings.delivery_info;
    }
  }

  $("#settings-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!supabase) return;
    const payload = {
      delivery_address: $("#setting-address").value.trim(),
      delivery_info: $("#setting-info").value.trim(),
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from("site_settings").update(payload).eq("id",1);
    $("#settings-status").textContent = error ? "Erro: " + error.message : "Informações salvas com sucesso.";
    if (!error) {
      $("#delivery-address").textContent = payload.delivery_address;
      $("#delivery-info").textContent = payload.delivery_info;
    }
  });

  loadPublicData();
})();
