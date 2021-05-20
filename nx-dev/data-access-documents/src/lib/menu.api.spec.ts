import { MenuApi } from './menu.api';
import {
  DocumentMetadata,
  DocumentsApi,
} from '@nrwl/nx-dev/data-access-documents';
import { join } from 'path';
import { appRootPath } from '@nrwl/workspace/src/utilities/app-root';
import { readJsonFile } from '@nrwl/workspace';

const archiveRootPath = join(appRootPath, 'nx-dev/nx-dev/public/documentation');
const documentsCache = new Map<string, DocumentMetadata[]>();
const versionsData = readJsonFile(join(archiveRootPath, 'versions.json'));

describe('MenuApi', () => {
  const docsApi = new DocumentsApi(versionsData, documentsCache);
  const api = new MenuApi(docsApi);

  describe('getMenu', () => {
    it('should group by section', () => {
      const menu = api.getMenu('preview', 'react');

      expect(menu).toEqual({
        version: 'preview',
        flavor: 'react',
        sections: expect.arrayContaining([
          expect.objectContaining({ id: 'basic', itemList: expect.any(Array) }),
          expect.objectContaining({ id: 'api', itemList: expect.any(Array) }),
          expect.objectContaining({
            id: 'deep-dive',
            itemList: expect.any(Array),
          }),
        ]),
      });
    });

    it('should add path to menu items', () => {
      const menu = api.getMenu('preview', 'react');

      // first basic section item should have prefix by version and flavor
      // e.g. "preview/react/getting-started/intro"
      expect(menu.sections[0].itemList[0].itemList[0].path).toMatch(
        /preview\/react/
      );
    });
  });
});
