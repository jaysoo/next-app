import * as React from 'react';
import { useRouter } from 'next/router';
import {
  flavorList,
  getDocument,
  getStaticDocumentPaths,
  getVersions,
} from '@nrwl/nx-dev/data-access-documents';

interface DocumentationProps {
  version: any;
  flavor: { label: string; value: string };
  flavors: { label: string; value: string }[];
  versions: any[];
  menu: any;
  document?: any;
  error?: any;
}

interface DocumentationParams {
  params: { version: string; flavor: string; segments: string | string[] };
}

export function Documentation({ document, error }: DocumentationProps) {
  const router = useRouter();
  if (router.isFallback || !document) {
    return <h1>FALLBACK</h1>;
  } else {
    return <h1>FOUND</h1>;
  }
}

export async function getStaticProps({ params }: DocumentationParams) {
  const { versions, version, flavor, menu, document } = await getProps({
    params,
  });

  if (document) {
    return {
      props: {
        version: null as any,
        flavor: null as any,
        flavors: null as any,
        versions: null as any,
        menu: null as any,
        document,
      },
    };
  } else {
    console.log('>>> redirect', JSON.stringify(params));
    return {
      props: {
        version: null as any,
        flavor: null as any,
        flavors: null as any,
        versions: null as any,
        menu: null as any,
        document: document || null,
      },
    };
  }
}

async function getProps({ params }: DocumentationParams) {
  let versions: any[];
  let version: any;
  let flavor: { label: string; value: string };
  let menu: any;
  let document: any;

  /*
   * Try to find the document matching segments. If the document isn't found, then:
   *
   * - Try to get menu for current flavor+version, if found then redirect to first page in menu.
   * - Otherwise, redirect to the root.
   */
  try {
    versions = null as any;
    version = null as any;
    flavor = null as any;
    menu = null as any;
    document = getDocument(params.version, [params.flavor, ...params.segments]);

    return {
      version,
      flavor,
      flavors: flavorList,
      versions: versions,
      menu,
      document,
      error: null,
    };
  } catch (e) {
    console.log('>>> ERROR', e);
    return {
      version: null,
      versions: null,
      flavors: null,
      flavor: null,
      menu: null,
      document: null,
      error: e,
    };
  }

  return {
    version: null,
    versions: null,
    flavors: null,
    flavor: null,
    menu: null,
    document: document || null,
    error: 'fallback',
  };
}

export async function getStaticPaths(props) {
  const versions = ['preview'].concat(getVersions().map((x) => x.id));

  const allPaths = versions.reduce((acc, v) => {
    acc.push(...getStaticDocumentPaths(v));
    return acc;
  }, []);

  return {
    paths: allPaths,
    /*
     * Block rendering until the page component resolves with either:
     * 1. The content of the document if it exists.
     * 2. A redirect to another page if document is not found.
     */
    fallback: true,
  };
}

export default Documentation;
