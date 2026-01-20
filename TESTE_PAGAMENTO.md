# 🧪 Como Testar o Fluxo de Pagamento

## ✅ Correções Aplicadas:

1. ✅ **Semestral e Anual trocados** - CORRIGIDO
2. ✅ **Email preenche todos os labels** - CORRIGIDO (agora cada plano tem seu próprio state)
3. ✅ **Sugestão do Google dá erro** - CORRIGIDO (adicionado trim e onBlur)
4. ⚠️ **Cartão de teste** - Veja instruções abaixo

---

## 🔧 Como Testar com o Stripe:

### Passo 1: Acesse a Landing Page
https://trainerpro-17.preview.emergentagent.com

### Passo 2: Escolha um Plano
- Role até a seção "Escolha seu plano"
- Digite seu email em **UM** dos planos
- Clique em "Assinar Agora"

### Passo 3: No Checkout do Stripe

Use estes **cartões de teste** válidos:

#### ✅ Cartão que FUNCIONA (aprovação imediata):
```
Número: 4242 4242 4242 4242
Data: 12/34 (qualquer data futura)
CVC: 123 (qualquer 3 dígitos)
CEP: 12345
```

#### ❌ Cartão que FALHA (para testar erro):
```
Número: 4000 0000 0000 0002
Data: 12/34
CVC: 123
CEP: 12345
```

#### 🔐 Cartão que requer autenticação 3D Secure:
```
Número: 4000 0027 6000 3184
Data: 12/34
CVC: 123
CEP: 12345
```

### Passo 4: Após o Pagamento
1. Você será redirecionado para `/success`
2. Verá a confirmação de pagamento
3. Clique em "Criar Minha Conta Agora"
4. Defina sua senha (mínimo 6 caracteres)
5. Clique em "Criar Conta"
6. Será redirecionado para `/login`
7. Faça login e use o app!

---

## 🐛 Possíveis Problemas e Soluções:

### Problema: "Erro ao processar pagamento"
**Causa**: Cartão inválido ou problema de conexão
**Solução**: 
- Use exatamente o cartão `4242 4242 4242 4242`
- Verifique se sua conta Stripe está em modo TEST
- Confira se os Price IDs estão corretos no dashboard do Stripe

### Problema: "Pagamento não confirmado"
**Causa**: Você clicou em "Voltar" antes de completar
**Solução**: 
- Complete todo o fluxo de pagamento no Stripe
- Clique em "Pay" para finalizar

### Problema: "Token inválido ou já utilizado"
**Causa**: Tentou criar conta 2x com o mesmo token
**Solução**: 
- Faça um novo pagamento para gerar novo token
- Cada token só pode ser usado uma vez

---

## 📊 Verificar no Stripe Dashboard

1. Acesse: https://dashboard.stripe.com/test/payments
2. Certifique-se que está em **modo TEST** (toggle no topo)
3. Você deve ver os pagamentos de teste aparecendo
4. Status deve ser "Succeeded" para pagamentos aprovados

---

## 🔑 Credenciais Configuradas:

- ✅ Secret Key: `sk_test_51SrlQuI8oWN5ja52...` (configurada)
- ✅ Price ID Mensal: `price_1SrlWEI8oWN5ja521B1sT6TV`
- ✅ Price ID Semestral: `price_1SrlWEI8oWN5ja52M25Ri6ps`
- ✅ Price ID Anual: `price_1SrlWEI8oWN5ja52bjBq9YgZ`

---

## ✅ Checklist de Teste:

- [ ] Landing page carrega corretamente
- [ ] Cada plano tem seu próprio campo de email
- [ ] Email com sugestão do Google funciona
- [ ] Botão "Assinar Agora" abre checkout do Stripe
- [ ] Checkout usa cartão 4242 4242 4242 4242
- [ ] Após pagar, redireciona para /success
- [ ] Página de sucesso mostra dados corretos
- [ ] Botão "Criar Conta" funciona
- [ ] Cadastro cria usuário no Supabase
- [ ] Login funciona com a nova conta
- [ ] Dashboard carrega sem erros

---

## 🚀 Próximos Passos (Após Testar):

Se tudo funcionar:
- ✅ Sistema está pronto para uso
- 📧 Considere adicionar emails de boas-vindas
- 🔔 Adicione webhook do Stripe para confirmações automáticas

Se encontrar erros:
- 📋 Me envie o erro específico
- 🔍 Verifique os logs: `/var/log/supervisor/backend.err.log`
- 💬 Compartilhe qual passo falhou
