import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LegalAreaId } from '@lexai/shared';

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PROMPT_DIR = join(PACKAGE_ROOT, 'src', 'prompts');

const promptCache = new Map<LegalAreaId, string>();

export async function loadSystemPrompt(areaId: LegalAreaId): Promise<string> {
  const cached = promptCache.get(areaId);
  if (cached) {
    return cached;
  }

  const filePath = join(PROMPT_DIR, `${areaId}.system.md`);
  const content = await readFile(filePath, 'utf-8');
  promptCache.set(areaId, content);
  return content;
}

export function clearPromptCache(): void {
  promptCache.clear();
}

export function getPromptDir(): string {
  return PROMPT_DIR;
}