/*
  GIFT LIST — CONFIGURAÇÃO

  1) Crie um projeto gratuito no Supabase.
  2) Copie a URL do projeto e a "Publishable key" (ou anon key).
  3) Cole os dois valores abaixo.
  4) NÃO coloque a Service Role Key aqui. Ela é secreta e nunca deve ir para o GitHub.

  O endereço abaixo é apenas um texto inicial. Você poderá alterá-lo pelo painel administrativo.
*/

window.GIFT_CONFIG = {
  SUPABASE_URL: "COLE_AQUI_A_URL_DO_SEU_PROJETO_SUPABASE",
  SUPABASE_ANON_KEY: "COLE_AQUI_A_CHAVE_PUBLICA_DO_SUPABASE",

  // Nome que aparece no login do administrador.
  ADMIN_DISPLAY_NAME: "João Arthur",

  // Chave Pix usada no site.
  PIX_KEY: "81985387719",

  // Conteúdo inicial mostrado enquanto as configurações do banco ainda não foram preenchidas.
  FALLBACK_ADDRESS: "COLE AQUI O ENDEREÇO COMPLETO DE ENTREGA.",
  FALLBACK_INFO: "Se a compra pedir complemento ou referência, siga as informações acima. Para pedidos da Amazon, confira se o endereço selecionado é o correto antes de finalizar."
};
