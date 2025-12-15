/**
 * Sanity Structure
 */

import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Textes du site')
        .child(
          S.document()
            .schemaType('siteTexts')
            .documentId('siteTexts')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !['siteTexts'].includes(item.getId() as string)
      ),
    ])
