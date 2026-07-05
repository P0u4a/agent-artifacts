#!/usr/bin/env node
import { cp, mkdir } from 'node:fs/promises'

await mkdir('dist/runtime', { recursive: true })
await cp('skills', 'dist/skills', { recursive: true })
