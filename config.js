/*
  GIFT LIST — CONFIGURAÇÃO

  1) Crie um projeto gratuito no Supabase.
  2) Copie a URL do projeto e a "Publishable key" (ou anon key).
  3) Cole os dois valores abaixo.
  4) NÃO coloque a Service Role Key aqui. Ela é secreta e nunca deve ir para o GitHub.

  O endereço abaixo é apenas um texto inicial. Você poderá alterá-lo pelo painel administrativo.
*/

window.GIFT_CONFIG = {
  SUPABASE_URL: "https://cbkvlkadiozttzwceiqp.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_yBO3P9PzoGpjG-dUYxzqGw_VrLa5mVb",

  // Nome que aparece no login do administrador.
  ADMIN_DISPLAY_NAME: "João Arthur",
  ADMIN_EMAIL: "joaoarthurcontato14@gmail.com"

  // Chave Pix usada no site.
  PIX_KEY: "81985387719",

  // Conteúdo inicial mostrado enquanto as configurações do banco ainda não foram preenchidas.
  FALLBACK_ADDRESS: "Rua Júlio Castilho, 308 - Dois Unidos, Recife/PE.",
  FALLBACK_INFO: "Se a compra pedir complemento ou referência, siga as informações acima. Para pedidos da Amazon, confira se o endereço selecionado é o correto antes de finalizar."
};
