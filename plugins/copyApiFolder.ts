import { copyFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { Plugin } from 'vite';
import { globby } from 'globby';

export function copyApiFolder(): Plugin {
  return {
    name: 'copy-api-folder',
    async closeBundle() {
      try {
        // Find all route. js files in src/app/api
        const files = await globby('src/app/api/**/route.js');
        
        for (const file of files) {
          // Copy to build/server/src/app/api
          const destPath = join('build/server', file);
          await mkdir(dirname(destPath), { recursive: true });
          await copyFile(file, destPath);
          console.log(`Copied ${file} to ${destPath}`);
        }
      } catch (error) {
        console.error('Error copying API folder:', error);
      }
    },
  };
}
