/**
 * Traduções para mensagens de erro do better-auth
 * Mapeia mensagens de erro em inglês para português brasileiro
 */

export const authErrorTranslations: Record<string, string> = {
  // Erros de credenciais
  "Invalid credentials": "Credenciais inválidas",
  "Invalid email or password": "Email ou senha inválidos",
  "Email or password is incorrect": "Email ou senha incorretos",
  "Invalid email": "Email inválido",
  "Invalid password": "Senha inválida",

  // Erros de usuário
  "User not found": "Usuário não encontrado",
  "User already exists": "Usuário já existe",
  "User already exists. Use another email.":
    "Usuário já existe. Use outro email.",
  "Email already exists": "Este email já está em uso",
  "Account not found": "Conta não encontrada",
  "Account already exists": "Conta já existe",

  // Erros de senha
  "Password is required": "Senha é obrigatória",
  "Password must be at least 8 characters":
    "Senha deve ter pelo menos 8 caracteres",
  "Password too weak": "Senha muito fraca",
  "Passwords do not match": "Senhas não coincidem",
  "Invalid password format": "Formato de senha inválido",

  // Erros de email
  "Email is required": "Email é obrigatório",
  "Invalid email format": "Formato de email inválido",
  "Email already in use": "Email já está em uso",
  "Email verification required": "Verificação de email obrigatória",

  // Erros de autenticação
  Unauthorized: "Não autorizado",
  "Access denied": "Acesso negado",
  "Session expired": "Sessão expirada",
  "Invalid session": "Sessão inválida",
  "Authentication failed": "Falha na autenticação",
  "Token expired": "Token expirado",
  "Invalid token": "Token inválido",

  // Erros de OAuth/Google
  "OAuth authentication failed": "Falha na autenticação OAuth",
  "Google authentication failed": "Falha na autenticação com Google",
  "OAuth provider error": "Erro no provedor OAuth",
  "Social login failed": "Falha no login social",

  // Erros de rede/conexão
  "Network error": "Erro de rede",
  "Connection failed": "Falha na conexão",
  "Server error": "Erro do servidor",
  "Internal server error": "Erro interno do servidor",
  "Service unavailable": "Serviço indisponível",

  // Erros de validação
  "Validation failed": "Falha na validação",
  "Invalid input": "Entrada inválida",
  "Required field missing": "Campo obrigatório ausente",
  "Invalid format": "Formato inválido",

  // Erros de rate limiting
  "Too many requests": "Muitas tentativas",
  "Rate limit exceeded": "Limite de tentativas excedido",
  "Too many login attempts": "Muitas tentativas de login",

  // Erros genéricos
  "Something went wrong": "Algo deu errado",
  "An error occurred": "Ocorreu um erro",
  "Unknown error": "Erro desconhecido",
  "Operation failed": "Operação falhou",
  "Request failed": "Requisição falhou",

  // Mensagens específicas do better-auth
  "User creation failed": "Falha ao criar usuário",
  "Login failed": "Falha no login",
  "Registration failed": "Falha no registro",
  "Account creation failed": "Falha ao criar conta",
  "Sign up failed": "Falha no cadastro",
  "Sign in failed": "Falha no login",
  "Logout failed": "Falha no logout",

  // Mensagens de sucesso (para referência)
  "Login successful": "Login realizado com sucesso",
  "Registration successful": "Registro realizado com sucesso",
  "Account created successfully": "Conta criada com sucesso",
  "Sign up successful": "Cadastro realizado com sucesso",
  "Sign in successful": "Login realizado com sucesso",
};

/**
 * Traduz uma mensagem de erro do better-auth para português
 * @param errorMessage - Mensagem de erro em inglês
 * @returns Mensagem traduzida em português ou a mensagem original se não encontrar tradução
 */
export function translateAuthError(errorMessage: string): string {
  if (!errorMessage) return "Erro desconhecido";

  // Remove espaços extras e converte para lowercase para comparação
  const normalizedMessage = errorMessage.trim();

  // Tenta encontrar a tradução exata
  if (authErrorTranslations[normalizedMessage]) {
    return authErrorTranslations[normalizedMessage];
  }

  // Tenta encontrar por palavras-chave (fallback)
  const lowerMessage = normalizedMessage.toLowerCase();

  if (lowerMessage.includes("invalid credentials")) {
    return "Credenciais inválidas";
  }
  if (lowerMessage.includes("user not found")) {
    return "Usuário não encontrado";
  }
  if (
    lowerMessage.includes("email already exists") ||
    lowerMessage.includes("email already in use")
  ) {
    return "Este email já está em uso";
  }
  if (lowerMessage.includes("password") && lowerMessage.includes("required")) {
    return "Senha é obrigatória";
  }
  if (lowerMessage.includes("email") && lowerMessage.includes("required")) {
    return "Email é obrigatório";
  }
  if (lowerMessage.includes("invalid email")) {
    return "Email inválido";
  }
  if (lowerMessage.includes("invalid password")) {
    return "Senha inválida";
  }
  if (lowerMessage.includes("authentication failed")) {
    return "Falha na autenticação";
  }
  if (lowerMessage.includes("network error")) {
    return "Erro de rede";
  }
  if (lowerMessage.includes("server error")) {
    return "Erro do servidor";
  }
  if (lowerMessage.includes("unauthorized")) {
    return "Não autorizado";
  }
  if (lowerMessage.includes("session expired")) {
    return "Sessão expirada";
  }
  if (lowerMessage.includes("google") && lowerMessage.includes("failed")) {
    return "Falha na autenticação com Google";
  }
  if (lowerMessage.includes("oauth") && lowerMessage.includes("failed")) {
    return "Falha na autenticação OAuth";
  }
  if (lowerMessage.includes("too many requests")) {
    return "Muitas tentativas";
  }
  if (lowerMessage.includes("validation failed")) {
    return "Falha na validação";
  }

  // Se não encontrar tradução, retorna a mensagem original
  return normalizedMessage;
}

/**
 * Função utilitária para exibir erro traduzido no toast
 * @param error - Objeto de erro ou string
 * @param defaultMessage - Mensagem padrão caso não consiga traduzir
 * @returns Mensagem traduzida
 */
export function getTranslatedAuthError(
  error: string | Error | Record<string, unknown> | null | undefined,
  defaultMessage: string = "Erro desconhecido"
): string {
  if (!error) return defaultMessage;

  // Se for string, traduz diretamente
  if (typeof error === "string") {
    return translateAuthError(error);
  }

  // Se for objeto de erro, tenta extrair a mensagem
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return translateAuthError(error.message);
  }

  // Se for objeto com propriedade error.message (padrão do better-auth)
  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof error.error === "object" &&
    error.error !== null &&
    "message" in error.error &&
    typeof error.error.message === "string"
  ) {
    return translateAuthError(error.error.message);
  }

  // Se for objeto com propriedade error (string)
  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof error.error === "string"
  ) {
    return translateAuthError(error.error);
  }

  return defaultMessage;
}
