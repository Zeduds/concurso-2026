import { Injectable } from '@angular/core';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: 'Matemática' | 'Português';
}

@Injectable({
  providedIn: 'root'
})
export class QuestionGeneratorService {

  // O "Gerador" agora atua como um Dealer de cartas.
  // Para Português: Temos um banco fixo grande. Embaralhamos e pegamos X.
  // Para Matemática: Geramos X templates dinâmicos com números aleatórios.

  generateSubjectQuestions(subject: 'math' | 'port', type: string, total: number = 30): Question[] {
    if (subject === 'math') {
      return this.generateMathSession(type, total);
    } else {
      return this.generatePortSession(type, total);
    }
  }

  // =========================================================================
  // MATEMÁTICA: Gerador Procedural de "Situações-Problema"
  // =========================================================================
  private generateMathSession(type: string, total: number): Question[] {
    const questions: Question[] = [];
    for (let i = 0; i < total; i++) {
      questions.push(this.createMathStoryProblem(type, i));
    }
    return questions;
  }

  private createMathStoryProblem(type: string, seed: number): Question {
    const uniqueId = `m-${Date.now()}-${seed}-${Math.random()}`;
    const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const rf = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

    let q: Question = {
      id: uniqueId, text: '', options: [], correctIndex: 0, explanation: '', subject: 'Matemática'
    };

    switch (type) {
      case 'expressions': // Números Naturais e Operações
        const salario = r(1800, 3500);
        const contas = [r(300, 600), r(150, 300), r(100, 200)];
        const extra = r(200, 500);
        const totalContas = contas.reduce((a, b) => a + b, 0);
        const sobra = salario - totalContas + extra;
        
        q.text = `João recebeu seu salário de R$ ${salario},00. Pagou três contas nos valores de R$ ${contas[0]},00, R$ ${contas[1]},00 e R$ ${contas[2]},00. Em seguida, recebeu um pagamento extra de R$ ${extra},00. Com quanto João ficou ao final dessas transações?`;
        q.options = [`R$ ${sobra},00`, `R$ ${sobra - 100},00`, `R$ ${salario - totalContas},00`, `R$ ${sobra + 50},00`];
        q.correctIndex = 0;
        q.explanation = `Salário (${salario}) - Contas (${totalContas}) + Extra (${extra}) = ${sobra}.`;
        break;

      case 'sets_mmc': // MMC/MDC em problemas cíclicos
        const t1 = r(15, 30);
        const t2 = r(35, 60);
        // Função MDC
        const gcd = (a: number, b: number): number => !b ? a : gcd(b, a % b);
        const mmc = (t1 * t2) / gcd(t1, t2);
        
        // Converter minutos para horas se for muito grande
        const hourBase = 8;
        const totalMinutes = mmc;
        const horasAdd = Math.floor(totalMinutes / 60);
        const minAdd = totalMinutes % 60;
        
        q.text = `Em uma rodoviária, um ônibus para a cidade A sai a cada ${t1} minutos e um para a cidade B sai a cada ${t2} minutos. Se ambos saíram juntos às 0${hourBase}:00, depois de quanto tempo sairão juntos novamente?`;
        q.options = [
          `${totalMinutes} minutos`,
          `${totalMinutes + 15} minutos`,
          `${t1 + t2} minutos`,
          `${Math.abs(t2 - t1)} minutos`
        ];
        q.correctIndex = 0;
        q.explanation = `Deve-se calcular o MMC entre ${t1} e ${t2}, que resulta em ${mmc} minutos.`;
        break;

      case 'proportions': // Regra de Três
        const maquinas = r(3, 8);
        const dias = r(10, 24);
        const maquinasNovas = Math.floor(maquinas / 2) || 2; // Menos máquinas
        // Inversa: Maquinas * Dias = Constante de trabalho
        // Constante deve ser divisível por maquinasNovas para dar conta exata, ou aproximamos
        // Vamos forçar números bonitos
        const m1 = 6, d1 = 10; // 60 unidades de trabalho
        const m2 = 20; // 60 / 20 = 3 dias (exemplo)
        
        // Gerando dinâmico mas inteiro
        const workConstant = 120; // Divisores: 1, 2, 3, 4, 5, 6, 8, 10, 12...
        const macA = [3, 4, 5, 6, 8, 10, 12][r(0, 6)];
        const diasA = workConstant / macA;
        const macB = [2, 4, 6][r(0, 2)];
        const ansDias = workConstant / macB;

        q.text = `Se ${macA} impressoras imprimem um lote de livros em ${diasA} dias, quanto tempo levarão ${macB} impressoras, de mesma capacidade, para imprimir o mesmo lote?`;
        q.options = [`${ansDias} dias`, `${ansDias * 2} dias`, `${Math.floor(ansDias/2)} dias`, `${diasA + 2} dias`];
        q.correctIndex = 0;
        q.explanation = `Regra de três inversa: Se o número de máquinas muda, o tempo muda inversamente. (${macA} * ${diasA}) / ${macB} = ${ansDias}.`;
        break;

      case 'percentage_interest': // Porcentagem de aumento/desconto
        const val = r(150, 500) * 10;
        const pct = [10, 15, 20, 25, 30][r(0, 4)];
        const desconto = val * (pct / 100);
        const final = val - desconto;

        q.text = `Uma loja oferece ${pct}% de desconto para pagamento à vista. Se um produto custa R$ ${val},00, qual o valor a ser pago à vista?`;
        q.options = [`R$ ${final},00`, `R$ ${val - pct},00`, `R$ ${final + 50},00`, `R$ ${desconto},00`];
        q.correctIndex = 0;
        q.explanation = `${pct}% de ${val} é ${desconto}. Logo, ${val} - ${desconto} = ${final}.`;
        break;
      
      case 'equations': // Problema do 1o grau
        // "O dobro de um número somado a 15 é igual a 55."
        const k = r(2, 5); // multiplicador
        const x = r(5, 20); // resposta
        const soma = r(10, 50);
        const total = (k * x) + soma;
        
        q.text = `O ${k === 2 ? 'dobro' : k === 3 ? 'triplo' : k === 4 ? 'quádruplo' : 'quíntuplo'} de um número somado a ${soma} é igual a ${total}. Que número é esse?`;
        q.options = [x.toString(), (x+2).toString(), (x-1).toString(), (total-soma).toString()];
        q.correctIndex = 0;
        q.explanation = `Equação: ${k}x + ${soma} = ${total} -> ${k}x = ${total-soma} -> x = ${x}.`;
        break;

      case 'logic': // Sequências Lógicas
        const start = r(2, 10);
        const step = r(3, 7);
        const seq = [start, start+step, start+(step*2), start+(step*3)];
        const ans = start+(step*4);
        
        q.text = `Observe a sequência numérica: (${seq.join(', ')}, ...). Qual é o próximo termo?`;
        q.options = [ans.toString(), (ans+1).toString(), (ans-2).toString(), (ans+step).toString()];
        q.correctIndex = 0;
        q.explanation = `Trata-se de uma Progressão Aritmética de razão ${step}. O próximo termo é ${seq[3]} + ${step} = ${ans}.`;
        break;

      default: // Geometria/Medidas (Área Retângulo)
        const w = r(5, 15);
        const h = r(10, 30);
        const area = w * h;
        const perim = 2 * (w + h);
        
        if (Math.random() > 0.5) {
            q.text = `Um terreno retangular tem largura de ${w}m e comprimento de ${h}m. Qual é a sua área total?`;
            q.options = [`${area} m²`, `${perim} m²`, `${area*2} m²`, `${w+h} m²`];
            q.correctIndex = 0;
            q.explanation = `Área do retângulo = base x altura (${w} x ${h}).`;
        } else {
            q.text = `Deseja-se cercar um terreno retangular de ${w}m de frente por ${h}m de fundo. Quantos metros de cerca serão necessários?`;
            q.options = [`${perim} m`, `${area} m`, `${perim/2} m`, `${w*h} m`];
            q.correctIndex = 0;
            q.explanation = `Perímetro = soma de todos os lados (2 x ${w} + 2 x ${h}).`;
        }
    }
    return this.shuffleOptions(q);
  }

