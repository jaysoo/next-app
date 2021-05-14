export async function getStaticProps({ params }) {
  const props = await getProps({ params });

  console.log('>>>', props);

  if (props.a) {
    return {
      props,
    };
  } else {
    return {
      redirect: {
        destination: '/about',
        permanent: false,
      },
    };
  }
}

async function getProps({ params }) {
  let versions;
  let version;
  let flavor;
  let menu;
  let a;

  console.log('>>> params', params);

  try {
    versions = getVersions();
    version = versions.find((item) => item.id === params.a) || null;
    menu = getMenu(params.a);
    a = getDocument(params.a);

    console.log('>>>', a);

    return {
      version,
      versions: versions,
      menu,
      a,
    };
  } catch (e) {
    console.log('>>> ERROR', e);
    return {
      version: null,
      versions: null,
      flavors: null,
      flavor: null,
      menu: null,
      a: null,
    };
  }
}

function getVersions() {
  return [];
}

function getMenu(a) {
  if (a === 'one' || a === 'two') {
    return {};
  } else {
    throw new Error('nopemenu');
  }
}

function getDocument(a) {
  if (a === 'one' || a === 'two') {
    return `hello ${a}`;
  } else {
    throw new Error('nopedoc');
  }
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { a: 'one' } }, { params: { a: 'two' } }],
    fallback: 'blocking',
  };
}

export default function Redirect(props) {
  return <h1>Redirect ({props.a})</h1>;
}
