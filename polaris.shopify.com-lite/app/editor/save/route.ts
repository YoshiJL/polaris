import {NextRequest, NextResponse} from 'next/server';

import {State} from '@/types';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    const body = await req.json();
    const tsFileContent = createTsFileContent(body.state);
    fs.writeFileSync('./content.ts', tsFileContent);
    return NextResponse.json({message: 'Content saved'});
  } else {
    return NextResponse.json({message: 'Not allowed'});
  }
}

function stringify(obj: Object): string {
  function escape(str: string) {
    return str.replace(/\\\`/g, '`').replace(/`/g, '\\`');
  }
  let string = JSON.stringify(obj, null, 2)
    .replace(/},\n  {/g, `},\n\n  {`)
    .replace(/"([a-z]+)":/gi, '$1:')
    .replaceAll(/content: "([^"]+)"\n/g, (match, str) => {
      return `content: \`${escape(str.replace(/\\n/g, '\n'))}\`\n`;
    });

  return string;
}

function createTsFileContent(state: State): string {
  return `import { State } from '@/types';

/*
  Automatically generated file (created by /api/editor.tsx).
  Do not edit by hand.
*/

const pages: State['pages'] = ${stringify(state.pages)};
const images: State['images'] = ${stringify(state.images)};
export const content: State = { pages, images };
`;
}