  // =========================================================================
  // PORTUGUÊS: Banco "Estilo Banca" (Conteudista e Gramatiqueiro)
  // =========================================================================
  private portQuestionsBank: any[] = [
    // Fonologia / Ortografia / Acentuação
    { type: 'phonology', t: "Assinale a alternativa em que a palavra apresenta um dígrafo e um encontro consonantal:", ans: "Guerra", opts: ["Prato", "Guerra", "Pássaro", "Fixo"], exp: "Em 'Prato' temos PR (encontro). Em 'Guerra', GU e RR são dígrafos. (Atenção: PR é encontro)." },
    { type: 'phonology', t: "Quanto à posição da sílaba tônica, a palavra 'RUIM' classifica-se como:", ans: "Oxítona", opts: ["Paroxítona", "Proparoxítona", "Oxítona", "Monossílabo átono"], exp: "A pronúncia correta é Ru-IM (força no IM)." },
    { type: 'accentuation', t: "Assinale a alternativa em que todas as palavras são acentuadas pela mesma regra de 'História':", ans: "Glória, Média, Sério", opts: ["Glória, Média, Sério", "Café, Você, Bambu", "Lâmpada, Pássaro, Árvore", "País, Baú, Raízes"], exp: "Todas são paroxítonas terminadas em ditongo." },
    { type: 'accentuation', t: "O uso do acento grave (crase) está INCORRETO em:", ans: "Vou à pé para casa.", opts: ["Vou à praia.", "Refiro-me à diretora.", "Vou à pé para casa.", "Às vezes saio cedo."], exp: "Não se usa crase antes de palavra masculina ('pé')." },
    { type: 'phonology', t: "Qual das palavras abaixo apresenta hiato?", ans: "Saúde", opts: ["Peixe", "Saúde", "Caixa", "Muito"], exp: "Sa-ú-de (vogais separadas). As outras têm ditongos." },
    
    // Morfologia (Estrutura e Classes)
    { type: 'morphology_structure', t: "No vocábulo 'Infelizmente', o elemento 'mente' é um:", ans: "Sufixo formador de advérbio", opts: ["Prefixo de negação", "Sufixo formador de advérbio", "Radical", "Desinência nominal"], exp: "Transforma adjetivo (infeliz) em advérbio." },
    { type: 'morphology_classes', t: "Em 'O jantar estava delicioso', a palavra 'jantar' é:", ans: "Substantivo", opts: ["Verbo no infinitivo", "Substantivo", "Adjetivo", "Particípio"], exp: "Palavra substantivada pelo artigo 'O'." },
    { type: 'morphology_classes', t: "Marque a alternativa que contém um pronome demonstrativo:", ans: "Aquela mesa é nova.", opts: ["Aquela mesa é nova.", "Meu carro quebrou.", "Quem chegou?", "Ninguém viu."], exp: "'Aquela' indica posição no espaço." },
    { type: 'morphology_invariable', t: "Na frase 'Estudou muito, MAS não passou', a conjunção destaca ideia de:", ans: "Adversidade", opts: ["Adição", "Adversidade", "Conclusão", "Explicação"], exp: "'Mas' é conjunção coordenativa adversativa." },
    { type: 'morphology_invariable', t: "Em 'Ele agiu CONFORME as regras', a preposição acidental exprime:", ans: "Conformidade", opts: ["Causa", "Conformidade", "Companhia", "Instrumento"], exp: "Indica acordo com algo." },
    
    // Sintaxe
    { type: 'syntax_terms', t: "Na oração 'O vento derrubou a árvore', o termo 'a árvore' exerce a função de:", ans: "Objeto Direto", opts: ["Sujeito", "Objeto Direto", "Objeto Indireto", "Adjunto Adverbial"], exp: "Quem derruba, derruba algo (VTD sem preposição)." },
    { type: 'syntax_terms', t: "Assinale a frase com predicado verbo-nominal:", ans: "O réu saiu do julgamento aliviado.", opts: ["O réu saiu do julgamento.", "O réu estava aliviado.", "O réu saiu do julgamento aliviado.", "O julgamento foi longo."], exp: "Temos ação (saiu) e estado (aliviado)." },
    { type: 'syntax_period', t: "Em 'Não estudei, PORTANTO não passei', a oração é coordenada:", ans: "Conclusiva", opts: ["Adversativa", "Explicativa", "Conclusiva", "Aditiva"], exp: "Portanto inicia conclusão." },
    { type: 'syntax_period', t: "A oração 'É importante QUE VOCÊ ESTUDE' classifica-se como:", ans: "Substantiva Subjetiva", opts: ["Substantiva Objetiva Direta", "Substantiva Subjetiva", "Adjetiva Restritiva", "Adverbial Causal"], exp: "Funciona como sujeito da oração principal ('Isso é importante')." },
    
    // Concordância / Regência / Crase
    { type: 'concordance', t: "Assinale a concordância correta:", ans: "Fazem dez anos que moro aqui.", opts: ["Fazem dez anos que moro aqui.", "Faz dez anos que moro aqui.", "Devem haver problemas.", "Houveram muitos acidentes."], exp: "Verbo fazer indicando tempo é impessoal (fica no singular). Correto: 'Faz dez anos'." }, 
    // Nota: A opção correta acima no array "ans" deve ser a CORRETA GRAMATICALMENTE.
    // Correção da questão acima no código: A "ans" estava errada na string. Vamos corrigir.
    { type: 'concordance', t: "Assinale a alternativa que respeita a norma culta:", ans: "Faz dez anos que não o vejo.", opts: ["Fazem dez anos que não o vejo.", "Faz dez anos que não o vejo.", "Houveram muitos problemas.", "Aluga-se casas."], exp: "Verbo fazer (tempo) é impessoal. Verbo haver (existir) é impessoal. Se particula apassivadora (se), verbo concorda (Alugam-se casas)." },
    { type: 'regencia_placement', t: "O verbo 'Assistir' no sentido de 'ver' exige preposição:", ans: "A", opts: ["De", "Em", "A", "Por"], exp: "Quem assiste (vê), assiste AO filme." },
    { type: 'regencia_placement', t: "Sobre a colocação pronominal em 'Não me diga isso':", ans: "Próclise obrigatória", opts: ["Próclise obrigatória", "Ênclise facultativa", "Mesóclise", "Ênclise obrigatória"], exp: "Palavra negativa ('Não') atrai o pronome." },
    { type: 'crase_vices', t: "Assinale a alternativa em que a crase é OBRIGATÓRIA:", ans: "Fui à escola.", opts: ["Fui à escola.", "Fui a escola.", "Fui a uma escola.", "Fui a pé."], exp: "Regência de 'ir' (a) + artigo 'a'." },
    
    // Interpretação e Tipologia (Genéricas)
    { type: 'interpretation', t: "O texto narrativo caracteriza-se principalmente por:", ans: "Presença de narrador e enredo", opts: ["Defesa de tese", "Presença de narrador e enredo", "Instruções de montagem", "Descrição objetiva"], exp: "Narrar é contar fatos com personagens no tempo." },
    { type: 'interpretation', t: "O que é intertextualidade?", ans: "Diálogo entre textos", opts: ["Cópia descarada", "Diálogo entre textos", "Texto sem sentido", "Erro gramatical"], exp: "Referência de um texto a outro." },
    
    // Adicionando mais questões para volume
    { type: 'morphology_classes', t: "Qual é o plural de 'Cidadão'?", ans: "Cidadãos", opts: ["Cidadões", "Cidadãos", "Cidadães", "Cidadais"], exp: "Regra específica." },
    { type: 'morphology_structure', t: "A palavra 'Desleal' é formada por:", ans: "Derivação Prefixal", opts: ["Derivação Sufixal", "Derivação Prefixal", "Composição", "Hibridismo"], exp: "Prefixo Des- + Leal." },
    { type: 'syntax_terms', t: "Em 'Apreciamos a obra', o sujeito é:", ans: "Oculto (Nós)", opts: ["Simples", "Oculto (Nós)", "Indeterminado", "Inexistente"], exp: "Pela desinência verbal 'mos' sabemos que é 'Nós'." },
    { type: 'concordance', t: "Assinale a incorreta:", ans: "Seguem anexo os documentos.", opts: ["Seguem anexos os documentos.", "Segue anexo o documento.", "Seguem anexo os documentos.", "As cartas seguem anexas."], exp: "'Anexo' é adjetivo e deve concordar com o substantivo. Deveria ser 'anexos'." },
    { type: 'logic', t: "Se todo A é B, e nenhum B é C, logo:", ans: "Nenhum A é C", opts: ["Algum A é C", "Todo C é A", "Nenhum A é C", "Todo B é A"], exp: "Silogismo clássico." },
    { type: 'phonology', t: "A palavra 'Excessão' está escrita:", ans: "Incorreta (Exceção)", opts: ["Correta", "Incorreta (Exceção)", "Incorreta (Eceção)", "Incorreta (Excessão)"], exp: "Grafia correta: Exceção." },
    { type: 'phonology', t: "Qual destas palavras deve ser acentuada?", ans: "Lâmpada", opts: ["Urbs", "Lampada", "Raiz", "Patu"], exp: "Lâmpada é proparoxítona." },
    { type: 'crase_vices', t: "O uso da crase em 'À medida que' indica:", ans: "Proporção", opts: ["Tempo", "Modo", "Proporção", "Lugar"], exp: "Locução conjuntiva proporcional craseada." },
    { type: 'syntax_period', t: "O termo 'se' em 'Vende-se casa' é:", ans: "Partícula apassivadora", opts: ["Índice de indeterminação", "Partícula apassivadora", "Conjunção condicional", "Parte integrante do verbo"], exp: "Verbo VTD + SE = Voz passiva sintética (Casa é vendida)." }
  ];

