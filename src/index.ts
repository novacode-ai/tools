import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execAsync = promisify(exec);

// Export the tool definitions so the AI Engine can use them
export const systemTools = {
    bash: {
        description: 'Execute a bash command on the user computer. Use this to run scripts, git commands, or inspect the system.',
        parameters: z.object({
            command: z.string().describe('The bash command to run')
        }),
        execute: async ({ command }: { command: string }) => {
            try {
                const { stdout, stderr } = await execAsync(command);
                return { stdout, stderr };
            } catch (e: any) {
                return { error: e.message };
            }
        }
    },
    readFile: {
        description: 'Read the contents of a file on the local file system.',
        parameters: z.object({
            path: z.string().describe('Absolute or relative path to the file')
        }),
        execute: async ({ path }: { path: string }) => {
            try {
                const content = await fs.readFile(path, 'utf-8');
                return { content };
            } catch (e: any) {
                return { error: e.message };
            }
        }
    }
};
