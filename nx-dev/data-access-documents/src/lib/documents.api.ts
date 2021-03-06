import { readFileSync } from 'fs';
import { join, relative } from 'path';
import matter from 'gray-matter';
import { readJsonFile } from '@nrwl/workspace';
import {
  archiveRootPath,
  extractTitle,
  previewRootPath,
} from './documents.utils';
import {
  DocumentData,
  DocumentMetadata,
  VersionMetadata,
} from './documents.models';

export const flavorList: { label: string; value: string }[] = [
  { label: 'Angular', value: 'angular' },
  { label: 'React', value: 'react' },
  { label: 'Node', value: 'node' },
];

export class DocumentsApi {
  constructor(
    private readonly versions: VersionMetadata[],
    private readonly documentsMap: Map<string, DocumentMetadata[]>
  ) {}

  getVersions(): VersionMetadata[] {
    return this.versions;
  }

  getDocument(version: string, _segments: string | string[]): DocumentData {
    const segments = Array.isArray(_segments) ? [..._segments] : [_segments];
    const docPath = this.getFilePath(version, segments);
    const originalContent = readFileSync(docPath, 'utf8');
    const file = matter(originalContent);

    // Set default title if not provided in front-matter section.
    if (!file.data.title) {
      file.data.title =
        extractTitle(originalContent) ?? segments[segments.length - 1];
    }

    return {
      filePath: relative(
        version === 'preview' ? previewRootPath : archiveRootPath,
        docPath
      ),
      data: file.data,
      content: file.content,
      excerpt: file.excerpt,
    };
  }

  getDocuments(version: string) {
    try {
      let list = this.documentsMap.get(version);
      if (!list) {
        list = readJsonFile(join(this.getDocumentsRoot(version), 'map.json'));
        this.documentsMap.set(version, list);
      }
      return list;
    } catch {
      throw new Error(`Cannot find map.json for ${version}`);
    }
  }

  getStaticDocumentPaths(version: string) {
    const paths = [];

    function recur(curr, acc) {
      if (curr.itemList) {
        curr.itemList.forEach((ii) => {
          recur(ii, [...acc, curr.id]);
        });
        return;
      }

      paths.push({
        params: {
          version,
          flavor: acc[0],
          segments: acc.slice(1).concat(curr.id),
        },
      });
    }

    this.getDocuments(version).forEach((item) => {
      recur(item, []);
    });

    return paths;
  }

  getDocumentsRoot(version: string): string {
    if (version === 'preview') {
      return previewRootPath;
    }

    if (version === 'latest' || version === 'previous') {
      return join(
        archiveRootPath,
        this.versions.find((x) => x.id === version).path
      );
    }

    throw new Error(`Cannot find root for ${version}`);
  }

  private getFilePath(version: string, segments: string[]): string {
    let items = this.getDocuments(version);
    let found;
    for (const segment of segments) {
      found = items.find((item) => item.id === segment);
      if (found) {
        items = found.itemList;
      } else {
        throw new Error(
          `Cannot find document matching segments: ${JSON.stringify(segments)}`
        );
      }
    }
    const file = found.file ?? segments.join('/');
    return join(this.getDocumentsRoot(version), `${file}.md`);
  }
}
