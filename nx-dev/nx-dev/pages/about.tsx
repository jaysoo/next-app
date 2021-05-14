import { flavorList, getDocument, getVersions } from '@nrwl/nx-dev/data-access-documents';
import { appRootPath } from '@nrwl/workspace/src/utilities/app-root';
import { execSync} from 'child_process';
import { readFileSync} from 'fs';


export function getServerSideProps() {
  return {
    props: {
      // document: getDocument('latest', ['react', 'react', 'getting-started', 'getting-started']),
      // versions: getVersions(),
      // flavorList,
      appRootPath,
      output: `

/var/task/dist/nx-dev/nx-dev/.next/server: ${execSync(`ls -lsa /var/task/dist/nx-dev/nx-dev/.next/server`).toString()}

files: ${execSync(`du -hc ${appRootPath}`).toString()}`
    }
  };
}

export default function About(props: any) {
  console.log('>>> props', JSON.stringify(props, null, 2));
  return <h1>About {props.appRootPath}</h1>;
}
