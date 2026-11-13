const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export interface VerifiedUniversity {
  id: string;
  name: string;
  acronym: string;
}

export async function getVerifiedUniversities(): Promise<VerifiedUniversity[]> {
  const response = await fetch(`${API_URL}/universities`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar as universidades.");
  }

  return response.json();
}
