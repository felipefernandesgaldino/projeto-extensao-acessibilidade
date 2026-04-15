import { createClient } from '@supabase/supabase-js'

// 1. CONFIGURAÇÃO DO SUPABASE
// Substitua pelos seus dados reais do painel do Supabase se forem diferentes
// O '(import.meta as any)' remove o erro ts(2339)
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
const SUPABASE_KEY = (import.meta as any).env.VITE_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 2. FUNÇÃO PARA FALAR E SALVAR NO BANCO
async function falar(texto: string, acao: string) {
    // Faz o navegador/celular falar a frase
    const mensagem = new SpeechSynthesisUtterance(texto)
    mensagem.lang = 'pt-BR'
    window.speechSynthesis.speak(mensagem)
    
    console.log(`Enviando alerta de ${acao} para o Supabase...`)

    // Salva o registro na tabela que criamos no banco de dados
    const { error } = await supabase
        .from('alertas_acessibilidade')
        .insert([{ tipo_alerta: acao }])

    if (error) {
        console.error("Erro ao avisar o cuidador no banco:", error.message)
    } else {
        console.log("Sucesso! O cuidador recebeu o alerta no sistema.")
    }
}

// 3. OUVINTES DE CLIQUE (Event Listeners)
// Liga os IDs dos botões do seu index.html às funções de voz
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-fome')?.addEventListener('click', () => falar('Estou com fome', 'Fome'))
    document.getElementById('btn-sede')?.addEventListener('click', () => falar('Quero beber água', 'Sede'))
    document.getElementById('btn-banheiro')?.addEventListener('click', () => falar('Preciso ir ao banheiro', 'Banheiro'))
    document.getElementById('btn-dor')?.addEventListener('click', () => falar('Estou sentindo dor', 'Dor'))
    document.getElementById('btn-ajuda')?.addEventListener('click', () => falar('Por favor, preciso de ajuda', 'Ajuda'))
    document.getElementById('btn-emergencia')?.addEventListener('click', () => falar('EMERGÊNCIA! PRECISO DE VOCÊ AGORA!', 'Emergência'))
})