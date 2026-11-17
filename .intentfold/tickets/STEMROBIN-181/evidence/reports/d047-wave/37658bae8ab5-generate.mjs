import path from 'node:path'
import { A, command } from './prepare.mjs'

command('generation-initial', 'python3', [
  '/Users/yong/.agents/skills/n-azure/scripts/generate_image.py',
  '--prompt-file', path.join(A, 'candidates/initial/wood.prompt.txt'),
  '--reference-image', path.join(A, 'inputs/source/fig-83.png'),
  '--output', path.join(A, 'candidates/initial/wood.png'),
  '--background', 'opaque', '--quality', 'high', '--size', '1536x1024',
  '--retries', '0',
])
