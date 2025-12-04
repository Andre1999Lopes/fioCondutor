# 🔐 Configuração de Permissões IAM para Deploy

## Resumo Rápido

Para fazer deploy via terminal (EB CLI), você precisa de um usuário IAM com permissões para:

- Elastic Beanstalk
- RDS (banco de dados)
- EC2 (instâncias)
- S3 (armazenamento)
- CloudFormation (infraestrutura)
- IAM (roles e policies)

---

## Opção 1: Policies AWS Gerenciadas (Mais Fácil)

Anexe estas policies AWS gerenciadas ao usuário:

1. ✅ **AdministratorAccess-AWSElasticBeanstalk**
2. ✅ **AmazonRDSFullAccess**
3. ✅ **AmazonEC2FullAccess**
4. ✅ **AmazonS3FullAccess**
5. ✅ **IAMFullAccess** (ou IAMLimitedAccess se preferir)

---

## Opção 2: Policy Customizada (Mais Restrito)

Crie uma policy customizada com permissões mínimas necessárias:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ElasticBeanstalkPermissions",
      "Effect": "Allow",
      "Action": ["elasticbeanstalk:*"],
      "Resource": "*"
    },
    {
      "Sid": "EC2Permissions",
      "Effect": "Allow",
      "Action": ["ec2:*"],
      "Resource": "*"
    },
    {
      "Sid": "RDSPermissions",
      "Effect": "Allow",
      "Action": ["rds:*"],
      "Resource": "*"
    },
    {
      "Sid": "S3Permissions",
      "Effect": "Allow",
      "Action": ["s3:*"],
      "Resource": "*"
    },
    {
      "Sid": "CloudFormationPermissions",
      "Effect": "Allow",
      "Action": ["cloudformation:*"],
      "Resource": "*"
    },
    {
      "Sid": "AutoScalingPermissions",
      "Effect": "Allow",
      "Action": ["autoscaling:*"],
      "Resource": "*"
    },
    {
      "Sid": "LoadBalancerPermissions",
      "Effect": "Allow",
      "Action": ["elasticloadbalancing:*"],
      "Resource": "*"
    },
    {
      "Sid": "IAMPermissions",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:CreateInstanceProfile",
        "iam:AddRoleToInstanceProfile",
        "iam:PassRole",
        "iam:GetRole",
        "iam:GetInstanceProfile",
        "iam:ListInstanceProfiles",
        "iam:PutRolePolicy",
        "iam:AttachRolePolicy",
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchPermissions",
      "Effect": "Allow",
      "Action": ["logs:*", "cloudwatch:*"],
      "Resource": "*"
    }
  ]
}
```

---

## 📝 Passo a Passo: Criar Usuário IAM

### 1. Acessar Console IAM

1. Faça login na AWS Console
2. Acesse: https://console.aws.amazon.com/iam/
3. Clique em **Users** (no menu lateral)

### 2. Criar Usuário

1. Clique em **Create user**
2. **User name:** `eb-deploy-user` (ou qualquer nome)
3. Marque: ☑️ **Provide user access to the AWS Management Console** (opcional)
4. Marque: ☑️ **I want to create an IAM user**
5. Clique em **Next**

### 3. Adicionar Permissões

**Opção A - Políticas Gerenciadas:**

1. Selecione: **Attach policies directly**
2. Busque e marque:
   - `AdministratorAccess-AWSElasticBeanstalk`
   - `AmazonRDSFullAccess`
   - `AmazonEC2FullAccess`
   - `AmazonS3FullAccess`
   - `IAMFullAccess`

**Opção B - Política Customizada:**

1. Clique em **Create policy**
2. Selecione aba **JSON**
3. Cole a policy customizada acima
4. Nome: `EBDeployPolicy`
5. Volte e anexe ao usuário

### 4. Criar Access Keys

1. Após criar o usuário, clique no usuário criado
2. Aba **Security credentials**
3. Scroll até **Access keys**
4. Clique em **Create access key**
5. Selecione: **Command Line Interface (CLI)**
6. Marque: ☑️ **I understand...**
7. Clique em **Create access key**
8. **⚠️ IMPORTANTE:** Copie e salve:
   - **Access key ID**
   - **Secret access key**
   - (Você não poderá ver o Secret novamente!)

### 5. Configurar no Terminal

```bash
aws configure

# Será solicitado:
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json
```

### 6. Verificar Configuração

```bash
# Verificar se configurou corretamente
aws sts get-caller-identity

# Deve retornar algo como:
# {
#     "UserId": "AIDAXXXXXXXXXXXXXXXXX",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/eb-deploy-user"
# }
```

---

## 🔒 Boas Práticas de Segurança

### ✅ Recomendações:

1. **Use MFA (Multi-Factor Authentication)**

   - Mesmo para usuários programáticos
   - Adiciona camada extra de segurança

2. **Rotacione Access Keys Regularmente**

   - A cada 90 dias
   - Use `aws iam create-access-key` para gerar nova

3. **Use Policies Menos Permissivas Possível**

   - Comece com a customizada
   - Adicione permissões conforme necessário

4. **Não Compartilhe Credenciais**

   - Cada desenvolvedor deve ter seu próprio usuário
   - Use AWS Organizations para múltiplos usuários

5. **Use AWS CloudTrail**

   - Monitore todas as ações do usuário
   - Receba alertas de atividades suspeitas

6. **Adicione Tags ao Usuário**
   - `Environment: Production`
   - `Purpose: ElasticBeanstalkDeploy`
   - `Owner: DevTeam`

### ❌ Não Faça:

- ❌ Não use conta root da AWS
- ❌ Não commite credenciais no Git
- ❌ Não compartilhe Access Keys via email/chat
- ❌ Não use `AdministratorAccess` (muito permissivo)

---

## 🔍 Troubleshooting

### Erro: "User is not authorized to perform..."

**Causa:** Faltam permissões

**Solução:**

```bash
# Ver qual ação está faltando
aws sts get-caller-identity

# Adicionar permissão específica no IAM Console
```

### Erro: "Access Denied"

**Causa:** Access Key incorreta ou expirada

**Solução:**

```bash
# Reconfigurar
aws configure

# Ou criar nova access key no IAM Console
```

### Verificar Permissões do Usuário

```bash
# Listar policies anexadas
aws iam list-attached-user-policies --user-name eb-deploy-user

# Ver detalhes de uma policy
aws iam get-policy-version \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess-AWSElasticBeanstalk \
  --version-id v1
```

---

## 📚 Recursos

- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Elastic Beanstalk Permissions](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.iam.html)
- [AWS Security Credentials](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html)

---

**Pronto! Agora você pode fazer deploy com segurança.** 🚀