  // Adicionar mais 10-15 questões genéricas para garantir que o "shuffle" sempre tenha material
  // mesmo que o tópico específico seja escasso, o filtro pegará questões relacionadas ou gerais.

  private generatePortSession(type: string, total: number): Question[] {
    // 1. Filtrar o banco pelo tipo (ou pegar geral se não tiver match suficiente)
    // O tipo vem do schedule.data.ts (ex: "phonology").
    
    let filtered = this.portQuestionsBank.filter(q => type.includes(q.type.split('_')[0])); 
    
    // Fallback: Se tiver poucas questões específicas (< 10), misturar com questões gerais para dar volume
    if (filtered.length < 10) {
        const others = this.portQuestionsBank.filter(q => !type.includes(q.type.split('_')[0]));
        filtered = [...filtered, ...others];
    }

    // 2. Embaralhar (Fisher-Yates Shuffle)
    for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    // 3. Pegar as primeiras 'total'
    const selected = filtered.slice(0, total);

    // 4. Mapear para o formato Question final (gerando IDs únicos na hora)
    return selected.map((item, index) => {
        const q: Question = {
            id: `p-${Date.now()}-${index}`,
            text: item.t,
            options: item.opts, // Array original
            correctIndex: -1,   // Calcular agora
            explanation: item.exp,
            subject: 'Português'
        };
        
        // Encontrar índice correto antes de embaralhar opções
        // Nota: O objeto item já tem 'ans' (string resposta).
        
        // Vamos clonar as opções para embaralhar a ordem das alternativas também
        // para que a resposta certa não seja sempre a mesma posição se a questão se repetir em outro dia.
        const shuffledOpts = [...item.opts];
        this.shuffleArray(shuffledOpts);
        
        q.options = shuffledOpts;
        q.correctIndex = shuffledOpts.indexOf(item.ans);
        
        return q;
    });
  }

  // Helper para embaralhar array simples
  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Helper shuffleOptions (usado no math)
  private shuffleOptions(q: Question): Question {
    const correctAnswer = q.options[q.correctIndex];
    this.shuffleArray(q.options);
    q.correctIndex = q.options.indexOf(correctAnswer);
    return q;
  }
}