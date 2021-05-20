import {
  DocumentMetadata,
  DocumentsApi,
  MenuApi,
  VersionMetadata,
} from '@nrwl/nx-dev/data-access-documents';

// Imports JSON directly so they can be bundled into the app and functions.
// Also provides some test safety.
import previewDocuments from '../../../docs/map.json';
import previousDocuments from '../public/documentation/previous/map.json';
import latestDocuments from '../public/documentation/latest/map.json';
import archiveVersionsData from '../public/documentation/versions.json';

export function loadDocumentsData(): Map<string, DocumentMetadata[]> {
  return new Map([
    ['preview', previewDocuments],
    ['latest', latestDocuments],
    ['previous', previousDocuments],
  ]);
}

export function loadVersionsData(): VersionMetadata[] {
  // Manually add previews entry since we don't have it in the versions.json file.
  return archiveVersionsData.concat({
    name: 'preview',
    id: 'preview',
    release: 'preview',
    path: 'preview',
    default: false,
  });
}

export const documentsApi = new DocumentsApi(loadVersionsData(), loadDocumentsData());
export const menuApi = new MenuApi(documentsApi);
