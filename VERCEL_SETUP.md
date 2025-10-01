# Configuração do Vercel para Feijó Seguros

## Variáveis de Ambiente

Após fazer o deploy no Vercel, você precisa configurar as seguintes variáveis de ambiente:

1. Acesse o painel do Vercel
2. Vá para Settings > Environment Variables
3. Adicione a seguinte variável:

```
VITE_RESEND_API_KEY=re_2hAktQX4_MZFwiUSRBdNzge3oSxXAqnkh
```

## Configuração do Domínio

O sistema está configurado para funcionar com o domínio:
- **Produção**: `https://feijo-seguros.vercel.app`
- **Desenvolvimento**: `http://localhost:3001`

## Funcionalidades Configuradas

✅ **CORS**: Configurado para permitir requisições do domínio de produção
✅ **API de Email**: Função serverless criada em `/api/send-email.js`
✅ **Roteamento**: Configurado no `vercel.json` para direcionar chamadas de API
✅ **Detecção de Ambiente**: O frontend detecta automaticamente se está em produção ou desenvolvimento

## Como Testar

1. Faça o deploy no Vercel
2. Configure a variável de ambiente `VITE_RESEND_API_KEY`
3. Acesse `https://feijo-seguros.vercel.app`
4. Teste o formulário de cotação de seguro auto

## Estrutura de Arquivos

```
/
├── api/
│   └── send-email.js          # Função serverless para envio de emails
├── src/
│   └── lib/
│       └── email-service.ts   # Serviço que detecta ambiente e chama API correta
├── server.js                  # Servidor local para desenvolvimento
├── vercel.json               # Configuração do Vercel
└── .env.example              # Exemplo de variáveis de ambiente
```

## Notas Importantes

- O email será enviado usando `onboarding@resend.dev` (domínio verificado do Resend)
- Para usar um domínio personalizado, você precisa verificar o domínio no painel do Resend
- O sistema funciona tanto em desenvolvimento quanto em produção sem alterações no código