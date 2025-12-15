/**
 * Schema Types Index
 */

import { type SchemaTypeDefinition } from 'sanity'
import { siteTexts } from './siteTexts'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteTexts],
}
