// migracao.js - Transfere os dados do localStorage (Free) para o Supabase (Premium)

async function migrarDadosFreeParaPremium() {
  try {
    // 1. Verifica se existe uma sessão ativa no Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      console.log("Usuário ainda não está autenticado no Supabase.");
      return;
    }

    const userId = session.user.id;

    // 2. Busca os dados salvos localmente no navegador (versão Free)
    // Se o seu planner usa mais de uma chave no localStorage, adicione-as no objeto abaixo
    const dadosLocais = {
      plannerData: localStorage.getItem('flowi_planner_data'),
      metas: localStorage.getItem('flowi_metas'),
      tarefas: localStorage.getItem('flowi_tarefas')
    };

    // Verifica se existe algum dado salvo localmente
    const temDados = Object.values(dadosLocais).some(dado => dado !== null);

    if (temDados) {
      console.log("Dados da versão Free encontrados. Iniciando migração...");

      // 3. Salva/Atualiza os dados na tabela usuarios_dados do Supabase
      const { error: uploadError } = await supabase
        .from('usuarios_dados')
        .upsert({
          user_id: userId,
          conteudo_planner: dadosLocais,
          atualizado_em: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (uploadError) {
        console.error("Erro ao salvar dados no Supabase:", uploadError.message);
      } else {
        console.log("Sucesso! Dados da versão Free migrados para a nuvem no Premium.");
      }
    } else {
      console.log("Nenhum dado local antigo encontrado para migrar.");
    }
  } catch (err) {
    console.error("Erro inesperado durante a migração:", err);
  }
}

// Executa a migração assim que a página é carregada e o Supabase confirma a autenticação
document.addEventListener('DOMContentLoaded', () => {
  if (typeof supabase !== 'undefined') {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        migrarDadosFreeParaPremium();
      }
    });
  }
});
